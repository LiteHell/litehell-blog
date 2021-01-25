import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import Layout from '../../components/layout';
import Blog from '../../modules/blog';
import styles from '../../styles/Blog.module.scss';

export default class Post extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>
            LiteHell의 블로그 - {this.props.article.metadata.title || '무제'}
          </title>
          <link
            rel='stylesheet'
            href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.5.0/styles/vs2015.min.css'
          />
        </Head>

        <div className={styles.header}>
          <div className={styles.title}>
            <h1>{this.props.article.metadata.title || '무제'}</h1>
            <h2>{this.props.article.metadata.subtitle || ''}</h2>
          </div>
          <p>
            {this.props.article.metadata.date
              ? new Date(this.props.article.metadata.date).toLocaleString()
              : '어떤 공기 좋은 날'}
            에&nbsp;
            {this.props.article.metadata.author || '누군가'}이(가) 작성함.
            <br />
            {this.props.article.metadata.category && (
              <span>
                카테고리 :&nbsp;
                <Link
                  href={`/category/${encodeURIComponent(
                    this.props.article.metadata.category
                  )}`}
                >
                  {this.props.article.metadata.category}
                </Link>
                <br />
              </span>
            )}
            {this.props.article.metadata.tags && (
              <span>
                태그 :&nbsp;
                {this.props.article.metadata.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    <Link href={`/tag/${encodeURIComponent(tag)}`}>{tag}</Link>
                  </span>
                ))}
                <br />
              </span>
            )}
          </p>
        </div>

        <section
          className={styles.article}
          dangerouslySetInnerHTML={{ __html: this.props.article.rendered }}
        ></section>
      </Layout>
    );
  }
}
Post.propTypes = {
  article: PropTypes.shape({
    metadata: PropTypes.shape({
      title: PropTypes.string,
      subtitle: PropTypes.string,
      author: PropTypes.string,
      date: PropTypes.string,
      category: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
    }),
    rendered: PropTypes.string.isRequired,
  }),
};

export async function getStaticProps({ params }) {
  const blog = new Blog();
  const article = await blog.readArticle(params.id);

  return { props: { article } };
}

export async function getStaticPaths() {
  const blog = new Blog();
  const articles = await blog.getArticleNames();

  return {
    paths: articles.map((articleName) => {
      return {
        params: {
          id: articleName,
        },
      };
    }),
    fallback: false,
  };
}
