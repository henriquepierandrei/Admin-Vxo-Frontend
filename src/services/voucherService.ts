import api from './api';
import type { PageResponse, VoucherResponse, VoucherGenerateRequest, DefaultResponse } from '../utils/types';

export async function getVouchers(page: number, size: number): Promise<PageResponse<VoucherResponse>> {
  const res = await api.get('/admin/vouchers', { params: { page, size } });
  return res.data;
}

export async function generateVoucher(data: VoucherGenerateRequest): Promise<string> {
  const res = await api.post('/admin/vouchers', data);
  return res.data;
}

export async function deleteVoucher(code: string): Promise<DefaultResponse> {
  const res = await api.delete(`/admin/vouchers/${code}`);
  return res.data;
}