import type { NextRequest } from "next/server";
import { Middleware } from "./base";

/**
 * Log requests and responses in production environment only.
 */
export class Logger extends Middleware {
  public override async handle(req: NextRequest) {
    if (process.env.NODE_ENV !== "production") {
      return await super.handle(req);
    }

    const start = new Date();
    console.log(
      `[${start.toISOString()}] <-- ${req.method} ${req.nextUrl.pathname}`,
    );

    const res = await super.handle(req);

    const end = new Date();
    console.log(
      `[${end.toISOString()}] --> ${req.method} ${req.nextUrl.pathname} ${res.status} ${end.getTime() - start.getTime()}ms`,
    );

    return res;
  }
}
