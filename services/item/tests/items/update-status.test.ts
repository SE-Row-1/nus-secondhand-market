import { publishItemUpdatedEvent } from "@/events/publish-item-updated-event";
import { ItemStatus, ItemType, type Item } from "@/types";
import { itemsCollection, transactionsCollection } from "@/utils/db";
import { afterAll, describe, expect, it, mock } from "bun:test";
import { me, someone } from "../test-utils/mock-data";
import { PUT } from "../test-utils/request";
import { responsify } from "../test-utils/responsify";

afterAll(async () => {
  await itemsCollection.deleteMany({ name: "test" });
  await transactionsCollection.deleteMany();
});

describe("for sale -> dealt", () => {
  it("succeeds if the actor is the seller", async () => {
    mock.module("@/events/publish-item-updated-event", () => ({
      publishItemUpdatedEvent: mock(),
    }));

    const item: Item = {
      id: crypto.randomUUID(),
      type: ItemType.Single,
      name: "test",
      description: "test",
      price: 100,
      photoUrls: ["uploads/test.png"],
      seller: me.simplifiedAccount,
      status: ItemStatus.ForSale,
      createdAt: new Date(),
      deletedAt: null,
    };
    await itemsCollection.insertOne({ ...item });

    const res = await PUT(
      `/items/${item.id}/status`,
      {
        status: ItemStatus.Dealt,
        buyer: someone.simplifiedAccount,
      },
      {
        headers: {
          Cookie: `access_token=${me.jwt}`,
        },
      },
    );
    const body = await res.json();

    expect(res.status).toEqual(200);
    expect(body).toEqual(
      responsify({
        ...item,
        status: ItemStatus.Dealt,
      }),
    );
    expect(
      await itemsCollection.countDocuments({
        id: item.id,
        status: ItemStatus.Dealt,
      }),
    ).toEqual(1);
    expect(
      await transactionsCollection.countDocuments({
        "item.id": item.id,
        seller: me.simplifiedAccount,
        buyer: someone.simplifiedAccount,
        completedAt: null,
        cancelledAt: null,
      }),
    ).toEqual(1);
    expect(publishItemUpdatedEvent).toHaveBeenCalledTimes(1);
  });

  it("fails if buyer is not given", async () => {
    mock.module("@/events/publish-item-updated-event", () => ({
      publishItemUpdatedEvent: mock(),
    }));

    const item: Item = {
      id: crypto.randomUUID(),
      type: ItemType.Single,
      name: "test",
      description: "test",
      price: 100,
      photoUrls: ["uploads/test.png"],
      seller: me.simplifiedAccount,
      status: ItemStatus.ForSale,
      createdAt: new Date(),
      deletedAt: null,
    };
    await itemsCollection.insertOne({ ...item });

    const res = await PUT(
      `/items/${item.id}/status`,
      {
        status: ItemStatus.Dealt,
      },
      {
        headers: {
          Cookie: `access_token=${me.jwt}`,
        },
      },
    );
    const body = await res.json();

    expect(res.status).toEqual(400);
    expect(body).toEqual({ error: expect.any(String) });
    expect(
      await itemsCollection.countDocuments({
        id: item.id,
        status: ItemStatus.ForSale,
      }),
    ).toEqual(1);
    expect(
      await transactionsCollection.countDocuments({ "item.id": item.id }),
    ).toEqual(0);
    expect(publishItemUpdatedEvent).toHaveBeenCalledTimes(0);
  });

  it("fails if the actor is not the seller", async () => {
    mock.module("@/events/publish-item-updated-event", () => ({
      publishItemUpdatedEvent: mock(),
    }));

    const item: Item = {
      id: crypto.randomUUID(),
      type: ItemType.Single,
      name: "test",
      description: "test",
      price: 100,
      photoUrls: ["uploads/test.png"],
      seller: me.simplifiedAccount,
      status: ItemStatus.ForSale,
      createdAt: new Date(),
      deletedAt: null,
    };
    await itemsCollection.insertOne({ ...item });

    const res = await PUT(
      `/items/${item.id}/status`,
      {
        status: ItemStatus.Dealt,
        buyer: someone.simplifiedAccount,
      },
      {
        headers: {
          Cookie: `access_token=${someone.jwt}`,
        },
      },
    );
    const body = await res.json();

    expect(res.status).toEqual(403);
    expect(body).toEqual({ error: expect.any(String) });
    expect(
      await itemsCollection.countDocuments({
        id: item.id,
        status: ItemStatus.ForSale,
      }),
    ).toEqual(1);
    expect(
      await transactionsCollection.countDocuments({ "item.id": item.id }),
    ).toEqual(0);
    expect(publishItemUpdatedEvent).toHaveBeenCalledTimes(0);
  });

  it("fails if the transaction already exists", async () => {
    mock.module("@/events/publish-item-updated-event", () => ({
      publishItemUpdatedEvent: mock(),
    }));

    const item: Item = {
      id: crypto.randomUUID(),
      type: ItemType.Single,
      name: "test",
      description: "test",
      price: 100,
      photoUrls: ["uploads/test.png"],
      seller: me.simplifiedAccount,
      status: ItemStatus.ForSale,
      createdAt: new Date(),
      deletedAt: null,
    };
    await itemsCollection.insertOne({ ...item });
    await transactionsCollection.insertOne({
      id: crypto.randomUUID(),
      buyer: someone.simplifiedAccount,
      seller: me.simplifiedAccount,
      item: {
        id: item.id,
        name: item.name,
        price: item.price,
      },
      createdAt: new Date(),
      completedAt: null,
      cancelledAt: null,
    });

    const res = await PUT(
      `/items/${item.id}/status`,
      {
        status: ItemStatus.Dealt,
        buyer: someone.simplifiedAccount,
      },
      {
        headers: {
          Cookie: `access_token=${me.jwt}`,
        },
      },
    );
    const body = await res.json();

    expect(res.status).toEqual(409);
    expect(body).toEqual({ error: expect.any(String) });
    expect(
      await itemsCollection.countDocuments({
        id: item.id,
        status: ItemStatus.ForSale,
      }),
    ).toEqual(1);
    expect(
      await transactionsCollection.countDocuments({ "item.id": item.id }),
    ).toEqual(1);
    expect(publishItemUpdatedEvent).toHaveBeenCalledTimes(0);
  });

  it("succeeds if a previous transaction is cancelled", async () => {
    mock.module("@/events/publish-item-updated-event", () => ({
      publishItemUpdatedEvent: mock(),
    }));

    const item: Item = {
      id: crypto.randomUUID(),
      type: ItemType.Single,
      name: "test",
      description: "test",
      price: 100,
      photoUrls: ["uploads/test.png"],
      seller: me.simplifiedAccount,
      status: ItemStatus.ForSale,
      createdAt: new Date(),
      deletedAt: null,
    };

    await itemsCollection.insertOne({ ...item });
    await transactionsCollection.insertOne({
      id: crypto.randomUUID(),
      buyer: someone.simplifiedAccount,
      seller: me.simplifiedAccount,
      item: {
        id: item.id,
        name: item.name,
        price: item.price,
      },
      createdAt: new Date(),
      completedAt: null,
      cancelledAt: new Date(),
    });

    const res = await PUT(
      `/items/${item.id}/status`,
      {
        status: ItemStatus.Dealt,
        buyer: someone.simplifiedAccount,
      },
      {
        headers: {
          Cookie: `access_token=${me.jwt}`,
        },
      },
    );
    const body = await res.json();

    expect(res.status).toEqual(200);
    expect(body).toEqual(
      responsify({
        ...item,
        status: ItemStatus.Dealt,
      }),
    );
    expect(
      await itemsCollection.countDocuments({
        id: item.id,
        status: ItemStatus.Dealt,
      }),
    ).toEqual(1);
    expect(
      await transactionsCollection.countDocuments({
        "item.id": item.id,
        seller: me.simplifiedAccount,
        buyer: someone.simplifiedAccount,
        completedAt: null,
        cancelledAt: null,
      }),
    ).toEqual(1);
    expect(publishItemUpdatedEvent).toHaveBeenCalledTimes(1);
  });
});

