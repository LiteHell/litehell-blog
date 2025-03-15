import React, { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div>
      <header>
        <h1>LiteHell의 블로그</h1>
      </header>
      <main>{children}</main>
      <footer>Copyright (C) LiteHell</footer>
    </div>
  );
}
