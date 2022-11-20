import fs from 'fs/promises';
import path from 'path';
import Blog from './modules/blog.js';
import { Feed } from 'feed';
import getFirstImageFromHtml from './modules/getFirstImageFromHtml.js';

const func = async () => {
  // Get article list
  const blog = new Blog();
  const articles = await blog.getArticleList();

  // Only ~10 items in feed
  if (articles.length > 10) articles = articles.slice(0, 10);

  // Create feed
  const feed = new Feed({
    title: 'LiteHell의 블로그',
    description:
      'LiteHell의 개인블로그입니다. 프로그래밍이나 제 개인적인 일상에 관련된 글들이 올라옵니다.',
    id: 'https://blog.litehell.info',
    link: 'https://blog.litehell.info',
    language: 'ko-KR',
    image: 'https://gravatar.com/avatar/837266b567b50fd59e72428220bf69b1',
    copyright: 'All rights reserved 2020 © Yeonjin Shin',
    updated: new Date(articles[0].metadata.date),
    feedLinks: {
      json: 'https://blog.litehell.info/feed/json',
      atom: 'https://blog.litehell.info/feed/atom',
    },
    author: {
      name: 'Yeonjin Shin',
      email: 'litehell@litehell.info',
      link: 'https://litehell.info',
    },
  });

  // Add articles into feed
  for (const article of articles) {
    const content = (await blog.readArticle(article.name)).rendered;
    feed.addItem({
      title: article.metadata.title || '무제',
      id: article.name,
      link: `https://blog.litehell.info/post/${encodeURIComponent(
        article.name
      )}`,
      description: article.subtitle || '',
      content,
      date: new Date(article.metadata.date),
      image:
        getFirstImageFromHtml(content) ||
        'https://gravatar.com/avatar/837266b567b50fd59e72428220bf69b1',
    });
  }

  // Create directory if not found
  await fs.mkdir(path.join(path.resolve(), 'public/feed'), { recursive: true });

  // Generate feeds
  await fs.writeFile(path.join(path.resolve(), 'public/feed/rss'), feed.rss2());
  await fs.writeFile(
    path.join(path.resolve(), 'public/feed/atom'),
    feed.atom1()
  );
  await fs.writeFile(
    path.join(path.resolve(), 'public/feed/json'),
    feed.json1()
  );
};

func()
  .then(() => {
    console.log('Genearated successfully!');
  })
  .catch((err) => {
    console.error('Error while generating feeds!');
    console.error(err);
  });
