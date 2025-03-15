import React from "react";
import { BlogArticle } from "../../../blog/getArticles";
import PostList from "../../components/postList";
import Layout from "../../components/layout";

export type AllArticlesProp = {
  posts: BlogArticle[];
  navigation: {
    current: number;
    total: number;
  };
};

export default function AllArticles({ posts, navigation }: AllArticlesProp) {
  return (
    <Layout>
      <PostList
        posts={posts.map((i) => ({
          metadata: i.content.metadata,
          link: `/post/${encodeURI(i.name)}`,
        }))}
        title="모든 글"
        navigation={{
          next:
            navigation.current !== navigation.total
              ? {
                  href: `/page/${navigation.current + 1}`,
                  page: navigation.current + 1,
                }
              : undefined,
          prev:
            navigation.current !== 1
              ? {
                  href: `/page/${navigation.current - 1}`,
                  page: navigation.current - 1,
                }
              : undefined,
        }}
      ></PostList>
    </Layout>
  );
}
