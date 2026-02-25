import { Inbox } from 'lucide-react';

interface Props {
  message?: string;
}

export function EmptyState({ message = 'Nenhum registro encontrado' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
      <Inbox size={48} strokeWidth={1} />
      <p className="mt-3 text-sm">{message}</p>
    </div>
  );
}