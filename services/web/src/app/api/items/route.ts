import { NextResponse } from "next/server";

const mockAccounts = [
  {
    id: 1,
    nickname: "Johnny",
    avatar_url: "https://avatars.githubusercontent.com/u/78269445?v=4",
  },
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
  {
    id: 5,
    nickname: "EmJ",
    avatar_url: "https://avatars.githubusercontent.com/u/83934144?v=4",
  },
] as const;

const mockItems = [
  {
    id: "eedd8f7d-e269-4dcb-a8e3-1dcca7c75b9e",
    type: "single",
    seller: mockAccounts[0],
    name: "Vintage Lamp",
    description:
      "A beautiful vintage lamp from the 1950s, in perfect condition.",
    price: 150.0,
    photo_urls: [],
    status: 0,
    created_at: "2023-01-15T10:30:00Z",
    deleted_at: null,
  },
  {
    id: "9836ab64-fd25-4004-8640-7a102cca4864",
    type: "single",
    seller: mockAccounts[1],
    name: "iPhone 12",
    description: "iPhone 12 in great condition, barely used.",
    price: 900.0,
    photo_urls: ["https://picsum.photos/200", "https://picsum.photos/200"],
    status: 2,
    created_at: "2023-02-01T14:15:00Z",
    deleted_at: null,
  },
  {
    id: "2278ca99-03ee-4125-83cc-52888604d755",
    type: "single",
    seller: mockAccounts[3],
    name: "Gaming Laptop",
    description: "High-performance gaming laptop with RTX 3070. Barely used.",
    price: 1800.0,
    photo_urls: ["https://picsum.photos/200"],
    status: 1,
    created_at: "2023-04-05T12:00:00Z",
    deleted_at: null,
  },
  {
    id: "4f900994-7ca7-4d37-88e4-ffa884445f1a",
    type: "single",
    seller: mockAccounts[4],
    name: "Mountain Bike",
    description: "Lightweight aluminum mountain bike, perfect for trails.",
    price: 750.0,
    photo_urls: ["https://picsum.photos/200"],
    status: 2,
    created_at: "2023-05-20T09:30:00Z",
    deleted_at: null,
  },
  {
    id: "669205d9-5868-41d3-8b50-0ded259120cf",
    type: "single",
    seller: mockAccounts[0],
    name: "Smartwatch",
    description: "Water-resistant smartwatch with heart-rate monitor and GPS.",
    price: 220.0,
    photo_urls: ["https://picsum.photos/200"],
    status: 0,
    created_at: "2023-06-10T11:15:00Z",
    deleted_at: null,
  },
  {
    id: "6689aca9-2eff-4ca3-bdd9-1b6f08c8a6a7",
    type: "single",
    seller: mockAccounts[1],
    name: "Bluetooth Speaker",
    description:
      "Portable Bluetooth speaker, 20-hour battery life, waterproof.",
    price: 75.0,
    photo_urls: ["https://picsum.photos/200"],
    status: 1,
    created_at: "2023-08-15T13:00:00Z",
    deleted_at: null,
  },
  {
    id: "6a7cf2f0-ddeb-407f-840a-81156ce1b369",
    type: "single",
    seller: mockAccounts[3],
    name: "Air Purifier",
    description: "HEPA air purifier for large rooms, 3 fan speeds.",
    price: 200.0,
    photo_urls: ["https://picsum.photos/200"],
    status: 0,
    created_at: "2023-09-20T10:00:00Z",
    deleted_at: null,
  },
  {
    id: "2bafe3c2-31c9-45fc-bd03-ae1fc9f4841a",
    type: "single",
    seller: mockAccounts[4],
    name: "Leather Jacket",
    description: "Men’s leather jacket, genuine leather, worn twice.",
    price: 300.0,
    photo_urls: ["https://picsum.photos/200"],
    status: 2,
    created_at: "2023-10-01T14:20:00Z",
    deleted_at: null,
  },
  // {
  //   id: "f15af22d-a1ea-4b47-9b14-bf1f59bc63aa",
  //   type: "pack",
  //   seller: mockAccounts[2],
  //   name: "Give back to the community",
  //   description: "A bonus pack of my items for sale. Get a 20% discount!",
  //   discount: 0.2,
  //   status: 0,
  //   children: [
  //     {
  //       id: "f9419dbb-7862-4bb4-b8a2-fce2b26b0f0e",
  //       type: "single",
  //       seller: mockAccounts[2],
  //       name: "Office Chair",
  //       description:
  //         "Ergonomic office chair with lumbar support. Used for 6 months.",
  //       price: 120.5,
  //       photo_urls: ["https://picsum.photos/200", "https://picsum.photos/200"],
  //       status: 0,
  //       created_at: "2023-03-10T08:45:00Z",
  //       deleted_at: null,
  //     },
  //     {
  //       id: "525a9e07-2d1b-4af9-8460-7d6309fb8e59",
  //       type: "single",
  //       seller: mockAccounts[2],
  //       name: "Electric Kettle",
  //       description:
  //         "Fast-boil electric kettle, 1.7L capacity, stainless steel.",
  //       price: 45.0,
  //       photo_urls: ["https://picsum.photos/200"],
  //       status: 0,
  //       created_at: "2023-07-05T08:10:00Z",
  //       deleted_at: null,
  //     },
  //   ],
  //   created_at: "2023-11-15T10:30:00Z",
  //   deleted_at: null,
  // },
] as const;

export async function GET() {
  return NextResponse.json({ items: mockItems, count: 9 }, { status: 200 });
}
