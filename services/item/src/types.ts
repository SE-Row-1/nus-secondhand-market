export type Seller = {
  id: number;
  nickname: string | null;
  avatarUrl: string | null;
};

export type Account = Seller & {
  email: string;
  department: {
    id: number;
    acronym: string;
    name: string;
  } | null;
  phoneCode: string | null;
  phoneNumber: string | null;
  preferredCurrency: string | null;
  createdAt: Date;
  deletedAt: Date | null;
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

export type SingleItem = {
  id: string;
  type: ItemType.Single;
  seller: Seller;
  name: string;
  description: string;
  price: number;
  photoUrls: string[];
  status: ItemStatus;
  createdAt: Date;
  deletedAt: Date | null;
};

export type ItemPack = {
  id: string;
  type: ItemType.Pack;
  seller: Seller;
  name: string;
  description: string;
  price: number;
  discount: number;
  children: Item[];
  status: ItemStatus;
  createdAt: Date;
  deletedAt: Date | null;
};

export type Item = SingleItem | ItemPack;
