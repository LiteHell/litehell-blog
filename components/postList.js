import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../styles/ArticleList.module.scss';

export default class PostList extends React.Component {
  constructor(props) {
    super(props);
    this._postsPerPage = 10;
    this.state = {
      page: 1,
      previous: null,
      next: this._postsPerPage < props.posts.length ? 2 : null,
    };
    this.goPage = this.goPage.bind(this);
  }
  getPostsForPage() {
    const { page } = this.state;
    return this.props.posts.slice(
      this._postsPerPage * (page - 1),
      this._postsPerPage * page
    );
  }
  goPage(page) {
    return () => {
      const postCount = this.props.posts.length;
      this.setState({
        page,
        previous: page !== 1 ? page - 1 : null,
        next: page * this._postsPerPage < postCount ? page + 1 : null,
      });
    };
  }
  render() {
    return (
      <div>
        {this.props.header && (
          <div className={styles.postListHeader}>
            <h1>{this.props.header}</h1>
            {this.props.backLink && (
              <div className={styles.backLink}>
                <Link href={this.props.backLink}>
                  {this.props.backLinkText || '뒤로 가기'}
                </Link>
              </div>
            )}
          </div>
        )}
        <ul className={styles.postList}>
          {this.getPostsForPage().map((post) => (
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
          {this.props.posts.length > this._postsPerPage && [
            this.state.previous ? (
              <a href='#' onClick={this.goPage(this.state.previous)}>
                {this.state.previous} 페이지로
              </a>
            ) : (
              <span>첫 페이지</span>
            ),
            this.state.next ? (
              <a
                href='#'
                className={styles.next}
                onClick={this.goPage(this.state.next)}
              >
                {this.state.next} 페이지로
              </a>
            ) : (
              <span className={styles.next}>마지막 페이지</span>
            ),
          ]}
        </nav>
      </div>
    );
  }
}

PostList.propTypes = {
  header: PropTypes.string,
  backLink: PropTypes.string,
  backLinkText: PropTypes.string,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      metadata: PropTypes.shape({
        title: PropTypes.string,
        subtitle: PropTypes.string,
      }),
    })
  ).isRequired,
};
