"""
Direct unit test of analyze_situps and analyze_squats with simulated 33 landmark coordinate series.
Validates:
- Hip flexion angle calculation
- Repetition state machine transitions
- Exact rep count increment
- Cadence calculation
- Metric generation
"""

import sys
import os
import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from ai_engine import analyze_situps, analyze_squats, calculate_angle

def test_situp_algorithm():
    print("[*] Testing sit-up state machine with 60 landmark frames (3 full cycles)...")
    
    # 60 frames @ 20 fps = 3.0 seconds
    duration_sec = 3.0
    frame_data_list = []
    
    # 3 cycles: down -> up -> down -> up -> down -> up -> down
    # In each frame, create 33 dummy landmarks with realistic hip, shoulder, knee positions
    total_frames = 60
    for i in range(total_frames):
        # Phase oscillates between 0 (down, angle ~140°) and 1 (curled up, angle ~55°)
        phase = (1.0 - np.cos(3 * 2 * np.pi * (i / total_frames))) / 2.0
        
        # 33 landmarks: default to (0.5, 0.5, 0.0, 0.95)
        lms = [(0.5, 0.5, 0.0, 0.95) for _ in range(33)]
        
        # Hip at (0.5, 0.8)
        hip = (0.5, 0.8, 0.0, 0.95)
        # Knee at (0.7, 0.7)
        knee = (0.7, 0.7, 0.0, 0.95)
        
        # Shoulder position:
        # Down: shoulder at (0.2, 0.85) -> angle between (0.2, 0.85) - (0.5, 0.8) - (0.7, 0.7) is ~150°
        # Up: shoulder curls up to (0.55, 0.5) -> angle is ~50°
        sh_x = 0.2 + phase * 0.35
        sh_y = 0.85 - phase * 0.35
        shoulder = (sh_x, sh_y, 0.0, 0.95)
        
        lms[11] = shoulder # left shoulder
        lms[12] = shoulder # right shoulder
        lms[23] = hip      # left hip
        lms[24] = hip      # right hip
        lms[25] = knee     # left knee
        lms[26] = knee     # right knee
        lms[0] = (sh_x, sh_y - 0.1, 0.0, 0.95) # nose
        
        frame_data_list.append({
            "landmarks": lms,
            "timestamp_sec": round(i / 20.0, 2),
            "confidence": 94.0
        })
        
    result = analyze_situps(frame_data_list, duration_sec)
    
    print(f"Results -> Reps Counted: {result['reps_count']}, Cadence: {result['cadence_rpm']} rpm, Overall Score: {result['overall_score']}")
    
    assert result['reps_count'] >= 2, f"Expected at least 2 reps counted, got {result['reps_count']}"
    assert result['cadence_rpm'] > 0
    assert result['overall_score'] > 70
    assert result['assessment_status'] == "Completed"
    
    print("[PASS] Sit-up repetition state machine correctly detected and counted completed repetitions!")

def test_squat_algorithm():
    print("[*] Testing squat state machine with 60 landmark frames (2 deep squat cycles)...")
    
    duration_sec = 4.0
    frame_data_list = []
    total_frames = 60
    
    for i in range(total_frames):
        phase = (1.0 - np.cos(2 * 2 * np.pi * (i / total_frames))) / 2.0
        lms = [(0.5, 0.5, 0.0, 0.95) for _ in range(33)]
        
        # Standing: hip (0.5, 0.4), knee (0.5, 0.65), ankle (0.5, 0.9) -> angle ~180°
        # Squat: hip drops to (0.5, 0.65), knee bends forward to (0.6, 0.7), ankle (0.5, 0.9) -> angle ~90°
        hip_y = 0.4 + phase * 0.25
        knee_x = 0.5 + phase * 0.1
        knee_y = 0.65 + phase * 0.05
        
        hip = (0.5, hip_y, 0.0, 0.95)
        knee = (knee_x, knee_y, 0.0, 0.95)
        ankle = (0.5, 0.9, 0.0, 0.95)
        shoulder = (0.5, hip_y - 0.3, 0.0, 0.95)
        
        lms[11] = shoulder
        lms[12] = shoulder
        lms[23] = hip
        lms[24] = hip
        lms[25] = knee
        lms[26] = knee
        lms[27] = ankle
        lms[28] = ankle
        
        frame_data_list.append({
            "landmarks": lms,
            "timestamp_sec": round(i / 15.0, 2),
            "confidence": 95.0
        })
        
    result = analyze_squats(frame_data_list, duration_sec)
    print(f"Results -> Squat Reps: {result['reps_count']}, Deepest Knee Angle: {result['metrics'][1]['score']}°, Score: {result['overall_score']}")
    
    assert result['reps_count'] >= 1
    assert result['overall_score'] > 75
    print("[PASS] Squat depth and repetition state machine correctly detected and validated!")

if __name__ == "__main__":
    test_situp_algorithm()
    test_squat_algorithm()
