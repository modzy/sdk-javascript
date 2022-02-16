/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fs } from "fs";

// This type is any because the browser version takes a file and this confuses the
// type-checking in ModzyClient because it doesn't know this function is if overridden
// by the browser version
export async function toBase64({ path, mimeType }: any) {
  const raw = await fs.readFile(path, { encoding: "base64" });
  return "data:" + mimeType + ";base64," + raw;
}
