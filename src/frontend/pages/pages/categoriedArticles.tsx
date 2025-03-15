import React from "react";
import { BlogArticle } from "../../../blog/getArticles";
import Layout from "../../components/layout";
import PostList from "../../components/postList";

export type CategoriedArticlesProp = {
  posts: BlogArticle[];
  navigation: {
    current: number;
    total: number;
  };
  category: string;
};

export default function CategoriedArticles({
  posts,
  navigation,
  category,
}: CategoriedArticlesProp) {
  return (
    <Layout>
      <PostList
        posts={posts.map((i) => ({
          metadata: i.content.metadata,
          link: `/post/${encodeURI(i.name)}`,
        }))}
        title={`${category} 카테고리의 글`}
        backLink={{
          href: "/",
          label: "모든 글 목록으로",
        }}
        navigation={{
          next:
            navigation.current !== navigation.total
              ? {
                  href: `/category/${encodeURIComponent(category)}/page/${navigation.current + 1}`,
                  page: navigation.current + 1,
                }
              : undefined,
          prev:
            navigation.current !== 1
              ? {
                  href: `/category/${encodeURIComponent(category)}/page/${navigation.current - 1}`,
                  page: navigation.current - 1,
                }
              : undefined,
        }}
      ></PostList>
    </Layout>
  );
}
