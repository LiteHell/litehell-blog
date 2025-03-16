---
title: 'Webpack과 React를 이용한 정적 웹사이트 만들기 (2)'
subtitle: '... + Static HTML Generation = TA-DA!'
author: 'LiteHell'
date: '2023-01-10T05:00:54.358Z'
category: 'Dev'
series: 'webpack_and_react_ssg'
tags:
    - 'React'
---
# 들어가는 글
1편에서와 같이 개발하면 매우 잘 된다, 구조가 단순하기 때문이다. 1편의 방식을 개발했을 때 빌드된 결과물을 보면 다음과 같이 생겼을 것이다.

```html
<!-- dist/index.html -->
<!-- 참고로 이 예시는 예시일뿐이며, 세부사항은 개개인의 상황에 따라 다를 수 있다. -->
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Lorem ipsum</title>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <script defer="defer" src="166.js"></script>
        <script defer="defer" src="main.js"></script>
    </head>
    <body>

    </body>
</html>
```

1편에서 번들링된 파일이 script 태그로 삽입되어 HTML 문서가 불려와진 후 모두 끝난 후 실행되는 형태이다. (`defer`속성은 스크립트가 문서 분석 이후에 실행되도록 한다.)

즉, **CSR(Client-Side Rendering)** 방식이다. body 태그 내에 div 태그를 만들고 해당 태그에 React Component를 렌더링하는 코드가 클라이언트단에서 모두 실행되는 방식이다. 빌드 단계에서 렌더링이 이루어지지 않으며, 빌드 단계에서 이루어지는 것은 오직 코드 번들링뿐이다.

리소스가 한 번만 로드되고 후속 페이지 로드시간이 빠르다는 장점이 있지만 몇가지 단점도 있다.
- SEO(검색 엔진 최적화)에 불리하다.
- 초기 페이지 로드시간이 느리며, 다 로드되기 전까진 흰 화면만 뜬다. (필요한 JavaScript와 CSS를 다 불러와야 하기 때문이다.)

이러한 단점들을 극복하려면 어떻게 해야할까?

## with React Hydration
빌드시에 초기 HTML을 생성하고, 진입 스크립트을 hydration을 하는 방식으로 수정하면 된다. 여기서 hydration이란 ReactDOMServer에 의해 렌더링된 초기 마크업 코드에 이벤트 리스너를 연결(즉, 요약하자면 재활용)하는 것이다.

이 방식을 이용하면 HTML 마크업 코드는 빌드 단계에서 생성되고, 클라이언트단에서는 React가 이미 생성된 HTML 코드에 부착(attach)하여 동작한다. 이 방식의 장점은 다음과 같다.
- SEO(검색 엔진 최적화)에 유리하다.
- JavaScript와 CSS가 다 불려와지기 전까지 흰화면만 뜨는 현상을 수정할 수 있다.

이 방식을 채택하기 전에 먼지 어떤 사항을 확인해야 하는지 한 번 알아보자.

### 유효한 HTML코드 작성
모든 HTML 코드는 유효하게 작성되어야 한다. 예시를 들자면, p태그 안에는 p태그가 들어갈 수 없다.

React hydration을 하기 위해서는, 빌드단에서 생성된 HTML 코드와 React Component가 생성하는 UI 코드가 일치해야 한다. 만약 초기 UI 불일치 오류가 나타난다면, 유효하지 않은 HTML 코드를 작성한 건 아닌지 한 번 확인해봐야 한다.

### 클라이언트단에서만 작동하는 코드 수정
Node.js 환경에서 실행되면 오류가 나는 코드가 있다. 이런 코드들은 브라우저 환경에서만 실행되도록 수정해야 한다.

```tsx
// 예시

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined'

if (isBrowser())
    import('../some_module_that_works_only_on_browser');
```

또한, 브라우저단에서 결과가 결정되거나 항상 일정하지 않은 코드는 `useEffect` 등을 이용해 UI가 렌더링된 이후에 실행되도록 수정해야 한다. 
`useState`와 `useEffect` 등은 브라우저단에서만 렌더링된다.
```tsx
import { useState, useEffect } from 'react';

// 예시
export default function AreYouKorean() {
    // const isKorean = navigator.language === 'ko';
    const [isKorean, setIsKorean] = useState<boolean | null>(null);
    useEffect(() => {
        setIsKorean(navigator.language === 'ko');
    });

    let message: string = '...';
    if (isKorean !== null)
        message = isKorean ? '한국인이시군요.' : "You're not Korean!";
    return <div>{ message }</div>
}
```

