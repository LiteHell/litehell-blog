import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import styles from '../styles/Layout.module.scss';
import PropTypes from 'prop-types';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.body}>
        <Head>
          <link
            rel='icon'
            href='https://gravatar.com/avatar/837266b567b50fd59e72428220bf69b1'
          />
          <link rel='canonical' href={this.props.openGraph.canonicalUrl} />
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
            content={this.props.openGraph.title || 'LiteHell의 블로그'}
          />
          <meta
            property='og:description'
            content={
              this.props.openGraph.description || 'LiteHell의 개인블로그'
            }
          />
          <meta property='og:locale' content='ko_KR' />
          <meta
            property='og:type'
            content={this.props.openGraph.type || 'blog'}
          />
          {this.props.openGraph.withSiteName && (
            <meta property='og:site_name' content='LiteHell의 블로그' />
          )}
          <meta property='og:url' content={this.props.openGraph.canonicalUrl} />
          <meta
            property='og:image'
            content={
              this.props.openGraph.image ||
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
          <div className={styles.container}>{this.props.children}</div>
        </main>
        <footer className={styles.footer}>
          <div className={styles.container}>
            Copyrights (C) 2020 LiteHell, All rights reserved.
            <br />
            Fox Image : Copyrights (C) 2004 Shiretoko-Shari Torurist Association
            <br />
            Feeds : <a href='/feed/rss'>RSS 2.0</a>,{' '}
            <a href='/feed/atom'>Atom 1.0</a>, <a href='/feed/json'>Json 1.0</a>
          </div>
        </footer>
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node,
  openGraph: PropTypes.shape({
    canonicalUrl: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    withSiteName: PropTypes.boolean,
    image: PropTypes.string,
  }),
};
