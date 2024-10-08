/**
 * A brief preview of account information.
 *
 * This is used when we only need to provide part of the account information.
 * For example, when a user requests a list of items, it is totally enough to
 * just show them the seller's nickname and avatar. We don't need to show them
 * the seller's email, phone number, etc.
 *
 * This preview information will be stored in this microservice's own database
 * as a redundancy of account microservice's database.
 * By doing this, we can save some time of consulting the account microservice,
 * for example, in the scenario mentioned above.
 */
export type AccountPreview = {
  id: number;
  nickname: string | null;
  avatarUrl: string | null;
};

/**
 * The full version of account information.
 *
 * This is used when we have to provide more account details,
 * which are not included in the preview information.
 * For example, when a user requests the details of an item, they may well also
 * want to know more about the seller, such as his/her email, phone number, etc.
 *
 * We have to consult the account microservice to retrieve these information.
 */
export type Account = AccountPreview & {
  email: string;
  department: {
    id: number;
    acronym: string;
    name: string;
  } | null;
  phoneCode: string | null;
  phoneNumber: string | null;
  createdAt: Date;
  deletedAt: Date | null;
};

/**
 * An item can be either a single item, or an item pack.
 */
export enum ItemType {
  SINGLE = "single",
  PACK = "pack",
}

/**
 * An item can be in one of the following statuses.
 *
 * State machine: FOR_SALE <-> DEALT -> SOLD
 */
export enum ItemStatus {
  FOR_SALE,
  DEALT,
  SOLD,
}

/**
 * A single item.
 *
 * The most basic unit of items.
 */
export type SingleItem = {
  id: string;
  type: ItemType.SINGLE;
  seller: AccountPreview;
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
  type: ItemType.PACK;
  seller: AccountPreview;
  name: string;
  description: string;
  discount: number;
  status: ItemStatus;
  children: Item[];
  createdAt: Date;
  deletedAt: Date | null;
};

/**
 * The term "item" refers to either a single item or an item pack.
 */
export type Item = SingleItem | ItemPack;
