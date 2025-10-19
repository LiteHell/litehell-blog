import React from "react";
import { BlogPost } from "../../../blog/getPosts";
import Layout from "../../components/layout";
import PostList from "../../components/postList/postList";
import useFormatMessage from "../../i18n/useFormatMessage";

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
  const formatMessage = useFormatMessage();

  return (
    <Layout>
      <PostList
        posts={posts.map(i => ({
          metadata: i.content.metadata,
          link: `/post/${encodeURI(i.name)}`,
          lang: i.content.lang,
        }))}
        title={formatMessage("page.categoriedPosts.title", { category })}
        backLink={{
          href: "/",
          label: formatMessage("page.categoriedPosts.back"),
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
