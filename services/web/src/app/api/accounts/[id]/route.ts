import type { DetailedAccount } from "@/types";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const mockAccount: DetailedAccount = {
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

export async function PATCH(request: NextRequest) {
  const accessToken = cookies().get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Please log in first." },
      { status: 401 },
    );
  }

  const json = await request.json();

  return NextResponse.json({ ...mockAccount, ...json }, { status: 200 });
}

export async function DELETE() {
  cookies().set("access_token", "", { maxAge: 0 });

  return new NextResponse(null, { status: 204 });
}
