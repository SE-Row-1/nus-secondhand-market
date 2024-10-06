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
    const filePath = join(LocalPhotoManager.UPLOAD_DIR, photo.name);
    await writeFile(filePath, new Uint8Array(await photo.arrayBuffer()));
    return filePath;
  }

  public async remove(photoUrl: string) {
    await rm(photoUrl);
  }
}
