import { useEffect, useState, useCallback } from 'react';
import { Filter, X } from 'lucide-react';
import { getPayments } from '../services/paymentService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/StatusBadge';
import { formatDateTime, formatCurrency } from '../utils/formatters';
import { PRODUCT_TYPE_LABELS, PAYMENT_STATUS_LABELS } from '../utils/constant';
import type { AdminPayment, PageResponse, ProductType } from '../utils/types';

const statusVariant = (s: string): 'success' | 'warning' | 'danger' | 'default' => {
  if (s === 'approved') return 'success';
  if (s === 'pending' || s === 'in_process') return 'warning';
  if (s === 'rejected' || s === 'cancelled') return 'danger';
  return 'default';
};

export default function PaymentsPage() {
  const [data, setData] = useState<PageResponse<AdminPayment> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [status, setStatus] = useState('');
  const [productType, setProductType] = useState('');
  const [processed, setProcessed] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPayments(page, 15, {
        status: status || undefined,
        productType: (productType as ProductType) || undefined,
        processed: processed === '' ? undefined : processed === 'true',
      });
      setData(res);
    } catch {
      // handled globally
    } finally {
      setLoading(false);
    }
  }, [page, status, productType, processed]);

  useEffect(() => {
    load();
  }, [load]);

  function clearFilters() {
    setStatus('');
    setProductType('');
    setProcessed('');
    setPage(0);
  }

  const hasFilters = status || productType || processed !== '';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors ${
            showFilters || hasFilters ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
          }`}
        >
          <Filter size={14} />
          Filtros
          {hasFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          )}
        </button>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-zinc-500 hover:text-zinc-800 flex items-center gap-1">
            <X size={12} />
            Limpar
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl border border-zinc-200 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(0); }}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option value="">Todos</option>
              {Object.entries(PAYMENT_STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Produto</label>
            <select
              value={productType}
              onChange={(e) => { setProductType(e.target.value); setPage(0); }}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option value="">Todos</option>
              {Object.entries(PRODUCT_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Processado</label>
            <select
              value={processed}
              onChange={(e) => { setProcessed(e.target.value); setPage(0); }}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option value="">Todos</option>
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : !data || data.empty ? (
          <EmptyState />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50">
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">ID</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Slug</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Produto</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Valor</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Processado</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((p) => (
                    <tr key={p.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500">#{p.id}</td>
                      <td className="px-4 py-3 text-zinc-700">@{p.slug}</td>
                      <td className="px-4 py-3">
                        <StatusBadge label={PRODUCT_TYPE_LABELS[p.productType] || p.productType} />
                      </td>
                      <td className="px-4 py-3 font-mono text-zinc-700">{formatCurrency(p.amount)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          label={PAYMENT_STATUS_LABELS[p.status] || p.status}
                          variant={statusVariant(p.status)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          label={p.processed ? 'Sim' : 'Não'}
                          variant={p.processed ? 'success' : 'warning'}
                        />
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">{formatDateTime(p.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 border-t border-zinc-100">
              <Pagination page={data.number} totalPages={data.totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}