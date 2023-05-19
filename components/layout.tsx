import Head from 'next/head';
import Link from 'next/link';
import { ReactElement } from 'react';
import styles from '../styles/Layout.module.scss';

type propTypes = {
  children: ReactElement | ReactElement[];
  openGraph: {
    canonicalUrl: string;
    title?: string;
    description?: string;
    type?: string;
    withSiteName?: boolean;
    image?: string;
  };
};

export default function Layout(props: propTypes) {
  return (
    <div className={styles.body}>
      <Head>
        <link
          rel='icon'
          href='https://gravatar.com/avatar/837266b567b50fd59e72428220bf69b1'
        />
        <link rel='canonical' href={props.openGraph.canonicalUrl} />
        <link
          rel='alternate'
          type='application/rss+xml'
          title='RSS 2.0 Feed for blog.litehell.info'
          href='https://blog.litehell.info/feed/rss'
        />
        <link
          rel='alternate'
          type='	application/atom+xml'
          title='Atom 1.0 Feed for blog.litehell.info'
          href='https://blog.litehell.info/feed/atom'
        />
        <link
          rel='alternate'
          type='application/feed+json'
          title='Json 1.0 Feed for blog.litehell.info'
          href='https://blog.litehell.info/feed/json'
        />

        <meta
          property='og:title'
          content={props.openGraph.title || 'LiteHell의 블로그'}
        />
        <meta
          property='og:description'
          content={props.openGraph.description || 'LiteHell의 개인블로그'}
        />
        <meta property='og:locale' content='ko_KR' />
        <meta property='og:type' content={props.openGraph.type || 'blog'} />
        {props.openGraph.withSiteName && (
          <meta property='og:site_name' content='LiteHell의 블로그' />
        )}
        <meta property='og:url' content={props.openGraph.canonicalUrl} />
        <meta
          property='og:image'
          content={
            props.openGraph.image ||
            'https://gravatar.com/avatar/837266b567b50fd59e72428220bf69b1'
          }
        />
      </Head>
      <header className={styles.header}>
        <div className={styles.container}>
          <h1>
            <Link href='/'>LiteHell의 블로그</Link>
          </h1>
          <div className={styles.outLinks}>
            외부고리 :&nbsp;
            <a href='https://github.com/LiteHell'>GitHub</a>
            <a href='https://linkedin.com/in/LiteHell'>LinkedIn</a>
            <a href='https://keybase.io/LiteHell'>Keybase</a>
            <a href='mailto:litehell@litehell.info'>Email</a>
          </div>
          <div className={styles.inLinks}>
            내부고리 :&nbsp;
            <Link href='/category'>카테고리</Link>
            <Link href='/tag'>태그</Link>
          </div>
        </div>
      </header>
      <main className={styles.mainContainer}>
        <div className={styles.container}>{props.children}</div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <a href='https://www.gnu.org/licenses/agpl-3.0.en.html'>
            <img
              alt='GNU Affero General License Version 3'
              src='https://www.gnu.org/graphics/agplv3-with-text-100x42.png'
              style={{ height: '31px' }}
            ></img>
          </a>
          &nbsp;
          <a
            rel='license'
            href='http://creativecommons.org/licenses/by-sa/4.0/'
          >
            <img
              alt='Creative Commons License'
              style={{ borderWidth: 0 }}
              src='https://i.creativecommons.org/l/by-sa/4.0/88x31.png'
            />
          </a>
          <br />
          Copyrights (C) 2020 LiteHell, All rights reserved.
          <br />
          <div className={styles.visibleOnPrintOnly}>
            LiteHell&apos;s Blog -&nbsp;
            <a href='https://blog.litehell.info'>https://blog.litehell.info</a>
            <br />
            This work is licensed under a Creative Commons
            Attribution-ShareAlike 4.0 International License.
            <br />
            <br />
            Url of this article:&nbsp;
            <a href={props.openGraph.canonicalUrl}>
              {props.openGraph.canonicalUrl}
            </a>
            <br />
          </div>
          <div className={styles.invisibleOnPrint}>
            Fox Image : Copyrights (C) 2004 Shiretoko-Shari Torurist Association
            <br />
            <Link href='/license'>
              This blog is free software; For source code and more informations
              on license and copyrights, Click here.
            </Link>
            <br />
            <br />
            Feeds : <a href='/feed/rss'>RSS 2.0</a>,{' '}
            <a href='/feed/atom'>Atom 1.0</a>, <a href='/feed/json'>Json 1.0</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
