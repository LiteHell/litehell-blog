import React, { PropsWithChildren } from "react";
import { Footer, Header, LayoutContainer, Note } from "./styled";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <LayoutContainer>
      <Header>
        <div className="profileImg">
          <a href="/">
            <img
              src="https://gravatar.com/avatar/837266b567b50fd59e72428220bf69b1"
              alt="LiteHell의 Gravatar 아이콘"
            ></img>
          </a>
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
          <Note>
            글 쓸 때는 AI를 안 씁니다. 전부 직접 씁니다. 만약 오탈자나 어색한
            문장이 있다면 퇴고를 대충해서 그런거니 양해 부탁드립니다.
          </Note>
        </div>
      </Header>
      <main>{children}</main>
      <Footer>
        <p>
          Copyright (C) 2020 ~ 2025 Yeonjin Shin (a.k.a. LiteHell), All rights
          reserved.
          <br />
          <a href="/license">
            This blog is free software; For source code and more informations on
            license and copyrights, Click here.
          </a>
        </p>
        <p>
          Feeds: <a href="/feed/rss">RSS 2.0</a>, <a href="/feed/atom">Atom</a>,{" "}
          <a href="/feed/json">JSON</a>
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
            <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">
              <img
                alt="GNU Affero General License Version 3"
                src="https://www.gnu.org/graphics/agplv3-with-text-100x42.png"
              />
            </a>
          </a>
        </div>
      </Footer>
    </LayoutContainer>
  );
}
