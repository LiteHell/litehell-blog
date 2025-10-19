import React, { ReactNode } from "react";
import { BlogPostMetadata } from "../../../blog/parsePostMetadata";
import { Navigation, PostListUl, Title } from "./styled";
import useFormatMessage from "../../i18n/useFormatMessage";
import useCurrentLang from "../../i18n/useCurrentLang";

type PostListProp = {
  title: ReactNode;
  backLink?: {
    label: string;
    href: string;
  };
  navigation?: {
    prev?: {
      page: number;
      href: string;
    };
    next?: {
      page: number;
      href: string;
    };
  };
  posts: {
    metadata: BlogPostMetadata;
    link: string;
    lang: string;
  }[];
};

export default function PostList({
  title,
  backLink,
  navigation,
  posts,
}: PostListProp) {
  const formatMessage = useFormatMessage();
  const currentLang = useCurrentLang();

  return (
    <div>
      <Title>
        <h2>{title} </h2>
        <div className="backLink">
          {backLink && <a href={backLink.href}>&lt; {backLink.label}</a>}
        </div>
      </Title>
      <PostListUl>
        {posts.map(post => (
          <li>
            <a href={post.link}>
              <div className="title">{post.metadata.title}</div>
              <div className="subtitle">{post.metadata.subtitle}</div>
              <div className="date">
                {new Date(post.metadata.date!).toLocaleString()}

                {post.lang !== currentLang ? (
                  <div className="untranslated">
                    {formatMessage("postList.untranslated")}
                  </div>
                ) : null}
              </div>
            </a>
          </li>
        ))}
      </PostListUl>
      {(!!navigation?.prev || !!navigation?.next) && (
        <Navigation>
          {navigation?.prev ? (
            <a href={navigation.prev.href}>
              {formatMessage("postList.goToNthPage", navigation.prev)}
            </a>
          ) : (
            <div>{formatMessage("postList.firstPage")}</div>
          )}
          {navigation?.next ? (
            <a href={navigation.next.href}>
              {formatMessage("postList.goToNthPage", navigation.next)}
            </a>
          ) : (
            <div>{formatMessage("postList.lastPage")}</div>
          )}
        </Navigation>
      )}
    </div>
  );
}
