import React from "react";
import { BlogArticle } from "../../../blog/getArticles";
import PostList from "../../components/postList";
import Layout from "../../components/layout";
import TagList from "../../components/tagList";

export type AllTagsProp = {
  tags: { name: string; count: number }[];
};

export default function AllTags({ tags }: AllTagsProp) {
  return (
    <Layout>
      <TagList
        tags={tags.map((i) => ({
          ...i,
          href: `/tag/${encodeURIComponent(i.name)}`,
        }))}
      ></TagList>
    </Layout>
  );
}
