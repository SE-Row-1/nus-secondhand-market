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

  private static BASE_URL = `https://${Bun.env.S3_BUCKET_NAME}.s3.${Bun.env.S3_REGION}.amazonaws.com`;

  private static UPLOAD_DIR = "item-photos";

  public async save(photo: File) {
    const [, extension] = photo.name.split(".");

    const key = `${S3PhotoManager.UPLOAD_DIR}/${crypto.randomUUID()}.${extension}`;

    await S3PhotoManager.client.send(
      new PutObjectCommand({
        Bucket: Bun.env.S3_BUCKET_NAME,
        Key: key,
        Body: new Uint8Array(await photo.arrayBuffer()),
      }),
    );

    return `${S3PhotoManager.BASE_URL}/${key}`;
  }

  public async remove(photoUrl: string): Promise<void> {
    await S3PhotoManager.client.send(
      new DeleteObjectCommand({
        Bucket: Bun.env.S3_BUCKET_NAME,
        Key: photoUrl.replace(`${S3PhotoManager.BASE_URL}/`, ""),
      }),
    );
  }
}
