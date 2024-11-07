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

    const { hash, url } = await SmmsPhotoStorageGateway.request<{
      hash: string;
      url: string;
    }>("/upload", { method: "POST", body: formData });

    SmmsPhotoStorageGateway.registry[url] = hash;

    return url;
  }

  public async remove(photoUrl: string) {
    const hash = SmmsPhotoStorageGateway.registry[photoUrl];

    if (!hash) {
      return;
    }

    await SmmsPhotoStorageGateway.request(`/delete/${hash}`, {
      method: "GET",
    });

    delete SmmsPhotoStorageGateway.registry[photoUrl];
  }

  private static async request<T>(endpoint: string, init: RequestInit = {}) {
    const res = await fetch(SmmsPhotoStorageGateway.BASE_URL + endpoint, {
      ...init,
      headers: {
        ...init.headers,
        Authorization: Bun.env.SMMS_API_KEY,
      },
    });

    const json = (await res.json()) as { message: string; data: T };

    if (!res.ok) {
      throw new HTTPException(res.status as StatusCode, {
        message: `SM.MS endpoint "${endpoint}" responded with error: ${json.message}`,
      });
    }

    return json.data;
  }
}
