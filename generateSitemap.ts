import { Feed } from 'feed';
import fs from 'fs/promises';
import path from 'path';
import Blog from './modules/blog';
import getFirstImageFromHtml from './modules/getFirstImageFromHtml';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { createWriteStream } from 'fs';

const func = async () => {
  // Get article list
  const blog = new Blog();
  const articles = await blog.getArticleList();

  // Add articles into sitemap links
  const links = [];
  for (const article of articles) {
    const content = (await blog.readArticle(article.name)).rendered;
    links.push({
        url: `https://blog.litehell.info/post/${encodeURIComponent(
            article.name
          )}`
    });
  }
  // Create a stream to write to
  const stream = new SitemapStream( { hostname: 'https://blog.litehell.info' } )

  // Return a promise that resolves with your XML string
  const file = createWriteStream(path.join(path.resolve(), 'public/sitemap.xml'), {encoding: 'utf8'});
  await new Promise<void>((resolve, reject) => {
        const pipe = Readable.from(links).pipe(stream).pipe(file);
        pipe.on('finish', () => {
            pipe.close();
            resolve();
        }).on('error', (err) => {
            reject(err);
        })
    }
  );
};

func()
  .then(() => {
    console.log('Genearated successfully!');
  })
  .catch((err) => {
    console.error('Error while generating sitemap!');
    console.error(err);
  });
