---
title: 'Webpack과 React를 이용한 정적 웹사이트 만들기 (3)'
subtitle: '... + MiniCssExtractPlugin = TA-DA!'
author: 'LiteHell'
date: '2023-07-23T17:25:47.907Z'
series: 'webpack_and_react_ssg'
seriesName: 'Webpack과 React를 이용한 정적 웹사이트 만들기'
category: 'Dev'
tags:
    - 'React'
---
전 글까지 [style-loader](https://webpack.js.org/loaders/style-loader/)를 썼다. style-loader는 style 태그를 동적으로 생성하여 CSS를 DOM 안에 주입하는 로더이다. 즉, style-loader를 쓰면 js 스크립트가 실행되면서 style 태그가 동적으로 생성되고, 그 태그 내에 css가 동적으로 삽입되면서 스타일이 적용된다.

하지만 정적 페이지로 빌드후 속도가 느린 서버로 게시하거나 스크립트 용량이 비대하면, 스크립트가 완전히 다 실행되기 전까지의 찰나동안 스타일이 적용되지 않은 깨진 페이지가 나타난다. 이런 버그를 막기 위해서는 [MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin/)을 이용하면 된다.

MiniCssExtractPlugin은 CSS를 스크립트를 통해 DOM에 주입하지 않고 별도의 CSS 파일에 저장한 뒤, 빌드시에 해당 CSS 파일을 삽입하는 link 태그를 HTML에 삽입한다. 즉 동적으로 CSS를 주입하지 않는다. 따라서 이를 이용하면 스크립트가 완전히 다 실행되기 전까지 페이지 스타일이 적용되지 않는 현상을 해결할 수 있다.

MiniCssExtractPlugin을 이용하기 위해서는 먼저 해당 패키지를 설치해야 한다. 다음 명령어로 해당 패키지를 설치한다.

```bash
yarn add --dev mini-css-extract-plugin
```

그 다음 `webpack.config.js` 파일에서 다음 부분을 다음과 같이 수정한다.
```js
// 수정 전
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
```

```js
// 수정 후
module: {
        ...commons.module,
        rules: [
            ...commons.module.rules,
            // CSS를 빌드시 로드하도록 하면 오류가 발생한다. (Node.js 환경은 웹브라우저가 아니므로 스타일 주입 시도가 당연히 실패하기 때문이다.)
            // 따라서 css파일은 웹브라우저단에서 로드되는 번들 스크립트에서만 주입되도록 
            // src/index.tsx Webpack 설정에만 추가한다.
            // 그리고 프로덕션 빌드시에는 MiniCssExtractPlugin을 이용하여 js가 다 로드되기 전에는
            // 스타일이 적용되지 않는 버그를 해결한다.
            {
                test: /\.css$/,
                use: [dev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
            },
        ]
    },
    plugins: [
        ...commons.plugins,
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
        filename: 'index.html',
        // template 속성을 추가한다.
        template: './src/index.html'
    })],
```

위와 같이 수정한 후 정적 웹페이지를 빌드하면 이제 스크립트가 불러와지는동안 스타일이 적용되지 않는 문제가 해결된다.