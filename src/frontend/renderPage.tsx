import minfiyHtml from "@minify-html/node";
import mustache from "mustache";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import getFirstImageFromHtml from "../utils/getFirstImageFromHtml";
import BlogPage, { BlogPageProp } from "./pages";
import template from "./template.ejs";
import createNodeFormatMessage, {
  NodeFormatMessageFunction,
} from "./i18n/createNodeFormatMessage";
import getDefaultLang from "./i18n/getDefaultLang";
import getLangData from "./i18n/getLangData";
import getSupportedLangs from "./i18n/getSupportedLangs";

export type HTMLHeadTemplateData = {
  canonicalUrl: string;
  og_title: string;
  og_description: string;
  og_type: string;
  canonicalImage: string;
  title: string;
};

const gravatar = "https://gravatar.com/avatar/837266b567b50fd59e72428220bf69b1";

function createDefaultTemplateData(
  formatMessage: NodeFormatMessageFunction,
  lang = "ko",
) {
  return {
    canonicalImage: gravatar,
    canonicalUrl: `https://blog${lang == "ko" ? "" : `-${lang}`}.litehell.info`,
    og_type: "blog",
    og_title: formatMessage("head.og.title"),
    title: formatMessage("head.og.title"),
    og_description: formatMessage("head.og.description"),
  };
}

function getHtmlHeadData(
  data: BlogPageProp,
  formatMessage: NodeFormatMessageFunction,
  lang = "ko",
): Partial<HTMLHeadTemplateData> {
  const blogUrl = `https://blog${lang == "ko" ? "" : `-${lang}`}.litehell.info`;
  switch (data.pageName) {
    case "all_posts":
      return data.navigation.current === 1
        ? {
            title: formatMessage("head.allPost.title"),
            canonicalUrl: blogUrl,
          }
        : {
            title: formatMessage("head.allPost.paginating.title", {
              page: data.navigation.current,
            }),
            canonicalUrl: `${blogUrl}/page/${data.navigation.current}`,
          };

    case "tags":
      return {
        og_title: formatMessage("head.tags.title"),
        title: formatMessage("head.tags.title"),
        canonicalUrl: blogUrl + "/tags",
      };
    case "categories":
      return {
        og_title: formatMessage("head.categories.title"),
        title: formatMessage("head.categories.title"),
        canonicalUrl: blogUrl + "/tags",
      };
    case "tagged_posts":
      return {
        title: formatMessage("head.taggedPosts.title", { tag: data.tag }),
        og_title: formatMessage("head.taggedPosts.title", { tag: data.tag }),
        canonicalUrl:
          data.navigation.current === 1
            ? `${blogUrl}/tag/${data.tag}`
            : `${blogUrl}/tag/${data.tag}/page/${data.navigation.current}`,
      };
    case "categoried_posts":
      return {
        title: formatMessage("head.categoriedPosts.title", {
          category: data.category,
        }),
        og_title: formatMessage("head.categoriedPosts.title", {
          category: data.category,
        }),
        canonicalUrl:
          data.navigation.current === 1
            ? `${blogUrl}/category/${data.category}`
            : `${blogUrl}/category/${data.category}/page/${data.navigation.current}`,
      };
    case "post":
      return {
        title: formatMessage("head.post.title", {
          title: data.post.current.content.metadata.title,
        }),
        og_title: data.post.current.content.metadata.title,
        og_description:
          data.post.current.content.metadata.subtitle ??
          formatMessage("head.post.description"),
        canonicalImage:
          getFirstImageFromHtml(data.post.current.content.parsed) ?? gravatar,
        canonicalUrl: `${blogUrl}/post/${encodeURIComponent(data.post.current.name)}`,
      };
    case "license":
      return {
        title: formatMessage("head.license.title"),
        og_title: formatMessage("head.license.title"),
        canonicalUrl: blogUrl + "/license",
      };
  }
}

export default async function renderBlogPage(data: BlogPageProp) {
  const BLOG_LANG = process.env.BLOG_LANG ?? getDefaultLang();
  const formatMessage = await createNodeFormatMessage(BLOG_LANG);
  const langData = await getLangData(BLOG_LANG);
  const defaultHeadTemplateData = createDefaultTemplateData(
    formatMessage,
    BLOG_LANG,
  );

  const body = renderToStaticMarkup(
    <BlogPage {...data} lang={BLOG_LANG} langData={langData} />,
  );

  const htmlHeadData = getHtmlHeadData(data, formatMessage, BLOG_LANG);

  const langAlternativesMeta = getSupportedLangs()
    .map(
      lang =>
        `<link rel="alternate" hreflang="${lang}" href="${htmlHeadData.canonicalUrl?.replace(/^https:\/\/blog(.+?)\.litehell\.info/, lang === "ko" ? "https://blog.litehell.info" : "https://blog-en.litehell.info")}" />`,
    )
    .join("\n");

  return minfiyHtml
    .minify(
      Buffer.from(
        mustache.render(template, {
          ...defaultHeadTemplateData,
          ...htmlHeadData,
          ...data,
          body,
          urlLangSuffix: BLOG_LANG == "ko" ? "" : `-${BLOG_LANG}`,
          langAlternativesMeta,
          lang: BLOG_LANG,
        }),
      ),
      {
        minify_css: true,
        minify_js: true,
      },
    )
    .toString("utf-8");
}
