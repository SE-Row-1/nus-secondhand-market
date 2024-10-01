import type { Account } from "@/types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const mockAccount: Account = {
  id: 1,
  email: "e1351826@u.nus.edu",
  nickname: "mrcaidev",
  avatar_url: "https://avatars.githubusercontent.com/u/78269445?v=4",
  department: {
    id: 0,
    acronym: "ISS",
    name: "Institute of System Science",
  },
  phone_code: "65",
  phone_number: "80843976",
  preferred_currency: "CNY",
  created_at: "2024-09-23 12:19:10.415264+00",
  deleted_at: null,
};

const mockJwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzI3MjY1NTY3fQ.dsSDeoQ1Nwxi4tNWyyhM8KFiKaVxnpemMkNkLe7_Y60";

export async function POST() {
  cookies().set({
    name: "access_token",
    value: mockJwt,
    path: "/",
    domain: "localhost",
    maxAge: 60 * 60 * 24 * 7,
    expires: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  return NextResponse.json({ ...mockAccount }, { status: 201 });
}

export async function DELETE() {
  cookies().delete("access_token");

  return new NextResponse(null, { status: 204 });
}
