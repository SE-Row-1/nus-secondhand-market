import type {
  DbTransaction,
  Participant,
  SimplifiedItem,
  Transaction,
} from "@/types";
import { db } from "@/utils/db";

type SelectManyDto = {
  itemId?: string | undefined;
  participantId?: number | undefined;
  isCompleted?: boolean | undefined;
  isCancelled?: boolean | undefined;
};

export async function selectMany(dto: SelectManyDto) {
  const { rows } = await db.query<DbTransaction>(
    `
      select *
      from transaction
      where case when $1::uuid is null then true else item_id = $1 end
        and case when $2::integer is null then true else (buyer_id = $2 or seller_id = $2) end
        and case when $3::boolean is null then true else (
          case when $3::boolean = true then completed_at is not null else completed_at is null end
        ) end
        and case when $4::boolean is null then true else (
          case when $4::boolean = true then cancelled_at is not null else cancelled_at is null end
        ) end
      order by created_at desc
    `,
    [dto.itemId, dto.participantId, dto.isCompleted, dto.isCancelled],
  );

  return rows.map(rowToTransaction);
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

  if (!rows[0]) {
    return undefined;
  }

  return rowToTransaction(rows[0]);
}

type InsertDto = Pick<Transaction, "item" | "seller" | "buyer">;

export async function insertOne(dto: InsertDto) {
  const { rows } = await db.query<DbTransaction>(
    `
      insert into transaction (item_id, item_name, item_price, seller_id, seller_email, seller_nickname, seller_avatar_url, buyer_id, buyer_email, buyer_nickname, buyer_avatar_url)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      returning *
    `,
    [
      dto.item.id,
      dto.item.name,
      dto.item.price,
      dto.seller.id,
      dto.seller.email,
      dto.seller.nickname,
      dto.seller.avatarUrl,
      dto.buyer.id,
      dto.buyer.email,
      dto.buyer.nickname,
      dto.buyer.avatarUrl,
    ],
  );

  return rowToTransaction(rows[0]!);
}

export async function completeOneById(id: string) {
  const { rows } = await db.query<DbTransaction>(
    `
      update transaction
      set completed_at = now()
      where id = $1
        and completed_at is null
        and cancelled_at is null
      returning *
    `,
    [id],
  );

  if (!rows[0]) {
    return undefined;
  }

  return rowToTransaction(rows[0]);
}

export async function cancelOneById(id: string) {
  const { rows } = await db.query<DbTransaction>(
    `
      update transaction
      set cancelled_at = now()
      where id = $1
        and completed_at is null
        and cancelled_at is null
      returning *
    `,
    [id],
  );

  if (!rows[0]) {
    return undefined;
  }

  return rowToTransaction(rows[0]);
}

export async function updateParticipant(partipant: Participant) {
  const { rowCount: rowCount1 } = await db.query(
    `
      update transaction
      set seller_email = $2, seller_nickname = $3, seller_avatar_url = $4
      where seller_id = $1
    `,
    [partipant.id, partipant.email, partipant.nickname, partipant.avatarUrl],
  );

  const { rowCount: rowCount2 } = await db.query(
    `
      update transaction
      set buyer_email = $2, buyer_nickname = $3, buyer_avatar_url = $4
      where buyer_id = $1
    `,
    [partipant.id, partipant.email, partipant.nickname, partipant.avatarUrl],
  );

  return rowCount1! + rowCount2!;
}

export async function cancelManyByParticipantId(participantId: number) {
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

export async function cancelManyByItemId(itemId: string) {
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

function rowToTransaction(row: DbTransaction): Transaction {
  return {
    id: row.id,
    item: {
      id: row.item_id,
      name: row.item_name,
      price: row.item_price,
    },
    seller: {
      id: row.seller_id,
      email: row.seller_email,
      nickname: row.seller_nickname,
      avatarUrl: row.seller_avatar_url,
    },
    buyer: {
      id: row.buyer_id,
      email: row.buyer_email,
      nickname: row.buyer_nickname,
      avatarUrl: row.buyer_avatar_url,
    },
    createdAt: row.created_at,
    completedAt: row.completed_at,
    cancelledAt: row.cancelled_at,
  };
}
