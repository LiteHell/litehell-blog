import Head from 'next/head'
import Layout from '../../components/layout'
import Blog from '../../modules/blog'
import React from 'react'
import PostList from '../../components/postList'

export default class Home extends React.Component {
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
          backLinkText='< 카테고리 목록으로'></PostList>
      </Layout>
    )
  }
}

export async function getStaticProps({ params }) {
  const { category } = params;
  const blog = await new Blog();
  const articles = await blog.getArticleList();

  return {
    props: {
      posts: articles.filter(article => article.metadata.category === category),
      category
    }
  };
}

export async function getStaticPaths() {
    const blog = new Blog();
    const categories = await blog.getCategories();

    return { paths: categories.map(category => {
      return {
        params: {
          category
        }
      }
    }), fallback: false };
}