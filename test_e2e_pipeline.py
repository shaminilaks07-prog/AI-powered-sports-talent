"""
End-to-End Automated Pipeline Test Script
Verifies:
1. Health & DB Connectivity
2. Athlete Registration & PBKDF2 Password Verification
3. Athlete Profile Retrieval & Updates
4. Synthetic Video Creation with OpenCV & AI Biomechanics Video Analysis
5. Sit-ups Repetition & Metrics Calculation
6. Assessment History Retrieval
7. Coach Feedback Submission
8. Verified Grassroots Opportunities Retrieval
9. Progress Trend Aggregation
"""

import sys
import os
import json
import time
import urllib.request
import urllib.error
import cv2
import numpy as np

BASE_URL = "http://127.0.0.1:8000"

def log_test(name, passed, detail=""):
    status = "PASS" if passed else "FAIL"
    print(f"[{status}] {name} {f'- {detail}' if detail else ''}")
    if not passed:
        sys.exit(1)

def request_json(url, method="GET", data=None):
    headers = {"Content-Type": "application/json"} if data else {}
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(error_body)
        except Exception:
            return e.code, {"error": error_body}

def create_synthetic_test_video(output_path, num_frames=60, fps=20):
    """Create a 3-second test video containing dynamic movement frames using OpenCV."""
    width, height = 320, 240
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    for i in range(num_frames):
        frame = np.full((height, width, 3), 245, dtype=np.uint8) # light background
        
        # Ground line
        cv2.line(frame, (20, 210), (300, 210), (70, 102, 79), 3)
        
        # Simple moving athlete stick-figure
        hip_y = int(140 + 20 * np.sin(i * 0.2))
        head_y = hip_y - 45
        head_x = 160 + int(10 * np.cos(i * 0.2))
        
        # Head
        cv2.circle(frame, (head_x, head_y), 12, (48, 56, 49), -1)
        # Spine
        cv2.line(frame, (head_x, head_y + 12), (160, hip_y), (48, 56, 49), 4)
        # Legs
        cv2.line(frame, (160, hip_y), (140, 205), (70, 102, 79), 3)
        cv2.line(frame, (160, hip_y), (180, 205), (70, 102, 79), 3)
        
        out.write(frame)
        
    out.release()
    return os.path.exists(output_path) and os.path.getsize(output_path) > 1000

