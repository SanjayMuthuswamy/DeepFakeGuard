import os
import tensorflow as tf
from tensorflow.keras.models import load_model

# === Path to your new model ===
MODEL_PATH = r"C:\Users\sanja\OneDrive\Desktop\DeepFakeGuard\backend\models\deepfake_classifier_new.keras"

# Load model
try:
    model = load_model(MODEL_PATH)
    print(f"✅ Loaded model from: {MODEL_PATH}")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    exit()

# Inspect input shape
if hasattr(model, 'input_shape'):
    print(f"🖼️ Model input shape: {model.input_shape}")
else:
    print("⚠️ Model has no attribute 'input_shape'")

first_layer = model.layers[0]
if hasattr(first_layer, 'weights') and first_layer.weights:
    w = first_layer.weights[0]
    print(f"🎯 First layer name: {first_layer.name}")
    print(f"🎯 First layer weights shape: {w.shape}")
else:
    print("⚠️ First layer has no weights to inspect")

# Optional: check number of channels
if len(model.input_shape) == 4:
    channels = model.input_shape[-1]
    print(f"📊 Number of input channels: {channels}")
    if channels == 3:
        print("✅ Model expects RGB input (3 channels).")
    elif channels == 1:
        print("⚠️ Model expects grayscale input (1 channel).")
    else:
        print(f"⚠️ Model expects {channels} channels. You may need to adjust your preprocessing.")
