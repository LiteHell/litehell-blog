import React from "react";
import Layout from "../../components/layout";
import PostContent, {
  PostProp as PostContentProp,
} from "../../components/post/post";

export type PostProp = {
  post: PostContentProp;
};

export default function Post(props: PostProp) {
  return (
    <Layout>
      <PostContent {...props.post} />
    </Layout>
  );
}
