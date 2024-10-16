import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { extname } from "path";
import type { PhotoManager } from "./photo-manager-interface";

/**
 * Store photos in AWS S3.
 */
export class S3PhotoManager implements PhotoManager {
  private static client = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
  });

  private static BASE_URL = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;

  private static UPLOAD_DIR = "item-photos";

  public async save(photo: File) {
    const key = `${S3PhotoManager.UPLOAD_DIR}/${crypto.randomUUID()}${extname(photo.name)}`;

    await S3PhotoManager.client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: new Uint8Array(await photo.arrayBuffer()),
      }),
    );

    return `${S3PhotoManager.BASE_URL}/${key}`;
  }

  public async remove(photoUrl: string) {
    await S3PhotoManager.client.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: photoUrl.replace(`${S3PhotoManager.BASE_URL}/`, ""),
      }),
    );
  }
}
