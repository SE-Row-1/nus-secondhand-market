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
  Single = "single",
  Pack = "pack",
}

export enum ItemStatus {
  ForSale,
  Dealt,
  Sold,
}

export type SingleItem<
  A extends SimplifiedAccount | DetailedAccount = SimplifiedAccount,
> = {
  id: string;
  type: ItemType.Single;
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
  type: ItemType.Pack;
  name: string;
  description: string;
  price: number;
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

export type WishlistItem = Item<SimplifiedAccount> & {
  wanted_at: string;
};

export type WishlistStatistics = {
  count: number;
  last_wanted_at: string | null;
  wanters?: SimplifiedAccount[];
};

export type Transaction = {
  id: string;
  item: Pick<Item, "id" | "name" | "price">;
  buyer: SimplifiedAccount;
  seller: SimplifiedAccount;
  created_at: string;
  completed_at: string | null;
  cancelled_at: string | null;
};
