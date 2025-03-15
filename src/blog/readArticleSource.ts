import { lstat, readdir, readFile } from "fs/promises";
import path from "path";

export default async function readArticleSource({
  name,
  draft,
}: {
  name: string;
  draft: boolean;
}) {
  const dir = `./${draft ? "drafts" : "posts"}/${name}`;
  const entries = await readdir(dir);
  for (const entryName of entries) {
    const entryPath = path.join(dir, entryName);
    const stat = lstat(entryPath);
    if ((await stat).isFile() && entryName.endsWith(".md")) {
      return await readFile(entryPath, { encoding: "utf8" });
    }
  }

  throw new Error("article not found");
}
