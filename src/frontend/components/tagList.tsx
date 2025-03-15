import React from "react";

export type TagListProp = {
  tags: { name: string; href: string; count: number }[];
  title?: string;
};

export default function TagList({ tags, title }: TagListProp) {
  return (
    <div>
      <h2>{title ?? "태그 목록"}</h2>
      <ul>
        {tags.map((tag) => (
          <li>
            <a href={tag.href}>
              {tag.name} ({tag.count})
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
