import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface Props {
  onMenuClick: () => void;
  title: string;
}

export function Header({ onMenuClick, title }: Props) {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-zinc-200/60">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors lg:hidden"
          >
            <Menu size={20} className="text-zinc-600" />
          </button>
          <h1 className="text-lg font-semibold text-zinc-900">{title}</h1>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}