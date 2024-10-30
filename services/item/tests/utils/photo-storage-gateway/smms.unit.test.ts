import { SmmsPhotoStorageGateway } from "@/utils/photo-storage-gateway/smms";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { HTTPException } from "hono/http-exception";

const mockFetch = spyOn(global, "fetch");

afterEach(() => {
  mockFetch.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("saves and removes photo", async () => {
  const gateway = new SmmsPhotoStorageGateway();
  const photo = new File(["test"], "test.png") as unknown as File;
  mockFetch.mockResolvedValueOnce(
    new Response(
      JSON.stringify({
        data: { hash: "abc", url: "https://s2.loli.net/test.png" },
      }),
      { status: 200 },
    ),
  );

  const photoUrl = await gateway.save(photo);

  expect(photoUrl).toEqual("https://s2.loli.net/test.png");
  expect(mockFetch).toHaveBeenLastCalledWith("https://sm.ms/api/v2/upload", {
    method: "POST",
    body: expect.any(FormData),
    headers: {
      Authorization: Bun.env.SMMS_API_KEY,
    },
  });

  mockFetch.mockResolvedValueOnce(
    new Response(JSON.stringify({}), { status: 200 }),
  );

  await gateway.remove(photoUrl);

  expect(mockFetch).toHaveBeenLastCalledWith(
    "https://sm.ms/api/v2/delete/abc",
    {
      method: "GET",
      headers: {
        Authorization: Bun.env.SMMS_API_KEY,
      },
    },
  );
});

it("throws HTTPException with upstream status code if upload fails", async () => {
  const gateway = new SmmsPhotoStorageGateway();
  const photo = new File(["test"], "test.png") as unknown as File;
  mockFetch.mockResolvedValueOnce(
    new Response(JSON.stringify({}), { status: 400 }),
  );

  const promise = gateway.save(photo);

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 400);
});

it("throws HTTPException with upstream status code if deletion fails", async () => {
  const gateway = new SmmsPhotoStorageGateway();
  const photo = new File(["test"], "test.png") as unknown as File;
  mockFetch.mockResolvedValueOnce(
    new Response(
      JSON.stringify({
        data: { hash: "abc", url: "https://s2.loli.net/test.png" },
      }),
      { status: 200 },
    ),
  );
  const photoUrl = await gateway.save(photo);
  mockFetch.mockResolvedValueOnce(
    new Response(JSON.stringify({}), { status: 400 }),
  );

  const promise = gateway.remove(photoUrl);

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 400);
});
