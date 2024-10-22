import { SmmsPhotoStorageGateway } from "@/utils/photo-storage-gateway/smms";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { HTTPException } from "hono/http-exception";

const myFetch = mock();

beforeAll(() => {
  global.fetch = myFetch;
});

afterAll(() => {
  mock.restore();
});

it("saves and removes photo", async () => {
  const gateway = new SmmsPhotoStorageGateway();
  const photo = new File(["test"], "test.png") as unknown as File;
  myFetch.mockImplementationOnce(
    async () =>
      new Response(
        JSON.stringify({
          data: { hash: "abc", url: "https://sm.ms/test.png" },
        }),
        { status: 200 },
      ),
  );

  const photoUrl = await gateway.save(photo);

  expect(photoUrl).toEqual("https://sm.ms/test.png");
  expect(myFetch).toHaveBeenLastCalledWith("https://sm.ms/api/v2/upload", {
    method: "POST",
    body: expect.any(FormData),
    headers: {
      Authorization: Bun.env.SMMS_API_KEY,
    },
  });

  myFetch.mockImplementationOnce(
    async () => new Response(null, { status: 200 }),
  );

  await gateway.remove(photoUrl);

  expect(myFetch).toHaveBeenLastCalledWith("https://sm.ms/api/v2/delete/abc", {
    method: "GET",
    headers: {
      Authorization: Bun.env.SMMS_API_KEY,
    },
  });
});

it("throws HTTPException if SM.MS upload fails", async () => {
  const gateway = new SmmsPhotoStorageGateway();
  const photo = new File(["test"], "test.png") as unknown as File;
  myFetch.mockImplementationOnce(
    async () => new Response(null, { status: 400 }),
  );

  const fn = async () => await gateway.save(photo);

  expect(fn).toThrow(
    new HTTPException(502, {
      message: 'Failed to upload photo "test.png" to SM.MS',
    }),
  );
});

it("throws HTTPException if SM.MS delete fails", async () => {
  const gateway = new SmmsPhotoStorageGateway();
  const photo = new File(["test"], "test.png") as unknown as File;
  myFetch.mockImplementationOnce(
    async () =>
      new Response(
        JSON.stringify({
          data: { hash: "abc", url: "https://sm.ms/test.png" },
        }),
        { status: 200 },
      ),
  );
  const photoUrl = await gateway.save(photo);
  myFetch.mockImplementationOnce(
    async () => new Response(null, { status: 400 }),
  );

  const fn = async () => await gateway.remove(photoUrl);

  expect(fn).toThrow(
    new HTTPException(502, {
      message: 'Failed to delete photo "https://sm.ms/test.png" from SM.MS',
    }),
  );
});
