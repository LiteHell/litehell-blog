import Head from 'next/head';
import Link from 'next/link';
import Comments from '../../components/comments';
import Layout from '../../components/layout';
import { BlogPost } from '../../components/postList';
import Blog, { BlogPostMetadata } from '../../modules/blog';
import getFirstImageFromHtml from '../../modules/getFirstImageFromHtml';
import styles from '../../styles/Blog.module.scss';

type seriesPropTypes = {
  series?: { title: string; articleId: string }[];
  seriesName?: string;
};

type postNavigationPropTypes = {
  previousPost?: BlogPost;
  nextPost?: BlogPost;
};

type propTypes = {
  articleId: string;
  article: {
    metadata: BlogPostMetadata;
    rendered: string;
  };
} & seriesPropTypes &
  postNavigationPropTypes;

function SeriesContainer(props: propTypes) {
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

function PostNavigation({ previousPost, nextPost }: postNavigationPropTypes) {
  const PostLink = ({ post, left }: { post: BlogPost; left: boolean }) => {
    return (
      <div className={left ? styles.leftAnchor : styles.rightAnchor}>
        <Link href={`/post/${encodeURIComponent(post.name)}`}>
          <div className={styles.postDescription}>
            <div className={styles.title}>{post.metadata.title}</div>
            <div className={styles.subtitle}>{post.metadata.subtitle}</div>
          </div>
        </Link>
      </div>
    );
  };

  const navClassNames = [styles.postNav];
  if (previousPost && nextPost) navClassNames.push(styles.hasBoth);

  return (
    <nav className={navClassNames.join(' ')}>
      {previousPost ? (
        <PostLink post={previousPost} left={true}></PostLink>
      ) : (
        <div className={styles.nothing}></div>
      )}
      {nextPost ? (
        <PostLink post={nextPost} left={false}></PostLink>
      ) : (
        <div className={styles.nothing}></div>
      )}
    </nav>
  );
}

export default function Post(props: propTypes) {
  const cannonicalUrl = 'https://blog.litehell.info/post/' + props.articleId;
  const canonicalImage =
    getFirstImageFromHtml(props.article.rendered) ||
    'https://gravatar.com/avatar/837266b567b50fd59e72428220bf69b1';
  const titleForDisplay = props.article.metadata.title || '무제';

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

      {props.series && <SeriesContainer {...props}></SeriesContainer>}

      <section
        className={styles.article}
        dangerouslySetInnerHTML={{ __html: props.article.rendered }}
      ></section>

      <Comments key={props.articleId} />

      <PostNavigation {...props} />
    </Layout>
  );
}

async function getNearPostIds(
  articleId: string
): Promise<[BlogPost | undefined, BlogPost | undefined]> {
  const blog = new Blog();
  const posts = (
    await Promise.all(
      (await blog.getArticleNames()).map(async (i) => {
        const article = await blog.readArticle(i);
        return { name: i, ...article };
      })
    )
  ).sort((a, b) => Date.parse(a.metadata.date) - Date.parse(b.metadata.date));
  const postIndex = posts.map((i) => i.name).indexOf(articleId);

  // Get near ids
  const prevPost = postIndex != 0 ? posts[postIndex - 1] : undefined;
  const nextPost =
    postIndex + 1 < posts.length ? posts[postIndex + 1] : undefined;

  // Return them
  return [prevPost, nextPost];
}

export async function getStaticProps({ params }) {
  const blog = new Blog();
  const article = await blog.readArticle(params.id);

  // Get near posts for bottom post nav
  const [previousPost, nextPost] = await getNearPostIds(params.id);
  const postNavProps: postNavigationPropTypes = {};
  if (previousPost) postNavProps.previousPost = previousPost;
  if (nextPost) postNavProps.nextPost = nextPost;

  // Get series info if it's series
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

  return {
    props: { article, articleId: params.id, ...series, ...postNavProps },
  };
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
