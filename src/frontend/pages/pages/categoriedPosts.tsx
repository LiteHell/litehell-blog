import React from "react";
import { BlogPost } from "../../../blog/getPosts";
import Layout from "../../components/layout";
import PostList from "../../components/postList";

export type CategoriedPostsProp = {
  posts: BlogPost[];
  navigation: {
    current: number;
    total: number;
  };
  category: string;
};

export default function CategoriedPosts({
  posts,
  navigation,
  category,
}: CategoriedPostsProp) {
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
