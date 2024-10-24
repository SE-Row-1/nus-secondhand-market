import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const otp = Math.floor(Math.random() * 1_000_000).toString();

  console.log(`Sending OTP ${otp} to ${email}...`);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return NextResponse.json(1, { status: 200 });
}
