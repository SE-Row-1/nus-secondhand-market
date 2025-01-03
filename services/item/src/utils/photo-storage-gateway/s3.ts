import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { extname } from "path";
import type { PhotoStorageGateway } from "./types";

/**
 * Store photos in AWS S3.
 */
export class S3PhotoStorageGateway implements PhotoStorageGateway {
  private static client = new S3Client({
    credentials: {
      accessKeyId: Bun.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: Bun.env.AWS_SECRET_ACCESS_KEY,
    },
    region: Bun.env.AWS_REGION,
  });

  private static BASE_URL = `https://${Bun.env.S3_BUCKET_NAME}.s3.${Bun.env.AWS_REGION}.amazonaws.com`;

  private static UPLOADS_DIR = "item-photos";

  public async save(photo: File) {
    const key = `${S3PhotoStorageGateway.UPLOADS_DIR}/${crypto.randomUUID()}${extname(photo.name)}`;

    await S3PhotoStorageGateway.client.send(
      new PutObjectCommand({
        Bucket: Bun.env.S3_BUCKET_NAME,
        Key: key,
        Body: new Uint8Array(await photo.arrayBuffer()),
      }),
    );

    return `${S3PhotoStorageGateway.BASE_URL}/${key}`;
  }

  public async remove(photoUrl: string) {
    await S3PhotoStorageGateway.client.send(
      new DeleteObjectCommand({
        Bucket: Bun.env.S3_BUCKET_NAME,
        Key: photoUrl.replace(`${S3PhotoStorageGateway.BASE_URL}/`, ""),
      }),
    );
  }
}
