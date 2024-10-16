import { NextResponse, type NextRequest } from "next/server";

interface Middleware {
  setNext: (next: Middleware) => Middleware;
  handle: (req: NextRequest) => Promise<NextResponse>;
}

export abstract class BaseMiddleware implements Middleware {
  private next: Middleware | null = null;

  public setNext(next: Middleware) {
    this.next = next;
    return next;
  }

  public async handle(req: NextRequest) {
    if (this.next) {
      return await this.next.handle(req);
    }
    return NextResponse.next();
  }
}
