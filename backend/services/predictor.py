# services/predictor.py
import os
import logging
import numpy as np
import cv2
import mediapipe as mp
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.efficientnet import EfficientNetB0, preprocess_input

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
                                                                                                
# === Paths (adjust if needed) ===
# This makes the path robust when predictor.py is in services/
BASE_DIR = os.path.dirname(os.path.dirname(__file__))   # one level up from services/
MODEL_PATH = os.path.join(BASE_DIR, "models", "deepfake_classifier.keras")

# === Load classifier (final classifier) ===
try:
    classifier = load_model(MODEL_PATH)
    logger.info("Loaded classifier from %s", MODEL_PATH)
except Exception as e:
    logger.exception("Failed to load classifier model. Make sure the file exists at: %s", MODEL_PATH)
    classifier = None

# === Load base model to produce embeddings ===
try:
    base_model = EfficientNetB0(weights="imagenet", include_top=False, pooling="avg", input_shape=(224, 224, 3))
    logger.info("Loaded EfficientNetB0 base model for embeddings")
except Exception as e:
    logger.exception("Failed to load base model (EfficientNetB0).")
    base_model = None

# === Mediapipe face detection instance (re-used across calls) ===
mp_face_detection = mp.solutions.face_detection
face_detection = mp_face_detection.FaceDetection(model_selection=0, min_detection_confidence=0.5)

# === Utilities ===
def _clip_bbox(x, y, w_box, h_box, frame_w, frame_h):
    x1 = max(0, int(x))
    y1 = max(0, int(y))
    x2 = min(frame_w, int(x + w_box))
    y2 = min(frame_h, int(y + h_box))
    return x1, y1, x2, y2

# === Image preprocessing (for single images) ===
def preprocess_image(image_path, target_size=(224, 224)):
    """
    Returns: np.array of embeddings (N_faces, embedding_dim) or None if no faces / errors.
    """
    frame = cv2.imread(image_path)
    if frame is None:
        logger.warning("Cannot read image: %s", image_path)
        return None

    # Convert to RGB for mediapipe
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_detection.process(rgb_frame)

    faces_embeddings = []
    if results and results.detections:
        for detection in results.detections:
            bbox = detection.location_data.relative_bounding_box
            h, w, _ = frame.shape
            # relative bbox -> pixel coords
            x = bbox.xmin * w
            y = bbox.ymin * h
            w_box = bbox.width * w
            h_box = bbox.height * h

            x1, y1, x2, y2 = _clip_bbox(x, y, w_box, h_box, w, h)
            if x2 <= x1 or y2 <= y1:
                continue

            # crop from rgb_frame (so channels are correct)
            face = rgb_frame[y1:y2, x1:x2]
            if face.size == 0:
                continue

            face_resized = cv2.resize(face, target_size)
            face_resized = face_resized.astype("float32") / 255.0  # normalized [0,1]

            # EfficientNet preprocess expects values scaled similarly to 0-255 -> use preprocess_input after scaling
            face_input = np.expand_dims(face_resized * 255.0, axis=0)
            face_input = preprocess_input(face_input)

            if base_model is None:
                logger.error("base_model is not initialized.")
                return None

            embedding = base_model.predict(face_input, verbose=0)
            faces_embeddings.append(embedding[0])

    if not faces_embeddings:
        return None
    return np.array(faces_embeddings)

# === Video helpers ===
def extract_frames(video_path, output_dir, frame_skip=5):
    """
    Saves frames to output_dir: frame_0.jpg, frame_1.jpg, ...
    """
    os.makedirs(output_dir, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    idx = 0
    frame_num = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_num % frame_skip == 0:
            cv2.imwrite(os.path.join(output_dir, f"frame_{idx}.jpg"), frame)
            idx += 1
        frame_num += 1
    cap.release()

def preprocess_frames(input_dir, output_dir, target_size=(224,224)):
    """
    For each frame in input_dir, detect faces and save each face as a .npy (float32, normalized [0,1]) into output_dir.
    File names: frame_0_0.npy (frame index, face index)
    """
    os.makedirs(output_dir, exist_ok=True)
    for file_name in sorted(os.listdir(input_dir)):
        if not file_name.lower().endswith(".jpg"):
            continue
        img_path = os.path.join(input_dir, file_name)
        frame = cv2.imread(img_path)
        if frame is None:
            continue

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_detection.process(rgb_frame)
        if not results or not results.detections:
            continue

        for i, detection in enumerate(results.detections):
            bbox = detection.location_data.relative_bounding_box
            h, w, _ = frame.shape
            x = bbox.xmin * w
            y = bbox.ymin * h
            w_box = bbox.width * w
            h_box = bbox.height * h
            x1, y1, x2, y2 = _clip_bbox(x, y, w_box, h_box, w, h)
            if x2 <= x1 or y2 <= y1:
                continue
            face = rgb_frame[y1:y2, x1:x2]
            face_resized = cv2.resize(face, target_size)
            face_resized = face_resized.astype("float32") / 255.0  # store normalized
            save_name = os.path.join(output_dir, file_name.replace(".jpg", f"_{i}.npy"))
            np.save(save_name, face_resized)


def preprocess_video(video_path, target_size=(224,224), frame_skip=5):
    temp_frames_dir = "temp_frames"
    temp_preprocessed_dir = "temp_preprocessed"
    os.makedirs(temp_frames_dir, exist_ok=True)
    os.makedirs(temp_preprocessed_dir, exist_ok=True)

    try:
        extract_frames(video_path, temp_frames_dir, frame_skip=frame_skip)
        preprocess_frames(temp_frames_dir, temp_preprocessed_dir, target_size=target_size)

        features = []
        for file_name in sorted(os.listdir(temp_preprocessed_dir)):
            if file_name.endswith(".npy"):
                face = np.load(os.path.join(temp_preprocessed_dir, file_name)).astype("float32")
                face = np.expand_dims(face * 255.0, axis=0)  # match preprocess_input expectations
                face = preprocess_input(face)
                if base_model is None:
                    logger.error("base_model is not initialized.")
                    return np.empty((0,))
                embedding = base_model.predict(face, verbose=0)
                features.append(embedding[0])

        if not features:
            # return empty features array with shape (0, embedding_dim)
            if base_model is not None:
                emb_dim = base_model.output_shape[-1]
                return np.empty((0, emb_dim))
            return np.empty((0,))

        return np.array(features)

    finally:
        # Cleanup temp dirs
        import shutil
        if os.path.exists(temp_frames_dir):
            shutil.rmtree(temp_frames_dir)
        if os.path.exists(temp_preprocessed_dir):
            shutil.rmtree(temp_preprocessed_dir)


# === Prediction wrappers ===
def predict_image(image_path):
    """
    returns: dict with keys type,result,score or error dict
    """
    if classifier is None:
        return {"status": "error", "message": "Classifier not loaded"}

    features = preprocess_image(image_path)
    if features is None:
        return {"status": "error", "message": "No face detected"}

    preds = classifier.predict(features)
    avg_pred = float(np.mean(preds))
    return {"type": "image", "result": "Fake" if avg_pred >= 0.5 else "Real", "score": avg_pred}


def predict_video(video_path):
    if classifier is None:
        return {"status": "error", "message": "Classifier not loaded"}

    features = preprocess_video(video_path)
    if features is None or features.shape[0] == 0:
        return {"status": "error", "message": "No faces detected"}

    preds = classifier.predict(features)
    avg_pred = float(np.mean(preds))
    return {"type": "video", "result": "Fake" if avg_pred >= 0.5 else "Real", "score": avg_pred}