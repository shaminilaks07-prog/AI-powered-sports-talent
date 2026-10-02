from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import shutil
import json
import sqlite3

from database import init_db, get_db_connection
from models import UserRegisterRequest, UserLoginRequest, UserResponse, AssessmentResult
from ai_engine import analyze_video_pose

# Create uploads folder if not exists
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize FastAPI App
app = FastAPI(
    title="AI Sports Talent Assessment Platform API",
    description="Backend API for AI-powered mobile sports talent scouting and biomechanics assessment",
    version="1.0.0"
)

# Enable CORS so the React mobile frontend can connect easily
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded video files statically
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "AI-Powered Sports Talent Assessment Platform API is running 🏃‍♂️⚡",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "sqlite",
        "ai_engine": "mediapipe_opencv"
    }

@app.post("/api/auth/register")
def register_user(user: UserRegisterRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """INSERT INTO users (name, email, password, age, gender, primary_sport)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (user.name, user.email, user.password, user.age, user.gender, user.primary_sport)
        )
        conn.commit()
        user_id = cursor.lastrowid
        return {
            "success": True,
            "message": "User registered successfully!",
            "user": {
                "id": user_id,
                "name": user.name,
                "email": user.email,
                "age": user.age,
                "gender": user.gender,
                "primary_sport": user.primary_sport
            }
        }
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    finally:
        conn.close()

@app.post("/api/auth/login")
def login_user(creds: UserLoginRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ? AND password = ?", (creds.email, creds.password))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    return {
        "success": True,
        "message": "Login successful!",
        "user": {
            "id": row["id"],
            "name": row["name"],
            "email": row["email"],
            "age": row["age"],
            "gender": row["gender"],
            "primary_sport": row["primary_sport"]
        }
    }

import time

ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".mov", ".avi", ".webm", ".mkv", ".m4v"}
MAX_VIDEO_SIZE = 60 * 1024 * 1024  # 60 MB

@app.post("/api/assessments/analyze")
async def analyze_and_record(
    sport: str = Form("General"),
    user_id: int = Form(1),
    video: UploadFile = File(...)
):
    # Validate filename and extension
    original_filename = os.path.basename(video.filename or "video.mp4")
    ext = os.path.splitext(original_filename)[1].lower()
    
    if ext not in ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Please upload a valid sports video clip (.mp4, .mov, .webm, .avi, .mkv)."
        )

    # Generate safe unique filename
    timestamp = int(time.time())
    safe_sport = "".join(c if c.isalnum() else "_" for c in sport.lower())
    safe_clean_name = "".join(c for c in original_filename if c.isalnum() or c in "._-")
    safe_filename = f"user_{user_id}_{timestamp}_{safe_sport}_{safe_clean_name}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    # Save video file and enforce size limits
    file_size = 0
    try:
        with open(file_path, "wb") as buffer:
            while chunk := await video.read(1024 * 1024):  # 1MB chunks
                file_size += len(chunk)
                if file_size > MAX_VIDEO_SIZE:
                    buffer.close()
                    if os.path.exists(file_path):
                        os.remove(file_path)
                    raise HTTPException(
                        status_code=400,
                        detail="Video file exceeds 60MB limit. Please upload a short 5-30 second video clip."
                    )
                buffer.write(chunk)
    except HTTPException:
        raise
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to save video: {str(e)}")

    if file_size == 0:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=400,
            detail="Uploaded video file is empty. Please select a valid sports recording."
        )

    try:
        # Run AI Pose Assessment Engine
        analysis = analyze_video_pose(file_path, sport=sport)
        
        # Save assessment to SQLite database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO assessments 
               (user_id, sport, overall_score, metrics_json, strengths_json, weaknesses_json, suggestions_json, video_filename)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                user_id,
                sport,
                analysis["overall_score"],
                json.dumps(analysis["metrics"]),
                json.dumps(analysis["strengths"]),
                json.dumps(analysis["weaknesses"]),
                json.dumps(analysis["suggestions"]),
                safe_filename
            )
        )
        conn.commit()
        assessment_id = cursor.lastrowid
        conn.close()
        
        analysis["id"] = assessment_id
        analysis["user_id"] = user_id
        analysis["video_filename"] = safe_filename
        
        return {
            "success": True,
            "message": "Video analyzed and assessment saved successfully!",
            "data": analysis
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

@app.get("/api/assessments/user/{user_id}")
def get_user_assessments(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "user_id": r["user_id"],
            "sport": r["sport"],
            "overall_score": r["overall_score"],
            "metrics": json.loads(r["metrics_json"]),
            "strengths": json.loads(r["strengths_json"]),
            "weaknesses": json.loads(r["weaknesses_json"]),
            "suggestions": json.loads(r["suggestions_json"]),
            "video_filename": r["video_filename"],
            "created_at": r["created_at"]
        })
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
