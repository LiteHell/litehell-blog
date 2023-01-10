import Head from 'next/head';
import Layout from '../components/layout';
import PostList, { BlogPost } from '../components/postList';
import Blog from '../modules/blog';

export default function Home({ posts }: { posts: BlogPost[] }) {
  return (
    <Layout
      openGraph={{
        canonicalUrl: 'https://blog.litehell.info',
      }}
    >
      <Head>
        <title>LiteHell의 블로그</title>
      </Head>
      <PostList posts={posts} header='모든 글'></PostList>
    </Layout>
  );
}

export async function getStaticProps() {
  const blog = await new Blog();

  return {
    props: {
      posts: await blog.getArticleList(),
    },
  };
}
