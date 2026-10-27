from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any

class UserRegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    age: Optional[int] = 18
    gender: Optional[str] = "Other"
    primary_sport: Optional[str] = "General Fitness"
    location: Optional[str] = ""
    fitness_goals: Optional[str] = ""

class UserLoginRequest(BaseModel):
    email: str
    password: str

class UserUpdateRequest(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    primary_sport: Optional[str] = None
    location: Optional[str] = None
    fitness_goals: Optional[str] = None
    bio: Optional[str] = None
    coach_share_enabled: Optional[bool] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    age: Optional[int] = None
    gender: Optional[str] = None
    primary_sport: Optional[str] = None
    location: Optional[str] = ""
    fitness_goals: Optional[str] = ""
    bio: Optional[str] = ""
    coach_share_enabled: Optional[bool] = False
    created_at: Optional[str] = None

class MetricDetail(BaseModel):
    name: str
    score: float
    unit: Optional[str] = ""
    target: Optional[str] = ""
    feedback: str

class AssessmentResult(BaseModel):
    id: Optional[int] = None
    user_id: Optional[int] = None
    sport: str
    overall_score: float
    reps_count: Optional[int] = 0
    duration_sec: Optional[float] = 0.0
    cadence_rpm: Optional[float] = 0.0
    detection_confidence: Optional[float] = 90.0
    assessment_status: Optional[str] = "Completed"
    metrics: List[MetricDetail]
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]
    video_filename: Optional[str] = None
    coach_notes: Optional[str] = ""
    created_at: Optional[str] = None

class CoachFeedbackRequest(BaseModel):
    coach_notes: str

class OpportunityItem(BaseModel):
    id: int
    title: str
    sport: str
    organizer: str
    location: str
    deadline: str
    description: str
    eligibility: str
    verified: bool
