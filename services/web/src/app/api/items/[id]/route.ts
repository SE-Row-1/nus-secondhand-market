import { NextRequest, NextResponse } from "next/server";
import { mockItems } from "../mock";

export async function GET() {
  return NextResponse.json({
    ...mockItems[1],
    seller: {
      id: 2,
      email: "e1234562@u.nus.edu",
      nickname: "JaneS",
      avatar_url: "https://avatars.githubusercontent.com/u/69978374?v=4",
      phone_code: "65",
      phone_number: "91234567",
      department: {
        id: 1,
        acronym: "ISS",
        name: "Institute of Systems Science",
      },
    },
  });
}

export async function PATCH(req: NextRequest) {
  const formData = await req.formData();

  const name = formData.get("name");
  const description = formData.get("description");
  const price = formData.get("price");
  const removed_photo_urls = formData.getAll("removed_photo_urls");

  const photo_urls = mockItems[0].photo_urls.filter(
    (url) => !removed_photo_urls.includes(url),
  );

  return NextResponse.json({
    ...mockItems[0],
    name,
    description,
    price,
    photo_urls,
  });
}

export async function DELETE() {
  return new Response(null, { status: 204 });
}
