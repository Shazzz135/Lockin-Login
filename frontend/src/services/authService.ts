import { apiClient } from './apiClient';

export async function login(email: string, password: string) {
  return apiClient('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
}

export async function signup(data: any) {
  return apiClient('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
