/**
 * A simplified version of account information.
 *
 * This is used when we only need to provide part of the account information.
 * For example, when a user requests a list of items, it is totally enough to
 * just show them the seller's nickname and avatar. We don't need to show them
 * the seller's email, phone number, etc.
 *
 * This part of information will be stored in this microservice's own database
 * as a redundancy of account microservice's database.
 * By doing this, we can save some time of consulting the account microservice,
 * for example, in the scenario mentioned above.
 */
export type SimplifiedAccount = {
  id: number;
  nickname: string | null;
  avatarUrl: string | null;
};

/**
 * The detailed version of account information.
 *
 * This is used when we have to provide more account details,
 * which are not included in the simplified version.
 * For example, when a user requests the details of an item, they may well also
 * want to know more about the seller, such as his/her email, phone number, etc.
 *
 * We have to consult the account microservice to retrieve these information.
 */
export type DetailedAccount = SimplifiedAccount & {
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

/**
 * An item can be either a single item, or an item pack.
 */
export enum ItemType {
  Single = "single",
  Pack = "pack",
}

/**
 * An item can be in one of these statuses.
 *
 * State machine: FOR_SALE <-> DEALT -> SOLD
 */
export enum ItemStatus {
  ForSale,
  Dealt,
  Sold,
}

/**
 * A single item.
 *
 * The most basic unit of items.
 */
export type SingleItem = {
  id: string;
  type: ItemType.Single;
  seller: SimplifiedAccount;
  name: string;
  description: string;
  price: number;
  photoUrls: string[];
  status: ItemStatus;
  createdAt: Date;
  deletedAt: Date | null;
};

/**
 * An item pack.
 *
 * It can contain other single items, or even other item packs.
 */
export type ItemPack = {
  id: string;
  type: ItemType.Pack;
  seller: SimplifiedAccount;
  name: string;
  description: string;
  price: number;
  discount: number;
  children: Item[];
  status: ItemStatus;
  createdAt: Date;
  deletedAt: Date | null;
};

/**
 * An item can be either a single item, or an item pack.
 */
export type Item = SingleItem | ItemPack;
