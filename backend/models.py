from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any

class UserRegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    age: Optional[int] = 18
    gender: Optional[str] = "Other"
    primary_sport: Optional[str] = "General"

class UserLoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    age: Optional[int] = None
    gender: Optional[str] = None
    primary_sport: Optional[str] = None

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
    metrics: List[MetricDetail]
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]
    video_filename: Optional[str] = None
    created_at: Optional[str] = None
