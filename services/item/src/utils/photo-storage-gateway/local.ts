import { existsSync, mkdirSync } from "fs";
import { rm, writeFile } from "fs/promises";
import { extname, join } from "path";
import type { PhotoStorageGateway } from "./types";

/**
 * Store photos in local folder.
 */
export class LocalPhotoStorageGateway implements PhotoStorageGateway {
  private static UPLOADS_DIR = "./uploads";

  public constructor() {
    if (!existsSync(LocalPhotoStorageGateway.UPLOADS_DIR)) {
      mkdirSync(LocalPhotoStorageGateway.UPLOADS_DIR);
    }
  }

  public async save(photo: File) {
    const path = join(
      LocalPhotoStorageGateway.UPLOADS_DIR,
      `${crypto.randomUUID()}${extname(photo.name)}`,
    );

    await writeFile(path, new Uint8Array(await photo.arrayBuffer()));

    return path;
  }

  public async remove(photoUrl: string) {
    await rm(photoUrl);
  }
}