describe("dealt -> sold", () => {
  it("succeeds if the actor is the buyer", async () => {
    mock.module("@/events/publish-item-updated-event", () => ({
      publishItemUpdatedEvent: mock(),
    }));

    const item: Item = {
      id: crypto.randomUUID(),
      type: ItemType.Single,
      name: "test",
      description: "test",
      price: 100,
      photoUrls: ["uploads/test.png"],
      seller: me.simplifiedAccount,
      status: ItemStatus.Dealt,
      createdAt: new Date(),
      deletedAt: null,
    };
    await itemsCollection.insertOne({ ...item });
    await transactionsCollection.insertOne({
      id: crypto.randomUUID(),
      buyer: someone.simplifiedAccount,
      seller: me.simplifiedAccount,
      item: {
        id: item.id,
        name: item.name,
        price: item.price,
      },
      createdAt: new Date(),
      completedAt: null,
      cancelledAt: null,
    });

    const res = await PUT(
      `/items/${item.id}/status`,
      {
        status: ItemStatus.Sold,
      },
      {
        headers: {
          Cookie: `access_token=${someone.jwt}`,
        },
      },
    );
    const body = await res.json();

    expect(res.status).toEqual(200);
    expect(body).toEqual(
      responsify({
        ...item,
        status: ItemStatus.Sold,
      }),
    );
    expect(
      await itemsCollection.countDocuments({
        id: item.id,
        status: ItemStatus.Sold,
      }),
    ).toEqual(1);
    expect(
      await transactionsCollection.countDocuments({
        "item.id": item.id,
        seller: me.simplifiedAccount,
        buyer: someone.simplifiedAccount,
        completedAt: { $ne: null },
        cancelledAt: null,
      }),
    ).toEqual(1);
    expect(publishItemUpdatedEvent).toHaveBeenCalledTimes(1);
  });

  it("fails if the actor is not the buyer", async () => {
    mock.module("@/events/publish-item-updated-event", () => ({
      publishItemUpdatedEvent: mock(),
    }));

    const item: Item = {
      id: crypto.randomUUID(),
      type: ItemType.Single,
      name: "test",
      description: "test",
      price: 100,
      photoUrls: ["uploads/test.png"],
      seller: me.simplifiedAccount,
      status: ItemStatus.Dealt,
      createdAt: new Date(),
      deletedAt: null,
    };
    await itemsCollection.insertOne({ ...item });
    await transactionsCollection.insertOne({
      id: crypto.randomUUID(),
      buyer: someone.simplifiedAccount,
      seller: me.simplifiedAccount,
      item: {
        id: item.id,
        name: item.name,
        price: item.price,
      },
      createdAt: new Date(),
      completedAt: null,
      cancelledAt: null,
    });

    const res = await PUT(
      `/items/${item.id}/status`,
      {
        status: ItemStatus.Sold,
      },
      {
        headers: {
          Cookie: `access_token=${me.jwt}`,
        },
      },
    );
    const body = await res.json();

    expect(res.status).toEqual(403);
    expect(body).toEqual({ error: expect.any(String) });
    expect(
      await itemsCollection.countDocuments({
        id: item.id,
        status: ItemStatus.Dealt,
      }),
    ).toEqual(1);
    expect(
      await transactionsCollection.countDocuments({
        "item.id": item.id,
        seller: me.simplifiedAccount,
        buyer: someone.simplifiedAccount,
        completedAt: null,
        cancelledAt: null,
      }),
    ).toEqual(1);
    expect(publishItemUpdatedEvent).toHaveBeenCalledTimes(0);
  });

  it("fails if the transaction does not exist", async () => {
    mock.module("@/events/publish-item-updated-event", () => ({
      publishItemUpdatedEvent: mock(),
    }));

    const item: Item = {
      id: crypto.randomUUID(),
      type: ItemType.Single,
      name: "test",
      description: "test",
      price: 100,
      photoUrls: ["uploads/test.png"],
      seller: me.simplifiedAccount,
      status: ItemStatus.Dealt,
      createdAt: new Date(),
      deletedAt: null,
    };
    await itemsCollection.insertOne({ ...item });

    const res = await PUT(
      `/items/${item.id}/status`,
      {
        status: ItemStatus.Sold,
      },
      {
        headers: {
          Cookie: `access_token=${someone.jwt}`,
        },
      },
    );
    const body = await res.json();

    expect(res.status).toEqual(403);
    expect(body).toEqual({ error: expect.any(String) });
    expect(
      await itemsCollection.countDocuments({
        id: item.id,
        status: ItemStatus.Dealt,
      }),
    ).toEqual(1);
    expect(
      await transactionsCollection.countDocuments({
        "item.id": item.id,
        seller: me.simplifiedAccount,
        buyer: someone.simplifiedAccount,
        completedAt: null,
        cancelledAt: null,
      }),
    ).toEqual(0);
    expect(publishItemUpdatedEvent).toHaveBeenCalledTimes(0);
  });

  it("fails if the transaction is already completed", async () => {
    mock.module("@/events/publish-item-updated-event", () => ({
      publishItemUpdatedEvent: mock(),
    }));

    const item: Item = {
      id: crypto.randomUUID(),
      type: ItemType.Single,
      name: "test",
      description: "test",
      price: 100,
      photoUrls: ["uploads/test.png"],
      seller: me.simplifiedAccount,
      status: ItemStatus.Dealt,
      createdAt: new Date(),
      deletedAt: null,
    };
    await itemsCollection.insertOne({ ...item });
    await transactionsCollection.insertOne({
      id: crypto.randomUUID(),
      buyer: someone.simplifiedAccount,
      seller: me.simplifiedAccount,
      item: {
        id: item.id,
        name: item.name,
        price: item.price,
      },
      createdAt: new Date(),
      completedAt: new Date(),
      cancelledAt: null,
    });

    const res = await PUT(
      `/items/${item.id}/status`,
      {
        status: ItemStatus.Sold,
      },
      {
        headers: {
          Cookie: `access_token=${someone.jwt}`,
        },
      },
    );
    const body = await res.json();

    expect(res.status).toEqual(409);
    expect(body).toEqual({ error: expect.any(String) });
    expect(
      await itemsCollection.countDocuments({
        id: item.id,
        status: ItemStatus.Dealt,
      }),
    ).toEqual(1);
    expect(
      await transactionsCollection.countDocuments({
        "item.id": item.id,
        seller: me.simplifiedAccount,
        buyer: someone.simplifiedAccount,
        completedAt: { $ne: null },
        cancelledAt: null,
      }),
    ).toEqual(1);
    expect(publishItemUpdatedEvent).toHaveBeenCalledTimes(0);
  });

  it("fails if the transaction is cancelled", async () => {
    mock.module("@/events/publish-item-updated-event", () => ({
      publishItemUpdatedEvent: mock(),
    }));

    const item: Item = {
      id: crypto.randomUUID(),
      type: ItemType.Single,
      name: "test",
      description: "test",
      price: 100,
      photoUrls: ["uploads/test.png"],
      seller: me.simplifiedAccount,
      status: ItemStatus.Dealt,
      createdAt: new Date(),
      deletedAt: null,
    };
    await itemsCollection.insertOne({ ...item });
    await transactionsCollection.insertOne({
      id: crypto.randomUUID(),
      buyer: someone.simplifiedAccount,
      seller: me.simplifiedAccount,
      item: {
        id: item.id,
        name: item.name,
        price: item.price,
      },
      createdAt: new Date(),
      completedAt: null,
      cancelledAt: new Date(),
    });

    const res = await PUT(
      `/items/${item.id}/status`,
      {
        status: ItemStatus.Sold,
      },
      {
        headers: {
          Cookie: `access_token=${someone.jwt}`,
        },
      },
    );
    const body = await res.json();

    expect(res.status).toEqual(403);
    expect(body).toEqual({ error: expect.any(String) });
    expect(
      await itemsCollection.countDocuments({
        id: item.id,
        status: ItemStatus.Dealt,
      }),
    ).toEqual(1);
    expect(
      await transactionsCollection.countDocuments({
        "item.id": item.id,
        seller: me.simplifiedAccount,
        buyer: someone.simplifiedAccount,
        completedAt: null,
        cancelledAt: { $ne: null },
      }),
    ).toEqual(1);
    expect(publishItemUpdatedEvent).toHaveBeenCalledTimes(0);
  });
});

