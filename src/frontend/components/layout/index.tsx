import React, { PropsWithChildren } from "react";
import { Footer, Header, LayoutContainer, Note } from "./styled";
import useFormatMessage from "../../i18n/useFormatMessage";
import { FormattedMessage } from "react-intl";
import useCurrentLang from "../../i18n/useCurrentLang";
import getSupportedLangs from "../../i18n/getSupportedLangs";

export default function Layout({ children }: PropsWithChildren) {
  const formatMessage = useFormatMessage();
  const currentLang = useCurrentLang();
  const supportedLangs = getSupportedLangs();

  return (
    <LayoutContainer>
      <Header>
        <div className="profileImg">
          <a href="/">
            <img
              src="https://gravatar.com/avatar/837266b567b50fd59e72428220bf69b1"
              alt={formatMessage("layout.gravatar.alt")}
            ></img>
          </a>
        </div>
        <div className="title">
          <h1>
            <a href="/">{formatMessage("layout.title")}</a>
          </h1>
          <p className="links">
            {formatMessage("layout.externalLinks")}:{" "}
            <a href="https://github.com/litehell">GitHub</a>,{" "}
            <a href="https://yeonjin.name/portfolio">Portfolio</a>
            <br />
            {formatMessage("layout.internalLinks")}:{" "}
            <a href="/categories">
              {formatMessage("layout.internalLinks.category")}
            </a>
            , <a href="/tags">{formatMessage("layout.internalLinks.tags")}</a>
            <br />
            {formatMessage("layout.otherLanguages")}:{" "}
            {supportedLangs
              .filter(lang => lang !== currentLang)
              .map(lang => {
                const url =
                  lang === "ko"
                    ? "https://blog.litehell.info"
                    : `https://blog-${lang}.litehell.info`;

                return (
                  <a href={url}>
                    {new Intl.DisplayNames(currentLang, {
                      type: "language",
                    }).of(lang)}{" "}
                    (
                    {new Intl.DisplayNames(lang, { type: "language" }).of(lang)}
                    )
                  </a>
                );
              })}
          </p>
          <Note>
            <FormattedMessage id="layout.note" />
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
