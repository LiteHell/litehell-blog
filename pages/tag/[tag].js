import Head from 'next/head';
import PropTypes from 'prop-types';
import React from 'react';
import Layout from '../../components/layout';
import PostList from '../../components/postList';
import Blog from '../../modules/blog';

export default class TaggedPostList extends React.Component {
  render() {
    return (
      <Layout>
        <Head>
          <title>LiteHell의 블로그 - {this.props.tag} 태그</title>
        </Head>
        <PostList
          posts={this.props.posts}
          header={`${this.props.tag} 태그가 달린 글`}
          backLink='/tag'
          backLinkText='< 태그 목록으로'
        ></PostList>
      </Layout>
    );
  }
}
TaggedPostList.propTypes = {
  posts: PostList.propTypes.posts,
  tag: PropTypes.string.isRequired,
};

export async function getStaticProps({ params }) {
  const { tag } = params;
  const blog = await new Blog();
  const articles = await blog.getArticleList();

  return {
    props: {
      posts: articles.filter((article) => article.metadata.tags?.includes(tag)),
      tag,
    },
  };
}

export async function getStaticPaths() {
  const blog = new Blog();
  const tags = await blog.getTags();

  return {
    paths: tags.map((tag) => {
      return {
        params: {
          tag,
        },
      };
    }),
    fallback: false,
  };
}
