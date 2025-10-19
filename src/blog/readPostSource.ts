import { lstat, readdir, readFile } from "fs/promises";
import path from "path";

export type PostSource = {
  lang: string;
  rawSource: string;
};

export default async function readPostSource({
  name,
  draft,
}: {
  name: string;
  draft: boolean;
  lang?: string;
}): Promise<PostSource[]> {
  const dir = `./${draft ? "drafts" : "posts"}/${name}`;
  const entries = await readdir(dir);
  let sources = (
    await Promise.all(
      entries.map(async entryName => {
        const entryPath = path.join(dir, entryName);
        const stat = lstat(entryPath);
        if ((await stat).isFile() && entryName.endsWith(".md")) {
          return {
            lang: entryName.substring(0, entryName.length - 3),
            rawSource: await readFile(entryPath, { encoding: "utf8" }),
          };
        } else {
          return null;
        }
      }),
    )
  ).filter(i => i !== null);

  if (sources.length === 0) throw new Error("post not found");
  else return sources;
}
