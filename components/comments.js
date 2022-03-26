import React, { createRef, useEffect } from 'react';
import styles from '../styles/Comments.module.scss';

export default function Comments() {
  const commentRef = createRef();

  useEffect(() => {
    if (commentRef.current.querySelector('script') !== null) return;

    const script = document.createElement('script');
    const attributes = {
      src: 'https://utteranc.es/client.js',
      repo: 'LiteHell/litehell-blog',
      'issue-term': 'pathname',
      label: 'blog comment',
      theme: 'github-light',
      crossorigin: 'anonymous',
      async: 'async',
    };

    for (const i in attributes) script.setAttribute(i, attributes[i]);

    commentRef.current.appendChild(script);
  });

  return <div className={styles.blogComments} ref={commentRef}></div>;
}
