import api from './api';
import type { PageResponse, AdminUserItem, ItemType, ItemRarity } from '../utils/types';

interface InventoryFilters {
  userId?: string;
  itemType?: ItemType;
  rarity?: ItemRarity;
}

export async function getInventory(
  page: number,
  size: number,
  filters?: InventoryFilters
): Promise<PageResponse<AdminUserItem>> {
  const params: Record<string, unknown> = { page, size, sort: 'acquiredAt,desc' };
  if (filters) {
    if (filters.userId) params.userId = filters.userId;
    if (filters.itemType) params.itemType = filters.itemType;
    if (filters.rarity) params.rarity = filters.rarity;
  }
  const res = await api.get('/admin/inventory', { params });
  return res.data;
}