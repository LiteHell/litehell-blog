import Link from 'next/link';
import styles from '../styles/TagList.module.scss';

type propTypes = {
  header?: string;
  backLink?: string;
  backLinkText?: string;
  prefix?: string;
  tags: { [tagName: string]: number };
};

export default function TagList(props: propTypes) {
  return (
    <div>
      {props.header && (
        <div className={styles.tagListHeader}>
          <h1>{props.header}</h1>
          {props.backLink && (
            <div className={styles.backLink}>
              <Link href={props.backLink}>{props.backLinkText || '뒤로'}</Link>
            </div>
          )}
        </div>
      )}
      <ul className={styles.tagList}>
        {Object.entries(props.tags).map((tag) => (
          <li key={tag[0]}>
            <Link
              href={`/${props.prefix || 'tag'}/${encodeURIComponent(tag[0])}`}
            >
              <div className={styles.tagItem}>
                <div className={styles.tag}>{tag[0]}</div>
                <div className={styles.count}>{tag[1]}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
