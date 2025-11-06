from fastapi import FastAPI, UploadFile, File
import shutil
import os
import logging
from fastapi.middleware.cors import CORSMiddleware
from services.predictor import predict_image, predict_video

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("app.log"), logging.StreamHandler()]
)

app = FastAPI()

# Allow your React frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to your React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "DeepFakeGuard API is running 🚀"}

@app.post("/predict/image")
async def predict_image_endpoint(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    logging.info(f"Image uploaded: {file.filename}")

    try:
        if file.filename.lower().endswith((".jpg", ".jpeg", ".png")):
            result = predict_image(temp_path)
            prediction_result = result.get("result", "Unknown")
            score = result.get("score", "N/A")
            logging.info(
                f"Image prediction done: {file.filename}, "
                f"Result: {prediction_result}, Score: {score}"
            )
        else:
            result = {"status": "error", "message": "Unsupported image format"}
            logging.warning(f"Unsupported image format: {file.filename}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return result

@app.post("/predict/video")
async def predict_video_endpoint(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    logging.info(f"Video uploaded: {file.filename}")

    try:
        if file.filename.lower().endswith((".mp4", ".avi", ".mov", ".gif")):
            result = predict_video(temp_path)
            prediction_result = result.get("result", "Unknown")
            score = result.get("score", "N/A")
            logging.info(
                f"Video prediction done: {file.filename}, "
                f"Result: {prediction_result}, Score: {score}"
            )
        else:
            result = {"status": "error", "message": "Unsupported video format"}
            logging.warning(f"Unsupported video format: {file.filename}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return result
