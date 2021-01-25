import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../styles/TagList.module.scss';

export default class TagList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        {this.props.header && (
          <div className={styles.tagListHeader}>
            <h1>{this.props.header}</h1>
            {this.props.backLink && (
              <div className={styles.backLink}>
                <Link href={this.props.backLink}>
                  {this.props.backLinkText || '뒤로'}
                </Link>
              </div>
            )}
          </div>
        )}
        <ul className={styles.tagList}>
          {Object.entries(this.props.tags).map((tag) => (
            <li key={tag[0]}>
              <Link
                href={`/${this.props.prefix || 'tag'}/${encodeURIComponent(
                  tag[0]
                )}`}
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
}

TagList.propTypes = {
  header: PropTypes.string,
  backLink: PropTypes.string,
  backLinkText: PropTypes.string,
  prefix: PropTypes.string,
  tags: function(props, propName, componentName) {
    const err = new Error('Invalid prop `' + propName + '` supplited to `' + componentName + '`. Validation failed.');
    if(!props[propName])
      throw err;
    const entries = Object.entries(props[propName]);
    for(const entry of entries) {
      if (typeof entry[0] !== 'string')
        throw err;
      else if (typeof entry[1] !== 'number')
        throw err;
    }
  }
};
