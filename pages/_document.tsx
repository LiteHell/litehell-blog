import { Head, Html, Main, NextScript } from 'next/document';
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
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5916984077364289'
          crossOrigin='anonymous'
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
