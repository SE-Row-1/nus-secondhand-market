import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import type { PhotoManager } from "./photo-manager-interface";

/**
 * Store photos in Amazon S3.
 */
export class S3PhotoManager implements PhotoManager {
  private static client = new S3Client({
    credentials: {
      accessKeyId: Bun.env.S3_ACCESS_KEY_ID,
      secretAccessKey: Bun.env.S3_SECRET_ACCESS_KEY,
    },
    region: Bun.env.S3_REGION,
  });

  private static baseUrl = `https://${Bun.env.S3_BUCKET_NAME}.s3.${Bun.env.S3_REGION}.amazonaws.com`;

  public async save(photo: File) {
    const [, extension] = photo.name.split(".");

    const key = `${crypto.randomUUID()}.${extension}`;

    await S3PhotoManager.client.send(
      new PutObjectCommand({
        Bucket: Bun.env.S3_BUCKET_NAME,
        Key: key,
        Body: new Uint8Array(await photo.arrayBuffer()),
      }),
    );

    return `${S3PhotoManager.baseUrl}/${key}`;
  }

  public async remove(photoUrl: string): Promise<void> {
    await S3PhotoManager.client.send(
      new DeleteObjectCommand({
        Bucket: Bun.env.S3_BUCKET_NAME,
        Key: photoUrl.replace(`${S3PhotoManager.baseUrl}/`, ""),
      }),
    );
  }
}
