import { ItemStatus, ItemType } from "@/types";
import { itemsCollection } from "@/utils/db";
import { publishItemEvent } from "@/utils/mq";
import { expect, it, mock } from "bun:test";
import { me, myJwt, someoneElseJwt } from "../test-utils/mock-data";
import { PUT } from "../test-utils/request";

it("succeeds if the actor is the seller", async () => {
  mock.module("@/utils/mq", () => ({
    publishItemEvent: mock(),
  }));

  const insertedId = crypto.randomUUID();

  await itemsCollection.insertOne({
    id: insertedId,
    type: ItemType.Single,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: ["uploads/before-update.png"],
    seller: {
      id: me.id,
      nickname: me.nickname,
      avatarUrl: me.avatarUrl,
    },
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  });

  const res = await PUT(
    `/items/${insertedId}/status`,
    { status: ItemStatus.Dealt },
    {
      headers: {
        Cookie: `access_token=${myJwt}`,
      },
    },
  );
  const body = await res.json();

  expect(res.status).toEqual(200);
  expect(body).toMatchObject({ id: insertedId, status: ItemStatus.Dealt });
  expect(body).not.toContainKey("_id");
  expect(
    await itemsCollection.countDocuments({
      id: insertedId,
      status: ItemStatus.Dealt,
    }),
  ).toEqual(1);
  expect(publishItemEvent).toHaveBeenCalledTimes(1);

  await itemsCollection.deleteOne({ id: insertedId });
});

it("fails if the actor is not the seller", async () => {
  const insertedId = crypto.randomUUID();

  await itemsCollection.insertOne({
    id: insertedId,
    type: ItemType.Single,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: ["uploads/before-update.png"],
    seller: {
      id: me.id,
      nickname: me.nickname,
      avatarUrl: me.avatarUrl,
    },
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  });

  const res = await PUT(
    `/items/${insertedId}/status`,
    { status: ItemStatus.Dealt },
    {
      headers: {
        Cookie: `access_token=${someoneElseJwt}`,
      },
    },
  );
  const body = await res.json();

  expect(res.status).toEqual(403);
  expect(body).toMatchObject({ error: expect.any(String) });
  expect(
    await itemsCollection.countDocuments({
      id: insertedId,
      status: ItemStatus.ForSale,
    }),
  ).toEqual(1);

  await itemsCollection.deleteOne({ id: insertedId });
});