describe("dealt -> for sale", () => {
  it("succeeds if the actor is the seller", async () => {
    mock.module("@/events/publish-item-updated-event", () => ({
      publishItemUpdatedEvent: mock(),
    }));

    const item: Item = {
      id: crypto.randomUUID(),
      type: ItemType.Single,
      name: "test",
      description: "test",
      price: 100,
      photoUrls: ["uploads/test.png"],
      seller: me.simplifiedAccount,
      status: ItemStatus.Dealt,
      createdAt: new Date(),
      deletedAt: null,
    };
    await itemsCollection.insertOne({ ...item });
    await transactionsCollection.insertOne({
      id: crypto.randomUUID(),
      buyer: someone.simplifiedAccount,
      seller: me.simplifiedAccount,
      item: {
        id: item.id,
        name: item.name,
        price: item.price,
      },
      createdAt: new Date(),
      completedAt: null,
      cancelledAt: null,
    });

    const res = await PUT(
      `/items/${item.id}/status`,
      {
        status: ItemStatus.ForSale,
      },
      {
        headers: {
          Cookie: `access_token=${me.jwt}`,
        },
      },
    );
    const body = await res.json();

    expect(res.status).toEqual(200);
    expect(body).toEqual(
      responsify({
        ...item,
        status: ItemStatus.ForSale,
      }),
    );
    expect(
      await itemsCollection.countDocuments({
        id: item.id,
        status: ItemStatus.ForSale,
      }),
    ).toEqual(1);
    expect(
      await transactionsCollection.countDocuments({
        "item.id": item.id,
        seller: me.simplifiedAccount,
        buyer: someone.simplifiedAccount,
        completedAt: null,
        cancelledAt: null,
      }),
    ).toEqual(0);
    expect(publishItemUpdatedEvent).toHaveBeenCalledTimes(1);
  });

  it("fails if the actor is not the seller", async () => {
    mock.module("@/events/publish-item-updated-event", () => ({
      publishItemUpdatedEvent: mock(),
    }));

    const item: Item = {
      id: crypto.randomUUID(),
      type: ItemType.Single,
      name: "test",
      description: "test",
      price: 100,
      photoUrls: ["uploads/test.png"],
      seller: me.simplifiedAccount,
      status: ItemStatus.Dealt,
      createdAt: new Date(),
      deletedAt: null,
    };
    await itemsCollection.insertOne({ ...item });
    await transactionsCollection.insertOne({
      id: crypto.randomUUID(),
      buyer: someone.simplifiedAccount,
      seller: me.simplifiedAccount,
      item: {
        id: item.id,
        name: item.name,
        price: item.price,
      },
      createdAt: new Date(),
      completedAt: null,
      cancelledAt: null,
    });

    const res = await PUT(
      `/items/${item.id}/status`,
      {
        status: ItemStatus.ForSale,
      },
      {
        headers: {
          Cookie: `access_token=${someone.jwt}`,
        },
      },
    );
    const body = await res.json();

    expect(res.status).toEqual(403);
    expect(body).toEqual({ error: expect.any(String) });
    expect(
      await itemsCollection.countDocuments({
        id: item.id,
        status: ItemStatus.Dealt,
      }),
    ).toEqual(1);
    expect(
      await transactionsCollection.countDocuments({
        "item.id": item.id,
        seller: me.simplifiedAccount,
        buyer: someone.simplifiedAccount,
        completedAt: null,
        cancelledAt: null,
      }),
    ).toEqual(1);
    expect(publishItemUpdatedEvent).toHaveBeenCalledTimes(0);
  });

  it("fails if the transaction does not exist", async () => {
    mock.module("@/events/publish-item-updated-event", () => ({
      publishItemUpdatedEvent: mock(),
    }));

    const item: Item = {
      id: crypto.randomUUID(),
      type: ItemType.Single,
      name: "test",
      description: "test",
      price: 100,
      photoUrls: ["uploads/test.png"],
      seller: me.simplifiedAccount,
      status: ItemStatus.Dealt,
      createdAt: new Date(),
      deletedAt: null,
    };
    await itemsCollection.insertOne({ ...item });

    const res = await PUT(
      `/items/${item.id}/status`,
      {
        status: ItemStatus.ForSale,
      },
      {
        headers: {
          Cookie: `access_token=${me.jwt}`,
        },
      },
    );
    const body = await res.json();

    expect(res.status).toEqual(403);
    expect(body).toEqual({ error: expect.any(String) });
    expect(
      await itemsCollection.countDocuments({
        id: item.id,
        status: ItemStatus.Dealt,
      }),
    ).toEqual(1);
    expect(
      await transactionsCollection.countDocuments({
        "item.id": item.id,
        seller: me.simplifiedAccount,
        buyer: someone.simplifiedAccount,
        completedAt: null,
        cancelledAt: null,
      }),
    ).toEqual(0);
    expect(publishItemUpdatedEvent).toHaveBeenCalledTimes(0);
  });

  it("fails if the transaction is already completed", async () => {
    mock.module("@/events/publish-item-updated-event", () => ({
      publishItemUpdatedEvent: mock(),
    }));

    const item: Item = {
      id: crypto.randomUUID(),
      type: ItemType.Single,
      name: "test",
      description: "test",
      price: 100,
      photoUrls: ["uploads/test.png"],
      seller: me.simplifiedAccount,
      status: ItemStatus.Dealt,
      createdAt: new Date(),
      deletedAt: null,
    };
    await itemsCollection.insertOne({ ...item });
    await transactionsCollection.insertOne({
      id: crypto.randomUUID(),
      buyer: someone.simplifiedAccount,
      seller: me.simplifiedAccount,
      item: {
        id: item.id,
        name: item.name,
        price: item.price,
      },
      createdAt: new Date(),
      completedAt: new Date(),
      cancelledAt: null,
    });

    const res = await PUT(
      `/items/${item.id}/status`,
      {
        status: ItemStatus.ForSale,
      },
      {
        headers: {
          Cookie: `access_token=${me.jwt}`,
        },
      },
    );
    const body = await res.json();

    expect(res.status).toEqual(409);
    expect(body).toEqual({ error: expect.any(String) });
    expect(
      await itemsCollection.countDocuments({
        id: item.id,
        status: ItemStatus.Dealt,
      }),
    ).toEqual(1);
    expect(
      await transactionsCollection.countDocuments({
        "item.id": item.id,
        seller: me.simplifiedAccount,
        buyer: someone.simplifiedAccount,
        completedAt: { $ne: null },
        cancelledAt: null,
      }),
    ).toEqual(1);
    expect(publishItemUpdatedEvent).toHaveBeenCalledTimes(0);
  });

  it("fails if the transaction is cancelled", async () => {
    mock.module("@/events/publish-item-updated-event", () => ({
      publishItemUpdatedEvent: mock(),
    }));

    const item: Item = {
      id: crypto.randomUUID(),
      type: ItemType.Single,
      name: "test",
      description: "test",
      price: 100,
      photoUrls: ["uploads/test.png"],
      seller: me.simplifiedAccount,
      status: ItemStatus.Dealt,
      createdAt: new Date(),
      deletedAt: null,
    };
    await itemsCollection.insertOne({ ...item });
    await transactionsCollection.insertOne({
      id: crypto.randomUUID(),
      buyer: someone.simplifiedAccount,
      seller: me.simplifiedAccount,
      item: {
        id: item.id,
        name: item.name,
        price: item.price,
      },
      createdAt: new Date(),
      completedAt: null,
      cancelledAt: new Date(),
    });

    const res = await PUT(
      `/items/${item.id}/status`,
      {
        status: ItemStatus.ForSale,
      },
      {
        headers: {
          Cookie: `access_token=${me.jwt}`,
        },
      },
    );
    const body = await res.json();

    expect(res.status).toEqual(403);
    expect(body).toEqual({ error: expect.any(String) });
    expect(
      await itemsCollection.countDocuments({
        id: item.id,
        status: ItemStatus.Dealt,
      }),
    ).toEqual(1);
    expect(
      await transactionsCollection.countDocuments({
        "item.id": item.id,
        seller: me.simplifiedAccount,
        buyer: someone.simplifiedAccount,
        completedAt: null,
        cancelledAt: { $ne: null },
      }),
    ).toEqual(1);
    expect(publishItemUpdatedEvent).toHaveBeenCalledTimes(0);
  });
});
