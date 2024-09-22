import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  return response.json();
};

export const login = (credentials: { email: string; password: string }) =>
  apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

export const signup = (userData: { username: string; email: string; password: string }) =>
  apiCall('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

export const getCurrentUser = () => apiCall('/api/auth/me');