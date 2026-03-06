import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { getStoreItems, createStoreItem, updateStoreItem, deleteStoreItem } from '../services/storeService';
import { useToast } from '../hooks/useToast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { ITEM_TYPE_LABELS, ITEM_RARITY_LABELS, RARITY_COLORS } from '../utils/constant';
import type { AdminItem, PageResponse, ItemStoreRequest, ItemType, ItemRarity } from '../utils/types';

const emptyForm: ItemStoreRequest = {
  itemUrl: '',
  itemType: 'BADGE',
  itemRarity: 'COMMON',
  itemName: '',
  itemDescription: '',
  itemPrice: 0,
  limited: false,
  quantityAvailable: undefined,
  discount: undefined,
  premium: false,
  active: true,
};

export default function StoreItemsPage() {
  const toast = useToast();
  const [data, setData] = useState<PageResponse<AdminItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ItemStoreRequest>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await getStoreItems(page, 12));
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(item: AdminItem) {
    setForm({
      itemUrl: item.itemUrl,
      itemType: item.itemType,
      itemRarity: item.itemRarity,
      itemName: item.itemName,
      itemDescription: item.itemDescription,
      itemPrice: item.itemPrice,
      limited: item.limited,
      quantityAvailable: item.quantityAvailable,
      discount: item.discount,
      premium: item.premium,
      active: item.active,
    });
    setEditingId(item.itemId);
    setModalOpen(true);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateStoreItem(editingId, form);
        toast.success('Item atualizado');
      } else {
        await createStoreItem(form);
        toast.success('Item criado');
      }
      setModalOpen(false);
      load();
    } catch {
      toast.error('Erro ao salvar item');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteStoreItem(deleteId);
      toast.success('Item removido');
      setDeleteId(null);
      load();
    } catch {
      toast.error('Erro ao remover item');
    } finally {
      setDeleting(false);
    }
  }

  function updateForm(patch: Partial<ItemStoreRequest>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <Plus size={16} />
          Novo Item
        </button>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : !data || data.empty ? (
          <EmptyState message="Nenhum item cadastrado" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50">
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Item</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Tipo</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Raridade</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Preço</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-zinc-500">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((item) => (
                    <tr key={item.itemId} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.itemUrl && (
                            <img src={item.itemUrl} alt="" className="w-9 h-9 rounded-lg object-cover bg-zinc-100" />
                          )}
                          <div>
                            <p className="font-medium text-zinc-900">{item.itemName}</p>
                            <p className="text-xs text-zinc-400 truncate max-w-[200px]">{item.itemDescription}</p>
                          </div>
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
                      <td className="px-4 py-3 font-mono text-zinc-700">
                        {item.discount ? (
                          <div>
                            <span className="line-through text-zinc-400 text-xs">{item.itemPrice}</span>
                            <span className="ml-1">{item.itemPrice - (item.itemPrice * item.discount / 100)}</span>
                          </div>
                        ) : (
                          item.itemPrice
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <StatusBadge label={item.active ? 'Ativo' : 'Inativo'} variant={item.active ? 'success' : 'default'} />
                          {item.premium && <StatusBadge label="Premium" variant="warning" />}
                          {item.limited && <StatusBadge label={`Qtd: ${item.quantityAvailable}`} variant="info" />}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteId(item.itemId)}
                            className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
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

      {/* CREATE / EDIT MODAL */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Editar Item' : 'Novo Item'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-zinc-500 mb-1">Nome</label>
              <input
                required
                value={form.itemName}
                onChange={(e) => updateForm({ itemName: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-zinc-500 mb-1">URL da Imagem</label>
              <input
                required
                value={form.itemUrl}
                onChange={(e) => updateForm({ itemUrl: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Tipo</label>
              <select
                value={form.itemType}
                onChange={(e) => updateForm({ itemType: e.target.value as ItemType })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              >
                {Object.entries(ITEM_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Raridade</label>
              <select
                value={form.itemRarity}
                onChange={(e) => updateForm({ itemRarity: e.target.value as ItemRarity })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              >
                {Object.entries(ITEM_RARITY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-zinc-500 mb-1">Descrição</label>
              <textarea
                rows={2}
                value={form.itemDescription}
                onChange={(e) => updateForm({ itemDescription: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Preço (coins)</label>
              <input
                type="number"
                required
                min={0}
                value={form.itemPrice}
                onChange={(e) => updateForm({ itemPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Desconto (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.discount ?? ''}
                onChange={(e) => updateForm({ discount: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => updateForm({ active: e.target.checked })}
                className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
              />
              Ativo
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.premium}
                onChange={(e) => updateForm({ premium: e.target.checked })}
                className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
              />
              Premium
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.limited}
                onChange={(e) => updateForm({ limited: e.target.checked })}
                className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
              />
              Limitado
            </label>
          </div>

          {form.limited && (
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Quantidade Disponível</label>
              <input
                type="number"
                min={1}
                value={form.quantityAvailable ?? ''}
                onChange={(e) => updateForm({ quantityAvailable: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {editingId ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Remover Item">
        <p className="text-sm text-zinc-600 mb-4">Tem certeza que deseja remover este item? Essa ação não pode ser desfeita.</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setDeleteId(null)}
            className="px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {deleting && <Loader2 size={14} className="animate-spin" />}
            Remover
          </button>
        </div>
      </Modal>
    </div>
  );
}