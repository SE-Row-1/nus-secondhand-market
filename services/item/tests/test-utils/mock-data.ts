import type { Account, Seller } from "@/types";
import { camelToSnake } from "@/utils/case";
import { sign } from "jsonwebtoken";

const simplifiedMe: Seller = {
  id: 1,
  nickname: "me",
  avatarUrl: "https://example.com/me.jpg",
};

const detailedMe: Account = {
  ...simplifiedMe,
  email: "me@example.com",
  phoneCode: "65",
  phoneNumber: "12345678",
  department: {
    id: 1,
    acronym: "ISS",
    name: "Institute of Systems Science",
  },
  preferredCurrency: "SGD",
  createdAt: new Date("2024-10-07T06:49:51.460Z"),
  deletedAt: null,
};

const meJwt = sign(simplifiedMe, Buffer.from(Bun.env.JWT_SECRET_KEY, "base64"));

export const me = {
  simplifiedAccount: simplifiedMe,
  simplified_account: JSON.parse(JSON.stringify(camelToSnake(simplifiedMe))),
  detailedAccount: detailedMe,
  detailed_account: JSON.parse(JSON.stringify(camelToSnake(detailedMe))),
  jwt: meJwt,
};

const simplifiedSomeone: Seller = {
  id: 2,
  nickname: "someone",
  avatarUrl: "https://example.com/someone.jpg",
};

const detailedSomeone: Account = {
  ...simplifiedSomeone,
  email: "someone@example.com",
  phoneCode: "65",
  phoneNumber: "87654321",
  department: {
    id: 2,
    acronym: "SOC",
    name: "School of Computing",
  },
  preferredCurrency: "USD",
  createdAt: new Date("2024-10-17T06:49:51.460Z"),
  deletedAt: null,
};

const someoneJwt = sign(
  {
    id: detailedSomeone.id,
    nickname: detailedSomeone.nickname,
    avatar_url: detailedSomeone.avatarUrl,
  },
  Buffer.from(Bun.env.JWT_SECRET_KEY, "base64"),
);

export const someone = {
  simplifiedAccount: simplifiedSomeone,
  simplified_account: camelToSnake(simplifiedSomeone),
  detailedAccount: detailedSomeone,
  detailed_account: camelToSnake(detailedSomeone),
  jwt: someoneJwt,
};
