import { publishEvent } from "@/events/publish";
import { ItemType, type ItemPack, type Seller } from "@/types";
import { HTTPException } from "hono/http-exception";
import * as itemsRepository from "../items/repository";
import { calculatePrice } from "./composite";

type ComposeDto = {
  name: string;
  description: string;
  discount: number;
  childrenIds: string[];
  user: Seller;
};

export async function compose(dto: ComposeDto) {
  const children = await itemsRepository.findManyByIds(dto.childrenIds);

  if (children.length !== dto.childrenIds.length) {
    throw new HTTPException(404, { message: "Some items do not exist" });
  }

  if (children.some((child) => dto.user.id !== child.seller.id)) {
    throw new HTTPException(403, {
      message: "You can only compose your own items",
    });
  }

  const withoutPricePack: Omit<ItemPack, "price"> = {
    id: crypto.randomUUID(),
    type: ItemType.Pack,
    seller: dto.user,
    name: dto.name,
    description: dto.description,
    discount: dto.discount,
    children,
    status: children[0]!.status,
    createdAt: new Date(),
    deletedAt: null,
  };
  const price = calculatePrice(withoutPricePack);
  const pack = { ...withoutPricePack, price };

  await itemsRepository.compose(pack);

  return pack;
}

type DecomposeDto = {
  id: string;
  user: Seller;
};

export async function decompose(dto: DecomposeDto) {
  const pack = await itemsRepository.findOneById(dto.id);

  if (!pack) {
    throw new HTTPException(404, { message: "Pack not found" });
  }

  if (pack.type !== ItemType.Pack) {
    throw new HTTPException(422, {
      message: "This endpoint only decomposes packs",
    });
  }

  if (dto.user.id !== pack.seller.id) {
    throw new HTTPException(403, {
      message: "You cannot decompose someone else' pack",
    });
  }

  await itemsRepository.decompose(pack);

  publishEvent("item", "item.deleted", pack.id);
}