### 결과가 불명확한 코드 수정
이런 코드는 당연히 빌드할 때 생긴 초기 UI와 클라이언트 렌더링시의 초기 UI가 서로 다르게 한다. 빌드시 시간의 초 단위가 짝수면 결과는 *Yes!*가 렌더링될텐데, 사용자가 로드할 때 시간이 홀수면 *No!*가 렌더링되니 서로 불일치하다. 이런 코드가 있다면 수정해야 한다.
```tsx
export default function isTimeEven() {
    const time = (new Date()).getSeconds() % 2 === 0;
    return time ? <p> Yes! </p> : <p> No! </p>;
}
```

## hydration 적용
위에서 언급한 문제를 모두 수정했다면 hydration시 초기 UI 불일치 오류는 없을 것이다. 이제 hydration을 적용해보자.

### 진입 스크립트 수정
먼저, hydrate하도록 `src/index.tsx`를 수정하자.
```tsx
// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import '../styles/index.css';
import isBrowser from './isBrowser';

export default function Index() {
    return <div className="bg-gray-400">
      Hello, World!
    </div>
}

// 만약 브라우저라면
if (isBrowser()) {
    // body > #root 태그에
    const rootDiv = document.querySelector('body > #root')!;
    // hydration이 필요하다면 (빌드 결과물)
    if (rootDiv.classList.contains('hydrate')) {
        // Index 컴포넌트를 hydrate한다.
        ReactDOM.hydrateRoot(rootDiv, <Index />);
    } else /* 만약 hydration이 필요없다면 (webpack serve) */ {
        // 그냥 렌더링 한다.
        const root = ReactDOM.createRoot(rootDiv);
        root.render(<Index />)
    }
}
```

브라우저 환경 여부를 판단하는 `src/isBrowser.ts`도 간단하게 작성한다.
```ts
// src/isBrowser.ts

export default function isBrowser () {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}
```

`src/index.tsx`는 빌드 스크립트에서도 import된다. 따라서 브라우저단에서만 실행되야 하는 코드는 브라우저단에서만 실행되도록 수정해야 한다.

### HTML 템플릿 생성
그 다음으로, 간단한 HTML 템플릿을 생성한다.

```html
<!-- src/index.html -->

<!DOCTYPE html>
<html lang="ko">
    <head>
        <meta charset="utf8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Lorem ipsum</title>
    </head>
    <body>
        <div id="root">

        </div>
    </body>
</html>
```

### HTML 생성 스크립트 추가
초기 HTML 코드를 생성하는 스크립트를 작성해야 한다. 먼저 스크립트 작성 전에 의존성을 몇가지 설치하자.
```bash
yarn add cheerio tmp-promise
```

그 다음으로, 다음과 같이 스크립트를 작성한다.
```tsx
// src/generate.tsx

import { load as loadHTML } from 'cheerio';
import { createWriteStream, promises as fs } from 'fs';
import React from 'react';
import server from 'react-dom/server';
import tmp from 'tmp-promise';
import Index from './index';

(async () => {
    // 임시 파일을 생성한다.
    const tmpFile = await tmp.file();

    // Webpack 번들러에 의해 생성된 HTML 파일의 위치이다.
    const filename = './dist/index.html';

    // 초기 UI 코드를 생성하는 ReactDOMServer의 스트림이다.
    const reactStream = server.renderToPipeableStream(<Index />);
    
    // 스트림을 임시 파일에 쓴다.
    const fileStream = createWriteStream(tmpFile.path);
    
    // 초기 UI 코드가 임시 파일에 모두 써졌으면
    reactStream.pipe(fileStream).on('finish', async () => {
        // 웹팩에 의해 번들링된 HTML 파일을 읽는다.
        const htmlText = await fs.readFile(filename, { encoding: 'utf8' });

        // HTML 파일의 id가 root인 태그에 초기 UI 코드를 넣는다.
        const dom = loadHTML(htmlText);
        dom('body > #root').html(await fs.readFile(tmpFile.path, { encoding: 'utf8' }));
        dom('body > #root').addClass('hydrate');
        dom('body > #root');

        // HTML 코드를 저장한다.
        await fs.writeFile(filename, dom.html());
    });
})();
```

