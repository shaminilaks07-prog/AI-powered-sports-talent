/**
 * API Service for interacting with the FastAPI Python Backend.
 * Includes local storage fallback so the user can test offline if needed.
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
    // If backend is down, fallback to local storage for testing
    console.warn('API register failed, saving to localStorage:', error);
    const mockUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      age: userData.age || 18,
      gender: userData.gender || 'Other',
      primary_sport: userData.primary_sport || 'General',
    };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    return { success: true, message: 'Registered locally (offline mode)', user: mockUser };
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
    console.warn('API login failed, checking localStorage:', error);
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      const user = JSON.parse(saved);
      if (user.email === credentials.email) {
        return { success: true, message: 'Logged in locally (offline mode)', user };
      }
    }
    // Demo account for quick testing
    if (credentials.email === 'athlete@demo.com' && credentials.password === 'password123') {
      const demoUser = {
        id: 1,
        name: 'Alex Rivera',
        email: 'athlete@demo.com',
        age: 19,
        gender: 'Male',
        primary_sport: 'Cricket',
      };
      localStorage.setItem('currentUser', JSON.stringify(demoUser));
      return { success: true, message: 'Logged in with Demo Account', user: demoUser };
    }
    throw new Error('Invalid email or password. You can use athlete@demo.com / password123 for testing.');
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
    console.warn('Backend server unreachable:', networkError.message);
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
    console.warn('Backend history fetch failed, reading localStorage:', error);
    const stored = localStorage.getItem(`history_${userId}`);
    return stored ? JSON.parse(stored) : [];
  }
}
