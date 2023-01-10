import Link from 'next/link';
import { useState } from 'react';
import { BlogPostMetadata } from '../modules/blog';
import styles from '../styles/ArticleList.module.scss';

export type BlogPost = { metadata: BlogPostMetadata; name: string };

type propTypes = {
  header?: string;
  backLink?: string;
  backLinkText?: string;
  posts: BlogPost[];
};

export default function PostList(props: propTypes) {
  const postPerPageCount = 10;
  const [page, setPage] = useState<number>(1);
  const previousPage: number | null = page !== 1 ? page - 1 : null;
  const nextPage: number | null =
    page * postPerPageCount < props.posts.length ? page + 1 : null;
  const hasMultiplePages = props.posts.length > postPerPageCount;

  const goPage = (page: number) => {
    return () => {
      setPage(page);
    };
  };

  const postsForPage = props.posts.slice(
    postPerPageCount * (page - 1),
    postPerPageCount * page
  );

  return (
    <div>
      {props.header && (
        <div className={styles.postListHeader}>
          <h1>{props.header}</h1>
          {props.backLink && (
            <div className={styles.backLink}>
              <Link href={props.backLink}>
                {props.backLinkText || '뒤로 가기'}
              </Link>
            </div>
          )}
        </div>
      )}
      <ul className={styles.postList}>
        {postsForPage.map((post) => (
          <li key={post.name}>
            <Link href={`/post/${post.name}`}>
              <div className={styles.postItem}>
                <div className={styles.postTitle}>
                  {post.metadata.title || '(무제)'}
                </div>
                <div className={styles.postSubtitle}>
                  {post.metadata.subtitle || '(설명 없음)'}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <nav className={styles.postNav}>
        {hasMultiplePages && [
          previousPage ? (
            <a href='#' onClick={goPage(previousPage)}>
              {previousPage} 페이지로
            </a>
          ) : (
            <span>첫 페이지</span>
          ),
          nextPage ? (
            <a href='#' className={styles.next} onClick={goPage(nextPage)}>
              {nextPage} 페이지로
            </a>
          ) : (
            <span className={styles.next}>마지막 페이지</span>
          ),
        ]}
      </nav>
    </div>
  );
}
