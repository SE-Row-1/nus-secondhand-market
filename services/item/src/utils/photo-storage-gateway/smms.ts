import { HTTPException } from "hono/http-exception";
import type { StatusCode } from "hono/utils/http-status";
import type { PhotoStorageGateway } from "./types";

/**
 * Store photos in SM.MS.
 */
export class SmmsPhotoStorageGateway implements PhotoStorageGateway {
  private static BASE_URL = "https://sm.ms/api/v2";

  private static registry: Record<string, string> = {};

  public async save(photo: File) {
    const formData = new FormData();
    formData.append("smfile", photo);

    const res = await fetch(SmmsPhotoStorageGateway.BASE_URL + "/upload", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: Bun.env.SMMS_API_KEY,
      },
    });

    if (!res.ok) {
      throw new HTTPException(res.status as StatusCode, {
        message: `Failed to upload photo "${photo.name}" to SM.MS`,
      });
    }

    const {
      data: { hash, url },
    } = (await res.json()) as { data: { hash: string; url: string } };

    SmmsPhotoStorageGateway.registry[url] = hash;

    return url;
  }

  public async remove(photoUrl: string) {
    const hash = SmmsPhotoStorageGateway.registry[photoUrl];

    // It could be that the photo URL was never uploaded to SM.MS,
    // or the registry cache was cleared.
    // Either way, we won't be able to delete the photo.
    if (!hash) {
      return;
    }

    const res = await fetch(
      SmmsPhotoStorageGateway.BASE_URL + `/delete/${hash}`,
      {
        method: "GET",
        headers: {
          Authorization: Bun.env.SMMS_API_KEY,
        },
      },
    );

    if (!res.ok) {
      throw new HTTPException(res.status as StatusCode, {
        message: `Failed to delete photo "${photoUrl}" from SM.MS`,
      });
    }

    delete SmmsPhotoStorageGateway.registry[photoUrl];
  }
}
