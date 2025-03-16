import React from "react";
import { BlogPostMetadata } from "../../../blog/parsePostMetadata";
import { Navigation, PostListUl, Title } from "./styled";

type PostListProp = {
  title: string;
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
  }[];
};

export default function PostList({
  title,
  backLink,
  navigation,
  posts,
}: PostListProp) {
  return (
    <div>
      <Title>
        <h2>{title} </h2>
        <div className="backLink">
          {backLink && <a href={backLink.href}>&lt; {backLink.label}</a>}
        </div>
      </Title>
      <PostListUl>
        {posts.map((post) => (
          <li>
            <a href={post.link}>
              <div className="title">{post.metadata.title}</div>
              <div className="subtitle">{post.metadata.subtitle}</div>
              <div className="date">
                {new Date(post.metadata.date!).toLocaleString()}
              </div>
            </a>
          </li>
        ))}
      </PostListUl>
      {(!!navigation?.prev || !!navigation?.next) && (
        <Navigation>
          {navigation?.prev ? (
            <a href={navigation.prev.href}>{navigation.prev.page} 페이지로</a>
          ) : (
            <div>첫 페이지</div>
          )}
          {navigation?.next ? (
            <a href={navigation.next.href}>{navigation.next.page} 페이지로</a>
          ) : (
            <div>마지막 페이지</div>
          )}
        </Navigation>
      )}
    </div>
  );
}
