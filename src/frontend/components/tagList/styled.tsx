import styled from "@emotion/styled";

export const Title = styled.h2`
  font-size: 1.4rem;
  line-height: 2rem;
  margin: 0.25rem 0rem 0rem 0rem;
  padding: 0rem;
`;

export const Tag = styled.li`
  font-size: 2rem;
  .count {
    font-size: 1.2rem;
  }
  a {
    text-decoration: none;
  }
`;

export const Tags = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  list-style: none;

  margin: 2rem 0rem 3rem 0rem;
  padding: 0rem;
  padding-left: 1.5rem;

  li {
    display: block;
  }
`;
