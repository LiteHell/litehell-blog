import fsExtra from "fs-extra";
import { mkdir } from "fs/promises";
import path from "path";
import getPosts from "../blog/getPosts";
import createRouteRenderer from "../render/renderRoute";
import getRoutes from "../routes";
import generateFeeds from "./feed";

export default async function build(outDir: string, { quite = false } = {}) {
  const posts = (
    await getPosts({
      includeDrafts: false,
      preferredLang: process.env.BLOG_LANG!,
    })
  ).sort(
    (a, b) =>
      Date.parse(b.content.metadata.date ?? "") -
      Date.parse(a.content.metadata.date ?? ""),
  );
  const routes = await getRoutes(posts);

  await mkdir(outDir, { recursive: true });
  await fsExtra.emptyDir(outDir);
  const renderRoute = createRouteRenderer(posts);

  await fsExtra.copy("./public", outDir);
  await fsExtra.copy("./posts", path.join(outDir, "post"));
  await fsExtra.copy("./drafts", path.join(outDir, "post"));

  if (!quite)
    console.log(
      "Routes to be rendered: \n" + routes.map(i => `   ${i}`).join("\n"),
    );

  await Promise.all(
    routes.map(async route => {
      const rendered = await renderRoute(route);
      const fileName = path.join(
        outDir,
        decodeURIComponent(route),
        "index.html",
      );
      const dirName = path.dirname(fileName);

      await mkdir(dirName, { recursive: true });
      await fsExtra.writeFile(fileName, rendered);
    }),
  );

  if (!quite) console.log("Generating feeds");
  await generateFeeds(outDir, posts);
}
