import React from "react";
import AllArticles, { AllArticlesProp } from "./pages/allArticles";
import AllCategories, { AllCategoriesProp } from "./pages/allCategories";
import AllTags, { AllTagsProp } from "./pages/allTags";
import CategoriedArticles, {
  CategoriedArticlesProp,
} from "./pages/categoriedArticles";
import Post, { PostProp } from "./pages/post";
import TaggedArticles, { TaggedArticlesProp } from "./pages/taggedArticles";

type BlogPageType =
  | "all_articles"
  | "categoried_articles"
  | "tagged_articles"
  | "post"
  | "tags"
  | "categories";

type BlogPagePropWithProps<PN extends BlogPageType, T> = {
  pageName: PN;
} & T;

export type BlogPageProp = {
  pageName: BlogPageType;
} & (
  | BlogPagePropWithProps<"all_articles", AllArticlesProp>
  | BlogPagePropWithProps<"tags", AllTagsProp>
  | BlogPagePropWithProps<"categories", AllCategoriesProp>
  | BlogPagePropWithProps<"tagged_articles", TaggedArticlesProp>
  | BlogPagePropWithProps<"categoried_articles", CategoriedArticlesProp>
  | BlogPagePropWithProps<"post", PostProp>
);

export default function BlogPage(props: BlogPageProp) {
  switch (props.pageName) {
    case "all_articles":
      return <AllArticles {...props}></AllArticles>;
    case "tags":
      return <AllTags {...props} />;
    case "categories":
      return <AllCategories {...props} />;
    case "categoried_articles":
      return <CategoriedArticles {...props} />;
    case "tagged_articles":
      return <TaggedArticles {...props} />;
    case "post":
      return <Post {...props} />;
    default:
      throw new Error("undefined pageName");
  }
}
