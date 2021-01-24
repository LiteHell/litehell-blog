import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import styles from '../styles/Layout.module.scss'

export default class Layout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div className={styles.body}>
            <Head>
                <link rel="icon" href="https://gravatar.com/avatar/837266b567b50fd59e72428220bf69b1" />
            </Head>
            <header className={styles.header}>
                <h1><Link href="/">LiteHell의 블로그</Link></h1>
                <div className={styles.outLinks}>
                    외부고리 :&nbsp;
                    <a href="https://github.com/LiteHell">GitHub</a>
                    <a href="https://linkedin.com/in/LiteHell">LinkedIn</a>
                    <a href="https://keybase.io/LiteHell">Keybase</a>
                    <a href="mailto:litehell@litehell.info">Email</a>
                </div>
                <div className={styles.inLinks}>
                    내부고리 :&nbsp;
                    <Link href="/category">카테고리</Link>
                    <Link href="/tag">태그</Link>
                </div>
            </header>
            <main className={styles.mainContainer}>
                { this.props.children }
            </main>
            <footer className={styles.footer}>
            Copyrights (C) 2020 LiteHell, All rights reserved.<br />
            Fox Image : Copyrights (C) 2004 Shiretoko-Shari Torurist Association
            </footer>
        </div>)
    }
}