import { createPhotoStorageGateway } from "@/utils/photo-storage-gateway";
import { LocalPhotoStorageGateway } from "@/utils/photo-storage-gateway/local";
import { S3PhotoStorageGateway } from "@/utils/photo-storage-gateway/s3";
import { SmmsPhotoStorageGateway } from "@/utils/photo-storage-gateway/smms";
import { afterAll, afterEach, expect, it } from "bun:test";
import { rm } from "fs/promises";

afterEach(() => {
  Bun.env.NODE_ENV = "test";
});

afterAll(async () => {
  await rm("uploads", { force: true, recursive: true });
});

it("returns local photo storage gateway in test environment", async () => {
  Bun.env.NODE_ENV = "test";

  const gateway = createPhotoStorageGateway();

  expect(gateway).toBeInstanceOf(LocalPhotoStorageGateway);
});

it("returns SM.MS photo storage gateway in development environment", async () => {
  Bun.env.NODE_ENV = "development";

  const gateway = createPhotoStorageGateway();

  expect(gateway).toBeInstanceOf(SmmsPhotoStorageGateway);
});

it("returns S3 photo storage gateway in production environment", async () => {
  Bun.env.NODE_ENV = "production";

  const gateway = createPhotoStorageGateway();

  expect(gateway).toBeInstanceOf(S3PhotoStorageGateway);
});
