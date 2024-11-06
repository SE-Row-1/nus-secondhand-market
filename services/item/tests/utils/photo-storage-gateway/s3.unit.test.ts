import { S3PhotoStorageGateway } from "@/utils/photo-storage-gateway/s3";
import { S3Client } from "@aws-sdk/client-s3";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";

const mockSend = spyOn(S3Client.prototype, "send");

afterEach(() => {
  mockSend.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("saves and removes photo", async () => {
  const gateway = new S3PhotoStorageGateway();
  const photo = new File(["test"], "test.png") as unknown as File;
  mockSend.mockImplementationOnce(async () => {});

  const photoUrl = await gateway.save(photo);

  expect(photoUrl).toMatch(
    new RegExp(
      `^https://${Bun.env.S3_BUCKET_NAME}.s3.${Bun.env.AWS_REGION}.amazonaws.com/item-photos/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.png$`,
    ),
  );
  expect(mockSend).toHaveBeenLastCalledWith(
    expect.objectContaining({
      input: {
        Bucket: Bun.env.S3_BUCKET_NAME,
        Key: expect.stringMatching(
          /^item-photos\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.png$/,
        ),
        Body: expect.any(Uint8Array),
      },
    }),
  );

  mockSend.mockImplementationOnce(async () => {});

  await gateway.remove(photoUrl);

  expect(mockSend).toHaveBeenLastCalledWith(
    expect.objectContaining({
      input: {
        Bucket: Bun.env.S3_BUCKET_NAME,
        Key: photoUrl.replace(
          `https://${Bun.env.S3_BUCKET_NAME}.s3.${Bun.env.AWS_REGION}.amazonaws.com/`,
          "",
        ),
      },
    }),
  );
});
