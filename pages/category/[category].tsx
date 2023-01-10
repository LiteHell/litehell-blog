import Head from 'next/head';
import Layout from '../../components/layout';
import PostList, { BlogPost } from '../../components/postList';
import Blog from '../../modules/blog';

type propTypes = {
  posts: BlogPost[];
  category: string;
};

export default function CategoriedPostList({ posts, category }: propTypes) {
  return (
    <Layout
      openGraph={{
        canonicalUrl:
          'https://blog.litehell.info/category' + encodeURIComponent(category),
        title: `LiteHell의 블로그 - ${category} 카테고리`,
        description: `LiteHell의 블로그에서 ${category} 카테고리에 속하는 글들`,
        withSiteName: true,
      }}
    >
      <Head>
        <title>LiteHell의 블로그 - {category} 카테고리</title>
      </Head>
      <PostList
        posts={posts}
        header={`${category} 카테고리의 글`}
        backLink='/category'
        backLinkText='< 카테고리 목록으로'
      ></PostList>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const { category } = params;
  const blog = await new Blog();
  const articles = await blog.getArticleList();

  return {
    props: {
      posts: articles.filter(
        (article) => article.metadata.category === category
      ),
      category,
    },
  };
}

export async function getStaticPaths() {
  const blog = new Blog();
  const categories = await blog.getCategories();

  return {
    paths: categories.map((category) => {
      return {
        params: {
          category,
        },
      };
    }),
    fallback: false,
  };
}
