import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Ban, ShieldCheck, Eye, Coins, Calendar } from 'lucide-react';
import { getUserBySlug, banUser, unbanUser } from '../services/userService';
import { useToast } from '../hooks/useToast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { formatDateTime, formatNumber } from '../utils/formatters';
import { USER_LEVEL_LABELS } from '../utils/Constants';
import type { AdminUser } from '../utils/types';

export default function UserDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [banModal, setBanModal] = useState(false);
  const [banDays, setBanDays] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getUserBySlug(slug)
      .then(setUser)
      .catch(() => toast.error('Usuário não encontrado'))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleBan(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setActionLoading(true);
    try {
      await banUser(user.slug, banDays);
      toast.success(`Usuário banido por ${banDays} dias`);
      setBanModal(false);
      const updated = await getUserBySlug(user.slug);
      setUser(updated);
    } catch {
      toast.error('Erro ao banir usuário');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUnban() {
    if (!user) return;
    setActionLoading(true);
    try {
      await unbanUser(user.slug);
      toast.success('Usuário desbanido');
      const updated = await getUserBySlug(user.slug);
      setUser(updated);
    } catch {
      toast.error('Erro ao desbanir usuário');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (!user) return <div className="text-center text-zinc-500 py-20">Usuário não encontrado</div>;

  const infoCards = [
    { icon: Coins, label: 'Coins', value: formatNumber(user.coins) },
    { icon: Eye, label: 'Visualizações', value: formatNumber(user.views) },
    { icon: Calendar, label: 'Último login', value: formatDateTime(user.lastLoginAt) },
    { icon: Calendar, label: 'Criado em', value: formatDateTime(user.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/users')}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-zinc-900">{user.name}</h2>
              {user.premium && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded">
                  <Crown size={12} />
                  Premium
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-500">{user.email}</p>
            <p className="text-xs text-zinc-400 mt-0.5">@{user.slug}</p>

            <div className="flex items-center gap-2 mt-3">
              <StatusBadge
                label={USER_LEVEL_LABELS[user.userLevel] || user.userLevel}
                variant="info"
              />
              {user.banned && (
                <StatusBadge
                  label={`Banido até ${formatDateTime(user.bannedUntil)}`}
                  variant="danger"
                />
              )}
            </div>

            {user.premium && user.premiumExpireAt && (
              <p className="text-xs text-zinc-400 mt-2">
                Premium expira em: {formatDateTime(user.premiumExpireAt)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {user.banned ? (
              <button
                onClick={handleUnban}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                <ShieldCheck size={16} />
                Desbanir
              </button>
            ) : (
              <button
                onClick={() => setBanModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <Ban size={16} />
                Banir
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {infoCards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-zinc-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <c.icon size={16} className="text-zinc-400" />
              <span className="text-xs text-zinc-500 font-medium">{c.label}</span>
            </div>
            <p className="text-lg font-bold text-zinc-900">{c.value}</p>
          </div>
        ))}
      </div>

      <Modal open={banModal} onClose={() => setBanModal(false)} title="Banir Usuário">
        <form onSubmit={handleBan} className="space-y-4">
          <p className="text-sm text-zinc-600">
            Tem certeza que deseja banir <strong>{user.name}</strong>?
          </p>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Dias de ban</label>
            <input
              type="number"
              min={1}
              max={3650}
              value={banDays}
              onChange={(e) => setBanDays(Number(e.target.value))}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setBanModal(false)}
              className="px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              Confirmar Ban
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}