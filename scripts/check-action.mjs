#!/usr/bin/env node
import { readFile } from "node:fs/promises";

const bundle = await readFile(new URL("../dist/index.mjs", import.meta.url), "utf8");

assertIncludes(bundle, "@tiara-stack/vite-plus");
assertIncludes(bundle, "npm");
assertIncludes(bundle, "install");
assertIncludes(bundle, "--global");

for (const forbidden of [
  "https://viteplus.dev/install.sh",
  "https://viteplus.dev/install.ps1",
  "raw.githubusercontent.com/voidzero-dev/vite-plus/main/packages/cli/install.sh",
  "raw.githubusercontent.com/voidzero-dev/vite-plus/main/packages/cli/install.ps1",
]) {
  if (bundle.includes(forbidden)) {
    throw new Error(`Action bundle still references upstream installer: ${forbidden}`);
  }
}

console.log("Verified setup-vp action bundle installs @tiara-stack/vite-plus");

function assertIncludes(source, needle) {
  if (!source.includes(needle)) {
    throw new Error(`Expected action bundle to include ${JSON.stringify(needle)}`);
  }
}
