import api from './api';
import type { PageResponse, AdminItem, ItemStoreRequest, DefaultResponse } from '../utils/types';

export async function getStoreItems(page: number, size: number): Promise<PageResponse<AdminItem>> {
  const res = await api.get('/admin/store/items', { params: { page, size } });
  return res.data;
}

export async function createStoreItem(data: ItemStoreRequest): Promise<AdminItem> {
  const res = await api.post('/admin/store/items', data);
  return res.data;
}

export async function updateStoreItem(id: string, data: ItemStoreRequest): Promise<AdminItem> {
  const res = await api.put(`/admin/store/items/${id}`, data);
  return res.data;
}

export async function deleteStoreItem(id: string): Promise<DefaultResponse> {
  const res = await api.delete(`/admin/store/items/${id}`);
  return res.data;
}