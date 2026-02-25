import api from './api';
import type { PageResponse, AdminPayment, ProductType } from '../utils/types';

interface PaymentFilters {
  status?: string;
  userId?: string;
  productType?: ProductType;
  processed?: boolean;
  startDate?: string;
  endDate?: string;
}

export async function getPayments(
  page: number,
  size: number,
  filters?: PaymentFilters
): Promise<PageResponse<AdminPayment>> {
  const params: Record<string, unknown> = { page, size, sort: 'createdAt,desc' };
  if (filters) {
    if (filters.status) params.status = filters.status;
    if (filters.userId) params.userId = filters.userId;
    if (filters.productType) params.productType = filters.productType;
    if (filters.processed !== undefined) params.processed = filters.processed;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
  }
  const res = await api.get('/admin/payments', { params });
  return res.data;
}