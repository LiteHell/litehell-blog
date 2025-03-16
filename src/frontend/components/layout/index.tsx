import React, { PropsWithChildren } from "react";
import { Footer, Header, LayoutContainer } from "./styled";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <LayoutContainer>
      <Header>
        <div className="rounded">
          <img
            src="https://gravatar.com/avatar/837266b567b50fd59e72428220bf69b1"
            alt="LiteHell의 Gravatar 아이콘"
          ></img>
        </div>
        <div className="title">
          <h1>
            <a href="/">LiteHell의 블로그</a>
          </h1>
          <p className="links">
            외부고리: <a href="https://github.com/litehell">GitHub</a>,{" "}
            <a href="https://yeonjin.name/portfolio">Portfolio</a>
            <br />
            내부고리: <a href="/categories">카테고리</a>,{" "}
            <a href="/tags">태그</a>
          </p>
        </div>
      </Header>
      <main>{children}</main>
      <Footer>
        <p>
          Copyright (C) 2020 ~ 2025 Yeonjin Shin (a.k.a. LiteHell), All rights
          reserved.
          <br />
          This blog is free software; For source code and more informations on
          license and copyrights, Click here.
        </p>
        <div className="badges">
          <a
            rel="license"
            href="http://creativecommons.org/licenses/by-sa/4.0/"
          >
            <img
              alt="Creative Commons License"
              src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png"
            />
          </a>
        </div>
      </Footer>
    </LayoutContainer>
  );
}
