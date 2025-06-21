import React, { ReactNode } from "react";
import { BlogPost } from "../../../blog/getPosts";
import Comments from "./comments";
import { Article, Header, PostNav, SeriesNav } from "./styled";

export type PostProp = {
  current: BlogPost;
  previous?: BlogPost;
  next?: BlogPost;
  series?: {
    name: string;
    posts: BlogPost[];
  };
};

export default function Post({
  current: post,
  previous,
  next,
  series,
}: PostProp) {
  const dateTime = post.content.metadata.last_modified_at
    ? `${new Date(post.content.metadata.date!).toLocaleString("ko-KR")}에 ${post.content.metadata.author}이(가) 작성하고 ${new Date(post.content.metadata.last_modified_at).toLocaleString("ko-KR")}에 수정함.`
    : `${new Date(post.content.metadata.date!).toLocaleString("ko-KR")}에 ${post.content.metadata.author}이(가) 작성함.`;
  const hasLinks =
    !!post.content.metadata.category || !!post.content.metadata.tags;
  const tagLinks = post.content.metadata.tags
    ?.map(tag => <a href={`/tag/${tag}`}>{tag}</a>)
    .reduce((pv, cv, idx, arr) => {
      pv.push(cv);
      if (idx !== arr.length - 1) pv.push(<>, </>);

      return pv;
    }, [] as ReactNode[]);

  return (
    <div>
      <Header>
        <div className="title">
          <h2>{post.content.metadata.title}</h2>
          {post.content.metadata.subtitle && (
            <h3>{post.content.metadata.subtitle}</h3>
          )}
        </div>
        <p className="datetime">{dateTime}</p>
        {hasLinks && (
          <div className="links">
            {post.content.metadata.category && (
              <div className="link">
                <span className="description">카테고리: </span>
                <a href={`/category/${post.content.metadata.category}`}>
                  {post.content.metadata.category}
                </a>
              </div>
            )}
            {post.content.metadata.tags && (
              <div className="link">
                <span className="description">테그: </span>
                {tagLinks}
              </div>
            )}
          </div>
        )}
      </Header>
      {series && (
        <SeriesNav>
          <div className="title">(시리즈) {series.name}</div>
          <ul>
            {series.posts.map(i => (
              <li>
                <a
                  href={`/post/${encodeURIComponent(i.name)}`}
                  className={i.name === post.name ? "active" : undefined}
                >
                  {i.content.metadata.title}
                </a>
              </li>
            ))}
          </ul>
        </SeriesNav>
      )}
      <Article dangerouslySetInnerHTML={{ __html: post.content.parsed }} />
      <Comments />
      <PostNav>
        {previous ? (
          <a
            href={`/post/${encodeURIComponent(previous.name)}`}
            className="previous"
          >
            <div className="arrow">❮</div>
            <div className="inner">
              <div className="title">{previous.content.metadata.title}</div>
              <div className="subtitle">
                {previous.content.metadata.subtitle}
              </div>
              <div className="date">
                {new Date(previous.content.metadata.date!).toLocaleString(
                  "ko-KR",
                )}
              </div>
            </div>
          </a>
        ) : (
          <div className="noop">첫 게시글입니다.</div>
        )}
        {next ? (
          <a href={`/post/${encodeURIComponent(next.name)}`} className="next">
            <div className="inner">
              <div className="title">{next.content.metadata.title}</div>
              <div className="subtitle">{next.content.metadata.subtitle}</div>
              <div className="date">
                {new Date(next.content.metadata.date!).toLocaleString("ko-KR")}
              </div>
            </div>
            <div className="arrow">❯</div>
          </a>
        ) : (
          <div className="noop">마지막 게시글입니다.</div>
        )}
      </PostNav>
    </div>
  );
}
