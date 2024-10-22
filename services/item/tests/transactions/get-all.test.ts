import type { Transaction } from "@/types";
import type { CamelToSnake } from "@/utils/case";
import { expect, it } from "bun:test";
import { me } from "../test-utils/mock-data";
import { GET } from "../test-utils/request";

it("returns all of one's transactions by default", async () => {
  const res = await GET("/transactions", {
    headers: {
      Cookie: `access_token=${me.jwt}`,
    },
  });
  const body = (await res.json()) as CamelToSnake<Transaction>[];

  expect(res.status).toEqual(200);
  expect(body).toBeArray();
  let lastCreatedAt = Infinity;
  for (const transaction of body) {
    const isSeller = me.simplifiedAccount.id === transaction.seller.id;
    const isBuyer = me.simplifiedAccount.id === transaction.buyer.id;
    expect(isSeller || isBuyer).toEqual(true);
    const currentCreatedAt = new Date(transaction.created_at).getTime();
    expect(currentCreatedAt).toBeLessThanOrEqual(lastCreatedAt);
    lastCreatedAt = currentCreatedAt;
  }
});

it("filters transactions if given item id", async () => {
  const res = await GET(
    "/transactions?itemId=9ab42141-580e-44dd-af63-f29efb593740",
    {
      headers: {
        Cookie: `access_token=${me.jwt}`,
      },
    },
  );
  const body = (await res.json()) as CamelToSnake<Transaction>[];

  expect(res.status).toEqual(200);
  expect(body).toBeArray();
  for (const transaction of body) {
    const isSeller = me.simplifiedAccount.id === transaction.seller.id;
    const isBuyer = me.simplifiedAccount.id === transaction.buyer.id;
    expect(isSeller || isBuyer).toEqual(true);
    expect(transaction.item_id).toEqual("9ab42141-580e-44dd-af63-f29efb593740");
  }
});

it("filters transactions if given exclude_cancelled", async () => {
  const res = await GET("/transactions?exclude_cancelled=true", {
    headers: {
      Cookie: `access_token=${me.jwt}`,
    },
  });
  const body = (await res.json()) as CamelToSnake<Transaction>[];

  expect(res.status).toEqual(200);
  expect(body).toBeArray();
  for (const transaction of body) {
    const isSeller = me.simplifiedAccount.id === transaction.seller.id;
    const isBuyer = me.simplifiedAccount.id === transaction.buyer.id;
    expect(isSeller || isBuyer).toEqual(true);
    expect(transaction.cancelled_at).toEqual(null);
  }
});

it("returns 401 if not authenticated", async () => {
  const res = await GET("/transactions");
  const body = await res.json();

  expect(res.status).toEqual(401);
  expect(body).toEqual({ error: expect.any(String) });
});
