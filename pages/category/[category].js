import Head from 'next/head';
import PropTypes from 'prop-types';
import React from 'react';
import Layout from '../../components/layout';
import PostList from '../../components/postList';
import Blog from '../../modules/blog';

export default class CategoriedPostList extends React.Component {
  render() {
    return (
      <Layout>
        <Head>
          <title>LiteHell의 블로그 - {this.props.category} 카테고리</title>
        </Head>
        <PostList
          posts={this.props.posts}
          header={`${this.props.category} 카테고리의 글`}
          backLink='/category'
          backLinkText='< 카테고리 목록으로'
        ></PostList>
      </Layout>
    );
  }
}
CategoriedPostList.propTypes = {
  posts: PostList.propTypes.posts,
  category: PropTypes.string.isRequired,
};

export async function getStaticProps({ params }) {
  const { category } = params;
  const blog = await new Blog();
  const articles = await blog.getArticleList();
  
  return {
    props: {
      posts: articles.filter(
        (article) => article.metadata.category === category
      ),
      category,
    },
  };
}

export async function getStaticPaths() {
  const blog = new Blog();
  const categories = await blog.getCategories();

  return {
    paths: categories.map((category) => {
      return {
        params: {
          category,
        },
      };
    }),
    fallback: false,
  };
}
