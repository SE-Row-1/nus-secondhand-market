import type {
  DbTransaction,
  DetailedAccount,
  DetailedItem,
  Transaction,
} from "@/types";
import { db } from "@/utils/db";

type SelectAllDto = {
  itemId: string | undefined;
  userId: number;
  excludeCancelled: boolean;
};

export async function selectAll(dto: SelectAllDto) {
  const result = await db.query<DbTransaction>(
    `
      select *
      from transaction
      where ($1 is null or item_id = $1)
        and ($2 is null or buyer_id = $2 or seller_id = $2)
        and ($3 = false or cancelled_at is null)
    `,
    [dto.itemId, dto.userId, dto.excludeCancelled],
  );

  return result.rows.map(convertToTransaction);
}

export async function selectOneById(id: string) {
  const result = await db.query<DbTransaction>(
    `
      select *
      from transaction
      where id = $1
    `,
    [id],
  );

  if (result.rowCount === 0) {
    return;
  }

  return convertToTransaction(result.rows[0]!);
}

type InsertDto = Pick<Transaction, "item" | "seller" | "buyer">;

export async function insertOne(dto: InsertDto) {
  const result = await db.query<DbTransaction>(
    `
      insert into transaction (item_id, item_name, item_price, buyer_id, buyer_nickname, buyer_avatar_url, seller_id, seller_nickname, seller_avatar_url)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      returning *
    `,
    [
      dto.item.id,
      dto.item.name,
      dto.item.price,
      dto.buyer.id,
      dto.buyer.nickname,
      dto.buyer.avatarUrl,
      dto.seller.id,
      dto.seller.nickname,
      dto.seller.avatarUrl,
    ],
  );

  return convertToTransaction(result.rows[0]!);
}

export async function completeById(id: string) {
  await db.query(
    `
      update transaction
      set completed_at = now()
      where id = $1
        and completed_at is null
        and cancelled_at is null
    `,
    [id],
  );
}

export async function cancelById(id: string) {
  await db.query(
    `
      update transaction
      set cancelled_at = now()
      where id = $1
        and completed_at is null
        and cancelled_at is null
    `,
    [id],
  );
}

export async function updateAccount(account: DetailedAccount) {
  await db.query(
    `
      update transaction
      set seller_nickname = $2, seller_avatar_url = $3
      where seller_id = $1
    `,
    [account.id, account.nickname, account.avatarUrl],
  );

  await db.query(
    `
      update transaction
      set buyer_nickname = $2, buyer_avatar_url = $3
      where buyer_id = $1
    `,
    [account.id, account.nickname, account.avatarUrl],
  );
}

export async function cancelByAccountId(accountId: number) {
  await db.query(
    `
      update transaction
      set cancelled_at = now()
      where (buyer_id = $1 or seller_id = $1)
        and completed_at is null
        and cancelled_at is null
    `,
    [accountId],
  );
}

export async function updateItem(item: DetailedItem) {
  await db.query(
    `
      update transaction
      set item_name = $2, item_price = $3
      where item_id = $1
    `,
    [item.id, item.name, item.price],
  );
}

export async function cancelByItemId(itemId: string) {
  await db.query(
    `
      update transaction
      set cancelled_at = now()
      where item_id = $1
        and completed_at is null
        and cancelled_at is null
    `,
    [itemId],
  );
}

function convertToTransaction(row: DbTransaction) {
  return {
    id: row.id,
    item: {
      id: row.item_id,
      name: row.item_name,
      price: row.item_price,
    },
    buyer: {
      id: row.buyer_id,
      nickname: row.buyer_nickname,
      avatarUrl: row.buyer_avatar_url,
    },
    seller: {
      id: row.seller_id,
      nickname: row.seller_nickname,
      avatarUrl: row.seller_avatar_url,
    },
    createdAt: row.created_at,
    completedAt: row.completed_at,
    cancelledAt: row.cancelled_at,
  } as Transaction;
}
