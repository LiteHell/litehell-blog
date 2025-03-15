import { readdir, lstat } from "fs/promises";
import path from "path";

async function scanDirectoryForArticles(dir: string) {
  const dirEntries = await readdir(dir, { encoding: "utf8" });
  const subDirectories = (
    await Promise.all(
      dirEntries.map(async (entryName) => ({
        isDirectory: (await lstat(path.join(dir, entryName))).isDirectory(),
        name: entryName,
      })),
    )
  )
    .filter((i) => i.isDirectory)
    .map((i) => i.name);

  const subDirectoriesWithMarkdownFile = (
    await Promise.all(
      subDirectories.map(async (articleName) => {
        const articleDir = path.join(dir, articleName);
        const files = await readdir(articleDir);
        const stats = await Promise.all(
          files
            .map((j) => path.join(articleDir, j))
            .map(async (i) => ({ stats: await lstat(i), name: i })),
        );
        if (stats.some((i) => i.stats.isFile() && i.name.endsWith(".md")))
          return articleName;
        else return null;
      }),
    )
  ).filter((i) => i !== null);

  return subDirectoriesWithMarkdownFile;
}

export default function getArticleNames(type: "published" | "drafts") {
  return scanDirectoryForArticles(
    type === "published" ? "./posts" : "./drafts",
  );
}
