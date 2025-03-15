import React from "react";
import { BlogArticle } from "../../../blog/getArticles";
import PostList from "../../components/postList";
import Layout from "../../components/layout";
import TagList from "../../components/tagList";

export type AllCategoriesProp = {
  categories: { name: string; count: number }[];
};

export default function AllCategories({ categories }: AllCategoriesProp) {
  return (
    <Layout>
      <TagList
        title="카테고리 목록"
        tags={categories.map((i) => ({
          ...i,
          href: `/category/${encodeURIComponent(i.name)}`,
        }))}
      ></TagList>
    </Layout>
  );
}
