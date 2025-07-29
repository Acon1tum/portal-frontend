import { User, Role, Business, TaglineCategory } from '@/app/utils/types';
import { getAllUsers, getAllRoles, getAllBusinesses, getAllTaglineCategories, getUserById, getRoleById, getBusinessById, authenticateUser } from './dummy-data';

// Set this to true to use dummy data, false to use real API
const USE_DUMMY_DATA = process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true';

// API base URL - can use either direct backend URL or proxied through Next.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200';

// Generic fetch function with error handling
async function fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// User API functions
export const fetchUsers = async (): Promise<User[]> => {
  if (USE_DUMMY_DATA) {
    return getAllUsers();
  }
  return fetchWithErrorHandling<User[]>(`${API_URL}/users`);
};

export const fetchUserById = async (id: string): Promise<User> => {
  if (USE_DUMMY_DATA) {
    const user = getUserById(id);
    if (!user) throw new Error('User not found');
    return user;
  }
  return fetchWithErrorHandling<User>(`${API_URL}/users/${id}`);
};

// Role API functions
export const fetchRoles = async (): Promise<Role[]> => {
  if (USE_DUMMY_DATA) {
    return getAllRoles();
  }
  return fetchWithErrorHandling<Role[]>(`${API_URL}/roles`);
};

export const fetchRoleById = async (id: string): Promise<Role> => {
  if (USE_DUMMY_DATA) {
    const role = getRoleById(id);
    if (!role) throw new Error('Role not found');
    return role;
  }
  return fetchWithErrorHandling<Role>(`${API_URL}/roles/${id}`);
};

// Business API functions
export const fetchBusinesses = async (): Promise<Business[]> => {
  if (USE_DUMMY_DATA) {
    return getAllBusinesses();
  }
  return fetchWithErrorHandling<Business[]>(`${API_URL}/businesses`);
};

export const fetchBusinessById = async (id: string): Promise<Business> => {
  if (USE_DUMMY_DATA) {
    const business = getBusinessById(id);
    if (!business) throw new Error('Business not found');
    return business;
  }
  return fetchWithErrorHandling<Business>(`${API_URL}/businesses/${id}`);
};

// Tagline Category API functions
export const fetchTaglineCategories = async (): Promise<TaglineCategory[]> => {
  if (USE_DUMMY_DATA) {
    return getAllTaglineCategories();
  }
  return fetchWithErrorHandling<TaglineCategory[]>(`${API_URL}/tagline-categories`);
};

// Auth functions
export const login = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  if (USE_DUMMY_DATA) {
    const result = authenticateUser(email, password);
    if (!result) {
      throw new Error('Invalid credentials');
    }
    return result;
  }
  return fetchWithErrorHandling<{ token: string; user: User }>(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
};

export const logout = async (): Promise<void> => {
  if (USE_DUMMY_DATA) {
    return;
  }
  return fetchWithErrorHandling<void>(`${API_URL}/auth/logout`, {
    method: 'POST',
  });
}; 