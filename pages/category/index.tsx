import Head from 'next/head';
import Layout from '../../components/layout';
import TagList from '../../components/tagList';
import Blog from '../../modules/blog';

export default function Categories({
  categories,
}: {
  categories: { [key: string]: number };
}) {
  return (
    <Layout
      openGraph={{
        canonicalUrl: 'https://blog.litehell.info/category',
        title: 'LiteHell의 블로그 - 카테고리 목록',
        description: 'LiteHell의 블로그의 카테고리 목록',
        withSiteName: true,
      }}
    >
      <Head>
        <title>LiteHell의 블로그 - 카테고리 목록</title>
      </Head>
      <TagList
        tags={categories}
        prefix='category'
        header='모든 카테고리'
        backLink='/'
        backLinkText='< 모든 글 목록으로'
      ></TagList>
    </Layout>
  );
}

export async function getStaticProps() {
  const blog = new Blog();
  const categories = await blog.getCategories(true);

  return {
    props: {
      categories,
    },
  };
}
