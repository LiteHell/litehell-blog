import React from "react";
import { BlogPostMetadata } from "../../blog/parsePostMetadata";

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
      <h2>{title} </h2>
      {backLink && (
        <div>
          <a href={backLink.href}>&lt; {backLink.label}</a>
        </div>
      )}
      <ul>
        {posts.map((post) => (
          <li>
            <a href={post.link}>{post.metadata.title}</a>
          </li>
        ))}
      </ul>
      <nav>
        {navigation?.prev && (
          <a href={navigation.prev.href}>{navigation.prev.page} 페이지로</a>
        )}
        {navigation?.next && (
          <a href={navigation.next.href}>{navigation.next.page} 페이지로</a>
        )}
      </nav>
    </div>
  );
}
