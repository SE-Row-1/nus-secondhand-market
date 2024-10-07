import { ItemStatus } from "@/types";
import { Jwt } from "hono/utils/jwt";

export const me = {
  id: 1,
  email: "me@example.com",
  nickname: "me",
  avatarUrl: "https://example.com/me.jpg",
  phoneCode: "65",
  phoneNumber: "12345678",
  department: {
    id: 1,
    acronym: "ME",
    name: "My department",
  },
  createdAt: new Date("2024-10-07T06:49:51.460Z"),
  deletedAt: null,
};

export const myJwt = await Jwt.sign(me, "nshm-item-service");

export const someoneElse = {
  id: 2,
  email: "someoneelse@example.com",
  nickname: "someoneelse",
  avatarUrl: "https://example.com/someoneelse.jpg",
  phoneCode: "65",
  phoneNumber: "87654321",
  department: {
    id: 2,
    acronym: "ELSE",
    name: "someone else's department",
  },
  createdAt: new Date("2024-10-07T06:49:51.460Z"),
  deletedAt: null,
};

export const someoneElseJwt = await Jwt.sign(someoneElse, "nshm-item-service");

export const fakeSingleItem = {
  id: crypto.randomUUID(),
  type: "single" as const,
  name: "test",
  description: "test",
  price: 100,
  photoUrls: [],
  seller: {
    id: me.id,
    nickname: me.nickname,
    avatarUrl: me.avatarUrl,
  },
  status: ItemStatus.FOR_SALE,
  createdAt: new Date(),
  deletedAt: null,
};
