import React from "react";
import { Tag, Tags, Title } from "./styled";

export type TagListProp = {
  tags: { name: string; href: string; count: number }[];
  title?: string;
};

export default function TagList({ tags, title }: TagListProp) {
  return (
    <div>
      <Title>{title ?? "태그 목록"}</Title>
      <Tags>
        {tags.map(tag => (
          <Tag>
            <a href={tag.href}>
              {tag.name} <span className="count">({tag.count})</span>
            </a>
          </Tag>
        ))}
      </Tags>
    </div>
  );
}
