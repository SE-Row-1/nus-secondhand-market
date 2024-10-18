import { camelToSnake } from "@/utils/case";
import { sign } from "jsonwebtoken";

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

export const myJwt = sign(
  camelToSnake({ id: me.id, nickname: me.nickname, avatar_url: me.avatarUrl }),
  Buffer.from(process.env.JWT_SECRET_KEY, "base64"),
);

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

export const someoneElseJwt = sign(
  camelToSnake({
    id: someoneElse.id,
    nickname: someoneElse.nickname,
    avatar_url: someoneElse.avatarUrl,
  }),
  Buffer.from(process.env.JWT_SECRET_KEY, "base64"),
);
