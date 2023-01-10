import Head from 'next/head';
import Layout from '../../components/layout';
import TagList from '../../components/tagList';
import Blog from '../../modules/blog';

export default function Tags({ tags }: { tags: { [key: string]: number } }) {
  return (
    <Layout
      openGraph={{
        canonicalUrl: 'https://blog.litehell.info/tag',
        title: 'LiteHell의 블로그 태그 목록',
        description: 'LiteHell의 블로그 태그 목록',
        withSiteName: true,
      }}
    >
      <Head>
        <title>LiteHell의 블로그 - 태그 목록</title>
      </Head>
      <TagList
        tags={tags}
        prefix='tag'
        header='모든 태그'
        backLink='/'
        backLinkText='< 모든 글 목록으로'
      ></TagList>
    </Layout>
  );
}

export async function getStaticProps() {
  const blog = new Blog();
  const tags = await blog.getTags(true);

  return {
    props: {
      tags,
    },
  };
}
