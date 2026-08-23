import { describe, it, expect } from "vitest";
import { createApp } from "../app";
import { fakeDeps, FakeState } from "../testing/fakes";

const H = { "x-user-id": "u1" };

describe("/v1/uploads", () => {
  it("401s without auth", async () => {
    const res = await createApp(fakeDeps()).request("/v1/uploads?filename=test.png", {
      method: "POST",
      body: "binarydata",
    });
    expect(res.status).toBe(401);
  });

  it("400s on missing filename", async () => {
    const res = await createApp(fakeDeps()).request("/v1/uploads", {
      method: "POST",
      headers: H,
      body: "binarydata",
    });
    expect(res.status).toBe(400);
  });

  it("400s on empty file body", async () => {
    const res = await createApp(fakeDeps()).request("/v1/uploads?filename=test.png", {
      method: "POST",
      headers: H,
    });
    expect(res.status).toBe(400);
  });

  it("200s and returns blob url on valid upload", async () => {
    const deps = fakeDeps();
    const res = await createApp(deps).request("/v1/uploads?filename=my-photo.jpg", {
      method: "POST",
      headers: H,
      body: "fakeimagebinarycontent",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toBe("https://blob.test/my-photo.jpg");
    const state = (deps as any)._state as FakeState;
    expect(state.uploadedBlobs.has("my-photo.jpg")).toBe(true);
  });
});
