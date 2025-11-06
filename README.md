# 🛡️ DeepFake Guard – AI-Powered Deepfake Detection System  

**DeepFake Guard** is an AI-powered application designed to detect and analyze deepfake **images and videos** with high accuracy and transparency.  
It empowers users to verify digital media authenticity through a simple, web-based interface.  

---

## 🚀 Features  

- 🔍 **Deepfake Detection:** Identifies manipulated or AI-generated images and videos.  
- 🧠 **AI-Powered Analysis:** Uses deep learning to analyze spatial and temporal inconsistencies.  
- 💡 **Explainable Results:** Provides confidence score, authenticity label (Real/Fake), and downloadable analysis report.  
- 🌐 **Web-Based Interface:** Upload and verify media files in real time.  

---

## 🧰 Tech Stack  

- **Frontend:** React.js  
- **Backend:** FastAPI  
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
