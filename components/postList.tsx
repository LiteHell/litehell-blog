import Link from 'next/link';
import { useMemo } from 'react';
import { BlogPostMetadata } from '../modules/blog';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../styles/ArticleList.module.scss';

export type BlogPost = { metadata: BlogPostMetadata; name: string };

type propTypes = {
  header?: string;
  backLink?: string;
  backLinkText?: string;
  posts: BlogPost[];
};

function usePageParamater(): [number, (number) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = useMemo(() => {
    const page = parseInt(searchParams.get('page') ?? '1');
    if (isNaN(page) || !isFinite(page)) {
      return 1;
    } else {
      return page;
    }
  }, [searchParams]);
  const setPage = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    const url = new URL(location.href);
    params.set('page', newPage);
    url.search = params.toString();

    router.push(url.href);
  };

  return [page, setPage];
}

export default function PostList(props: propTypes) {
  const postPerPageCount = 10;
  const [page, setPage] = usePageParamater();

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
