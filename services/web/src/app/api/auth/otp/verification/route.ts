import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { otp } = await req.json();

  console.log("Received OTP:", otp);

  return new Response(null, { status: 204 });
}
