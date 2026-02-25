import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ShoppingBag,
  Ticket,
  Package,
  Mail,
  FileText,
  X,
  Shield,   
} from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/users', icon: Users, label: 'Usuários' },
  { to: '/payments', icon: CreditCard, label: 'Pagamentos' },
  { to: '/store', icon: ShoppingBag, label: 'Loja' },
  { to: '/vouchers', icon: Ticket, label: 'Vouchers' },
  { to: '/inventory', icon: Package, label: 'Inventário' },
  { to: '/logs/email', icon: Mail, label: 'Logs de Email' },
  { to: '/logs/users', icon: FileText, label: 'Logs de Usuário' },
];

export function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-zinc-900 transform transition-transform duration-200 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-zinc-900" />
            </div>
            <span className="text-white font-semibold tracking-tight">Admin</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}