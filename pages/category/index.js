import Head from 'next/head'
import Layout from '../../components/layout'
import Blog from '../../modules/blog'
import React from 'react'
import PostList from '../../components/postList'
import TagList from '../../components/tagList'

export default class Home extends React.Component {
  render() {
    return (
      <Layout>
        <Head>
          <title>LiteHell의 블로그 - 카테고리 목록</title>
        </Head>
        <TagList
          tags={this.props.categories}
          prefix="category"
          header="모든 카테고리"
          backLink="/"
          backLinkText="< 모든 글 목록으로"></TagList>
      </Layout>
    )
  }
}

export async function getStaticProps() {
  const blog = new Blog();
  const categories = await blog.getCategories(true); 

  return {
    props: {
      categories
    }
  };
}