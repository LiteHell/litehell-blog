import React, { ReactNode } from "react";
import { BlogPost } from "../../../blog/getPosts";
import Comments from "./comments";
import { Article, Header, PostNav, SeriesNav, TranslationInfo } from "./styled";
import useFormatMessage from "../../i18n/useFormatMessage";
import useCurrentLang from "../../i18n/useCurrentLang";

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
  const formatMessage = useFormatMessage();
  const currentLang = useCurrentLang();
  const dateTime = formatMessage(
    post.content.metadata.last_modified_at
      ? "post.dateTime.with_last_modificated_at"
      : "post.dateTime",
    {
      ...post.content.metadata,
      date: new Date(post.content.metadata.date!).toLocaleString(currentLang),
    },
  );
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
                <span className="description">
                  {formatMessage("post.categories")}
                </span>
                <a href={`/category/${post.content.metadata.category}`}>
                  {post.content.metadata.category}
                </a>
              </div>
            )}
            {post.content.metadata.tags && (
              <div className="link">
                <span className="description">
                  {formatMessage("post.tags")}
                </span>
                {tagLinks}
              </div>
            )}
          </div>
        )}
      </Header>
      {series && (
        <SeriesNav>
          <div className="title">{formatMessage("post.series", series)}</div>
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
      {post.content.lang !== currentLang && !post.content.translated ? (
        <TranslationInfo>
          {formatMessage("post.translation_info.untranslated_text")}
        </TranslationInfo>
      ) : !!post.content.translated ? (
        <TranslationInfo>
          {post.content.metadata.translated_at
            ? formatMessage("post.translation_info.translated_at", {
                translated_at: new Date(
                  post.content.metadata.translated_at!,
                ).toLocaleString(currentLang),
              })
            : formatMessage("post.translation_info.translated_text")}
        </TranslationInfo>
      ) : null}
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
                  currentLang,
                )}
              </div>
            </div>
          </a>
        ) : (
          <div className="noop">{formatMessage("post.onFirstArticle")}</div>
        )}
        {next ? (
          <a href={`/post/${encodeURIComponent(next.name)}`} className="next">
            <div className="inner">
              <div className="title">{next.content.metadata.title}</div>
              <div className="subtitle">{next.content.metadata.subtitle}</div>
              <div className="date">
                {new Date(next.content.metadata.date!).toLocaleString(
                  currentLang,
                )}
              </div>
            </div>
            <div className="arrow">❯</div>
          </a>
        ) : (
          <div className="noop">{formatMessage("post.onLastArticle")}</div>
        )}
      </PostNav>
    </div>
  );
}
