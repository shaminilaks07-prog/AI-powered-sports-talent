# AI-Powered Mobile Platform for Democratizing Sports Talent Assessment 🏃‍♂️⚡

A college mini-project full-stack application designed to democratize sports talent identification and physical movement assessment. The platform enables student athletes—especially in rural, underserved, and grassroots communities—to evaluate their physical conditioning and technique using an ordinary smartphone or computer camera.

---

## 🌟 Core Vision & Motivation

Professional sports biomechanics laboratories, 3D motion-capture suits, and force plates cost thousands of dollars and are typically restricted to elite urban academies. 

**TalentPulse AI** eliminates this barrier by transforming any ordinary mobile camera into an objective biomechanical screening tool:
- **Zero Expensive Equipment**: Works on basic smartphone cameras and laptop webcams.
- **Grassroots Empowerment**: Helps student athletes in remote districts benchmark their form.
- **Rule-Based & Transparent**: Biomechanical metrics are computed from real joint angles; no fake AI scores or arbitrary black-box claims.
- **Assists Rather Than Replaces Coaches**: Designed as a supportive development tool for physical education teachers, grassroots scouts, and athletes.

---

## 🎨 Visual Identity & Design System

The application features an elegant, light, natural sports-technology aesthetic adhering to the curated palette:
- **Warm Off-White (`#FAFAF6`)**: Clean, natural primary background.
- **Soft Ivory (`#F3F1E8`)**: Secondary card backgrounds and guidance panels.
- **Light Sage Green (`#DCE8D8`)**: Subtle accents, active states, and pill badges.
- **Muted Forest Green (`#46664F`)**: Primary action buttons, brand marks, and indicators.
- **Subtle Teal (`#8FB8AC`)**: Accent borders and secondary icons.
- **Charcoal Text (`#303831`)**: High-contrast, easily readable typography.
- **Light Grey Borders (`#E5E7E2`)**: Minimalist dividers and container outlines.

---

## 🚀 Key Modules & Capabilities

1. **Public Landing Page**
   - Introduces the platform mission and rural empowerment vision.
   - 3-Step Process overview: **Record**, **Analyze**, **Improve**.
   - Exercise modules catalog and responsible AI ethics statement.

2. **Secure Authentication & Athlete Profiles**
   - PBKDF2-HMAC-SHA256 password hashing with unique salts.
   - Athlete registration capturing age, gender, location (district/state), and primary sport.
   - Profile management with persistent backend updates (`PUT /api/athletes/{id}`).
   - Privacy sharing toggle: Athletes control whether reports are shared with verified scouts.
   - 1-Click Demo Login for rapid examiner testing (`athlete@demo.com` or `arjun.patel@sports.org`).

3. **Dual-Mode Video Input**
   - **Live Webcam Recording**: In-browser video capture with MediaRecorder, 3-second countdown, full-body framing guide, and instant preview.
   - **File Upload**: Supports `.mp4`, `.mov`, `.webm`, `.avi` files (up to 60MB).
   - Instant sample testing buttons for fast desktop demonstrations.

4. **AI Computer Vision Assessment Engine**
   - Built with **OpenCV** and official **Google MediaPipe PoseLandmarker Tasks** (33 landmarks).
   - **Sit-ups & Core Endurance**: Hip flexion angle state machine (DOWN > 120° ↔ UP < 70°), completed repetition counter, cadence (reps/min), range of motion, and spinal alignment.
   - **Squats & Lower-Body Movement**: Knee angle tracking, depth evaluation (parallel 90° vs deep), bilateral knee symmetry, and upright torso incline.
   - **Jumping & Explosive Velocity**: Countermovement loading dip, explosive vertical takeoff speed, and landing absorption.
   - **Running & Sprinting Cadence**: High knee drive angle, forward acceleration lean, and stride rhythm.
   - **Balance & Posture Assessment**: Center-of-mass sway standard deviation, spinal verticality, and shoulder/pelvis tilt.
   - **Quality & Positioning Warning**: Automatically flags poor lighting, cut-off limbs, or low detection confidence (< 60%).

5. **Athlete Dashboard & Analytics**
   - Verified performance snapshot (Peak score, total sessions, repetitions counted).
   - Interactive SVG progress chart over historical test dates.
   - Honest empty states for new athletes (no fake stats).
   - Preliminary sports suitability suggestions linked to measured joint flexibility and stamina.

6. **Persistent History & Reports**
   - SQLite database storage for all user assessments.
   - Detailed biomechanics report with score ring, joint breakdown bars, strengths, refinement areas, and AI coaching drills.
   - Foundation for verified coach feedback notes.

7. **Verified Grassroots Opportunities**
   - Verified talent trials, district athletics meets, and national grassroots scouting camps (e.g., Khelo India trials, junior sports academies).

---

## 📁 Repository Structure

