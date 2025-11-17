import React from "react";
import { Comments as CommentsContainer } from "./styled";

export default function Comments({ term }: { term: string }) {
  const props = {};

  return (
    <CommentsContainer
      dangerouslySetInnerHTML={{
        __html: `
        <script 
        src="https://utteranc.es/client.js"
        repo="LiteHell/litehell-blog"
        issue-term="${term}"
        label="blog comment"
        theme="preferred-color-scheme"
        crossorigin="anonymous"
        async="async"></script>
    `,
      }}
    ></CommentsContainer>
  );
}
