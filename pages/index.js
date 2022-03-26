import Head from 'next/head';
import Layout from '../components/layout';
import Blog from '../modules/blog';
import React from 'react';
import PostList from '../components/postList';

export default class Home extends React.Component {
  render() {
    return (
      <Layout
        openGraph={{
          canonicalUrl: 'https://blog.litehell.info',
        }}
      >
        <Head>
          <title>LiteHell의 블로그</title>
        </Head>
        <PostList posts={this.props.posts} header='모든 글'></PostList>
      </Layout>
    );
  }
}
Home.propTypes = {
  posts: PostList.propTypes.posts,
};

export async function getStaticProps() {
  const blog = await new Blog();

  return {
    props: {
      posts: await blog.getArticleList(),
    },
  };
}
