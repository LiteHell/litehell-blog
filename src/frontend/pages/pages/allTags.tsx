import React from "react";
import Layout from "../../components/layout";
import TagList from "../../components/tagList/tagList";

export type AllTagsProp = {
  tags: { name: string; count: number }[];
};

export default function AllTags({ tags }: AllTagsProp) {
  return (
    <Layout>
      <TagList
        tags={tags.map(i => ({
          ...i,
          href: `/tag/${encodeURIComponent(i.name)}`,
        }))}
      ></TagList>
    </Layout>
  );
}
