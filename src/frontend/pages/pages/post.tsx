import React from "react";
import { BlogArticle } from "../../../blog/getArticles";
import Layout from "../../components/layout";

export type PostProp = {
  post: {
    current: BlogArticle;
    previous?: BlogArticle;
    next?: BlogArticle;
  };
};

export default function Post({ post }: PostProp) {
  return (
    <Layout>
      <div>
        <h2>{post.current.content.metadata.title}</h2>
        <article
          dangerouslySetInnerHTML={{ __html: post.current.content.parsed }}
        ></article>
        <nav></nav>
      </div>
    </Layout>
  );
}
