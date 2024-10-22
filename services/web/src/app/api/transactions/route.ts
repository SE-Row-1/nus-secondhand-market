import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: "d4310345-5ae4-4d68-b472-e37701bf757f",
      itemId: "bdaa2269-cd63-40f0-9c2d-b00327c9a941",
      buyer: {
        id: 1,
        nickname: "Johnny",
        avatar_url: "https://avatars.githubusercontent.com/u/78269445?v=4",
      },
      seller: {
        id: 2,
        nickname: "JaneS",
        avatar_url: "https://avatars.githubusercontent.com/u/69978374?v=4",
      },
      createdAt: new Date().toISOString(),
    },
  ]);
}
