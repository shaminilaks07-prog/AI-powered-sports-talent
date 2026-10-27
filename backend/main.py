from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import shutil
import json
import sqlite3
import time
from typing import Dict, Any, List, Optional

from database import init_db, get_db_connection, hash_password, verify_password
from models import (
    UserRegisterRequest,
    UserLoginRequest,
    UserUpdateRequest,
    UserResponse,
    AssessmentResult,
    CoachFeedbackRequest,
    OpportunityItem
)
from ai_engine import analyze_video_pose

# Create uploads folder if not exists
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize FastAPI App
app = FastAPI(
    title="AI-Powered Sports Talent Assessment Platform API",
    description="Backend API for AI-assisted sports talent scouting, biomechanics evaluation, and grassroots athlete empowerment",
    version="2.0.0"
)

# Enable CORS for React frontend and local mobile network access
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

@app.get("/api/status")
def root_status():
    return {
        "status": "online",
        "title": "AI-Powered Mobile Platform for Democratizing Sports Talent Assessment",
        "message": "API is running 🏃‍♂️⚡",
        "version": "2.0.0"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "sqlite",
        "ai_engine": "mediapipe_opencv_tasks",
        "version": "2.0.0"
    }

# =========================================================================
# AUTHENTICATION & ATHLETE PROFILE ENDPOINTS
# =========================================================================

@app.post("/api/auth/register")
def register_user(user: UserRegisterRequest):
    if not user.name.strip():
        raise HTTPException(status_code=400, detail="Athlete name cannot be empty.")
    if not user.email.strip() or "@" not in user.email:
        raise HTTPException(status_code=400, detail="A valid email address is required.")
    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    pwd_hash, salt = hash_password(user.password)

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """INSERT INTO users (name, email, password, salt, age, gender, primary_sport, location, fitness_goals)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                user.name.strip(),
                user.email.strip().lower(),
                pwd_hash,
                salt,
                user.age or 18,
                user.gender or "Other",
                user.primary_sport or "General Fitness",
                user.location or "",
                user.fitness_goals or ""
            )
        )
        conn.commit()
        user_id = cursor.lastrowid

        return {
            "success": True,
            "message": "Athlete account registered successfully!",
            "user": {
                "id": user_id,
                "name": user.name.strip(),
                "email": user.email.strip().lower(),
                "age": user.age or 18,
                "gender": user.gender or "Other",
                "primary_sport": user.primary_sport or "General Fitness",
                "location": user.location or "",
                "fitness_goals": user.fitness_goals or "",
                "bio": "",
                "coach_share_enabled": False
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
    cursor.execute("SELECT * FROM users WHERE email = ?", (creds.email.strip().lower(),))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    stored_password = row["password"]
    stored_salt = row["salt"]

    # Verify PBKDF2 hash or fallback to legacy plain text
    is_valid = False
    if stored_salt:
        is_valid = verify_password(creds.password, stored_password, stored_salt)
    else:
        is_valid = (creds.password == stored_password)

    if not is_valid:
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
            "primary_sport": row["primary_sport"],
            "location": row["location"] or "",
            "fitness_goals": row["fitness_goals"] or "",
            "bio": row["bio"] or "",
            "coach_share_enabled": bool(row["coach_share_enabled"])
        }
    }

@app.get("/api/athletes/{user_id}")
def get_athlete_profile(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Athlete profile not found.")

    return {
        "id": row["id"],
        "name": row["name"],
        "email": row["email"],
        "age": row["age"],
        "gender": row["gender"],
        "primary_sport": row["primary_sport"],
        "location": row["location"] or "",
        "fitness_goals": row["fitness_goals"] or "",
        "bio": row["bio"] or "",
        "coach_share_enabled": bool(row["coach_share_enabled"]),
        "created_at": row["created_at"]
    }

@app.put("/api/athletes/{user_id}")
def update_athlete_profile(user_id: int, updates: UserUpdateRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Athlete profile not found.")

    new_name = updates.name if updates.name is not None else row["name"]
    new_age = updates.age if updates.age is not None else row["age"]
    new_gender = updates.gender if updates.gender is not None else row["gender"]
    new_sport = updates.primary_sport if updates.primary_sport is not None else row["primary_sport"]
    new_location = updates.location if updates.location is not None else row["location"]
    new_goals = updates.fitness_goals if updates.fitness_goals is not None else row["fitness_goals"]
    new_bio = updates.bio if updates.bio is not None else row["bio"]
    new_share = int(updates.coach_share_enabled) if updates.coach_share_enabled is not None else row["coach_share_enabled"]

    cursor.execute("""
        UPDATE users
        SET name = ?, age = ?, gender = ?, primary_sport = ?, location = ?, fitness_goals = ?, bio = ?, coach_share_enabled = ?
        WHERE id = ?
    """, (new_name, new_age, new_gender, new_sport, new_location, new_goals, new_bio, new_share, user_id))
    conn.commit()
    conn.close()

    return {
        "success": True,
        "message": "Athlete profile updated successfully!",
        "user": {
            "id": user_id,
            "name": new_name,
            "email": row["email"],
            "age": new_age,
            "gender": new_gender,
            "primary_sport": new_sport,
            "location": new_location or "",
            "fitness_goals": new_goals or "",
            "bio": new_bio or "",
            "coach_share_enabled": bool(new_share)
        }
    }

@app.get("/api/athletes/{user_id}/progress")
def get_athlete_progress(user_id: int):
    """Aggregate athlete historical statistics and progress trends."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at ASC",
        (user_id,)
    )
    rows = cursor.fetchall()
    conn.close()

    total_tests = len(rows)
    if total_tests == 0:
        return {
            "total_assessments": 0,
            "highest_score": 0.0,
            "latest_score": 0.0,
            "total_reps": 0,
            "personal_bests": {},
            "history_trend": []
        }

    scores = [r["overall_score"] for r in rows]
    highest_score = max(scores)
    latest_score = scores[-1]
    total_reps = sum(r["reps_count"] or 0 for r in rows)

    # Calculate personal bests per sport
    personal_bests = {}
    for r in rows:
        sport = r["sport"]
        sc = r["overall_score"]
        reps = r["reps_count"] or 0
        if sport not in personal_bests:
            personal_bests[sport] = {"highest_score": sc, "max_reps": reps, "last_date": r["created_at"]}
        else:
            if sc > personal_bests[sport]["highest_score"]:
                personal_bests[sport]["highest_score"] = sc
            if reps > personal_bests[sport]["max_reps"]:
                personal_bests[sport]["max_reps"] = reps

    # Simplified history trend for charts
    history_trend = [
        {
            "id": r["id"],
            "date": r["created_at"],
            "sport": r["sport"],
            "score": r["overall_score"],
            "reps": r["reps_count"] or 0
        }
        for r in rows
    ]

    return {
        "total_assessments": total_tests,
        "highest_score": highest_score,
        "latest_score": latest_score,
        "total_reps": total_reps,
        "personal_bests": personal_bests,
        "history_trend": history_trend
    }

