import { NextRequest, NextResponse } from "next/server";
import { mockItems } from "../mock";

export async function GET() {
  return NextResponse.json(mockItems[mockItems.length - 1]);
}

export async function PATCH(req: NextRequest) {
  const formData = await req.formData();

  const name = formData.get("name");
  const description = formData.get("description");
  const price = formData.get("price");
  const removed_photo_urls = formData.getAll("removed_photo_urls");

  const photo_urls = mockItems[1].photo_urls.filter(
    (url) => !removed_photo_urls.includes(url),
  );

  return NextResponse.json({
    ...mockItems[1],
    name,
    description,
    price,
    photo_urls,
  });
}

export async function DELETE() {
  return new Response(null, { status: 204 });
}
