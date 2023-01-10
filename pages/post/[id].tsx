import Head from 'next/head';
import Link from 'next/link';
import Comments from '../../components/comments';
import Layout from '../../components/layout';
import Blog, { BlogPostMetadata } from '../../modules/blog';
import getFirstImageFromHtml from '../../modules/getFirstImageFromHtml';
import styles from '../../styles/Blog.module.scss';

type seriesPropTypes = {
  series?: { title: string; articleId: string }[];
  seriesName?: string;
};

type propTypes = {
  articleId: string;
  article: {
    metadata: BlogPostMetadata;
    rendered: string;
  };
} & seriesPropTypes;

function createSeriesContainer(props: propTypes) {
  return (
    <div className={styles.seriesContainer}>
      <div className={styles.seriesTitle}>(시리즈) {props.seriesName}</div>
      <ul>
        {props.series.map((i) => (
          <li
            key={i.articleId}
            className={i.articleId === props.articleId ? styles.now : undefined}
          >
            <Link href={`/post/${i.articleId}`}>{i.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Post(props: propTypes) {
  const cannonicalUrl = 'https://blog.litehell.info/post/' + props.articleId;
  const canonicalImage =
    getFirstImageFromHtml(props.article.rendered) ||
    'https://gravatar.com/avatar/837266b567b50fd59e72428220bf69b1';
  const titleForDisplay = props.article.metadata.title || '무제';
  const seriesContainer = props.series ? createSeriesContainer(props) : null;

  return (
    <Layout
      openGraph={{
        canonicalUrl: cannonicalUrl,
        title: titleForDisplay,
        description:
          props.article.metadata.subtitle ||
          'LiteHell의 개인블로그에 작성된 글',
        type: 'article',
        withSiteName: true,
        image: canonicalImage,
      }}
    >
      <Head>
        <title>LiteHell의 블로그 - {titleForDisplay}</title>
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.5.0/styles/vs2015.min.css'
        />
      </Head>

      <div className={styles.header}>
        <div className={styles.title}>
          <h1>{titleForDisplay}</h1>
          <h2>{props.article.metadata.subtitle || ''}</h2>
        </div>
        <p>
          {props.article.metadata.date
            ? new Date(props.article.metadata.date).toLocaleString()
            : '어떤 공기 좋은 날'}
          에&nbsp;
          {props.article.metadata.author || '누군가'}이(가) 작성
          {props.article.metadata.last_modified_at
            ? `하고 ${new Date(
                props.article.metadata.last_modified_at
              ).toLocaleString()}에 수정함`
            : '함'}
          <br />
          {props.article.metadata.category && (
            <span>
              카테고리 :&nbsp;
              <Link
                href={`/category/${encodeURIComponent(
                  props.article.metadata.category
                )}`}
              >
                {props.article.metadata.category}
              </Link>
              <br />
            </span>
          )}
          {props.article.metadata.tags && (
            <span>
              태그 :&nbsp;
              {props.article.metadata.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  <Link href={`/tag/${encodeURIComponent(tag)}`}>{tag}</Link>
                </span>
              ))}
              <br />
            </span>
          )}
        </p>
      </div>

      {seriesContainer}

      <section
        className={styles.article}
        dangerouslySetInnerHTML={{ __html: props.article.rendered }}
      ></section>
      <Comments key={props.articleId} />
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const blog = new Blog();
  const article = await blog.readArticle(params.id);

  const series: seriesPropTypes = {};
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
      .filter((i) => typeof i.metadata.seriesName !== 'undefined')
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
