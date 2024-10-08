export type Department = {
  id: number;
  acronym: string;
  name: string;
};

export type AccountPreview = {
  id: number;
  nickname: string | null;
  avatar_url: string | null;
};

export type Account = AccountPreview & {
  email: string;
  department: Department | null;
  phone_code: string | null;
  phone_number: string | null;
  preferred_currency: string | null;
  created_at: string;
  deleted_at: string | null;
};

export enum ItemType {
  SINGLE = "single",
  PACK = "pack",
}

export enum ItemStatus {
  FOR_SALE,
  DEALT,
  SOLD,
}

export type SingleItem = {
  id: string;
  type: ItemType.SINGLE;
  seller: AccountPreview;
  name: string;
  description: string;
  price: number;
  photo_urls: string[];
  status: ItemStatus;
  created_at: string;
  deleted_at: string | null;
};

export type ItemPack = {
  id: string;
  type: ItemType.PACK;
  seller: AccountPreview;
  name: string;
  description: string;
  discount: number;
  status: ItemStatus;
  children: Item[];
  created_at: string;
  deleted_at: string | null;
};

export type Item = SingleItem | ItemPack;
