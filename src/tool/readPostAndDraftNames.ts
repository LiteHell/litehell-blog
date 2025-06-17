import { readdir } from "fs/promises";
import path from "path";

export default async function readPostAndDraftNames() {
  const drafts = await readdir("drafts").then(async (dirEntries) => {
    let promises = [];
    for (const dirEntry of dirEntries) {
      promises.push(
        readdir(path.join("drafts", dirEntry)).then((subEntries) => {
          if (subEntries.some((i) => i.endsWith(".md"))) return dirEntry;
          else return null;
        }).catch(() => null)
      );
    }

    return (await Promise.all(promises)).filter((i) => i !== null) as string[];
  });

  const posts = await readdir("posts").then(async (dirEntries) => {
    let promises = [];
    for (const dirEntry of dirEntries) {
      promises.push(
        readdir(path.join("posts", dirEntry)).then((subEntries) => {
          if (subEntries.some((i) => i.endsWith(".md"))) return dirEntry;
          else return null;
        }).catch(() => null)
      );
    }

    return (await Promise.all(promises)).filter((i) => i !== null) as string[];
  });

  return { drafts, posts };
}
