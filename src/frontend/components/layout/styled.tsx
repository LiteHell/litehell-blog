import styled from "@emotion/styled";

export const Note = styled.p`
  font-size: 75%;
  color: #5e5e5e;
`;

export const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  --top-padding: max(40px, 3rem);
  --vertical-padding: max(20px, 2em);
  padding: var(--top-padding) var(--vertical-padding) 0em
    var(--vertical-padding);
  min-height: 100vh;
  box-sizing: border-box;

  & > * {
    width: 100%;
    @media (min-width: 1024px) {
      max-width: 960px;
    }
  }

  main {
    flex: 1;
  }

  footer {
    padding: 1.5rem 0rem;
    margin: 2rem 0rem 0rem 0rem;
    border-top: 1px solid #727272;
  }
`;

export const Header = styled.header`
  display: flex;
  flex-direction: row;

  @media (max-width: 25rem) {
    flex-direction: column;
  }

  align-items: center;
  gap: 2rem;
  padding-bottom: 1.5rem;

  .profileImg {
    a {
      color: inherit;
      text-decoration: none;
    }
    img {
      width: 8rem;
      height: 8rem;
      border-radius: 4rem 4rem;
      box-shadow:
        0 3px 6px rgba(0, 0, 0, 0.16),
        0 3px 6px rgba(0, 0, 0, 0.23);
    }
  }

  .title h1 {
    font-size: 2rem;
    line-height: 2.5rem;
    margin: 0rem 0rem 0.5rem 0rem;
    padding: 0rem;
    word-break: keep-all;

    a {
      color: inherit;
      text-decoration: none;
    }
  }

  .links {
    margin: 0rem;
    padding: 0rem;

    font-size: 0.9rem;
    line-height: 1.2rem;
  }

  @media (max-width: 1023px) {
    .title h1 {
      font-size: 1.5rem;
      line-height: 2rem;
    }
    .rounded img {
      width: 7rem;
      height: 7rem;
      border-radius: 3.5rem 3.4rem;
    }
  }
`;

export const Footer = styled.footer`
  font-size: 0.75rem;
  line-height: 0.9rem;

  p {
    margin: 0em 0em 1em 0em;
    padding: 0em;
  }

  .badges {
    display: flex;
    flex-direction: row;
    gap: 1em;

    img {
      border-width: 0px;
      height: 3em;
      width: auto;
    }
  }
`;