```
AI-powered sports talent/
├── backend/
│   ├── main.py                     # FastAPI REST API & routes
│   ├── database.py                 # SQLite schema, migrations & PBKDF2 hashing
│   ├── models.py                   # Pydantic schemas for auth, assessments & trials
│   ├── ai_engine.py                # MediaPipe Pose & activity-specific biomechanics
│   ├── pose_landmarker_lite.task   # MediaPipe 33-landmark pose model (5.7 MB)
│   ├── sports_talent.db            # SQLite database
│   ├── requirements.txt            # Python dependencies
│   └── uploads/                    # Local storage for recorded/uploaded sports clips
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Application controller & view router
│   │   ├── index.css               # Light sports design system & track aesthetics
│   │   ├── main.jsx                # React root mount
│   │   ├── components/
│   │   │   ├── DeviceFrame.jsx     # Mobile mockup shell & desktop wide toggle
│   │   │   ├── Navbar.jsx          # Top application navigation bar
│   │   │   ├── BottomNav.jsx       # 6-tab mobile bottom navigation bar
│   │   │   └── WebcamRecorder.jsx  # In-browser live webcam recorder with countdown
│   │   ├── screens/
│   │   │   ├── LandingPage.jsx     # Public platform landing page
│   │   │   ├── HomeScreen.jsx      # Athlete dashboard with SVG progress chart
│   │   │   ├── AuthScreen.jsx      # Register & login with 1-click demo
│   │   │   ├── UploadScreen.jsx    # Dual-mode camera/file assessment screen
│   │   │   ├── ResultsScreen.jsx   # Biomechanics report, score ring & coach feedback
│   │   │   ├── HistoryScreen.jsx   # Persistent assessment logs & deletion
│   │   │   ├── ProfileScreen.jsx   # Editable athlete profile & personal bests
│   │   │   ├── DrillsScreen.jsx    # Exercise guides & camera setup instructions
│   │   │   └── OpportunitiesScreen.jsx # Verified sports trials & scouting directory
│   │   └── services/
│   │       └── api.js              # REST API client with error handling
│   ├── index.html                  # SEO metadata, runner icon & Tailwind config
│   ├── package.json                # React 18, Vite 6, Lucide icons, Confetti
│   └── vite.config.js              # Vite dev server configuration
│
├── test_e2e_pipeline.py            # 10-point automated end-to-end test suite
├── test_situps_landmarks_algorithm.py # Biomechanical state machine algorithm unit tests
└── README.md                       # Comprehensive project documentation
```

---

## 🛠️ Prerequisites

- **Python**: Version 3.10 to 3.13 (Python 3.13 64-bit verified)
- **Node.js**: Version 18+ (Node.js 20+ recommended)
- **Web Browser**: Chrome, Edge, Safari, or Firefox with camera permissions enabled

---

## 💻 Installation & Setup

### 1. Backend Setup

Open a PowerShell terminal in the project root:

```powershell
# Navigate to the backend directory
cd backend

# Install required Python packages
python -m pip install -r requirements.txt

# Initialize and migrate the SQLite database
python database.py
```

### 2. Frontend Setup

Open a second PowerShell terminal:

```powershell
# Navigate to the frontend directory
cd frontend

# Install npm dependencies
npm.cmd install
```

---

## 🏃‍♂️ How to Run the Application

### 1. Start FastAPI Backend (Port 8000)

```powershell
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
* **API Root**: `http://127.0.0.1:8000/`
* **Health Check**: `http://127.0.0.1:8000/api/health`
* **Interactive Swagger Documentation**: `http://127.0.0.1:8000/docs`

### 2. Start React + Vite Frontend (Port 5173)

```powershell
cd frontend
npm.cmd run dev
```
* **Web Application URL**: `http://localhost:5173/`

Open `http://localhost:5173/` in your web browser.

---

## 🧪 Testing & Quality Assurance

Automated test suites are included to verify functionality:

### 1. Full Pipeline E2E Test Suite
Tests API health, user registration, PBKDF2 password hashing, profile updates, synthetic video creation with OpenCV, AI biomechanics analysis, assessment history, coach feedback, verified opportunities, and progress aggregation:

```powershell
python test_e2e_pipeline.py
```
*Expected Output: `ALL 10 E2E AUTOMATED TESTS COMPLETED WITH 100% SUCCESS!`*

### 2. Sit-up & Squat State Machine Algorithm Test
Directly tests joint angle calculations and repetition state transitions using simulated 33 landmark coordinate series:

```powershell
python test_situps_landmarks_algorithm.py
```
*Expected Output: `Sit-up repetition state machine correctly detected and counted completed repetitions!`*

### 3. Production Frontend Build Test
Verifies that all JSX screens and assets bundle cleanly:

```powershell
cd frontend
npm.cmd run build
```

---

## 🛡️ Privacy, Security & Ethics

- **Password Protection**: Passwords are never stored in plain text; PBKDF2-HMAC-SHA256 with cryptographically random salts is enforced.
- **Athlete Data Privacy**: Private assessment results are tied strictly to authenticated user IDs and cannot be viewed by unauthorized users.
- **Coach Sharing Control**: Athletes maintain an explicit toggle in their profile controlling whether reports are shared with verified coaches.
- **Camera Consent**: Video capture starts only after explicit user interaction with a visible 3-second countdown.
- **Limitations Disclosure**: The system clearly discloses that computer vision is an assistive assessment tool and does not guarantee tournament selection, team placement, or medical diagnostic advice.

---

## 👥 College Mini-Project Information
- **Project Title**: AI-Powered Mobile Platform for Democratizing Sports Talent Assessment
- **Domain**: Artificial Intelligence / Computer Vision / Full-Stack Sports Technology
- **Architecture**: React (Vite) + Python FastAPI + MediaPipe Pose + OpenCV + SQLite3
