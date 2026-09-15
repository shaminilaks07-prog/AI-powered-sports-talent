import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "sports_talent.db")

def get_db_connection():
    """Create and return a SQLite database connection with row access by column name."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database tables for users and sports assessment records."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Table 1: Users
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        age INTEGER,
        gender TEXT,
        primary_sport TEXT,
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
        metrics_json TEXT NOT NULL,
        strengths_json TEXT NOT NULL,
        weaknesses_json TEXT NOT NULL,
        suggestions_json TEXT NOT NULL,
        video_filename TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    );
    """)
    
    conn.commit()
    conn.close()
    print("[OK] SQLite database initialized successfully at:", DB_PATH)

if __name__ == "__main__":
    init_db()
