import { Feed } from "feed";
import fs from "fs/promises";
import path from "path";
import { BlogPost } from "../blog/getPosts";
import getFirstImageFromHtml from "../utils/getFirstImageFromHtml";

export default async function generateFeeds(outDir: string, posts: BlogPost[]) {
  const somePosts = posts.slice(0, 10);

  // Create feed
  const feed = new Feed({
    title: "LiteHell의 블로그",
    description:
      "LiteHell의 개인블로그입니다. 프로그래밍이나 제 개인적인 일상에 관련된 글들이 올라옵니다.",
    id: "https://blog.litehell.info",
    link: "https://blog.litehell.info",
    language: "ko-KR",
    image: "https://gravatar.com/avatar/837266b567b50fd59e72428220bf69b1",
    copyright: "All rights reserved 2020 ~ 2025 © Yeonjin Shin",
    updated: new Date(
      posts[0].content.metadata.last_modified_at ??
        posts[0].content.metadata.date ??
        "",
    ),
    feedLinks: {
      json: "https://blog.litehell.info/feed/json",
      atom: "https://blog.litehell.info/feed/atom",
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
      title: post.content.metadata.title || "무제",
      id: post.name,
      link: `https://blog.litehell.info/post/${encodeURIComponent(post.name)}`,
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
