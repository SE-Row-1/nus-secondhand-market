export type Participant = {
  id: number;
  email: string;
  nickname: string | null;
  avatarUrl: string | null;
};

export type Account = Participant & {
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
  ForSale,
  Dealt,
  Sold,
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
  seller_id: number;
  seller_email: string;
  seller_nickname: string | null;
  seller_avatar_url: string | null;
  buyer_id: number;
  buyer_email: string;
  buyer_nickname: string | null;
  buyer_avatar_url: string | null;
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
