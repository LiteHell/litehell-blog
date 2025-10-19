import React from "react";
import { BlogPost } from "../../../blog/getPosts";
import Layout from "../../components/layout";
import PostList from "../../components/postList/postList";
import useFormatMessage from "../../i18n/useFormatMessage";

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
  const formatMessage = useFormatMessage();

  return (
    <Layout>
      <PostList
        posts={posts.map(i => ({
          metadata: i.content.metadata,
          link: `/post/${encodeURI(i.name)}`,
          lang: i.content.lang,
        }))}
        title={formatMessage("page.taggedPosts.title")}
        backLink={{
          href: "/",
          label: formatMessage("page.taggedPosts.back"),
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
