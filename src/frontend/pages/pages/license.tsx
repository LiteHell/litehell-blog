import React from "react";
import Layout from "../../components/layout";
import { Article } from "../../components/post/styled";
import useFormatMessage from "../../i18n/useFormatMessage";

export default function License() {
  const formatMessage = useFormatMessage();

  return (
    <Layout>
      <Article>
        <h1>{formatMessage("license.contact_and_copyright.title")}</h1>
        <section
          dangerouslySetInnerHTML={{
            __html: formatMessage(
              "license.contact_and_copyright.firstSection.html",
            ),
          }}
        />
        <section
          className="content-license"
          dangerouslySetInnerHTML={{
            __html: formatMessage(
              "license.contact_and_copyright.contentLicense.html",
            ),
          }}
        />
        <section className="blog-src-code-license">
          <p></p>
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
