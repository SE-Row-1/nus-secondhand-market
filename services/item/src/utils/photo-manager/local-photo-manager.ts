import { existsSync, mkdirSync } from "fs";
import { rm, writeFile } from "fs/promises";
import { join } from "path";
import type { PhotoManager } from "./photo-manager-interface";

/**
 * Store photos in local directory.
 */
export class LocalPhotoManager implements PhotoManager {
  private static UPLOAD_DIR = "./uploads";

  public constructor() {
    if (!existsSync(LocalPhotoManager.UPLOAD_DIR)) {
      mkdirSync(LocalPhotoManager.UPLOAD_DIR);
    }
  }

  public async save(photo: File) {
    const photoUrl = join(LocalPhotoManager.UPLOAD_DIR, photo.name);
    await writeFile(photoUrl, new Uint8Array(await photo.arrayBuffer()));
    return photoUrl;
  }

  public async remove(photoUrl: string) {
    await rm(photoUrl);
  }
}
