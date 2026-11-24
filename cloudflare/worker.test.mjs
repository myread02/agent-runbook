import assert from "node:assert/strict";
import { test } from "node:test";
import worker from "./worker.mjs";

const route = "https://stevwang.dev/init";
const entryURL = "https://raw.githubusercontent.com/stevwang-dev/agent-runbook/main/init.md";

test("serves the upstream Markdown directly for GET and HEAD", async (t) => {
  const markdown = "# Initialize the project\n";
  const upstream = t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, entryURL);
    assert.equal(options.redirect, "manual");
    return new Response(options.method === "HEAD" ? null : markdown);
  });

  const get = await worker.fetch(new Request(route));
  assert.equal(get.status, 200);
  assert.equal(get.headers.get("content-type"), "text/markdown; charset=utf-8");
  assert.equal(get.headers.get("location"), null);
  assert.equal(await get.text(), markdown);

  const head = await worker.fetch(new Request(route, { method: "HEAD" }));
  assert.equal(head.status, 200);
  assert.equal(head.headers.get("content-type"), get.headers.get("content-type"));
  assert.equal(await head.text(), "");
  assert.deepEqual(upstream.mock.calls.map(({ arguments: args }) => args[1].method), ["GET", "HEAD"]);
});

test("limits requests to the published path and read-only methods", async (t) => {
  const upstream = t.mock.method(globalThis, "fetch");
  assert.equal((await worker.fetch(new Request("https://stevwang.dev/"))).status, 404);
  const post = await worker.fetch(new Request(route, { method: "POST" }));
  assert.equal(post.status, 405);
  assert.equal(post.headers.get("allow"), "GET, HEAD");
  assert.equal(upstream.mock.callCount(), 0);
});

test("returns an uncached gateway error when the upstream fails", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("Not Found", { status: 404 }));
  const response = await worker.fetch(new Request(route));
  assert.equal(response.status, 502);
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("keeps upstream redirects away from clients", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.redirect("https://github.com/"));
  const response = await worker.fetch(new Request(route));
  assert.equal(response.status, 502);
  assert.equal(response.headers.get("location"), null);
});
