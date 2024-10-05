/**
 * A brief preview of the account.
 *
 * This is used when we only need to provide part of the account information.
 * For example, when a user requests a list of items, showing them the seller's
 * nickname and avatar is enough. We don't need to provide the seller's email,
 * phone number, etc.
 *
 * These preview information will be stored in this service's own database
 * as a redundancy, so that we don't need to query the account service
 * in scenarios like above.
 */
export type AccountPreview = {
  id: number;
  nickname: string | null;
  avatar_url: string | null;
};

/**
 * A detailed account information.
 *
 * This is used when we need to provide the full account information.
 * For example, when a user requests the details of an item, they may well also
 * want to know the seller's email, phone number, etc.
 *
 * In these scenarios, it becomes necessary to query the account service.
 */
export type Account = AccountPreview & {
  email: string;
  department: {
    id: number;
    acronym: string;
    name: string;
  } | null;
  phone_code: string | null;
  phone_number: string | null;
  created_at: Date;
  deleted_at: Date | null;
};

/**
 * The item's status, according to the business logic.
 *
 * FOR_SALE <-> DEALT -> SOLD
 */
export enum ItemStatus {
  FOR_SALE,
  DEALT,
  SOLD,
}

/**
 * A single second-hand item.
 */
export type SingleItem = {
  id: string;
  type: "single";
  seller: AccountPreview;
  name: string;
  description: string;
  price: number;
  photo_urls: string[];
  status: ItemStatus;
  created_at: Date;
  deleted_at: Date | null;
};

/**
 * A pack of second-hand items, which may further contain more packs.
 */
export type ItemPack = {
  id: string;
  type: "pack";
  seller: AccountPreview;
  name: string;
  description: string;
  discount: number;
  status: ItemStatus;
  children: (SingleItem | ItemPack)[];
  created_at: Date;
  deleted_at: Date | null;
};

/**
 * Single items and item packs are mixed in the database.
 */
export type Item = SingleItem | ItemPack;
