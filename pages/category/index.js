import Head from 'next/head';
import React from 'react';
import Layout from '../../components/layout';
import TagList from '../../components/tagList';
import Blog from '../../modules/blog';

export default class Categories extends React.Component {
  render() {
    return (
      <Layout>
        <Head>
          <title>LiteHell의 블로그 - 카테고리 목록</title>
        </Head>
        <TagList
          tags={this.props.categories}
          prefix='category'
          header='모든 카테고리'
          backLink='/'
          backLinkText='< 모든 글 목록으로'
        ></TagList>
      </Layout>
    );
  }
}
Categories.propTypes = {
  categories: TagList.propTypes.tags,
};

export async function getStaticProps() {
  const blog = new Blog();
  const categories = await blog.getCategories(true);

  return {
    props: {
      categories,
    },
  };
}
