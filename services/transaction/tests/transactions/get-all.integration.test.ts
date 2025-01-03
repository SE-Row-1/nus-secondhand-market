import type { Transaction } from "@/types";
import { snakeToCamel } from "@/utils/case";
import { expect, it } from "bun:test";
import { jwt1, participant1 } from "../test-utils/data";
import { GET } from "../test-utils/request";

it("returns transactions", async () => {
  const res = await GET("/transactions", {
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = snakeToCamel(await res.json()) as Transaction[];

  expect(res.status).toEqual(200);
  expect(body).toEqual(
    expect.arrayContaining([
      {
        id: expect.any(String),
        item: {
          id: expect.any(String),
          name: expect.any(String),
          price: expect.any(Number),
        },
        seller: {
          id: expect.any(Number),
          email: expect.any(String),
          nickname: expect.any(String),
          avatarUrl: expect.any(String),
        },
        buyer: {
          id: expect.any(Number),
          email: expect.any(String),
          nickname: expect.any(String),
          avatarUrl: expect.any(String),
        },
        createdAt: expect.any(String),
        completedAt: expect.not.stringContaining("x"),
        cancelledAt: expect.not.stringContaining("x"),
      },
    ]),
  );

  let lastCreatedAt = Infinity;
  for (const transaction of body) {
    const isSeller = participant1.id === transaction.seller.id;
    const isBuyer = participant1.id === transaction.buyer.id;
    expect(isSeller || isBuyer).toEqual(true);

    const currentCreatedAt = new Date(transaction.createdAt).getTime();
    expect(currentCreatedAt).toBeLessThanOrEqual(lastCreatedAt);
    lastCreatedAt = currentCreatedAt;
  }
});

it("filters transactions if item_id is given", async () => {
  const itemId = "10f33906-24df-449d-b4fb-fcc6c76606b6";
  const res = await GET(`/transactions?item_id=${itemId}`, {
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = snakeToCamel(await res.json()) as Transaction[];

  expect(res.status).toEqual(200);
  expect(body).toEqual(
    expect.arrayContaining([
      {
        id: expect.any(String),
        item: {
          id: itemId,
          name: expect.any(String),
          price: expect.any(Number),
        },
        seller: {
          id: expect.any(Number),
          email: expect.any(String),
          nickname: expect.any(String),
          avatarUrl: expect.any(String),
        },
        buyer: {
          id: expect.any(Number),
          email: expect.any(String),
          nickname: expect.any(String),
          avatarUrl: expect.any(String),
        },
        createdAt: expect.any(String),
        completedAt: expect.not.stringContaining("x"),
        cancelledAt: expect.not.stringContaining("x"),
      },
    ]),
  );
});

it("filters transactions if is_cancelled is given", async () => {
  const res = await GET("/transactions?is_cancelled=false", {
    headers: {
      Cookie: `access_token=${jwt1}`,
    },
  });
  const body = snakeToCamel(await res.json()) as Transaction[];

  expect(res.status).toEqual(200);
  expect(body).toEqual(
    expect.arrayContaining([
      {
        id: expect.any(String),
        item: {
          id: expect.any(String),
          name: expect.any(String),
          price: expect.any(Number),
        },
        seller: {
          id: expect.any(Number),
          email: expect.any(String),
          nickname: expect.any(String),
          avatarUrl: expect.any(String),
        },
        buyer: {
          id: expect.any(Number),
          email: expect.any(String),
          nickname: expect.any(String),
          avatarUrl: expect.any(String),
        },
        createdAt: expect.any(String),
        completedAt: expect.not.stringContaining("x"),
        cancelledAt: null,
      },
    ]),
  );
});

it("returns 401 if not logged in", async () => {
  const res = await GET("/transactions");
  const body = await res.json();

  expect(res.status).toEqual(401);
  expect(body).toEqual({ error: expect.any(String) });
});
