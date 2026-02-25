import axios from 'axios';
import { API_BASE_URL } from '../utils/Constants';
import { getRefreshToken } from '../utils/storage';
import type { AdminAuthResponse } from '../utils/types';

export async function loginAdmin(accessCode: string, password: string): Promise<AdminAuthResponse> {
  const res = await axios.post<AdminAuthResponse>(`${API_BASE_URL}/admin/auth/login`, {
    accessCode,
    password,
  });
  return res.data;
}

export async function logoutAdmin(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    await axios.post(`${API_BASE_URL}/admin/auth/logout`, null, {
      headers: { 'Refresh-Token': refreshToken },
    }).catch(() => {});
  }
}