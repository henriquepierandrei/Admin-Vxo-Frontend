import { useEffect, useState, useCallback } from 'react';
import { getEmailLogs } from '../services/logService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/StatusBadge';
import { formatDateTime } from '../utils/formatters';
import type { AdminEmailLog, PageResponse } from '../utils/types';

export default function EmailLogsPage() {
  const [data, setData] = useState<PageResponse<AdminEmailLog> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await getEmailLogs(page, 20));
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : !data || data.empty ? (
          <EmptyState message="Nenhum log de email" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50">
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">ID</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Nome</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Enviado em</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Expira em</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Recuperado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((log) => (
                    <tr key={log.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500">#{log.id}</td>
                      <td className="px-4 py-3 text-zinc-900 font-medium">{log.name}</td>
                      <td className="px-4 py-3 text-zinc-600">{log.userEmail}</td>
                      <td className="px-4 py-3 text-xs text-zinc-500">{formatDateTime(log.sentAt)}</td>
                      <td className="px-4 py-3 text-xs text-zinc-500">{formatDateTime(log.expireAt)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          label={log.recovered ? 'Sim' : 'Não'}
                          variant={log.recovered ? 'success' : 'default'}
                        />
                      </td>
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