import { NextResponse, type NextRequest } from "next/server";

/**
 * Base class for all middleware.
 */
export abstract class Middleware {
  /**
   * The next middleware in the chain.
   *
   * Defaults to null, which means this middleware is the last in the chain.
   */
  private next: Middleware | null = null;

  /**
   * Set the next middleware in the chain.
   *
   * That next middleware is returned for convenience of method chaining.
   */
  public setNext(next: Middleware): Middleware {
    this.next = next;
    return next;
  }

  /**
   * Handle an incoming request.
   *
   * Upon completion, the middleware passes the request to the next middleware
   * in the chain. And if there is no next middleware, it passes the request to
   * Next.js instead.
   *
   * Usually, this method is overridden by subclasses to implement the actual
   * middleware logic. The actual middleware can decide to directly return a
   * response without further passing it to anyone.
   */
  public async handle(req: NextRequest): Promise<NextResponse> {
    if (this.next) {
      return await this.next.handle(req);
    }
    return NextResponse.next();
  }
}
