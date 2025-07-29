import Cookies from 'js-cookie';
import { SessionUser } from '@/utils/types';

// Use NEXT_PUBLIC_API_URL for consistency across the app
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200';

// Login function to authenticate user and store session
export const login = async (email: string, password: string) => {
  // Include credentials so that the browser sends and receives cookies (the session cookie)
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for sending/receiving session cookies
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }

  // Log the user data coming from the server session response
  console.log('Login successful:', data.user);

  return { user: data.user as SessionUser };
};

// Function to check if user is authenticated by checking session
export const checkSession = async (): Promise<SessionUser | null> => {
  try {
    const res = await fetch(`${API_URL}/auth/check-session`, {
      method: 'GET',
      credentials: 'include', // Important for sending session cookies
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.user as SessionUser;
  } catch (error) {
    console.error('Session check failed:', error);
    return null;
  }
};

// Function to logout user
export const logout = async (): Promise<void> => {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

export const signupWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const res = await fetch(
    `${API_URL}/auth/signup-email-and-pass/signup`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    }
  )

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Signup failed')
  }

  // data.user is your Prisma userRecord, data.message is the text
  return data as {
    message: string
    user: {
      id: string
      email: string
      name?: string
      sex: string
      isEmailVerified: boolean
      otpVerified: boolean
      otpExpiresAt?: string
    }
  }
}

export const resendOTP = async (userId: string) => {
  const res = await fetch(`${API_URL}/auth/signup-with-google/callback/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',             // include cookies for session-based cooldown
    body: JSON.stringify({ userId }),
  })

  console.log("USERID RESEND" + userId)
  const data = await res.json()
  if (!res.ok) {
    // backend returns { error: "Please wait X seconds..." } on 429
    throw new Error(data.error || 'Failed to resend OTP')
  }

  return data as { message: string }
}

// Function to get and decode the JWT token manually from cookies (legacy - may not be needed with session auth)
export const userAuth = () => {
  const token = Cookies.get('token');
  
  if (!token) {
    throw new Error('Token not found');
  }

  // Split the JWT into its three parts (header, payload, and signature)
  const base64Url = token.split('.')[1];
  if (!base64Url) {
    throw new Error('Invalid token');
  }

  // Decode the base64Url string to a JSON object
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Base64URL to Base64
  const decodedJson = atob(base64); // Decode the base64 string
  const decoded = JSON.parse(decodedJson); // Parse the JSON string to an object
  
  return decoded; // Return the decoded token data
};  

export const signupWithGoogle = (): void => {
  window.location.href = `${API_URL}/auth/signup-with-google`;
};



