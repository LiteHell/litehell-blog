import React from "react";
import { Comments as CommentsContainer } from "./styled";

export default function Comments() {
  const props = {};

  return (
    <CommentsContainer
      dangerouslySetInnerHTML={{
        __html: `
        <script 
        src="https://utteranc.es/client.js"
        repo="LiteHell/litehell-blog"
        issue-term="og:title"
        label="blog comment"
        theme="github-light"
        crossorigin="anonymous"
        async="async"></script>
    `,
      }}
    ></CommentsContainer>
  );
}
