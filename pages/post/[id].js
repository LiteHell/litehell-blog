import Head from 'next/head'
import Blog from '../../modules/blog';
import Layout from '../../components/layout'
import styles from '../../styles/Blog.module.scss'
import Link from 'next/link';

export default function Post({ article }) {
  return (
    <Layout>
      <Head>
        <title>블로그</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.5.0/styles/vs2015.min.css" />
      </Head>
      
      <div className={styles.header}>
        <div className={styles.title}>
        <h1>{ article.metadata.title || '무제' }</h1>
        <h2>{ article.metadata.subtitle || ''}</h2>
        </div>
        <p>{ article.metadata.date ? (new Date(article.metadata.date)).toLocaleString() : '어떤 공기 좋은 날' }에&nbsp;
        { article.metadata.author || '누군가' }이(가) 작성함.<br />
        {article.metadata.category && 
        <span>
          카테고리 :&nbsp;
          <Link href={`/category/${encodeURIComponent(article.metadata.category)}`}>
            {article.metadata.category}
            </Link>
          <br />
        </span>
        }
        {article.metadata.tags && 
          <span>
            태그 :&nbsp;
            {article.metadata.tags.map(tag => 
            (<span className={styles.tag}><Link href={`/tag/${encodeURIComponent(tag)}`}>
              {tag}
              </Link></span>)
            )}
            <br />
          </span>
          }
        </p>
      </div>

      <section className={styles.article} dangerouslySetInnerHTML={{__html: article.rendered}}>
      </section>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
    const blog = new Blog();
    const article = await blog.readArticle(params.id);

    return { props: { article }}
}

export async function getStaticPaths() {
    const blog = new Blog();
    const articles = await blog.getArticleNames();

    return { paths: articles.map(articleName => {
      return {
        params: {
          id: articleName
        }
      }
    }), fallback: false };
}