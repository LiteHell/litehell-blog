import React from "react";
import Layout from "../../components/layout";
import { Article } from "../../components/post/styled";

export default function License() {
  return (
    <Layout>
      <Article>
        <h1>저작권 안내 및 연락처</h1>
        <section>
          본 블로그의 주인에게 문의하고자 하시는 분은{" "}
          <a href="mailto:litehell@litehell.info">litehell@litehell.info</a>로
          이메일을 보내주시기 바랍니다.
        </section>
        <section className="content-license">
          <h2>컨텐츠 저작권 안내</h2>본 블로그의 컨텐츠는{" "}
          <a
            rel="license"
            href="http://creativecommons.org/licenses/by-sa/4.0/"
          >
            크리에이티브 커먼즈 저작자표시-동일조건변경허락 4.0 국제 라이선스
          </a>
          에 따라 이용할 수 있습니다.
        </section>
        <section className="blog-src-code-license">
          <h2>블로그 소스 코드 라이선스</h2>
          <p>
            본 블로그는 자유 소프트웨어입니다. 본 블로그의 소스 코드는{" "}
            <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">
              GNU Affero General Public License 버전 3 혹은 그 이후 버전
            </a>
            에 따라 배포되며,&nbsp;
            <a href="https://github.com/litehell/litehell-blog">GitHub</a>에서
            소스 코드를 확인하실 수 있습니다. 라이선스 전문은 소스 코드 디렉토리
            내의 COPYING 파일을 확인해주세요.
          </p>
          <pre>
            LiteHell's Blog
            <br />
            Copyright (C) 2020 ~ 2024 Yeonjin Shin
            <br />
            <br />
            This program is free software: you can redistribute it and/or modify
            <br />
            it under the terms of the GNU Affero General Public License as
            <br />
            published by the Free Software Foundation, either version 3 of the
            <br />
            License, or (at your option) any later version.
            <br />
            <br />
            This program is distributed in the hope that it will be useful,
            <br />
            but WITHOUT ANY WARRANTY; without even the implied warranty of
            <br />
            MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
            <br />
            GNU Affero General Public License for more details.
            <br />
            <br />
            You should have received a copy of the GNU Affero General Public
            License
            <br />
            along with this program. If not, see &lt;
            <a href="https://www.gnu.org/licenses/">
              https://www.gnu.org/licenses/
            </a>
            &gt;.
          </pre>
        </section>
      </Article>
    </Layout>
  );
}
