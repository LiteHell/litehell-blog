import React from "react";
import AllCategories, { AllCategoriesProp } from "./pages/allCategories";
import AllPosts, { AllPostsProp } from "./pages/allPosts";
import AllTags, { AllTagsProp } from "./pages/allTags";
import CategoriedPosts, { CategoriedPostsProp } from "./pages/categoriedPosts";
import License from "./pages/license";
import Post, { PostProp } from "./pages/post";
import TaggedPosts, { TaggedPostsProp } from "./pages/taggedPosts";

type BlogPageType =
  | "all_posts"
  | "categoried_posts"
  | "tagged_posts"
  | "post"
  | "tags"
  | "categories"
  | "license";

type BlogPagePropWithProps<PN extends BlogPageType, T> = {
  pageName: PN;
} & T;

export type BlogPageProp = {
  pageName: BlogPageType;
} & (
  | BlogPagePropWithProps<"all_posts", AllPostsProp>
  | BlogPagePropWithProps<"tags", AllTagsProp>
  | BlogPagePropWithProps<"categories", AllCategoriesProp>
  | BlogPagePropWithProps<"tagged_posts", TaggedPostsProp>
  | BlogPagePropWithProps<"categoried_posts", CategoriedPostsProp>
  | BlogPagePropWithProps<"post", PostProp>
  | BlogPagePropWithProps<"license", {}>
);

export default function BlogPage(props: BlogPageProp) {
  switch (props.pageName) {
    case "all_posts":
      return <AllPosts {...props}></AllPosts>;
    case "tags":
      return <AllTags {...props} />;
    case "categories":
      return <AllCategories {...props} />;
    case "categoried_posts":
      return <CategoriedPosts {...props} />;
    case "tagged_posts":
      return <TaggedPosts {...props} />;
    case "post":
      return <Post {...props} />;
    case "license":
      return <License />;
    default:
      throw new Error("undefined pageName");
  }
}