# =========================================================================
# VIDEO UPLOAD & COMPUTER VISION ASSESSMENT
# =========================================================================

ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".mov", ".avi", ".webm", ".mkv", ".m4v"}
MAX_VIDEO_SIZE = 60 * 1024 * 1024  # 60 MB

@app.post("/api/assessments/analyze")
async def analyze_and_record(
    sport: str = Form("General Fitness"),
    user_id: int = Form(1),
    video: UploadFile = File(...)
):
    original_filename = os.path.basename(video.filename or "video.mp4")
    ext = os.path.splitext(original_filename)[1].lower()

    if ext not in ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format '{ext}'. Please upload or record a valid video (.mp4, .mov, .webm, .avi, .mkv)."
        )

    timestamp = int(time.time())
    safe_sport = "".join(c if c.isalnum() else "_" for c in sport.lower())
    safe_clean_name = "".join(c for c in original_filename if c.isalnum() or c in "._-")
    safe_filename = f"user_{user_id}_{timestamp}_{safe_sport}_{safe_clean_name}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    file_size = 0
    try:
        with open(file_path, "wb") as buffer:
            while chunk := await video.read(1024 * 1024):
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
        raise HTTPException(status_code=400, detail="Uploaded video file is empty. Please select a valid recording.")

    try:
        # Run AI Computer Vision Biomechanics Pipeline
        analysis = analyze_video_pose(file_path, sport=sport)

        reps_count = analysis.get("reps_count", 0)
        duration_sec = analysis.get("duration_sec", 0.0)
        cadence_rpm = analysis.get("cadence_rpm", 0.0)
        detection_confidence = analysis.get("detection_confidence", 90.0)
        assessment_status = analysis.get("assessment_status", "Completed")

        # Save assessment to SQLite database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO assessments 
               (user_id, sport, overall_score, reps_count, duration_sec, cadence_rpm, detection_confidence, assessment_status, metrics_json, strengths_json, weaknesses_json, suggestions_json, video_filename)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                user_id,
                sport,
                analysis["overall_score"],
                reps_count,
                duration_sec,
                cadence_rpm,
                detection_confidence,
                assessment_status,
                json.dumps(analysis["metrics"]),
                json.dumps(analysis["strengths"]),
                json.dumps(analysis["weaknesses"]),
                json.dumps(analysis["suggestions"]),
                safe_filename
            )
        )
        conn.commit()
        assessment_id = cursor.lastrowid
        cursor.execute("SELECT created_at FROM assessments WHERE id = ?", (assessment_id,))
        created_at_row = cursor.fetchone()
        created_at = created_at_row["created_at"] if created_at_row else None
        conn.close()

        analysis["id"] = assessment_id
        analysis["user_id"] = user_id
        analysis["video_filename"] = safe_filename
        analysis["created_at"] = created_at

        return {
            "success": True,
            "message": "Movement analyzed and assessment recorded successfully!",
            "data": analysis
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis engine error: {str(e)}")

def format_assessment_row(r) -> Dict[str, Any]:
    """Helper to convert a SQLite assessment row into the standard API dictionary."""
    return {
        "id": r["id"],
        "user_id": r["user_id"],
        "sport": r["sport"],
        "overall_score": r["overall_score"],
        "reps_count": r["reps_count"] or 0,
        "duration_sec": r["duration_sec"] or 0.0,
        "cadence_rpm": r["cadence_rpm"] or 0.0,
        "detection_confidence": r["detection_confidence"] or 90.0,
        "assessment_status": r["assessment_status"] or "Completed",
        "metrics": json.loads(r["metrics_json"]),
        "strengths": json.loads(r["strengths_json"]),
        "weaknesses": json.loads(r["weaknesses_json"]),
        "suggestions": json.loads(r["suggestions_json"]),
        "video_filename": r["video_filename"],
        "coach_notes": r["coach_notes"] or "",
        "created_at": r["created_at"]
    }

@app.get("/api/assessments/user/{user_id}")
def get_user_assessments(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [format_assessment_row(r) for r in rows]

@app.get("/api/assessments/{assessment_id}")
def get_assessment_by_id(assessment_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM assessments WHERE id = ?", (assessment_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail=f"Assessment with ID {assessment_id} not found.")
    return format_assessment_row(row)

@app.delete("/api/assessments/user/{user_id}")
def delete_user_assessments(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM assessments WHERE user_id = ?", (user_id,))
    deleted_count = cursor.rowcount
    conn.commit()
    conn.close()
    return {
        "success": True,
        "message": f"All assessments for user {user_id} deleted successfully.",
        "deleted_count": deleted_count
    }

@app.delete("/api/assessments/{assessment_id}")
def delete_assessment_by_id(assessment_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM assessments WHERE id = ?", (assessment_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail=f"Assessment with ID {assessment_id} not found.")
    cursor.execute("DELETE FROM assessments WHERE id = ?", (assessment_id,))
    conn.commit()
    conn.close()
    return {
        "success": True,
        "message": f"Assessment {assessment_id} deleted successfully."
    }

@app.post("/api/assessments/{assessment_id}/coach-feedback")
def add_coach_feedback(assessment_id: int, feedback: CoachFeedbackRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM assessments WHERE id = ?", (assessment_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Assessment not found.")
    
    cursor.execute(
        "UPDATE assessments SET coach_notes = ? WHERE id = ?",
        (feedback.coach_notes.strip(), assessment_id)
    )
    conn.commit()
    conn.close()
    return {
        "success": True,
        "message": "Coach feedback notes saved successfully!"
    }

# =========================================================================
# VERIFIED SPORTS OPPORTUNITIES & GRASSROOTS TRIALS
# =========================================================================

@app.get("/api/opportunities")
def get_verified_opportunities(sport: str = Query(None)):
    conn = get_db_connection()
    cursor = conn.cursor()
    if sport:
        cursor.execute("SELECT * FROM opportunities WHERE sport LIKE ? ORDER BY id ASC", (f"%{sport}%",))
    else:
        cursor.execute("SELECT * FROM opportunities ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": r["id"],
            "title": r["title"],
            "sport": r["sport"],
            "organizer": r["organizer"],
            "location": r["location"],
            "deadline": r["deadline"],
            "description": r["description"],
            "eligibility": r["eligibility"],
            "verified": bool(r["verified"])
        }
        for r in rows
    ]

# Mount built frontend dist for unified single-port hosting
DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(DIST_DIR):
    app.mount("/", StaticFiles(directory=DIST_DIR, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
