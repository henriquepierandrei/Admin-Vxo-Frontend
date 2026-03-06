import { useEffect, useState, useCallback } from 'react';
import { Filter, X } from 'lucide-react';
import { getInventory } from '../services/inventoryService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/StatusBadge';
import { formatDateTime } from '../utils/formatters';
import { ITEM_TYPE_LABELS, ITEM_RARITY_LABELS, RARITY_COLORS } from '../utils/constant';
import type { AdminUserItem, PageResponse, ItemType, ItemRarity } from '../utils/types';

export default function InventoryPage() {
  const [data, setData] = useState<PageResponse<AdminUserItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [userId, setUserId] = useState('');
  const [itemType, setItemType] = useState('');
  const [rarity, setRarity] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(
        await getInventory(page, 20, {
          userId: userId || undefined,
          itemType: (itemType as ItemType) || undefined,
          rarity: (rarity as ItemRarity) || undefined,
        })
      );
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, [page, userId, itemType, rarity]);

  useEffect(() => {
    load();
  }, [load]);

  function clearFilters() {
    setUserId('');
    setItemType('');
    setRarity('');
    setPage(0);
  }

  const hasFilters = userId || itemType || rarity;

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
        <div className="bg-white rounded-xl border border-zinc-200 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
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
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Tipo</label>
            <select
              value={itemType}
              onChange={(e) => { setItemType(e.target.value); setPage(0); }}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option value="">Todos</option>
              {Object.entries(ITEM_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Raridade</label>
            <select
              value={rarity}
              onChange={(e) => { setRarity(e.target.value); setPage(0); }}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option value="">Todas</option>
              {Object.entries(ITEM_RARITY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : !data || data.empty ? (
          <EmptyState message="Nenhum item no inventário" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50">
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Item</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Tipo</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Raridade</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">User ID</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Adquirido em</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((item) => (
                    <tr key={item.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.itemUrl && (
                            <img src={item.itemUrl} alt="" className="w-8 h-8 rounded-lg object-cover bg-zinc-100" />
                          )}
                          <span className="font-medium text-zinc-900">{item.itemName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge label={ITEM_TYPE_LABELS[item.itemType] || item.itemType} />
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${RARITY_COLORS[item.itemRarity]}`}>
                          {ITEM_RARITY_LABELS[item.itemRarity]}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500 max-w-[140px] truncate">
                        {item.userId}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">{formatDateTime(item.acquiredAt)}</td>
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