export type PartialAccount = {
  id: number;
  nickname: string | null;
  avatar_url: string | null;
};

export type Account = PartialAccount & {
  email: string;
  department: {
    id: number;
    acronym: string;
    name: string;
  };
  phone: string | null;
  created_at: Date;
  deleted_at: Date | null;
};

export enum ItemStatus {
  FOR_SALE,
  DEALT,
  SOLD,
}

export type SingleItem = {
  id: string;
  type: "single";
  seller: PartialAccount;
  name: string;
  description: string | null;
  price: number;
  photo_urls: string[];
  status: ItemStatus;
  created_at: Date;
  deleted_at: Date | null;
};

export type ItemPack = {
  id: string;
  type: "pack";
  seller: PartialAccount;
  name: string;
  description: string | null;
  discount: number;
  status: ItemStatus;
  children: (SingleItem | ItemPack)[];
  created_at: Date;
  deleted_at: Date | null;
};

export type Item = SingleItem | ItemPack;
