import type { Account, Participant } from "@/types";
import { sign } from "jsonwebtoken";

export const participant1: Participant = {
  id: 1,
  nickname: "nickname1",
  avatarUrl: "https://example.com/avatar1.jpg",
};

export const account1: Account = {
  ...participant1,
  email: "1@example.com",
  phoneCode: "65",
  phoneNumber: "12345678",
  department: {
    id: 1,
    acronym: "ISS",
    name: "Institute of Systems Science",
  },
  preferredCurrency: "SGD",
  createdAt: new Date().toISOString(),
  deletedAt: null,
};

export const jwt1 = sign(
  {
    id: account1.id,
    nickname: account1.nickname,
    avatar_url: account1.avatarUrl,
  },
  Buffer.from(Bun.env.JWT_SECRET_KEY, "base64"),
);

export const participant2: Participant = {
  id: 2,
  nickname: "nickname2",
  avatarUrl: "https://example.com/avatar2.jpg",
};

export const account2: Account = {
  ...participant2,
  email: "2@example.com",
  phoneCode: "65",
  phoneNumber: "22345678",
  department: {
    id: 2,
    acronym: "SOC",
    name: "School of Computing",
  },
  preferredCurrency: "USD",
  createdAt: new Date().toISOString(),
  deletedAt: null,
};

export const jwt2 = sign(
  {
    id: account2.id,
    nickname: account2.nickname,
    avatar_url: account2.avatarUrl,
  },
  Buffer.from(Bun.env.JWT_SECRET_KEY, "base64"),
);
