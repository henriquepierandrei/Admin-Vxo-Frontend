export type ItemType = 'BADGE' | 'FRAME' | 'CARD_EFFECT' | 'OTHERS';
export type ItemRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
export type ProductType = 'PLAN_MONTHLY' | 'PLAN_ANNUAL' | 'COINS_300' | 'COINS_900' | 'COINS_1800' | 'COINS_3600';
export type UserLevel = 'BEGINNER' | 'POPULAR' | 'INFLUENTIAL' | 'FAMOUS' | 'CELEBRITY';
export type VoucherType = 'PREMIUM' | 'COINS';
export type UserLogType =
  | 'GIFT_SENT' | 'GIFT_RECEIVED'
  | 'COINS_PURCHASED' | 'COINS_REFUNDED'
  | 'PLAN_PURCHASED' | 'PLAN_REFUNDED'
  | 'ITEM_PURCHASED' | 'ITEM_REFUNDED'
  | 'ITEM_REMOVED_FROM_STORE' | 'SLUG_CHANGED'
  | 'ADMIN_ITEM_UPDATED' | 'ADMIN_ITEM_CREATED' | 'ADMIN_ITEM_DELETED';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface DefaultResponse {
  status: string;
  message: string;
}

export interface AdminAuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AdminEmailLog {
  id: number;
  userEmail: string;
  name: string;
  sentAt: string;
  expireAt: string;
  recovered: boolean;
}

export interface AdminUserLog {
  logId: string;
  userId: string;
  slug: string;
  type: UserLogType;
  description: string;
  coinsAmount: number;
  referenceId: string;
  createdAt: string;
}

export interface AdminPayment {
  id: number;
  mercadoPagoId: number;
  userId: string;
  slug: string;
  status: string;
  amount: number;
  paymentMethod: string;
  paymentTypeId: string;
  productType: ProductType;
  processed: boolean;
  paymentDate: string;
  approvedAt: string;
  createdAt: string;
}

export interface AdminUserItem {
  id: string;
  userId: string;
  itemId: string;
  itemName: string;
  itemUrl: string;
  itemType: ItemType;
  itemRarity: ItemRarity;
  acquiredAt: string;
}

export interface AdminItem {
  itemId: string;
  itemUrl: string;
  itemType: ItemType;
  itemRarity: ItemRarity;
  itemName: string;
  itemDescription: string;
  itemPrice: number;
  limited: boolean;
  quantityAvailable: number;
  discount: number;
  premium: boolean;
  active: boolean;
}

export interface ItemStoreRequest {
  itemUrl: string;
  itemType: ItemType;
  itemRarity: ItemRarity;
  itemName: string;
  itemDescription: string;
  itemPrice: number;
  limited: boolean;
  quantityAvailable?: number;
  discount?: number;
  premium: boolean;
  active: boolean;
}

export interface AdminUser {
  userId: string;
  name: string;
  email: string;
  slug: string;
  premium: boolean;
  premiumExpireAt: string | null;
  userLevel: UserLevel;
  coins: number;
  receiveGifts: boolean;
  views: number;
  banned: boolean;
  bannedUntil: string | null;
  createdAt: string;
  lastLoginAt: string;
}

export interface VoucherResponse {
  id: string;
  code: string;
  type: VoucherType;
  value: number;
  active: boolean;
  used: boolean;
  usedByUsername: string | null;
  usedAt: string | null;
  expirationDate: string;
  createdAt: string;
}

export interface VoucherGenerateRequest {
  type: VoucherType;
  value: number;
  expirationDate: string;
}