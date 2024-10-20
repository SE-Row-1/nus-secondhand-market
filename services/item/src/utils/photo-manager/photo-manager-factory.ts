import { LocalPhotoManager } from "./local-photo-manager";
import type { PhotoManager } from "./photo-manager";
import { S3PhotoManager } from "./s3-photo-manager";

/**
 * Create a photo manager based on the running environment.
 */
export class PhotoManagerFactory {
  static createPhotoManager(): PhotoManager {
    if (Bun.env.NODE_ENV === "production") {
      return new S3PhotoManager();
    }

    return new LocalPhotoManager();
  }
}
