---
title: 'Webpack과 React를 이용한 정적 웹사이트 만들기 (1)'
subtitle: 'Webpack + TypeScript + React + TailwindCSS = TA-DA!'
author: 'LiteHell'
date: '2023-01-10T05:00:48.244Z'
series: 'webpack_and_react_ssg'
seriesName: 'Webpack과 React를 이용한 정적 웹사이트 만들기'
category: 'Dev'
tags:
    - 'React'
---
# 들어가는 글
본래 [내 개인 웹사이트](https://litehell.info)는 [Next.js의 Static HTML Export 기능](https://nextjs.org/docs/advanced-features/static-html-export)과 [GitHub Pages](https://pages.github.com/)를 이용해 배포됐다. 디자인에는 [bulma CSS 프레임워크](https://bulma.io)를 이용했다.

![홈페이지 재디자인 전의 이미지](./homepage_before_redesign_2022.png)

위와 같이 bulma에서 제공하는 component들을 이용해 간단하게 디자인했다.

그러나 내 웹사이트를 몇 번 보다보니 디자인을 좀 설렁설렁하게 한 느낌이 들었다. 그래서 디자인을 한 번 바꿔보고 싶었고, 이번 기회에 Next.js를 쓰지 않고 직접 정적 파일로 배포하는 경험도 해보고 싶었다.

이 글은 개인 홈페이지를 재작성한 경험에 기반하여 쓰는 글이지만, 독자들이 따라하며 참고할 수 있도록 일부 변형하여 작성했다. 설명을 최대한 자세하게 하려 노력했지만, 글 쓰는 실력이 좋은 편이 아니라 읽기 불편할 수 있으니 양해해주셨으면 좋겠다.

# Webpack과 Babel, 그리고 Typescript
Next.js는 쓰지 않았다. 간단한 한 페이지 정적 페이지 만드는 데에는 Webpack이면 충분하다.

이제 어떤 기술스택을 쓸 지 정했다, 이제 필요한 의존성을 먼저 설치하면 된다. 의존성을 한 번 설치해보자.

## 의존성 설치하기

먼저 React와 Typescript를 설치한다. 재디자인 전에 했듯이 이번에도 React로 개발할 것이다.
```bash
yarn add react-dom react
yarn add --dev typescript react @types/react @types/react-dom
```

그 다음, 다음 명령어로 tsconfig.json을 생성한다.
```bash
npx tsc --init
```

생성된 tsconfig.json에서 `jsx` 속성을 `react`로(다르게 해도 되긴 한데 나는 이렇게 했다), 그리고 `moduleResolution` 속성은 `node`로 바꾸어야 한다. 이 외에 나머지 속성들은 개인 취향대로 하면 된다. 일단 개인 취향대로 하고 나중에 코딩하다 `tsconfig.json`때문에 오류나면 그때 수정하면 된다.

참고로 내 `tsconfig.json`는 다음과 같다.
```json
{
  "compilerOptions": {
    "target": "es2016",
    "lib": ["DOM"],
    "jsx": "react",
    "module": "ESNext",
    "moduleResolution": "node",
    "typeRoots": ["node_modules/@types", "src/types"],
    "allowJs": false,
    "checkJs": false,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.tsx", "src/**/*.ts"],
  "exclude": ["node_modules"]
}

```

그 다음으로는 Webpack이 필요하다. 다음 명령어로 Webpack을 추가하자.
```bash
yarn add webpack webpack-cli
yarn add --dev webpack-dev-server ts-loader style-loader clean-webpack-plugin css-loader html-webpack-plugin
```

각 패키지들의 설명은 다음과 같다.
- `webpack`, `webpack-cli` : Webpack이다. 설명이 필요없다.
- `webpack-dev-server` : 수정이 되면 자동으로 webpack 재빌드해서 새로고침되는 웹 서버를 열기 위해 이용한다. 디버깅이 편해진다.
- webpack loader: Webpack에서 특정 유형의 파일을 불러오거나 변형한다.
  - `ts-loader`: `.ts`나 `.tsx`파일을 Webpack에서 읽을 때 쓴다.
  - `css-loader`: css 파일에서 `@import`나 `url()` 구절들을 `import/require()`와 같은 식으로 해석하는 loader다.
  - `style-loader`: css를 웹페이지에 추가하는 loader다
- webpack plugin
  - `clean-webpack-plugin`: 출력 디렉토리내 파일들을 삭제하는 플러그인이다.
  - `html-webpack-plugin`: 생성된 js 파일의 스크립트 태그들이 추가된 html파일을 자동으로 생성한다

나는 이번에 babel을 쓸 것이다. babel은 최신 버전의 자바스크립트 기능을 브라우저 지원에 신경쓰지 않고 쓸 수 있게 해준다. 아래 명령어로 babel도 설치하자.

```bash
yarn add --dev @babel/core @babel/preset-env @babel/preset-react babel-loader
```

[TailwindCSS](https://tailwindcss.com/)가 웹사이트 빠르게 만드는 데 좋다갈래 반신반의하는 느낌으로 한 번 써보려 한다. TailwindCSS를 쓰려면 다음 패키지들을 설치해야 한다.
```bash
yarn add --dev autoprefixer postcss postcss-loader tailwindcss
```

## Webpack 설정하기
이제 Webpack을 설정해야 한다. 루트 디렉토리에 `webpack.config.js`를 생성하고 내용을 다음과 같이 한다.
```js
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const dev = process.env.NODE_ENV === 'development';
module.exports = {
    // 개발시라면 개발 모드로 한다.
    mode: dev ? "development" : "production",
    optimization: {
      splitChunks: {
        // 청크를 가능한만큼 다 분리한다.
        // 파일 각각의 용량을 줄여들어서 웹페이지 로드속도 감소에 도움이 된다.
        chunks: 'all'
      },
      // 개발중이 아니라면 압축한다.
      minimize: !dev
    },
    // 진입 파일이다.
    // ./src/index.tsx 파일에 필요한 모듈들을 번들링한다고 이해하면 된다.
    //
    // 즉, 다시 말해 출력파일을 실행하면 ./src/index.tsx을 실행하는 것과 동일한 효과를 가진다,
    // 다만 필요한 모듈들이 같이 번들링되어 있어 웹 환경 등에서도 실행이 용이할 뿐이다.
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        // index.js로 하면 splitChunks 속성때문에 오류가 난다.
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css']
    },
    module: {
        rules: [
            // 참고: use 속성은 마지막 아이템에서 첫 아이템으로의 순서, 즉 다시 말해 오른쪽에서 왼쪽으로의 순서로 해석된다.
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    // Babel은 현대 자바스크립트를 브라우저 지원여부을 고려할 필요없이 쓸 수 있도록 해준다.
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react', '@babel/preset-env']
                        }
                    },
                    // Typescript를 Javascript로 컴파일해준다.
                    'ts-loader'
                ]
            },
            {
                test: /\.css$/,
                // postcss-loader는 TailwindCSS 적용에 이용된다.
                use: ['style-loader', 'css-loader', 'postcss-loader']
            }
        ]
    },
    plugins: [
        // 빌드전에 dist 디렉토리내 파일들을 먼저 지우고 
        new CleanWebpackPlugin(),
        // 빌드후 출력파일들이 script태그로 포함된 html파일을 생성한다.
        new HtmlWebpackPlugin({
        title: 'Yeonjin Shin',
        filename: 'index.html'
    })],
    // 디버깅할 때 쓰는 웹서버에 관한 설정이다.
    // webpack serve로 열 수 있다.
    devServer: {
        static: {directory: path.join(__dirname, 'dist')},
        open: true,
        port: 'auto',
    },
    // 이거 안하면 node_modules내 수 많은 파일의 변경여부도 같이 확인하기 때문에
    // 디버깅용 웹서버가 정상적으로 작동하지 않는다.
    watchOptions: {
        ignored: /node_modules/
    }
}
```

## TailwindCSS 설정하기
TailwindCSS를 적용하려면 TailwindCSS 설정파일을 생성해야 한다. TailwindCSS 설정 파일은 다음 명령어로 생성할 수 있다. `-p` 매개변수를 주면 PostCSS 설정파일도 같이 생성해준다.
```bash
npx tailwindcss init -p
```

`postcss.config.js`는 생성된 그대로 쓰면 되고, `tailwind.config.js`만 수정하면 된다. `tailwind.config.js`에 `content` 속성에 TailwindCSS를 사용할 파일 패턴을 넣는다.

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,css,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

이제 TailwindCSS를 쓰기 위해 한 가지만 더 하면 된다. 다음과 같이 `@tailwind` 구문들이 들어간 css파일을 생성하고, 그 css 파일을 프론트엔드 코드에서 추가해주면 된다.
```css
/* styles/index.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ...more css here */
```
```ts
// src/index.tsx

import '../styles/index.css';
// ...more imports and code here
```
TailwindCSS가 추가하는 CSS 코드는 PostCSS와 `postcss-loader`에 의해 CSS 파일에 자동으로 추가된다. 그리고 그 CSS 파일은 위와 같이 import만 해주면 `style-loader`에 의해 웹브라우저에서 html에 자동으로 추가된다.

이제 TailwindCSS, Webpack, React를 쓰기 위한 준비가 끝났다. 코딩만 하면 된다.

## 코딩
아래와 같이 코드를 작성해보자.
```tsx
// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import '../styles/index.css';

function Index() {
    return <div className="bg-gray-400">
      Hello, World!
    </div>
}

const rootDiv = document.createElement('div');
document.body.appendChild(rootDiv);
const root = ReactDOM.createRoot(rootDiv);
root.render(<Index />)
```

이렇게 하고 `npx webpack build`하면 잘 빌드될 것이다. `dist/index.html` 파일을 웹 브라우저로 열였을 때 "Hello, World!"가 뜨면 정상이다.

위와 같은 식으로 코딩하면 된다. 개발할 때는 `npx webpack serve`로 웹 서버를 열면 편하게 디버깅할 수 있다.