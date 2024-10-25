import { LocalPhotoStorageGateway } from "./local";
import { S3PhotoStorageGateway } from "./s3";
import { SmmsPhotoStorageGateway } from "./smms";
import type { PhotoStorageGateway } from "./types";

/**
 * Create photo storage gateway.
 */
export function createPhotoStorageGateway(): PhotoStorageGateway {
  if (Bun.env.NODE_ENV === "production") {
    return new S3PhotoStorageGateway();
  }

  if (Bun.env.NODE_ENV === "development") {
    return new SmmsPhotoStorageGateway();
  }

  return new LocalPhotoStorageGateway();
}
