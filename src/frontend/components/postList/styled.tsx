import styled from "@emotion/styled";

export const PostListUl = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 2rem 0rem 3rem 0rem;

  gap: 2rem;
  padding-left: 1.5rem;

  li {
    display: block;

    a {
      color: inherit;
      text-decoration: none;
    }

    .title {
      font-size: 1.6em;
    }
    .subtitle {
      font-size: 0.95em;
    }
    .date {
      font-weight: 200;
      font-size: 0.9em;
      color: #535353;

      .untranslated {
        display: inline-block;
        color: #cc7c7cff;
        margin-left: 0.5rem;
      }
    }
  }
`;

export const Title = styled.div`
  h2 {
    font-size: 1.4rem;
    line-height: 2rem;
    margin: 0.25rem 0rem 0rem 0rem;
    padding: 0rem;
  }
  .backLink {
    font-size: 0.9rem;
    line-height: 1rem;
    margin: 0rem 0rem 0.25rem 0rem;
    padding: 0rem;
  }
`;

export const Navigation = styled.nav`
  display: flex;
  flex-direction: row;
  gap: 4em;

  width: 100%;
  max-width: 300px;
`;
