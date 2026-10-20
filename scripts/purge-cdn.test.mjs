import assert from "node:assert/strict";
import { test } from "node:test";
import { purgePaths, tagOf } from "./purge-cdn.mjs";

test("a prerelease purges its tag and a normal release purges the bare and latest URLs", () => {
  assert.equal(tagOf({ mode: "pre", tag: "alpha" }), "alpha");
  assert.equal(tagOf({ mode: "exit", tag: "alpha" }), "latest");
  assert.equal(tagOf(undefined), "latest");
  assert.deepEqual(purgePaths("@realmorg/realm", ["dist/realm.js"], "alpha"), [
    "/npm/@realmorg/realm@alpha/dist/realm.js",
  ]);
  assert.deepEqual(purgePaths("@realmorg/realm", ["dist/realm.js"], "latest"), [
    "/npm/@realmorg/realm/dist/realm.js",
    "/npm/@realmorg/realm@latest/dist/realm.js",
  ]);
});

test("Unicons icon chunks are not purged", () => {
  assert.deepEqual(
    purgePaths("@realmorg/unicons", ["dist/unicons.html", "dist/icons/lu/0.js"], "alpha"),
    ["/npm/@realmorg/unicons@alpha/dist/unicons.html"],
  );
});
