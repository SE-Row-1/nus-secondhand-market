import { LocalPhotoManager } from "@/utils/photo-manager/local-photo-manager";
import { expect, it } from "bun:test";
import { existsSync } from "fs";
import { readFile } from "fs/promises";

it("saves and removes a local file", async () => {
  const photoManager = new LocalPhotoManager();

  const file = new File(
    [new Uint8Array(await readFile("package.json"))],
    "test-local.json",
  );

  // @ts-expect-error This works.
  const fileUrl = await photoManager.save(file);

  expect(fileUrl).toMatch("uploads/test-local.json");
  expect(existsSync(fileUrl)).toBeTrue();

  await photoManager.remove(fileUrl);

  expect(existsSync(fileUrl)).toBeFalse();
});
