import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';
import TrackingId from '../modules/gaTrackingId';

export default function Document() {
  return (
    <Html lang='ko-KR'>
      <Head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${TrackingId}`}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${TrackingId}', { page_path: window.location.pathname });
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
