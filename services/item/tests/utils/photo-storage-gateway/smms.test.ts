import { SmmsPhotoStorageGateway } from "@/utils/photo-storage-gateway/smms";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { HTTPException } from "hono/http-exception";

const mockFetch = mock();

beforeAll(() => {
  global.fetch = mockFetch;
});

afterAll(() => {
  mock.restore();
});

function mockSmmsResponse(status: number, json: unknown) {
  mockFetch.mockImplementationOnce(
    async () => new Response(JSON.stringify(json), { status }),
  );
}

it("saves and removes photo", async () => {
  const gateway = new SmmsPhotoStorageGateway();
  const photo = new File(["test"], "test.png") as unknown as File;
  mockSmmsResponse(200, {
    data: { hash: "abc", url: "https://sm.ms/test.png" },
  });

  const photoUrl = await gateway.save(photo);

  expect(photoUrl).toEqual("https://sm.ms/test.png");
  expect(mockFetch).toHaveBeenLastCalledWith("https://sm.ms/api/v2/upload", {
    method: "POST",
    body: expect.any(FormData),
    headers: {
      Authorization: Bun.env.SMMS_API_KEY,
    },
  });

  mockSmmsResponse(200, {});

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

it("throws HTTPException if SM.MS upload fails", async () => {
  const gateway = new SmmsPhotoStorageGateway();
  const photo = new File(["test"], "test.png") as unknown as File;
  mockSmmsResponse(400, {});

  const fn = async () => await gateway.save(photo);

  expect(fn).toThrow(HTTPException);
});

it("throws HTTPException if SM.MS delete fails", async () => {
  const gateway = new SmmsPhotoStorageGateway();
  const photo = new File(["test"], "test.png") as unknown as File;
  mockSmmsResponse(200, {
    data: { hash: "abc", url: "https://sm.ms/test.png" },
  });
  const photoUrl = await gateway.save(photo);
  mockSmmsResponse(400, {});

  const fn = async () => await gateway.remove(photoUrl);

  expect(fn).toThrow(HTTPException);
});
