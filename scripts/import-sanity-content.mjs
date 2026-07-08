import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const env = {
  ...readEnvFile(".env"),
  ...readEnvFile(".env.local"),
  ...process.env,
};

const dataset =
  env.SANITY_STUDIO_DATASET || env.PUBLIC_SANITY_DATASET || "production";
const seedFile = resolve("sanity/initial-content.ndjson");
const sanityCommand = process.platform === "win32" ? "sanity.cmd" : "sanity";

if (!existsSync(seedFile)) {
  console.error(`Sanity seed file not found: ${seedFile}`);
  process.exit(1);
}

console.log(`Importing Sanity seed content into dataset "${dataset}".`);
console.log("Set SANITY_STUDIO_DATASET or PUBLIC_SANITY_DATASET to target another dataset.");

const result = spawnSync(
  sanityCommand,
  ["datasets", "import", seedFile, dataset, "--replace"],
  { stdio: "inherit" },
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);

function readEnvFile(path) {
  if (!existsSync(path)) {
    return {};
  }

  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const separatorIndex = line.indexOf("=");
        if (separatorIndex === -1) {
          return null;
        }

        const key = line.slice(0, separatorIndex).trim();
        const value = line
          .slice(separatorIndex + 1)
          .trim()
          .replace(/^['"]|['"]$/g, "");

        return [key, value];
      })
      .filter(Boolean),
  );
}
