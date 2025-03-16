import minfiyHtml from "@minify-html/node";
import mustache from "mustache";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import BlogPage, { BlogPageProp } from "./pages";
import template from "./template.ejs";

export type HTMLHeadTemplateData = {
  canonicalUrl: string;
  og_title: string;
  og_description: string;
  og_type: string;
  canonicalImage: string;
};

const defaultHeadTemplateData: HTMLHeadTemplateData = {
  canonicalImage:
    "https://gravatar.com/avatar/837266b567b50fd59e72428220bf69b1",
  canonicalUrl: "https://blog.litehell.info",
  og_type: "blog",
  og_title: "LiteHell의 블로그",
  og_description: "LiteHell의 개인블로그",
};

export default async function renderBlogPage(
  data: BlogPageProp & Partial<HTMLHeadTemplateData>
) {
  const body = renderToStaticMarkup(<BlogPage {...data} />);
  return minfiyHtml
    .minify(
      Buffer.from(
        mustache.render(template, {
          ...defaultHeadTemplateData,
          ...data,
          body,
        })
      ),
      {
        minify_css: true,
        minify_js: true,
      }
    )
    .toString("utf-8");
}
