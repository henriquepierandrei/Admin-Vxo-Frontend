import { useEffect, useState, useCallback } from 'react';
import { Filter, X } from 'lucide-react';
import { getUserLogs } from '../services/logService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/StatusBadge';
import { formatDateTime } from '../utils/formatters';
import { LOG_TYPE_LABELS } from '../utils/constant';
import type { AdminUserLog, PageResponse, UserLogType } from '../utils/types';

export default function UserLogsPage() {
  const [data, setData] = useState<PageResponse<AdminUserLog> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [logType, setLogType] = useState('');
  const [userId, setUserId] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(
        await getUserLogs(page, 20, {
          type: (logType as UserLogType) || undefined,
          userId: userId || undefined,
        })
      );
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, [page, logType, userId]);

  useEffect(() => {
    load();
  }, [load]);

  function clearFilters() {
    setLogType('');
    setUserId('');
    setPage(0);
  }

  const hasFilters = logType || userId;

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
        </button>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-zinc-500 hover:text-zinc-800 flex items-center gap-1">
            <X size={12} /> Limpar
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl border border-zinc-200 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Tipo de Log</label>
            <select
              value={logType}
              onChange={(e) => { setLogType(e.target.value); setPage(0); }}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option value="">Todos</option>
              {Object.entries(LOG_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => { setUserId(e.target.value); setPage(0); }}
              placeholder="UUID do usuário"
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : !data || data.empty ? (
          <EmptyState message="Nenhum log encontrado" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50">
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Tipo</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Slug</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Descrição</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Coins</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((log) => (
                    <tr key={log.logId} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3">
                        <StatusBadge label={LOG_TYPE_LABELS[log.type] || log.type} />
                      </td>
                      <td className="px-4 py-3 text-zinc-700">@{log.slug}</td>
                      <td className="px-4 py-3 text-zinc-600 text-xs max-w-xs truncate">{log.description}</td>
                      <td className="px-4 py-3 font-mono text-zinc-600">
                        {log.coinsAmount !== 0 && (
                          <span className={log.coinsAmount > 0 ? 'text-emerald-600' : 'text-red-600'}>
                            {log.coinsAmount > 0 ? '+' : ''}{log.coinsAmount}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">{formatDateTime(log.createdAt)}</td>
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