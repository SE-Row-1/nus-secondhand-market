import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { otp } = await req.json();

  console.log("Received OTP:", otp);

  return new NextResponse(null, { status: 204 });
}
