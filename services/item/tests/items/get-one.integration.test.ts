import { ItemStatus, ItemType, type Item } from "@/types";
import { snakeToCamel } from "@/utils/case";
import { itemsCollection } from "@/utils/db";
import * as requester from "@/utils/requester";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { account1, seller1 } from "../test-utils/data";
import { GET } from "../test-utils/request";

const mockAccountRequester = mock();
const mockCreateRequester = spyOn(
  requester,
  "createRequester",
).mockImplementation(() => mockAccountRequester);

afterEach(() => {
  mockAccountRequester.mockClear();
  mockCreateRequester.mockClear();
});

afterAll(async () => {
  mock.restore();
  await itemsCollection.deleteMany({ name: "test" });
});

it("returns one item", async () => {
  const item: Item = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    seller: seller1,
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };
  await itemsCollection.insertOne({ ...item });
  mockAccountRequester.mockResolvedValueOnce(account1);

  const res = await GET(`/items/${item.id}`);
  const body = snakeToCamel(await res.json());

  expect(res.status).toEqual(200);
  expect(body).toEqual({
    ...item,
    seller: {
      ...account1,
      createdAt: account1.createdAt.toISOString(),
    },
    createdAt: item.createdAt.toISOString(),
  });
  expect(mockAccountRequester).toHaveBeenLastCalledWith(
    `/accounts/${item.seller.id}`,
  );
});

it("ignores deleted item", async () => {
  const id = crypto.randomUUID();
  await itemsCollection.insertOne({
    id,
    type: ItemType.Single,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    seller: seller1,
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: new Date(),
  });

  const res = await GET(`/items/${id}`);
  const body = await res.json();

  expect(res.status).toEqual(404);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 404 if item is not found", async () => {
  const res = await GET(`/items/${crypto.randomUUID()}`);
  const body = await res.json();

  expect(res.status).toEqual(404);
  expect(body).toEqual({ error: expect.any(String) });
});

it("returns 404 if seller is not found", async () => {
  const id = crypto.randomUUID();
  await itemsCollection.insertOne({
    id,
    type: ItemType.Single,
    name: "test",
    description: "test",
    price: 100,
    photoUrls: [],
    seller: seller1,
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  });
  mockAccountRequester.mockImplementationOnce(() => {
    throw new HTTPException(404);
  });

  const res = await GET(`/items/${id}`);
  const body = await res.json();

  expect(res.status).toEqual(404);
  expect(body).toEqual({ error: expect.any(String) });
});
