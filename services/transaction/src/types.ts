export type Participant = {
  id: number;
  nickname: string | null;
  avatarUrl: string | null;
};

export type Account = Participant & {
  email: string;
  department: {
    id: number;
    acronym: string;
    name: string;
  } | null;
  phoneCode: string | null;
  phoneNumber: string | null;
  preferredCurrency: string | null;
  createdAt: string;
  deletedAt: string | null;
};

export type SimplifiedItem = {
  id: string;
  name: string;
  price: number;
};

export enum ItemStatus {
  FOR_SALE,
  DEALT,
  SOLD,
}

export type DetailedItem = SimplifiedItem & {
  seller: Participant;
  status: ItemStatus;
};

export type DbTransaction = {
  id: string;
  item_id: string;
  item_name: string;
  item_price: number;
  buyer_id: number;
  buyer_nickname: string | null;
  buyer_avatar_url: string | null;
  seller_id: number;
  seller_nickname: string | null;
  seller_avatar_url: string | null;
  created_at: string;
  completed_at: string | null;
  cancelled_at: string | null;
};

export type Transaction = {
  id: string;
  item: SimplifiedItem;
  buyer: Participant;
  seller: Participant;
  createdAt: string;
  completedAt: string | null;
  cancelledAt: string | null;
};
