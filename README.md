# AI-Powered Mobile Platform for Democratizing Sports Talent Assessment 🏃‍♂️⚡

A college mini-project mobile application designed to evaluate sports movements, extract biomechanical joint metrics using computer vision (MediaPipe Pose & OpenCV), and provide actionable talent scores and AI coaching suggestions.

---

## 📁 Project Architecture

```
AI-powered sports talent/
├── backend/                  # Python FastAPI Backend & AI Engine
│   ├── main.py               # API routes (Auth, Upload, Assessment, History)
│   ├── database.py           # SQLite database setup & connection helpers
│   ├── models.py             # Pydantic data schemas
│   ├── ai_engine.py          # MediaPipe Pose & biomechanics computation
│   ├── requirements.txt      # Python dependencies
│   └── uploads/              # Local storage for uploaded sports videos
│
└── frontend/                 # React (Vite) Mobile-First Frontend
    ├── src/
    │   ├── App.jsx           # Main application state & screen router
    │   ├── index.css         # Sports aesthetic & glassmorphism design system
    │   ├── components/       # Reusable UI elements (Navbar, BottomNav, DeviceFrame)
    │   ├── screens/          # Core views (Home, Auth, Upload, Results, History, Profile)
    │   └── services/api.js   # REST API client with local offline fallback
    ├── index.html            # Mobile viewport & font imports
    └── package.json          # Frontend packages (React, Lucide icons, Confetti)
```

---

## 🚀 How to Run Locally

### 1. Start the Backend Server (Terminal 1)
```powershell
python -m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```
* Backend API runs on: `http://127.0.0.1:8000`
* Interactive API Documentation (Swagger UI): `http://127.0.0.1:8000/docs`

### 2. Start the Frontend Mobile UI (Terminal 2)
```powershell
cd frontend
npm run dev
```
* Mobile App runs on: `http://127.0.0.1:5173`

---

## ⚡ Features Included in Phase 2
- **Realistic Mobile Mockup Shell**: Test directly in your desktop browser inside an iPhone/Pixel frame with notch, or toggle to full-width view.
- **Top Bar & Bottom Tab Navigation**: Seamless switching between **Home**, **Scan AI (Upload)**, **History**, and **Profile**.
- **1-Click Demo Account**: Quickly log in with `athlete@demo.com` / `password123` to test without manual form entry.
- **Connected Status**: Real-time indicator showing if the Python backend is online.
