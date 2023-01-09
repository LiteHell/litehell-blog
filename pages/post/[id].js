import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import Comments from '../../components/comments';
import Layout from '../../components/layout';
import Blog from '../../modules/blog';
import getFirstImageFromHtml from '../../modules/getFirstImageFromHtml.js';
import styles from '../../styles/Blog.module.scss';

export default class Post extends React.Component {
  constructor(props) {
    super(props);
  }

  canonicalUrl() {
    return 'https://blog.litehell.info/post/' + this.props.articleId;
  }

  canonicalImage() {
    return (
      getFirstImageFromHtml(this.props.article.rendered) ||
      'https://gravatar.com/avatar/837266b567b50fd59e72428220bf69b1'
    );
  }

  titleForDisplay() {
    return this.props.article.metadata.title || '무제';
  }

  seriesContainer() {
    if (this.props.series) {
      return (
        <div className={styles.seriesContainer}>
          <div className={styles.seriesTitle}>
            (시리즈) {this.props.seriesName}
          </div>
          <ul>
            {this.props.series.map((i) => (
              <li
                key={i.articleId}
                className={
                  i.articleId === this.props.articleId ? styles.now : undefined
                }
              >
                <Link href={`/post/${i.articleId}`}>{i.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <Layout
        openGraph={{
          canonicalUrl: this.canonicalUrl(),
          title: this.titleForDisplay(),
          description:
            this.props.article.metadata.subtitle ||
            'LiteHell의 개인블로그에 작성된 글',
          type: 'article',
          withSiteName: true,
          image: this.canonicalImage(),
        }}
      >
        <Head>
          <title>LiteHell의 블로그 - {this.titleForDisplay()}</title>
          <link
            rel='stylesheet'
            href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.5.0/styles/vs2015.min.css'
          />
        </Head>

        <div className={styles.header}>
          <div className={styles.title}>
            <h1>{this.titleForDisplay()}</h1>
            <h2>{this.props.article.metadata.subtitle || ''}</h2>
          </div>
          <p>
            {this.props.article.metadata.date
              ? new Date(this.props.article.metadata.date).toLocaleString()
              : '어떤 공기 좋은 날'}
            에&nbsp;
            {this.props.article.metadata.author || '누군가'}이(가) 작성
            {this.props.article.metadata.last_modified_at
              ? `하고 ${new Date(
                  this.props.article.metadata.last_modified_at
                ).toLocaleString()}에 수정함`
              : '함'}
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

        {this.seriesContainer()}

        <section
          className={styles.article}
          dangerouslySetInnerHTML={{ __html: this.props.article.rendered }}
        ></section>
        <Comments />
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
      last_modified_at: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
    }),
    rendered: PropTypes.string.isRequired,
  }),
  seriesName: PropTypes.string,
  series: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      articleId: PropTypes.string,
    })
  ),
  articleId: PropTypes.string,
};

export async function getStaticProps({ params }) {
  const blog = new Blog();
  const article = await blog.readArticle(params.id);

  const series = {};
  if (article.metadata.series) {
    const seriesId = article.metadata.series;
    const seriesArticles = await (await blog.getArticleList())
      .filter((i) => i.metadata.series === seriesId)
      .reverse();
    series.series = seriesArticles.map((i) => ({
      title: i.metadata.title,
      articleId: i.name,
    }));
    series.seriesName = seriesArticles
      .filter((i) => Date.parse(i.metadata.date) <= Date.parse(i.metadata.date))
      .pop().metadata.seriesName;
  }

  return { props: { article, articleId: params.id, ...series } };
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
