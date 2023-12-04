import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

export default async (day) => {
  const url = `https://adventofcode.com/2023/day/${day}/input`;
  const currentDir = path.join(fileURLToPath(import.meta.url), "..");
  const cacheDir = path.join(currentDir, ".cache");

  const envFile = await fs.readFile(path.join(currentDir, ".env"), {
    encoding: "utf8",
  });
  const envVars = Object.fromEntries(
    envFile
      .split("\n")
      .filter((s) => s)
      .map((s) => [s.slice(0, s.indexOf("=")), s.slice(s.indexOf("=") + 1)]),
  );

  const filePath = path.join(cacheDir, `input-${day}.txt`);

  await fs.mkdir(cacheDir, { recursive: true });

  let fileText = await fs
    .readFile(filePath, { encoding: "utf8" })
    .catch(() => null);
  if (!fileText) {
    console.info("Fetching input from url");
    const response = await fetch(url, {
      headers: { Cookie: envVars.GITHUB_COOKIE },
    });
    if (!response.ok) {
      console.error("Failed fetch - response: ", response);
      throw new Error(`Failed to fetch url ${url}`);
    }
    fileText = await response.text();
    await fs.writeFile(filePath, fileText);
  }
  return fileText;
};
