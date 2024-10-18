import { existsSync, mkdirSync } from "fs";
import { rm, writeFile } from "fs/promises";
import { join } from "path";
import type { PhotoManager } from "./photo-manager";

/**
 * Store photos in local directory.
 */
export class LocalPhotoManager implements PhotoManager {
  private static UPLOADS_DIR = "./uploads";

  public constructor() {
    if (!existsSync(LocalPhotoManager.UPLOADS_DIR)) {
      mkdirSync(LocalPhotoManager.UPLOADS_DIR);
    }
  }

  public async save(photo: File) {
    const photoUrl = join(LocalPhotoManager.UPLOADS_DIR, photo.name);
    await writeFile(photoUrl, new Uint8Array(await photo.arrayBuffer()));
    return photoUrl;
  }

  public async remove(photoUrl: string) {
    await rm(photoUrl);
  }
}
