import Head from 'next/head';
import Layout from '../../components/layout';
import PostList, { BlogPost } from '../../components/postList';
import Blog from '../../modules/blog';

type propTypes = {
  posts: BlogPost[];
  tag: string;
};

export default function TaggedPostList({ tag, posts }: propTypes) {
  return (
    <Layout
      openGraph={{
        canonicalUrl:
          'https://blog.litehell.info/tag/' + encodeURIComponent(tag),
        title: `LiteHell의 블로그 - ${tag} 태그`,
        description: `LiteHell의 블로그에서 ${tag} 태그를 가진 글들`,
        withSiteName: true,
      }}
    >
      <Head>
        <title>LiteHell의 블로그 - {tag} 태그</title>
      </Head>
      <PostList
        posts={posts}
        header={`${tag} 태그가 달린 글`}
        backLink='/tag'
        backLinkText='< 태그 목록으로'
      ></PostList>
    </Layout>
  );
}

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
