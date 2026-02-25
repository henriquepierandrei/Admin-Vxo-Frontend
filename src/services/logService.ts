import api from './api';
import type { PageResponse, AdminEmailLog, AdminUserLog, UserLogType } from '../utils/types';

export async function getEmailLogs(page: number, size: number): Promise<PageResponse<AdminEmailLog>> {
  const res = await api.get('/admin/logs/email', { params: { page, size, sort: 'sentAt,desc' } });
  return res.data;
}

interface UserLogFilters {
  type?: UserLogType;
  userId?: string;
  start?: string;
  end?: string;
}

export async function getUserLogs(
  page: number,
  size: number,
  filters?: UserLogFilters
): Promise<PageResponse<AdminUserLog>> {
  const params: Record<string, unknown> = { page, size, sort: 'createdAt,desc' };
  if (filters) {
    if (filters.type) params.type = filters.type;
    if (filters.userId) params.userId = filters.userId;
    if (filters.start) params.start = filters.start;
    if (filters.end) params.end = filters.end;
  }
  const res = await api.get('/admin/logs/users', { params });
  return res.data;
}