import type { Account, Participant } from "@/types";
import { sign } from "jsonwebtoken";

const simplifiedMe: Participant = {
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
  createdAt: "2024-10-07T06:49:51.460Z",
  deletedAt: null,
};

const meJwt = sign(
  {
    id: detailedMe.id,
    nickname: detailedMe.nickname,
    avatar_url: detailedMe.avatarUrl,
  },
  Buffer.from(Bun.env.JWT_SECRET_KEY, "base64"),
);

export const me = {
  participant: simplifiedMe,
  account: detailedMe,
  jwt: meJwt,
};

const simplifiedSomeone: Participant = {
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
  createdAt: "2024-10-17T06:49:51.460Z",
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
  participant: simplifiedSomeone,
  account: detailedSomeone,
  jwt: someoneJwt,
};
