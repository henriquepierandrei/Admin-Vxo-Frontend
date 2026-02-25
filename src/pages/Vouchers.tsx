import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { Plus, Trash2, Loader2, Copy, Check } from 'lucide-react';
import { getVouchers, generateVoucher, deleteVoucher } from '../services/voucherService';
import { useToast } from '../hooks/useToast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { formatDateTime } from '../utils/formatters';
import { VOUCHER_TYPE_LABELS } from '../utils/Constants';
import type { VoucherResponse, PageResponse, VoucherType, VoucherGenerateRequest } from '../utils/types';

export default function VouchersPage() {
  const toast = useToast();
  const [data, setData] = useState<PageResponse<VoucherResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [vType, setVType] = useState<VoucherType>('COINS');
  const [value, setValue] = useState(100);
  const [expDate, setExpDate] = useState('');

  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const [deleteCode, setDeleteCode] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await getVouchers(page, 15));
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const req: VoucherGenerateRequest = {
        type: vType,
        value,
        expirationDate: new Date(expDate).toISOString(),
      };
      const code = await generateVoucher(req);
      setGeneratedCode(code);
      toast.success('Voucher gerado');
      load();
    } catch {
      toast.error('Erro ao gerar voucher');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteCode) return;
    setDeleting(true);
    try {
      await deleteVoucher(deleteCode);
      toast.success('Voucher removido');
      setDeleteCode(null);
      load();
    } catch {
      toast.error('Erro ao remover voucher');
    } finally {
      setDeleting(false);
    }
  }

  function copyCode() {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function closeCreate() {
    setCreateOpen(false);
    setGeneratedCode('');
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => { setCreateOpen(true); setGeneratedCode(''); }}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <Plus size={16} />
          Gerar Voucher
        </button>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : !data || data.empty ? (
          <EmptyState message="Nenhum voucher cadastrado" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50">
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Código</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Tipo</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Valor</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Usado por</th>
                    <th className="text-left px-4 py-3 font-medium text-zinc-500">Expira em</th>
                    <th className="text-right px-4 py-3 font-medium text-zinc-500">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((v) => (
                    <tr key={v.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-zinc-700">{v.code}</td>
                      <td className="px-4 py-3">
                        <StatusBadge label={VOUCHER_TYPE_LABELS[v.type]} variant={v.type === 'PREMIUM' ? 'warning' : 'info'} />
                      </td>
                      <td className="px-4 py-3 font-mono text-zinc-700">{v.value}</td>
                      <td className="px-4 py-3">
                        {v.used ? (
                          <StatusBadge label="Usado" variant="default" />
                        ) : v.active ? (
                          <StatusBadge label="Ativo" variant="success" />
                        ) : (
                          <StatusBadge label="Inativo" variant="danger" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">{v.usedByUsername || '—'}</td>
                      <td className="px-4 py-3 text-xs text-zinc-500">{formatDateTime(v.expirationDate)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            onClick={() => setDeleteCode(v.code)}
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

      {/* GENERATE MODAL */}
      <Modal open={createOpen} onClose={closeCreate} title="Gerar Voucher">
        {generatedCode ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-zinc-500">Voucher gerado com sucesso!</p>
            <div className="flex items-center justify-center gap-2">
              <code className="px-4 py-2 bg-zinc-100 rounded-lg text-lg font-mono font-bold text-zinc-900">
                {generatedCode}
              </code>
              <button
                onClick={copyCode}
                className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>
            <button
              onClick={closeCreate}
              className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Tipo</label>
              <select
                value={vType}
                onChange={(e) => setVType(e.target.value as VoucherType)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              >
                <option value="COINS">Coins</option>
                <option value="PREMIUM">Premium (dias)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">
                {vType === 'COINS' ? 'Quantidade de Coins' : 'Dias de Premium'}
              </label>
              <input
                type="number"
                required
                min={1}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Data de Expiração</label>
              <input
                type="datetime-local"
                required
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeCreate}
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
                Gerar
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* DELETE MODAL */}
      <Modal open={!!deleteCode} onClose={() => setDeleteCode(null)} title="Remover Voucher">
        <p className="text-sm text-zinc-600 mb-4">
          Remover o voucher <strong className="font-mono">{deleteCode}</strong>?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setDeleteCode(null)}
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