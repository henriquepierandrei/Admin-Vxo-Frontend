import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CreditCard,
  ShoppingBag,
  Ticket,
  Package,
  Mail,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { getUsers } from '../services/userService';
import { getPayments } from '../services/paymentService';
import { getStoreItems } from '../services/storeService';
import { getVouchers } from '../services/voucherService';

interface StatCard {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  to: string;
  color: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [usersRes, paymentsRes, itemsRes, vouchersRes] = await Promise.allSettled([
          getUsers(0, 1),
          getPayments(0, 1),
          getStoreItems(0, 1),
          getVouchers(0, 1),
        ]);

        const cards: StatCard[] = [
          {
            label: 'Usuários',
            value: usersRes.status === 'fulfilled' ? usersRes.value.totalElements.toString() : '—',
            icon: Users,
            to: '/users',
            color: 'bg-blue-50 text-blue-600',
          },
          {
            label: 'Pagamentos',
            value: paymentsRes.status === 'fulfilled' ? paymentsRes.value.totalElements.toString() : '—',
            icon: CreditCard,
            to: '/payments',
            color: 'bg-emerald-50 text-emerald-600',
          },
          {
            label: 'Itens na Loja',
            value: itemsRes.status === 'fulfilled' ? itemsRes.value.totalElements.toString() : '—',
            icon: ShoppingBag,
            to: '/store',
            color: 'bg-purple-50 text-purple-600',
          },
          {
            label: 'Vouchers',
            value: vouchersRes.status === 'fulfilled' ? vouchersRes.value.totalElements.toString() : '—',
            icon: Ticket,
            to: '/vouchers',
            color: 'bg-amber-50 text-amber-600',
          },
        ];

        setStats(cards);
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const quickLinks = [
    { label: 'Inventário', icon: Package, to: '/inventory', desc: 'Itens dos usuários' },
    { label: 'Logs de Email', icon: Mail, to: '/logs/email', desc: 'Recuperação de senha' },
    { label: 'Logs de Usuário', icon: FileText, to: '/logs/users', desc: 'Atividade do sistema' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-zinc-200 p-5 animate-pulse">
                <div className="w-10 h-10 bg-zinc-100 rounded-lg mb-3" />
                <div className="h-7 bg-zinc-100 rounded w-16 mb-1" />
                <div className="h-4 bg-zinc-100 rounded w-24" />
              </div>
            ))
          : stats.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="bg-white rounded-xl border border-zinc-200 p-5 hover:shadow-md hover:border-zinc-300 transition-all group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                  <s.icon size={20} />
                </div>
                <p className="text-2xl font-bold text-zinc-900">{s.value}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-zinc-500">{s.label}</span>
                  <ArrowRight size={14} className="text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                </div>
              </Link>
            ))}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Acesso Rápido
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="bg-white rounded-xl border border-zinc-200 p-5 hover:shadow-md hover:border-zinc-300 transition-all group flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
                <link.icon size={20} className="text-zinc-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900">{link.label}</p>
                <p className="text-xs text-zinc-400">{link.desc}</p>
              </div>
              <ArrowRight size={14} className="ml-auto text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}