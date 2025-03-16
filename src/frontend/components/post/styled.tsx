import styled from "@emotion/styled";

export const Header = styled.div`
  padding: 1.5rem 0rem 2rem 0rem;
  margin-bottom: 0.8rem;
  border-bottom: 1px solid #999999;

  .title {
    margin-bottom: 0.25rem;
    * {
      display: inline;
      margin: 0rem;
      padding: 0rem;
    }
    h2 {
      font-size: 2rem;
      line-height: 2.1rem;
    }
    h3 {
      margin-left: 1rem;
      font-size: 1rem;
      line-height: 1rem;
      font-weight: 200;
    }
  }

  .datetime {
    margin: 0rem;
    padding: 0rem;
    color: #666666;
  }

  .links {
    .description {
      color: #666666;
    }
  }
`;

export const Article = styled.article`
  padding: 10px 10px;
  font-size: 1rem;
  line-height: 180%;

  pre {
    overflow-x: auto;
  }
  h1 {
    font-size: 1.8rem;
    margin: 1.8rem 0px;
    &::before {
      content: "# ";
      color: #a19c91;
    }
  }
  h2 {
    font-size: 1.6rem;
    margin: 1.6rem 0px;
    &::before {
      content: "## ";
      color: #a19c91;
    }
  }
  h3 {
    font-size: 1.4rem;
    margin: 1.4rem 0px;
    &::before {
      content: "### ";
      color: #a19c91;
    }
  }
  h4 {
    font-size: 1.2rem;
    margin: 1.2rem 0px;
  }
  h5 {
    font-size: 1.15rem;
    margin: 1.15rem 0px;
    &::before {
      content: "> ";
      color: #a19c91;
    }
  }
  h6 {
    font-size: 1.1rem;
    margin: 1.1rem 0px;
    &::before {
      content: ">> ";
      color: #a19c91;
    }
  }
  img,
  iframe {
    display: block;
    margin: 0 auto;
    max-width: 80%;
  }
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
    border-collapse: collapse;
    td,
    tr,
    th {
      border: 1px gray solid;
    }
    th {
      font-weight: bold;
    }
    th,
    td {
      padding: 5px 10px;
    }
    thead {
      background: rgb(216, 216, 216);
    }
  }
  blockquote {
    background: rgb(194, 194, 194);
    margin: 25px 10px 25px 30px;
    padding: 10px 50px;
    border-left: 5px solid rgb(78, 78, 78);
  }
  ul,
  ol {
    li {
      margin: 6px 0px;
    }
  }
`;

export const SeriesNav = styled.nav`
  border: 1px solid #666666;
  border-radius: 4px 4px;
  background: #dddddd;
  padding: 1em;

  .title {
    font-weight: 600;
  }
  .active {
    font-weight: 600;
  }
  ul {
    margin: 1em 0px 0px 0px;
  }
`;

export const PostNav = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;

  a {
    text-decoration: none;
  }

  .inner {
    display: inline-block;
    vertical-align: top;

    .title {
      font-size: 1.3em;
    }
    .subtitle {
      font-weight: 200;
    }
    .date {
      font-size: 0.8em;
      font-weight: 200;
    }
  }

  .next::after {
    content: " ❯";
    font-size: 1.25em;
  }

  .previous::before {
    content: "❮ ";
    font-size: 1.25em;
  }
`;
