import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getUsers } from '../services/userService';
import { useDebounce } from '../hooks/useDebounce';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/StatusBadge';
import { formatDateTime } from '../utils/formatters';
import { USER_LEVEL_LABELS } from '../utils/constant';
import type { AdminUser, PageResponse } from '../utils/types';

export default function UsersPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<PageResponse<AdminUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers(page, 15);
      setData(res);
    } catch {
      // handled globally
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = data?.content.filter((u) => {
    if (!debouncedSearch) return true;
    const s = debouncedSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s) ||
      u.slug.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : !filtered || filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50">
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Nome</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Nível</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Coins</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Criado em</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr
                      key={user.userId}
                      onClick={() => navigate(`/users/${user.slug}`)}
                      className="border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-zinc-900">{user.name}</p>
                          <p className="text-xs text-zinc-400">@{user.slug}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <StatusBadge label={USER_LEVEL_LABELS[user.userLevel] || user.userLevel} variant="info" />
                      </td>
                      <td className="px-4 py-3 text-zinc-600 font-mono">{user.coins}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {user.premium && <StatusBadge label="Premium" variant="warning" />}
                          {user.banned && <StatusBadge label="Banido" variant="danger" />}
                          {!user.premium && !user.banned && <StatusBadge label="Ativo" variant="success" />}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">{formatDateTime(user.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data && (
              <div className="px-4 border-t border-zinc-100">
                <Pagination page={data.number} totalPages={data.totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}