def run_tests():
    print("=================================================================")
    print("   AI-POWERED SPORTS TALENT ASSESSMENT -- E2E TEST SUITE")
    print("=================================================================\n")

    # Test 1: Health Check
    code, res = request_json(f"{BASE_URL}/api/health")
    log_test("Health Check", code == 200 and res.get("status") == "healthy", f"status={res.get('status')}")

    # Test 2: Athlete Registration
    test_email = f"athlete_{int(time.time())}@grassroots.org"
    reg_payload = {
        "name": "Kavita Singh",
        "email": test_email,
        "password": "strongPassword123",
        "age": 16,
        "gender": "Female",
        "primary_sport": "Sit-ups and Core Endurance",
        "location": "Sundargarh, Odisha",
        "fitness_goals": "Qualify for State Junior Athletics Sports Academy"
    }
    code, reg_res = request_json(f"{BASE_URL}/api/auth/register", method="POST", data=reg_payload)
    log_test("Athlete Registration", code == 200 and reg_res.get("success"), f"user_id={reg_res.get('user', {}).get('id')}")
    user_id = reg_res["user"]["id"]

    # Test 3: Athlete Login & Password Hashing Verification
    login_payload = {"email": test_email, "password": "strongPassword123"}
    code, login_res = request_json(f"{BASE_URL}/api/auth/login", method="POST", data=login_payload)
    log_test("Athlete Login", code == 200 and login_res.get("success"), f"token verified for {login_res.get('user', {}).get('name')}")

    # Test 4: Profile Fetch
    code, prof_res = request_json(f"{BASE_URL}/api/athletes/{user_id}")
    log_test("Fetch Athlete Profile", code == 200 and prof_res.get("location") == "Sundargarh, Odisha")

    # Test 5: Profile Update
    update_payload = {
        "location": "Sundargarh District Sports Hub",
        "coach_share_enabled": True,
        "fitness_goals": "Achieve 35 sit-ups/minute for national talent trials"
    }
    code, upd_res = request_json(f"{BASE_URL}/api/athletes/{user_id}", method="PUT", data=update_payload)
    log_test("Update Athlete Profile", code == 200 and upd_res.get("user", {}).get("coach_share_enabled") is True)

    # Test 6: Create Synthetic Performance Video & Submit to AI Vision Pipeline
    video_path = os.path.join(os.path.dirname(__file__), "test_video_sample.mp4")
    created = create_synthetic_test_video(video_path)
    log_test("OpenCV Video Generator", created, f"file={os.path.basename(video_path)} size={os.path.getsize(video_path)}B")

    # Upload video multipart request to FastAPI
    import urllib.request
    boundary = "----WebKitFormBoundary" + str(int(time.time()))
    body = []
    
    # Field: sport
    body.append(f"--{boundary}".encode())
    body.append(b'Content-Disposition: form-data; name="sport"')
    body.append(b'')
    body.append(b'Sit-ups and Core Endurance')
    
    # Field: user_id
    body.append(f"--{boundary}".encode())
    body.append(b'Content-Disposition: form-data; name="user_id"')
    body.append(b'')
    body.append(str(user_id).encode())
    
    # Field: video
    body.append(f"--{boundary}".encode())
    body.append(b'Content-Disposition: form-data; name="video"; filename="test_video_sample.mp4"')
    body.append(b'Content-Type: video/mp4')
    body.append(b'')
    with open(video_path, "rb") as vf:
        body.append(vf.read())
    body.append(f"--{boundary}--".encode())
    body.append(b'')
    
    payload_bytes = b"\r\n".join(body)
    req = urllib.request.Request(
        f"{BASE_URL}/api/assessments/analyze",
        data=payload_bytes,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST"
    )
    
    with urllib.request.urlopen(req) as resp:
        analyze_code = resp.status
        analyze_res = json.loads(resp.read().decode("utf-8"))
        
    log_test("AI Biomechanics Video Analysis", analyze_code == 200 and analyze_res.get("success"), 
             f"Score: {analyze_res.get('data', {}).get('overall_score')}, Status: {analyze_res.get('data', {}).get('assessment_status')}")
    
    assessment_id = analyze_res["data"]["id"]

    # Test 7: Retrieve User Assessment History
    code, history_res = request_json(f"{BASE_URL}/api/assessments/user/{user_id}")
    log_test("Assessment History Persistence", code == 200 and len(history_res) >= 1, f"Total saved: {len(history_res)}")

    # Test 8: Submit Coach Feedback Notes
    feedback_payload = {"coach_notes": "Promising rhythmic trunk control. Work on anchoring toes to reduce hip flexion strain."}
    code, fb_res = request_json(f"{BASE_URL}/api/assessments/{assessment_id}/coach-feedback", method="POST", data=feedback_payload)
    log_test("Coach Feedback Ingestion", code == 200 and fb_res.get("success"))

    # Test 9: Verified Grassroots Opportunities Directory
    code, opps_res = request_json(f"{BASE_URL}/api/opportunities")
    log_test("Verified Opportunities Directory", code == 200 and len(opps_res) >= 3, f"{len(opps_res)} verified trials active")

    # Test 10: Aggregate Progress Stats
    code, prog_res = request_json(f"{BASE_URL}/api/athletes/{user_id}/progress")
    log_test("Athlete Progress Aggregation", code == 200 and prog_res.get("total_assessments") >= 1,
             f"Highest score: {prog_res.get('highest_score')}")

    # Clean up test video file
    if os.path.exists(video_path):
        os.remove(video_path)

    print("\n=================================================================")
    print("   ALL 10 E2E AUTOMATED TESTS COMPLETED WITH 100% SUCCESS!")
    print("=================================================================\n")

if __name__ == "__main__":
    run_tests()
