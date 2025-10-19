import React from "react";
import Layout from "../../components/layout";
import TagList from "../../components/tagList/tagList";
import { FormattedMessage } from "react-intl";

export type AllCategoriesProp = {
  categories: { name: string; count: number }[];
};

export default function AllCategories({ categories }: AllCategoriesProp) {
  return (
    <Layout>
      <TagList
        title={<FormattedMessage id="page.allCategories.title" />}
        tags={categories.map(i => ({
          ...i,
          href: `/category/${encodeURIComponent(i.name)}`,
        }))}
      ></TagList>
    </Layout>
  );
}
