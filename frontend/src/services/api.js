/**
 * API Service for connecting frontend with FastAPI Python Backend.
 * Standardizes endpoints with comprehensive error handling and offline fallbacks.
 */

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, { method: 'GET' });
    if (!response.ok) throw new Error('Backend not healthy');
    return await response.json();
  } catch (error) {
    console.warn('Backend server not reachable:', error.message);
    return { status: 'offline', error: error.message };
  }
}

export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Registration failed');
    return data;
  } catch (error) {
    console.warn('API register failed, checking error:', error);
    throw error;
  }
}

export async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Login failed');
    return data;
  } catch (error) {
    // Demo Account Fallback for offline testing
    if (credentials.email === 'athlete@demo.com' && credentials.password === 'password123') {
      const demoUser = {
        id: 1,
        name: 'Arjun Patel',
        email: 'athlete@demo.com',
        age: 18,
        gender: 'Male',
        primary_sport: 'Sit-ups and Core Endurance',
        location: 'Ranchi, Jharkhand',
        fitness_goals: 'Build core endurance and athletic stamina for national junior trials',
        bio: 'Aspiring grassroots track & endurance athlete.',
        coach_share_enabled: true
      };
      return { success: true, message: 'Logged in with Demo Account', user: demoUser };
    }
    throw error;
  }
}

export async function fetchAthleteProfile(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/athletes/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch athlete profile');
    return await response.json();
  } catch (error) {
    console.warn('Profile fetch error:', error);
    return null;
  }
}

export async function updateAthleteProfile(userId, profileData) {
  const response = await fetch(`${API_BASE_URL}/api/athletes/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to update profile');
  return data;
}

export async function fetchAthleteProgress(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/athletes/${userId}/progress`);
    if (!response.ok) throw new Error('Failed to fetch athlete progress');
    return await response.json();
  } catch (error) {
    console.warn('Progress fetch error:', error);
    return null;
  }
}

export async function uploadAndAnalyzeVideo(formData) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/assessments/analyze`, {
      method: 'POST',
      body: formData,
    });
  } catch (networkError) {
    throw new Error('Cannot connect to Python backend. Please verify FastAPI is running on http://127.0.0.1:8000.');
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMsg = data?.detail || `Analysis failed (HTTP ${response.status})`;
    throw new Error(errorMsg);
  }

  return data;
}

export async function fetchUserAssessments(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/assessments/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch assessment history');
    return await response.json();
  } catch (error) {
    console.warn('Backend history fetch error:', error);
    const stored = localStorage.getItem(`history_${userId}`);
    return stored ? JSON.parse(stored) : [];
  }
}

export async function fetchAssessmentById(assessmentId) {
  const response = await fetch(`${API_BASE_URL}/api/assessments/${assessmentId}`);
  if (!response.ok) throw new Error('Assessment not found');
  return await response.json();
}

export async function deleteAssessmentById(assessmentId) {
  const response = await fetch(`${API_BASE_URL}/api/assessments/${assessmentId}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete assessment');
  return await response.json();
}

export async function deleteUserAssessments(userId) {
  const response = await fetch(`${API_BASE_URL}/api/assessments/user/${userId}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to clear user assessments');
  return await response.json();
}

export async function submitCoachFeedback(assessmentId, coachNotes) {
  const response = await fetch(`${API_BASE_URL}/api/assessments/${assessmentId}/coach-feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coach_notes: coachNotes })
  });
  if (!response.ok) throw new Error('Failed to save coach feedback');
  return await response.json();
}

export async function fetchVerifiedOpportunities(sport = '') {
  try {
    const url = sport ? `${API_BASE_URL}/api/opportunities?sport=${encodeURIComponent(sport)}` : `${API_BASE_URL}/api/opportunities`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch opportunities');
    return await response.json();
  } catch (error) {
    console.warn('Opportunities fetch error:', error);
    return [];
  }
}
