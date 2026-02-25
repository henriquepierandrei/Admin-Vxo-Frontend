import api from './api';
import type { PageResponse, AdminUser, DefaultResponse } from '../utils/types';

export async function getUsers(page: number, size: number): Promise<PageResponse<AdminUser>> {
  const res = await api.get('/admin/users', { params: { page, size, sort: 'createdAt,desc' } });
  return res.data;
}

export async function getUserBySlug(slug: string): Promise<AdminUser> {
  const res = await api.get(`/admin/users/${slug}`);
  return res.data;
}

export async function banUser(slug: string, days: number): Promise<DefaultResponse> {
  const res = await api.post(`/admin/users/${slug}/ban`, null, { params: { days } });
  return res.data;
}

export async function unbanUser(slug: string): Promise<DefaultResponse> {
  const res = await api.post(`/admin/users/${slug}/unban`);
  return res.data;
}