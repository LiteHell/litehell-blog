import { lstat, readdir } from "fs/promises";
import path from "path";

async function scanDirectoryForPosts(dir: string) {
  const dirEntries = await readdir(dir, { encoding: "utf8" });
  const subDirectories = (
    await Promise.all(
      dirEntries.map(async entryName => ({
        isDirectory: (await lstat(path.join(dir, entryName))).isDirectory(),
        name: entryName,
      })),
    )
  )
    .filter(i => i.isDirectory)
    .map(i => i.name);

  const subDirectoriesWithMarkdownFile = (
    await Promise.all(
      subDirectories.map(async postName => {
        const postDir = path.join(dir, postName);
        const files = await readdir(postDir);
        const stats = await Promise.all(
          files
            .map(j => path.join(postDir, j))
            .map(async i => ({ stats: await lstat(i), name: i })),
        );
        if (stats.some(i => i.stats.isFile() && i.name.endsWith(".md")))
          return postName;
        else return null;
      }),
    )
  ).filter(i => i !== null);

  return subDirectoriesWithMarkdownFile;
}

export default function getPostNames(type: "published" | "drafts") {
  return scanDirectoryForPosts(type === "published" ? "./posts" : "./drafts");
}
