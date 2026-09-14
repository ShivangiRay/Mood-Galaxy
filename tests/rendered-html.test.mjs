import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("build emits a standalone Mood Galaxy entry point", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(html, /<title>Mood Galaxy<\/title>/);
  assert.match(html, /id="root"/);
  assert.match(html, /assets\/index-/);
});

test("the app remains account-free and local-first", async () => {
  const [page, readme] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);
  assert.match(page, /Tend a Tiny Planet/);
  assert.match(page, /Star Loom/);
  assert.doesNotMatch(page, /sign.?in|oauth|auth/i);
  assert.match(readme, /No account, API key, backend, or authentication is required/);
});
