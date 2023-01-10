import { useCallback } from 'react';
import styles from '../styles/Comments.module.scss';

export default function Comments() {
  const commentRef = useCallback((comment) => {
    if (comment?.querySelector('script') !== null) return;

    const scriptTag = document.createElement('script');
    const attributes = {
      src: 'https://utteranc.es/client.js',
      repo: 'LiteHell/litehell-blog',
      'issue-term': 'og:title',
      label: 'blog comment',
      theme: 'github-light',
      crossorigin: 'anonymous',
      async: 'async',
    };

    for (const i in attributes) scriptTag.setAttribute(i, attributes[i]);

    comment.appendChild(scriptTag);
  }, []);

  return <div className={styles.blogComments} ref={commentRef}></div>;
}
