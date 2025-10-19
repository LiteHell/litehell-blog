import { Feed } from "feed";
import fs from "fs/promises";
import path from "path";
import { BlogPost } from "../blog/getPosts";
import getFirstImageFromHtml from "../utils/getFirstImageFromHtml";
import createNodeFormatMessage from "../frontend/i18n/createNodeFormatMessage";

export default async function generateFeeds(outDir: string, posts: BlogPost[]) {
  const lang = process.env.BLOG_LANG ?? "ko";
  const blogUrl = `https://blog${lang === "ko" ? "" : `-${lang}`}.litehell.info`;
  const formatMessage = await createNodeFormatMessage(lang);

  // Create feed
  const feed = new Feed({
    title: formatMessage("feed.title"),
    description: formatMessage("feed.description"),
    id: blogUrl,
    link: blogUrl,
    language: lang,
    image: "https://gravatar.com/avatar/837266b567b50fd59e72428220bf69b1",
    copyright: "All rights reserved 2020 ~ 2025 © Yeonjin Shin",
    updated: new Date(
      posts[0].content.metadata.last_modified_at ??
        posts[0].content.metadata.date ??
        "",
    ),
    feedLinks: {
      json: blogUrl + "/feed/json",
      atom: blogUrl + "/feed/atom",
    },
    author: {
      name: "Yeonjin Shin",
      email: "litehell@litehell.info",
      link: "https://litehell.info",
    },
  });

  // Add articles into feed
  for (const post of posts) {
    const content = post.content.parsed;
    feed.addItem({
      title: post.content.metadata.title || formatMessage("feed.untitled"),
      id: post.name,
      link: `${blogUrl}/post/${encodeURIComponent(post.name)}`,
      description: post.content.metadata.subtitle || "",
      content,
      date: new Date(post.content.metadata.date ?? ""),
      image:
        getFirstImageFromHtml(content) ||
        "https://gravatar.com/avatar/837266b567b50fd59e72428220bf69b1",
    });
  }

  // Create directory if not found
  await fs.mkdir(path.join(outDir, "/feed"), { recursive: true });

  // Generate feeds
  await fs.writeFile(path.join(outDir, "/feed/rss"), feed.rss2());
  await fs.writeFile(path.join(outDir, "/feed/atom"), feed.atom1());
  await fs.writeFile(path.join(outDir, "/feed/json"), feed.json1());
}
