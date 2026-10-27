import sqlite3
import os
import json
import hashlib
import secrets
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "sports_talent.db")

def get_db_connection():
    """Create and return a SQLite database connection with row access by column name."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password: str, salt: str = None) -> tuple:
    """Hash a password securely using PBKDF2-HMAC-SHA256 with a unique salt."""
    if not salt:
        salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    )
    return key.hex(), salt

def verify_password(password: str, stored_hash: str, salt: str) -> bool:
    """Verify a plain-text password against a stored PBKDF2 hash and salt."""
    computed_hash, _ = hash_password(password, salt)
    return secrets.compare_digest(computed_hash, stored_hash)

def init_db():
    """Initialize database tables with complete schemas for users, assessments, and opportunities."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Table 1: Users
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        salt TEXT,
        age INTEGER DEFAULT 18,
        gender TEXT DEFAULT 'Other',
        primary_sport TEXT DEFAULT 'General Fitness',
        location TEXT DEFAULT '',
        fitness_goals TEXT DEFAULT '',
        bio TEXT DEFAULT '',
        coach_share_enabled INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Table 2: Assessments
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        sport TEXT NOT NULL,
        overall_score REAL NOT NULL,
        reps_count INTEGER DEFAULT 0,
        duration_sec REAL DEFAULT 0.0,
        cadence_rpm REAL DEFAULT 0.0,
        detection_confidence REAL DEFAULT 90.0,
        assessment_status TEXT DEFAULT 'Completed',
        metrics_json TEXT NOT NULL,
        strengths_json TEXT NOT NULL,
        weaknesses_json TEXT NOT NULL,
        suggestions_json TEXT NOT NULL,
        video_filename TEXT,
        coach_notes TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    );
    """)

    # Table 3: Verified Sports Opportunities & Scout Trials
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS opportunities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        sport TEXT NOT NULL,
        organizer TEXT NOT NULL,
        location TEXT NOT NULL,
        deadline TEXT NOT NULL,
        description TEXT NOT NULL,
        eligibility TEXT NOT NULL,
        verified INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Check and migrate columns in users if created from older schema
    cursor.execute("PRAGMA table_info(users);")
    existing_user_cols = [row["name"] for row in cursor.fetchall()]
    user_cols_to_add = {
        "salt": "TEXT",
        "location": "TEXT DEFAULT ''",
        "fitness_goals": "TEXT DEFAULT ''",
        "bio": "TEXT DEFAULT ''",
        "coach_share_enabled": "INTEGER DEFAULT 0"
    }
    for col, definition in user_cols_to_add.items():
        if col not in existing_user_cols:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col} {definition};")

    # Check and migrate columns in assessments
    cursor.execute("PRAGMA table_info(assessments);")
    existing_assessment_cols = [row["name"] for row in cursor.fetchall()]
    assessment_cols_to_add = {
        "reps_count": "INTEGER DEFAULT 0",
        "duration_sec": "REAL DEFAULT 0.0",
        "cadence_rpm": "REAL DEFAULT 0.0",
        "detection_confidence": "REAL DEFAULT 90.0",
        "assessment_status": "TEXT DEFAULT 'Completed'",
        "coach_notes": "TEXT DEFAULT ''"
    }
    for col, definition in assessment_cols_to_add.items():
        if col not in existing_assessment_cols:
            cursor.execute(f"ALTER TABLE assessments ADD COLUMN {col} {definition};")

    # Seed verified opportunities if table is empty
    cursor.execute("SELECT COUNT(*) as count FROM opportunities;")
    opp_count = cursor.fetchone()["count"]
    if opp_count == 0:
        sample_opportunities = [
            (
                "National Rural Sports Talent Search Trial",
                "Athletics & General Fitness",
                "Sports Development Board",
                "District Stadium, Zonal Center",
                "2026-12-15",
                "Open physical fitness assessment and talent scouting for students from rural government schools and community sports clubs.",
                "Boys and Girls aged 14–19 years; valid school ID or age certificate required."
            ),
            (
                "Grassroots Core Endurance & Track Scouting",
                "Sit-ups & Core Endurance",
                "Youth Athletics Federation",
                "State Sports Academy Grounds",
                "2026-11-30",
                "Regional talent identification focused on core stability, aerobic capacity, and bodyweight endurance for track & field disciplines.",
                "Athletes aged 15–21; open to all districts."
            ),
            (
                "Junior Cricket Fast Bowling & Agility Camp",
                "Cricket",
                "District Cricket Association",
                "Central Cricket Ground",
                "2026-12-05",
                "Kinematic assessment camp evaluating bowling action stability, front knee brace, and delivery cadence for junior pace bowlers.",
                "Under-17 & Under-19 bowlers; trials include video biometric analysis."
            ),
            (
                "Sub-Junior Basketball Athletic Assessment",
                "Basketball",
                "State Basketball Council",
                "Indoor Sports Complex",
                "2027-01-10",
                "Scouting program assessing vertical jump mechanics, bilateral landing symmetry, and defensive slide lateral velocity.",
                "Aged 13–18 years; beginners and intermediate players welcome."
            )
        ]
        cursor.executemany("""
            INSERT INTO opportunities (title, sport, organizer, location, deadline, description, eligibility, verified)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        """, sample_opportunities)

    conn.commit()
    conn.close()
    print("[OK] SQLite database initialized and migrated successfully at:", DB_PATH)

if __name__ == "__main__":
    init_db()
