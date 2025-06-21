import minfiyHtml from "@minify-html/node";
import mustache from "mustache";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import getFirstImageFromHtml from "../utils/getFirstImageFromHtml";
import BlogPage, { BlogPageProp } from "./pages";
import template from "./template.ejs";

export type HTMLHeadTemplateData = {
  canonicalUrl: string;
  og_title: string;
  og_description: string;
  og_type: string;
  canonicalImage: string;
  title: string;
};

const gravatar = "https://gravatar.com/avatar/837266b567b50fd59e72428220bf69b1";
const defaultHeadTemplateData: HTMLHeadTemplateData = {
  canonicalImage: gravatar,
  canonicalUrl: "https://blog.litehell.info",
  og_type: "blog",
  og_title: "LiteHell의 블로그",
  title: "LtieHell의 블로그",
  og_description: "LiteHell의 개인블로그",
};

function getHtmlHeadData(data: BlogPageProp): Partial<HTMLHeadTemplateData> {
  switch (data.pageName) {
    case "all_posts":
      return data.navigation.current === 1
        ? {
            title: "LiteHell의 블로그",
            canonicalUrl: "https://blog.litehell.info",
          }
        : {
            title: `LiteHell의 블로그 - ${data.navigation.current}번째 페이지`,
            canonicalUrl: `https://blog.litehell.info/page/${data.navigation.current}`,
          };

    case "tags":
      return {
        og_title: "LiteHell의 블로그 - 태그 목록",
        title: "LiteHell의 블로그 - 태그 목록",
        canonicalUrl: "https://blog.litehell.info/tags",
      };
    case "categories":
      return {
        og_title: "LiteHell의 블로그 - 카테고리 목록",
        title: "LiteHell의 블로그 - 카테고리 목록",
        canonicalUrl: "https://blog.litehell.info/tags",
      };
    case "tagged_posts":
      return {
        title: `LiteHell의 블로그 - ${data.tag} 태그`,
        og_title: `LiteHell의 블로그 - ${data.tag} 태그`,
        canonicalUrl:
          data.navigation.current === 1
            ? `https://blog.litehell.info/tag/${data.tag}`
            : `https://blog.litehell.info/tag/${data.tag}/page/${data.navigation.current}`,
      };
    case "categoried_posts":
      return {
        title: `LiteHell의 블로그 - ${data.category} 카테고리`,
        og_title: `LiteHell의 블로그 - ${data.category} 카테고리`,
        canonicalUrl:
          data.navigation.current === 1
            ? `https://blog.litehell.info/category/${data.category}`
            : `https://blog.litehell.info/category/${data.category}/page/${data.navigation.current}`,
      };
    case "post":
      return {
        title: `LiteHell의 블로그 - ${data.post.current.content.metadata.title}`,
        og_title: data.post.current.content.metadata.title,
        og_description:
          data.post.current.content.metadata.subtitle ??
          "LiteHell의 블로그 글입니다.",
        canonicalImage:
          getFirstImageFromHtml(data.post.current.content.parsed) ?? gravatar,
        canonicalUrl: `https://blog.litehell.info/post/${encodeURIComponent(data.post.current.name)}`,
      };
    case "license":
      return {
        title: "LiteHell의 블로그 - 라이센스",
        og_title: "LiteHell의 블로그 - 라이센스",
        canonicalUrl: "https://blog.litehell.info/license",
      };
  }
}

export default async function renderBlogPage(data: BlogPageProp) {
  const body = renderToStaticMarkup(<BlogPage {...data} />);
  return minfiyHtml
    .minify(
      Buffer.from(
        mustache.render(template, {
          ...defaultHeadTemplateData,
          ...getHtmlHeadData(data),
          ...data,
          body,
        }),
      ),
      {
        minify_css: true,
        minify_js: true,
      },
    )
    .toString("utf-8");
}
