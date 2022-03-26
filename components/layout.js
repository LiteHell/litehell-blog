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
        </header>
        <main className={styles.mainContainer}>{this.props.children}</main>
        <footer className={styles.footer}>
          Copyrights (C) 2020 LiteHell, All rights reserved.
          <br />
          Fox Image : Copyrights (C) 2004 Shiretoko-Shari Torurist Association
        </footer>
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node,
  openGraph: {
    canonicalUrl: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    withSiteName: PropTypes.boolean,
    image: PropTypes.string,
  },
};
