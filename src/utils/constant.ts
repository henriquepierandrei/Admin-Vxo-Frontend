export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const ITEM_TYPE_LABELS: Record<string, string> = {
  BADGE: 'Insígnia',
  FRAME: 'Moldura',
  CARD_EFFECT: 'Efeito no Card',
  OTHERS: 'Outros',
};

export const ITEM_RARITY_LABELS: Record<string, string> = {
  COMMON: 'Comum',
  RARE: 'Raro',
  EPIC: 'Épico',
  LEGENDARY: 'Lendário',
};

export const RARITY_COLORS: Record<string, string> = {
  COMMON: 'bg-zinc-100 text-zinc-700',
  RARE: 'bg-blue-50 text-blue-700',
  EPIC: 'bg-purple-50 text-purple-700',
  LEGENDARY: 'bg-amber-50 text-amber-700',
};

export const USER_LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'Iniciante',
  POPULAR: 'Popular',
  INFLUENTIAL: 'Influente',
  FAMOUS: 'Famoso',
  CELEBRITY: 'Celebridade',
};

export const PRODUCT_TYPE_LABELS: Record<string, string> = {
  PLAN_MONTHLY: 'Plano Mensal',
  PLAN_ANNUAL: 'Plano Anual',
  COINS_300: '300 Coins',
  COINS_900: '900 Coins',
  COINS_1800: '1800 Coins',
  COINS_3600: '3600 Coins',
};

export const LOG_TYPE_LABELS: Record<string, string> = {
  GIFT_SENT: 'Presente Enviado',
  GIFT_RECEIVED: 'Presente Recebido',
  COINS_PURCHASED: 'Coins Comprados',
  COINS_REFUNDED: 'Coins Reembolsados',
  PLAN_PURCHASED: 'Plano Comprado',
  PLAN_REFUNDED: 'Plano Reembolsado',
  ITEM_PURCHASED: 'Item Comprado',
  ITEM_REFUNDED: 'Item Reembolsado',
  ITEM_REMOVED_FROM_STORE: 'Item Removido da Loja',
  SLUG_CHANGED: 'Slug Alterado',
  ADMIN_ITEM_UPDATED: 'Item Atualizado (Admin)',
  ADMIN_ITEM_CREATED: 'Item Criado (Admin)',
  ADMIN_ITEM_DELETED: 'Item Deletado (Admin)',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
  cancelled: 'Cancelado',
  in_process: 'Em Processo',
  refunded: 'Reembolsado',
};

export const VOUCHER_TYPE_LABELS: Record<string, string> = {
  PREMIUM: 'Premium',
  COINS: 'Coins',
};