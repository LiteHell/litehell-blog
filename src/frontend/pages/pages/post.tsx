import React from "react";
import { BlogPost } from "../../../blog/getPosts";
import Layout from "../../components/layout";

export type PostProp = {
  post: {
    current: BlogPost;
    previous?: BlogPost;
    next?: BlogPost;
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
