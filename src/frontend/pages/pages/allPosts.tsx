import React from "react";
import { BlogPost } from "../../../blog/getPosts";
import Layout from "../../components/layout";
import PostList from "../../components/postList";

export type AllPostsProp = {
  posts: BlogPost[];
  navigation: {
    current: number;
    total: number;
  };
};

export default function AllPosts({ posts, navigation }: AllPostsProp) {
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
