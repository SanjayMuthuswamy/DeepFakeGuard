# 🛡️ DeepFake Guard – AI-Powered Deepfake Detection System  

[![Python](https://img.shields.io/badge/Python-3.9+-blue?logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-Frontend-blue?logo=react)](https://react.dev/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-Model-orange?logo=tensorflow)](https://www.tensorflow.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🧭 Project Overview  

**DeepFake Guard** is an advanced AI application that detects and analyzes **deepfake images and videos** using **EfficientNet-B0**.  
Built with **FastAPI** and **React**, it provides real-time verification, interpretability, and transparency to ensure **digital media authenticity**.  

---

## 🚀 Features  

- 🔍 **Deepfake Detection:** Identifies manipulated or AI-generated images and videos.  
- 🧠 **AI-Powered Analysis:** Utilizes **EfficientNet-B0** for feature extraction and deepfake classification.  
- 💡 **Explainable Results:** Provides confidence score, authenticity label (Real/Fake), and downloadable analysis report.  
- 🌐 **Web-Based Interface:** Upload and verify media files in real time.  

---

## 🧰 Tech Stack  

- **Frontend:** React.js  
- **Backend:** FastAPI  
- **AI Model:** EfficientNet-B0  
- **AI Frameworks:** TensorFlow, MediaPipe  
- **Other Tools:** OpenCV, NumPy, Matplotlib, Pandas  

---

## 📦 Installation  

```bash
# Clone the repository
git clone https://github.com/SanjayMuthuswamy/DeepFakeGuard.git

# Navigate to project folder
cd DeepFakeGuard

# Install dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn app:app --reload

# (Optional) Run React frontend
cd frontend
npm install
npm run dev
# or
npm start
