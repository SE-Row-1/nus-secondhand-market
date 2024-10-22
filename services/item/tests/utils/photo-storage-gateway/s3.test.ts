import { S3PhotoStorageGateway } from "@/utils/photo-storage-gateway/s3";
import { S3Client } from "@aws-sdk/client-s3";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";

const mySend = mock();

beforeAll(() => {
  S3Client.prototype.send = mySend;
});

afterAll(() => {
  mock.restore();
});

it("saves and removes photo", async () => {
  const gateway = new S3PhotoStorageGateway();
  const photo = new File(["test"], "test.png") as unknown as File;

  const photoUrl = await gateway.save(photo);

  expect(photoUrl).toMatch(
    new RegExp(
      `^https://${Bun.env.S3_BUCKET_NAME}.s3.${Bun.env.AWS_REGION}.amazonaws.com/item-photos/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.png$`,
    ),
  );
  expect(mySend).toHaveBeenLastCalledWith(
    expect.objectContaining({
      input: {
        Bucket: Bun.env.S3_BUCKET_NAME,
        Key: expect.stringMatching(
          /^item-photos\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.png$/,
        ),
        Body: expect.any(Uint8Array),
      },
    }),
  );

  await gateway.remove(photoUrl);

  expect(mySend).toHaveBeenLastCalledWith(
    expect.objectContaining({
      input: {
        Bucket: Bun.env.S3_BUCKET_NAME,
        Key: expect.stringMatching(
          /^item-photos\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.png$/,
        ),
      },
    }),
  );
});
