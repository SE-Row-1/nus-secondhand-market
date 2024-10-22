import { publishItemDeletedEvent } from "@/events/publish-item-deleted-event";
import { ItemType, type ItemPack, type SimplifiedAccount } from "@/types";
import { HTTPException } from "hono/http-exception";
import * as itemsRepository from "../repository";
import { CompositeItemPack } from "./composite";

type ComposeServiceDto = {
  name: string;
  description: string;
  discount: number;
  childrenIds: string[];
  user: SimplifiedAccount;
};

export async function compose(dto: ComposeServiceDto) {
  const children = await itemsRepository.find({
    id: { $in: dto.childrenIds },
    deletedAt: null,
  });

  if (children.length !== dto.childrenIds.length) {
    throw new HTTPException(404, { message: "Some items do not exist" });
  }

  if (children.some((child) => child.seller.id !== dto.user.id)) {
    throw new HTTPException(403, {
      message: "You can only compose your own items",
    });
  }

  const withoutPricePack = {
    id: crypto.randomUUID(),
    type: ItemType.Pack as const,
    seller: dto.user,
    name: dto.name,
    description: dto.description,
    discount: dto.discount,
    children,
    status: children[0]!.status,
    createdAt: new Date(),
    deletedAt: null,
  };
  const price = new CompositeItemPack(withoutPricePack).price;
  const pack = { ...withoutPricePack, price };

  await itemsRepository.compose(pack);

  return pack;
}

type DecomposeServiceDto = {
  id: string;
  user: SimplifiedAccount;
};

export async function decompose(dto: DecomposeServiceDto) {
  const pack = await itemsRepository.findOne({
    id: dto.id,
    type: ItemType.Pack,
    deletedAt: null,
  });

  if (!pack) {
    throw new HTTPException(404, { message: "Pack does not exist" });
  }

  if (pack.seller.id !== dto.user.id) {
    throw new HTTPException(403, {
      message: "You can only decompose your own pack",
    });
  }

  await itemsRepository.decompose(pack as ItemPack);

  publishItemDeletedEvent(pack.id);

  return;
}