### Webpack 설정 수정
Webpack 설정 파일에 생성 스크립트로 번들링하는 설정을 추가한다.
Node.js를 타켓팅할 시 일부 모듈은 C/C++ 에드온을 이용할 수 있다. 따라서 해당 경우에 대응할 수 있도록 [node-loader](https://www.npmjs.com/package/node-loader) 의존성을 같이 설치한다. (만약 그러한 모듈이 없다면 이 문단에서 `.node` 관련 내용은 무시해도 된다.) [empty-loader](https://www.npmjs.com/package/empty-loader) 모듈은 빌드 스크립트에서 CSS 파일을 무시하는 데 이용된다.
```bash
yarn add --dev node-loader empty-loader
```

그리고 다음과 같이 `webpack.config.js`를 수정한다.
```js
// webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const dev = process.env.NODE_ENV === 'development';

// src/index.tsx 설정과 src/generate.ts 설정에 공통적으로 들어가는 항목들이다.
const commons = {
    mode: dev ? "development" : "production",
    resolve: {
        // .node가 추가되었다.
        extensions: ['.tsx', '.ts', '.js', '.css', '.node']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react', '@babel/preset-env']
                        }
                    },
                    'ts-loader'
                ]
            },
            {
                // .node 파일을 로드한다.
                test: /\.node$/,
                use: 'node-loader'
            }
        ]
    },
    plugins: [new CleanWebpackPlugin()]
};

module.exports = [/* src/index.tsx 설정 */{
    ...commons,
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
      minimize: !dev
    },
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        ...commons.module,
        rules: [
            ...commons.module.rules,
            // CSS를 빌드시 로드하도록 하면 오류가 발생한다. (Node.js 환경은 웹브라우저가 아니므로 스타일 주입 시도가 당연히 실패하기 때문이다.)
            // 따라서 css파일은 웹브라우저단에서 로드되는 번들 스크립트에서만 주입되도록 
            // src/index.tsx Webpack 설정에만 추가한다.
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
        ]
    },
    plugins: [
        ...commons.plugins,
        new HtmlWebpackPlugin({
        filename: 'index.html',
        // template 속성을 추가한다.
        template: './src/index.html'
    })],
    devServer: {
        static: {directory: path.join(__dirname, 'dist')},
        open: true,
        port: 'auto',
    },
    watchOptions: {
        ignored: /node_modules/
    }
}, /* src/generate.tsx 설정 */ {
    ...commons,
    // node로 실행할 스크립트이기 때문에 target을 node로 한다.
    target: 'node',
    // entry는 src/generate.tsx로 한다.
    entry: './src/generate.tsx',
    module: {
        ...commons.module,
        rules: [
            ...commons.module.rules,
            {
                // css파일은 무시한다.
                test: /\.css$/,
                use: ['empty-loader']
            },
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist-builder'),
        filename: 'index.js'
    }
}]
```

## 빌드 스크립트 실행
이제 거의 다 됐다. 다음 명령어로 빌드해보자.
```bash
npx webpack build
node ./dist-builder
```

별 다른 오류없이 잘 될 것이다. 축하한다. 이제 앞으로 위 명령어로 빌드하면 초기 HTML 코드가 들어가있는 파일이 빌드될 것이다. 해당 빌드의 결과는 다음과 같다.

```html
<!-- dist/index.html -->
<!-- 참고로 이 예시는 예시일뿐이며, 세부사항은 개개인의 상황에 따라 다를 수 있다. -->
<!DOCTYPE html>
<html lang="ko">
    <head>
        <meta charset="utf8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Lorem ipsum</title>
        <script defer="defer" src="166.js"></script>
        <script defer="defer" src="main.js"></script>
    </head>
    <body>
        <div id="root">
            <div class="bg-gray-400">Hello, World!</div>
        </div>
    </body>
</html>
```