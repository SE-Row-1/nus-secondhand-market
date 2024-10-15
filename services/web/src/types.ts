export type Department = {
  id: number;
  acronym: string;
  name: string;
};

export type SimplifiedAccount = {
  id: number;
  nickname: string | null;
  avatar_url: string | null;
};

export type DetailedAccount = SimplifiedAccount & {
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

export type SingleItem<
  A extends SimplifiedAccount | DetailedAccount = SimplifiedAccount,
> = {
  id: string;
  type: ItemType.SINGLE;
  name: string;
  description: string;
  price: number;
  photo_urls: string[];
  status: ItemStatus;
  seller: A;
  created_at: string;
  deleted_at: string | null;
};

export type ItemPack<
  A extends SimplifiedAccount | DetailedAccount = SimplifiedAccount,
> = {
  id: string;
  type: ItemType.PACK;
  name: string;
  description: string;
  discount: number;
  children: Item[];
  status: ItemStatus;
  seller: A;
  created_at: string;
  deleted_at: string | null;
};

export type Item<
  A extends SimplifiedAccount | DetailedAccount = SimplifiedAccount,
> = SingleItem<A> | ItemPack<A>;

export type PaginatedItems<
  A extends SimplifiedAccount | DetailedAccount = SimplifiedAccount,
> = {
  items: Item<A>[];
  next_cursor: string;
};
