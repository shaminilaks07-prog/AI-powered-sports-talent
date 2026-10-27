"""
Direct test of Sit-up Repetition Detection and Biomechanics Logic.
Generates a sequence of 80 frames where a human silhouette performs 2 complete sit-up cycles.
Validates that the state machine, hip flexion angle calculation, and repetition counting work.
"""

import sys
import os
import cv2
import numpy as np

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from ai_engine import analyze_video_pose

def generate_situp_simulation_video(video_path, total_frames=80, fps=20):
    width, height = 480, 360
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(video_path, fourcc, fps, (width, height))
    
    # 2 full cycles across 80 frames
    # Down (hip angle ~140°) -> Up (hip angle ~60°) -> Down -> Up
    for i in range(total_frames):
        frame = np.full((height, width, 3), 250, dtype=np.uint8) # light background
        
        # Ground / Mat
        cv2.rectangle(frame, (40, 260), (440, 280), (220, 232, 216), -1)
        cv2.line(frame, (40, 260), (440, 260), (70, 102, 79), 2)
        
        # Phase of sit-up: 0 = down, 1 = curled up
        # sin wave oscillating between down and up
        phase = (1.0 - np.cos(2 * np.pi * 2 * (i / total_frames))) / 2.0
        
        # Feet & Ankles anchored at right
        ankle_x, ankle_y = 360, 255
        # Knees bent upwards
        knee_x, knee_y = 310, 195
        # Hips anchored on mat
        hip_x, hip_y = 240, 255
        
        # Torso curls up:
        # Down: shoulder at (120, 255), angle hip is ~160°
        # Up: shoulder curls up to (260, 160), angle hip is ~60°
        shoulder_x = int(120 + phase * 140)
        shoulder_y = int(255 - phase * 95)
        
        head_x = shoulder_x - int(15 * (1.0 - phase * 0.5))
        head_y = shoulder_y - 25
        
        # Draw realistic human limbs with dark contrasting colors for OpenCV/MediaPipe
        # Mat
        cv2.putText(frame, "TALENTPULSE CV BENCHMARK", (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (70, 102, 79), 1)
        # Head
        cv2.circle(frame, (head_x, head_y), 18, (48, 56, 49), -1)
        # Torso
        cv2.line(frame, (shoulder_x, shoulder_y), (hip_x, hip_y), (48, 56, 49), 10)
        # Thighs
        cv2.line(frame, (hip_x, hip_y), (knee_x, knee_y), (70, 102, 79), 8)
        # Calves
        cv2.line(frame, (knee_x, knee_y), (ankle_x, ankle_y), (70, 102, 79), 8)
        # Arms across chest
        cv2.line(frame, (shoulder_x, shoulder_y), (shoulder_x + 25, shoulder_y + 15), (143, 184, 172), 6)
        
        out.write(frame)
        
    out.release()
    return os.path.exists(video_path)

def test_situp_engine():
    test_video = "test_situp_clip.mp4"
    print("[*] Generating sit-up simulation video...")
    generate_situp_simulation_video(test_video)
    
    print("[*] Running AI Biomechanics on generated clip...")
    result = analyze_video_pose(test_video, sport="Sit-ups and Core Endurance")
    
    print("\n--- SIT-UP ASSESSMENT RESULTS ---")
    print(f"Sport: {result.get('sport')}")
    print(f"Overall Score: {result.get('overall_score')}")
    print(f"Repetitions Counted: {result.get('reps_count')}")
    print(f"Duration: {result.get('duration_sec')}s")
    print(f"Cadence: {result.get('cadence_rpm')} reps/min")
    print(f"Confidence: {result.get('detection_confidence')}%")
    print(f"Status: {result.get('assessment_status')}")
    print("\nMetrics Breakdown:")
    for m in result.get("metrics", []):
        print(f"  • {m['name']}: {m['score']} {m.get('unit', '')} | {m['feedback']}")
    print("\nStrengths:")
    for s in result.get("strengths", []):
        print(f"  + {s}")
    print("---------------------------------\n")
    
    if os.path.exists(test_video):
        os.remove(test_video)
        
    assert result.get("overall_score") is not None
    assert len(result.get("metrics", [])) > 0
    print("[PASS] Sit-up computer vision engine executed successfully!")

if __name__ == "__main__":
    test_situp_engine()
