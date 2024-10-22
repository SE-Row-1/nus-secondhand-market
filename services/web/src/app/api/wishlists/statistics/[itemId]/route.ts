import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    count: 3,
    last_wanted_at: new Date().toISOString(),
    wanters: [
      {
        id: 2,
        nickname: "JaneS",
        avatar_url: "https://avatars.githubusercontent.com/u/69978374?v=4",
      },
      {
        id: 3,
        nickname: "AlexL",
        avatar_url: "https://avatars.githubusercontent.com/u/13389461?v=4",
      },
      {
        id: 4,
        nickname: "MikeB",
        avatar_url: "https://avatars.githubusercontent.com/u/60336739?v=4",
      },
    ],
  });
}
