import { LocalPhotoStorageGateway } from "@/utils/photo-storage-gateway/local";
import { expect, it } from "bun:test";
import { existsSync } from "fs";

it("saves and removes photo", async () => {
  const gateway = new LocalPhotoStorageGateway();
  const photo = new File(["test"], "test.png") as File;

  const photoUrl = await gateway.save(photo);

  expect(photoUrl).toMatch(
    /^uploads\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.png$/,
  );
  expect(existsSync(photoUrl)).toBeTrue();

  await gateway.remove(photoUrl);

  expect(existsSync(photoUrl)).toBeFalse();
});
