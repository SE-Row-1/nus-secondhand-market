import { ItemStatus, type Account, type Item } from "@/types";
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

  public transitionTo(status: ItemStatus, actor: Account) {
    switch (status) {
      case ItemStatus.FOR_SALE:
        this.state.toForSale(actor);
        break;
      case ItemStatus.DEALT:
        this.state.toDealt(actor);
        break;
      case ItemStatus.SOLD:
        this.state.toSold(actor);
        break;
    }
  }

  public getRepresentation(): Item {
    return { ...this.item, status: this.state.representation };
  }

  private static createStateFromItem(item: Item) {
    switch (item.status) {
      case ItemStatus.FOR_SALE:
        return new ForSaleState();
      case ItemStatus.DEALT:
        return new DealtState();
      case ItemStatus.SOLD:
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
  public toForSale(_: Account) {
    throw new HTTPException(422, { message: "Transition not allowed" });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public toDealt(_: Account) {
    throw new HTTPException(422, { message: "Transition not allowed" });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public toSold(_: Account) {
    throw new HTTPException(422, { message: "Transition not allowed" });
  }
}

class ForSaleState extends State {
  public override representation = ItemStatus.FOR_SALE;

  public override toDealt(actor: Account) {
    if (actor.id !== this.context.item.seller.id) {
      throw new HTTPException(403, { message: "You are not the seller" });
    }

    this.context.setState(new DealtState());
  }
}

class DealtState extends State {
  public override representation = ItemStatus.DEALT;

  public override toForSale(actor: Account) {
    if (actor.id !== this.context.item.seller.id) {
      throw new HTTPException(403, { message: "You are not the seller" });
    }

    this.context.setState(new ForSaleState());
  }

  public override toSold(account: Account) {
    if (account.id !== this.context.item.seller.id) {
      throw new HTTPException(403, { message: "You are not the seller" });
    }

    this.context.setState(new SoldState());
  }
}

class SoldState extends State {
  public override representation = ItemStatus.SOLD;
}
