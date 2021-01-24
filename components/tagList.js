import styles from '../styles/TagList.module.scss'
import React from 'react'
import Link from 'next/link';

export default class TagList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <div>
            {
              this.props.header && (<div className={styles.tagListHeader}>
                <h1>{ this.props.header }</h1>
                {
                  this.props.backLink && (<div className={styles.backLink}>
                    <Link href={this.props.backLink}>{this.props.backLinkText || '뒤로'}</Link>
                  </div>)
                }
              </div>)
            }
            <ul className={styles.tagList}>
            {Object.entries(this.props.tags).map(tag => (
                <li key={tag[0]}>
                  <Link href={`/${this.props.prefix || 'tag'}/${encodeURIComponent(tag[0])}`}>
                      <div className={styles.tagItem}>
                        <div className={styles.tag}>{ tag[0] }</div>
                        <div className={styles.count}>{ tag[1] }</div>
                      </div>
                  </Link>
                </li>
            ))
            }
            </ul>
        </div>
    )
  }
}