import { ItemStatus, type Item, type SimplifiedAccount } from "@/types";
import { HTTPException } from "hono/http-exception";

export class StatefulItem {
  private state!: State;

  public constructor(public item: Item) {
    const currentState = StatefulItem.createStateFromItem(item);
    this.setState(currentState);
  }

  public setState(state: State) {
    this.state = state;
    this.state.setContext(this);
  }

  public transitionTo(status: ItemStatus, actor: SimplifiedAccount) {
    switch (status) {
      case ItemStatus.ForSale:
        this.state.toForSale(actor);
        break;
      case ItemStatus.Dealt:
        this.state.toDealt(actor);
        break;
      case ItemStatus.Sold:
        this.state.toSold(actor);
        break;
    }
  }

  public getRepresentation(): Item {
    return { ...this.item, status: this.state.representation };
  }

  private static createStateFromItem(item: Item) {
    switch (item.status) {
      case ItemStatus.ForSale:
        return new ForSaleState();
      case ItemStatus.Dealt:
        return new DealtState();
      case ItemStatus.Sold:
        return new SoldState();
    }
  }
}

abstract class State {
  protected context!: StatefulItem;

  public representation!: ItemStatus;

  public setContext(context: StatefulItem) {
    this.context = context;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public toForSale(_: SimplifiedAccount) {
    throw new HTTPException(422, { message: "Transition not allowed" });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public toDealt(_: SimplifiedAccount) {
    throw new HTTPException(422, { message: "Transition not allowed" });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public toSold(_: SimplifiedAccount) {
    throw new HTTPException(422, { message: "Transition not allowed" });
  }
}

class ForSaleState extends State {
  public override representation = ItemStatus.ForSale;

  public override toDealt(actor: SimplifiedAccount) {
    if (actor.id !== this.context.item.seller.id) {
      throw new HTTPException(403, { message: "You are not the seller" });
    }

    this.context.setState(new DealtState());
  }
}

class DealtState extends State {
  public override representation = ItemStatus.Dealt;

  public override toForSale(actor: SimplifiedAccount) {
    if (actor.id !== this.context.item.seller.id) {
      throw new HTTPException(403, { message: "You are not the seller" });
    }

    this.context.setState(new ForSaleState());
  }

  public override toSold(account: SimplifiedAccount) {
    if (account.id !== this.context.item.seller.id) {
      throw new HTTPException(403, { message: "You are not the seller" });
    }

    this.context.setState(new SoldState());
  }
}

class SoldState extends State {
  public override representation = ItemStatus.Sold;
}
