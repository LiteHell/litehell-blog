import React from "react";
import { BlogPost } from "../../../blog/getPosts";
import Layout from "../../components/layout";
import PostList from "../../components/postList/postList";

export type TaggedPostsProp = {
  posts: BlogPost[];
  navigation: {
    current: number;
    total: number;
  };
  tag: string;
};

export default function TaggedPosts({
  posts,
  navigation,
  tag,
}: TaggedPostsProp) {
  return (
    <Layout>
      <PostList
        posts={posts.map((i) => ({
          metadata: i.content.metadata,
          link: `/post/${encodeURI(i.name)}`,
        }))}
        title={`${tag} 태그가 달린 글`}
        backLink={{
          href: "/",
          label: "모든 글 목록으로",
        }}
        navigation={{
          next:
            navigation.current !== navigation.total
              ? {
                  href: `/tag/${encodeURIComponent(tag)}/page/${navigation.current + 1}`,
                  page: navigation.current + 1,
                }
              : undefined,
          prev:
            navigation.current !== 1
              ? {
                  href: `/tag/${encodeURIComponent(tag)}/page/${navigation.current - 1}`,
                  page: navigation.current - 1,
                }
              : undefined,
        }}
      ></PostList>
    </Layout>
  );
}
