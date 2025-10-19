import React, { ReactNode } from "react";
import { Tag, Tags, Title } from "./styled";
import useFormatMessage from "../../i18n/useFormatMessage";

export type TagListProp = {
  tags: { name: string; href: string; count: number }[];
  title?: ReactNode;
};

export default function TagList({ tags, title }: TagListProp) {
  const formatMessage = useFormatMessage();

  return (
    <div>
      <Title>{title ?? formatMessage("tagList.defaultTitle")}</Title>
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
