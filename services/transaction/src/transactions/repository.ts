import type {
  DbTransaction,
  Participant,
  SimplifiedItem,
  Transaction,
} from "@/types";
import { db } from "@/utils/db";

type SelectAllDto = {
  itemId: string | undefined;
  participantId: number;
  excludeCancelled: boolean;
};

export async function selectAll(dto: SelectAllDto) {
  const { rows } = await db.query<DbTransaction>(
    `
      select *
      from transaction
      where case when $1::uuid is null then true else item_id = $1 end
        and (buyer_id = $2 or seller_id = $2)
        and ($3 = false or cancelled_at is null)
      order by created_at desc
    `,
    [dto.itemId, dto.participantId, dto.excludeCancelled],
  );

  return rows.map(convertToTransaction);
}

export async function selectOneById(id: string) {
  const { rows } = await db.query<DbTransaction>(
    `
      select *
      from transaction
      where id = $1
    `,
    [id],
  );

  return convertToTransaction(rows[0]);
}

export async function selectLatestOneByItemId(itemId: string) {
  const { rows } = await db.query<DbTransaction>(
    `
      select *
      from transaction
      where item_id = $1
      order by created_at desc
      limit 1
    `,
    [itemId],
  );

  return convertToTransaction(rows[0]);
}

type InsertDto = Pick<Transaction, "item" | "seller" | "buyer">;

export async function insertOne(dto: InsertDto) {
  const { rows } = await db.query<DbTransaction>(
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

  return convertToTransaction(rows[0]!);
}

export async function completeById(id: string) {
  const { rowCount } = await db.query(
    `
      update transaction
      set completed_at = now()
      where id = $1
        and completed_at is null
        and cancelled_at is null
    `,
    [id],
  );

  return rowCount!;
}

export async function cancelById(id: string) {
  const { rowCount } = await db.query(
    `
      update transaction
      set cancelled_at = now()
      where id = $1
        and completed_at is null
        and cancelled_at is null
    `,
    [id],
  );

  return rowCount!;
}

export async function updateParticipant(partipant: Participant) {
  const { rowCount: rowCount1 } = await db.query(
    `
      update transaction
      set seller_nickname = $2, seller_avatar_url = $3
      where seller_id = $1
    `,
    [partipant.id, partipant.nickname, partipant.avatarUrl],
  );

  const { rowCount: rowCount2 } = await db.query(
    `
      update transaction
      set buyer_nickname = $2, buyer_avatar_url = $3
      where buyer_id = $1
    `,
    [partipant.id, partipant.nickname, partipant.avatarUrl],
  );

  return rowCount1! + rowCount2!;
}

export async function cancelByParticipantId(participantId: number) {
  const { rowCount } = await db.query(
    `
      update transaction
      set cancelled_at = now()
      where (buyer_id = $1 or seller_id = $1)
        and completed_at is null
        and cancelled_at is null
    `,
    [participantId],
  );

  return rowCount!;
}

export async function updateItem(item: SimplifiedItem) {
  const { rowCount } = await db.query(
    `
      update transaction
      set item_name = $2, item_price = $3
      where item_id = $1
    `,
    [item.id, item.name, item.price],
  );

  return rowCount!;
}

export async function cancelByItemId(itemId: string) {
  const { rowCount } = await db.query(
    `
      update transaction
      set cancelled_at = now()
      where item_id = $1
        and completed_at is null
        and cancelled_at is null
    `,
    [itemId],
  );

  return rowCount!;
}

function convertToTransaction(row: DbTransaction | undefined) {
  if (!row) {
    return undefined;
  }

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
