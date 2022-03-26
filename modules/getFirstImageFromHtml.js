import cheerio from 'cheerio';

export default function (html, baseUrl = 'https://blog.litehell.info') {
  const $ = cheerio.load(html);

  const imgs = $('img');
  if (imgs.length === 0) return null;

  const url = new URL(imgs.eq(0).attr('src'), baseUrl);
  return url.href;
}
