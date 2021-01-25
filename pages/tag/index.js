import Head from 'next/head';
import Layout from '../../components/layout';
import Blog from '../../modules/blog';
import React from 'react';
import TagList from '../../components/tagList';
import PropTypes from 'prop-types';

export default class Tags extends React.Component {
  render() {
    return (
      <Layout>
        <Head>
          <title>LiteHell의 블로그 - 태그 목록</title>
        </Head>
        <TagList
          tags={this.props.tags}
          prefix='tag'
          header='모든 태그'
          backLink='/'
          backLinkText='< 모든 글 목록으로'
        ></TagList>
      </Layout>
    );
  }
}
Tags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

export async function getStaticProps() {
  const blog = new Blog();
  const tags = await blog.getTags(true);

  return {
    props: {
      tags,
    },
  };
}
