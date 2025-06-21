import * as cheerio from "cheerio";

export default function (
  html: string,
  baseUrl = "https://blog.litehell.info",
): string | null {
  const $ = cheerio.load(html);

  const imgs = $("img");
  if (imgs.length === 0) return null;

  const url = new URL(imgs.eq(0).attr("src")!, baseUrl);
  return url.href;
}
