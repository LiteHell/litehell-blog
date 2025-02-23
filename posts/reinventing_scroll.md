---
title: '무한 스크롤 구현하기'
subtitle: '신나는 바퀴의 재발명'
author: 'LiteHell'
date: '2025-03-13T14:57:39.688Z'
category: 'Dev'
tags:
    - 'CSS'
    - 'Frontend'
---
# 서론
이 글은 내가 [주식회사 슈르](http://www.shuru.co.kr)에서 인턴으로 일하던 2023년 12월 ~ 2024년 2월 사이의 이야기이다.

이때 나는 [고인물테스트](https://youtu.be/6WZ5jjVXeF0)(~~https://goinmultest.pro~~, 현재는 운영종료)의 프론트엔드를 개발하고 있었다. (관련 글: [2024년의 회고](/post/retrospective_of_2024#하계방학-인턴십)) 여기서 스크롤 관련하여 삽질을 엄청 많이 하게 됐는데 이에 대하여 다루고자 한다.

# 본문
## UI 컨셉
[영상](https://youtu.be/6WZ5jjVXeF0?t=89)을 보자.

<iframe width="912" height="513" src="https://www.youtube.com/embed/6WZ5jjVXeF0" title="✨이벤트有✨ 덕질 하다하다 &#39;이것&#39;까지 만든 슈르네!! 근황" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

영상을 보면 메인 페이지가 다음과 같이 생겼다.

![메인 페이지](/img/reinventing_scroll/screenshot_1.jpg)

맨 위 "웹툰", "HOME", "K-POP" 버튼은 **카테고리 버튼**이다. 어떤 **카테고리 버튼**이 선택되냐에 따라 아래 표시되는 게시글이 달라진다.

![카테고리 버튼 애니메이션](/img/reinventing_scroll/category_nav_button_animation.webp)

컨텐츠는 좌우 방향으로 무한히 스크롤되야 한다. 예를 들자면 왼쪽으로 스크롤을 엄청 많이 해도 끊임없이 컨텐츠가 반복되야 한다.

또한 하단 컨텐츠는 정중앙에 스내핑되야 한다. 영상을 잘 보면 컨텐츠가 스내핑되고 있는 것을 알 수 있다.

이러한 UI를 CSS, JS(추후 화가 나서 TS로 재작성했다), HTML만으로 구현해야 했다.

## 라이브러리
남의 돈이 가장 좋듯 코드도 남이 만든 코드를 갖다 쓰는 게 가장 좋다.

저런 UI랑 비슷한 UI는 Carousel이다. (아닐 수도 있다. 만약 필자가 틀리다면 알려주면 감사하겠다.) 그래서 라이브러리르 찾아볼까 했는데

1. 컨텐츠가 좌우가 아닌 상하로도 스크롤이 되야하는 특성상 (위 사진 참고) 마음에 드는 라이브러리가 딱히 없었고
1. 라이브러리 괜찮은 건 React로 된 게 많은데 React를 쓰지않고 만들고 있었다.

그래서 라이브러리를 딱히 쓰지 않게 됐다. 왜 React나 Vue를 쓰지 않는 지 궁금하다면 [2024년의 회고](/post/retrospective_of_2024#하계방학-인턴십) 글을 보라.

## 네이티브 스크롤
라이브러리가 아무리 노력해도 웹 브라우저가 제공하는 스크롤 기능을 이길 수 없다. 그렇기 때문에 가능하다면 웹 브라우저의 스크롤 기능을 활용하는 게 이득이다.

...이상적으로는 그렇다. 내가 Safari 혐오가 생긴 게 이때부터였다.

처음에 [CSS의 `scroll-snap` 기능](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap)을 써보려 했는데 얘는 Gecko랑 Blink에서의 동작이 서로 달랐다. 그러니 패스.

지금 시점에서 정확히 기억나진 않지만 네이티브 스크롤만으로 해결하려 하니 사파리에서 버그가 나거나 크롬에서 버그가 나거나 둘 중 하나인 케이스가 너무 많았다. 아무리 해결하려 해도 답이 없더라....

그래서 결국 네이티브 스크롤을 쓰지 않고 바퀴를 재발명하게 됐다.

## 좌우 무제한 스크롤의 재발명
이제 스크롤을 재발명하기로 했다. 어떻게?

### 컨테이너와 아이템
(이 글에서의 컨텐츠 = 이미지에서의 "post"이다.)

일단 카테고리 버튼은 신경쓰지 말고 컨텐츠만 집중해보자. 컨테이너의 자식을 아이템이라 하자. 아래와 같이 컨테이너와 아이템이 있다. 핑크색이 컨테이너고 청록색이 아이템이다. 컨테이너 바깥에 위치한 아이템은 보이지 않으며, 컨텐츠 컨테이너의 너비와 컨텐츠 아이템의 너비는 항상 동일하다고 가정하자.

![컨테이너와 아이템들](/img/reinventing_scroll/container_and_items_1.png)

이용자가 좌우로 스크롤을 하면 이용자의 스크롤에 따라 아이템들의 위치를 모두 동일하게 이동시킨다.

![이동된 컨테이너와 아이템들](/img/reinventing_scroll/container_and_items_2.png)

그러면 컨테이너 외부의 아이템은 보이지 않으므로, 이용자에게는 좌우 스크롤이 되는 것처럼 보여진다.

### CSS와 transform
`position`이 `absolute`인 요소는 조상 요소중 `position`이 `relative`이거나 `absolute`인 가장 가까운 요소를 기준으로 위치가 결정된다는 것은 CSS 상식이다.

컨테이너의 `position`을 `relative`로 하고, 아이템에 다음과 같은 CSS를 적용하자.
```css
position: absolute;
top: 0px;
left: 50%;
```

그러면 사진과 같이 모든 아이템이 컨테이너의 정중앙으로 정렬된다.

![정중앙에 위치된 아이템들](/img/reinventing_scroll/container_and_items_centered.png)

우리 이제 여기서 생각을 잠깐 해보자. 저 정중앙에 위치된 아이템을 좌우로 각각 "적절히" 이동시키면 아래와 같은 이미지들을 구현할 수 있지 않을까?

![컨테이너와 아이템들](/img/reinventing_scroll/container_and_items_1.png)

![이동된 컨테이너와 아이템들](/img/reinventing_scroll/container_and_items_2.png)

여기서 `transform`이 등장한다. `transform`에 `translateX` 함수를 이용하면 특정 HTML 요소를 X축으로 이동시킬 수 있다.

위 이미지를 프레임이라 할 때, 컨텐츠 아이템들의 X축 위치는 다음 두가지 정보로부터 유도될 수 있음은 자명하다. 
1. 컨테이너의 정중앙에 가장 가까운 컨텐츠가 어떤 컨텐츠인지
1. 1번의 컨텐츠가 컨테이너의 정중앙으로부터 얼마나 떨어져 있는지의 방향(왼쪽/오른쪽)과 거리를 가진 값

이에 대하여 코드에 상세히 설명한 주석이 있다. 그 주석은 다음과 같다.

```js
/**
         * 2개의 예시로 알아보는 translate값 계산 알고리즘
         * 참고: 모든 예시에서 root의 너비=child를 가정함.
         *
         * 첫번째 예시
         *           ________________
         * 1. 위와 같이 너비 16px의 root가 있다고 가정한다.
         *
         *           __AAAAAAAAAAAAAA(AA) ※ 괄호안은 root 영역의 바깥에 있으므로 보이지 않는다.
         * 2. basisChildOffset=2, basisChildIndex=(A의 index)라고 가정하고
         *    basisChild의 translate값을 2로 설정한다.
         *
         * 3. root 영역을 보자. root 영역의 왼쪽에는 2px의 여백이 있으며 오른쪽에는 여백이 없다.
         *
         *           (BBBBBBBBBBBBBB)BBAAAAAAAAAAAAAA(AA) ※ 괄호안은 root 영역의 바깥에 있으므로 보이지 않는다.
         * 4. 왼쪽 여백을 채우기 위해 A의 왼쪽에 B가 나타나도록 B의 translate값을 설정한다.
         *
         *           BBAAAAAAAAAAAAAA
         * 5, 끝!
         *
         * 두번째 예시
         *          ________
         * `1. 위와 같이 너비 8px의 root가 있고, 3개의 child A, B, C가 있다고 가정한다.
         *
         *          ________                                (AAAAAAAA) ※ 괄호안은 root 영역의 바깥에 있으므로 보이지 않는다.
         *  2. basisChildOffset=36, basisChildIndex=(A의 offset)라고 가정하고
         *     basisChild의 translate값을 40으로 설정한다.
         *
         *  3. root 영역이 비어있다.
         *
         *          ________                        (CCCCCCCCAAAAAAAA) ※ 괄호안은 root 영역의 바깥에 있으므로 보이지 않는다.
         *          ________                (BBBBBBBBCCCCCCCCAAAAAAAA)
         *          ________        (AAAAAAAABBBBBBBBCCCCCCCC)
         *          ________(CCCCCCCCAAAAAAAABBBBBBBB)
         *          BBBBBBBB(CCCCCCCCAAAAAAAA)
         *  4. 위와 같이 루프를 돌면서 root영역을 채운다.
         *
         *          BBBBBBBB
         * 5. 끝!
         */
```

위 주석을 요약하면 다음과 같다.

1. 위에서 말한 두가지 정보로 정중앙에서 가장 가까운 아이템을 X축 이동시킨다.
1. 컨테이너의 영역을 꽉 채울 때까지 아이템을 하나하나씩 X축으로 이동시킨다.

이제 스크롤의 의미가 바꿨다. 스크롤은 이용자의 상호작용에 따라 "컨테이너의 정중앙에서 가장 가까운 아이템과 컨테이너와의 거리"를 적절히 변경하는 방식으로 구현될 수 있다.

("컨테이너의 정중앙에서 가장 가까운 아이템의 종류"는 내부적으로 자동 정규화(normalization)된다고 가정하자)

### 관성 스크롤
스크롤을 재발명한다는 것은 관성 스크롤("Kinetic scrolling", "Inertial scrolling", 혹은 "Momentum scrolling"이라 불린다)을 재발명하는 것과 같다.

이에 대해서는 Ariya Hidayat씨의 [Javascript Kinetic Scrolling](https://ariya.io/2013/08/javascript-kinetic-scrolling-part-1)의 도움을 매우 많이 받았다. 이용자가 X축으로 이동한 만큼 스크롤하되 내부적으로는 속도를 계산한다. 속도를 계산할 때는 이동평균하여 값이 튀지 않도록 보정한다.

터치가 끝났을 때 속도와 터치 방향을 확인하여 속도가 특정값 이상이고 방향이 알맞다면 다음 아이템으로 자동 스크롤하고 아닌 경우에는 원래 아이템으로 자동 스크롤하도록 구현한다. (어처피 스내핑해야 하므로 이렇게 구현해도 상관없다.)

## 컨텐츠 내부에서의 상하 스크롤
[smooth-scrollbar](https://github.com/idiotWu/smooth-scrollbar) 라이브러리를 갖다 붙였거나 브라우저의 네이티브 스크롤를 이용하거나 둘 중 하나였던 거 같은데 정확히는 기억나지 않는다.

## 카테고리 버튼과의 연동
카테고리 버튼도 좌우로 스크롤 가능하고, 이용자가 스크롤하는 만큼 컨텐츠도 좌우로 움직여졌으면 좋겠다는 요구사항이 있었다.

그러면 컨텐츠와 카테코리 버튼의 상태가 양방향으로 연결되야 한다. 카테고리 버튼이 좌우로 스크롤되면 컨텐츠도 좌우로 스크롤되고, 컨텐츠가 좌우로 스크롤되면 카테고리 버튼도 스크롤되야 한다.

근데 이렇게 하니 버그가 기가 막히더라. 그래서 그냥 컨텐츠가 좌우로 스크롤될 때만 카테고리 버튼이 같이 스크롤되도록 하고, 카테고리 버튼은 그냥 이용자가 직접 좌우 스크롤할 수 없도록 막았다. (위에 첨부한 사진을 자세히 보면 버튼을 스크롤하는 것이 아닌 "클릭"하고 있다는 걸 알 수 있다.)

# 결론
이때를 기점으로 사파리 혐오가 생겼다. 버그 잡느라 되게 힘들었는데 그래도 돌이켜보면 재미있는 경험이었다.

잔버그 고치는 데 시간을 많이 썼다. 다만 커밋 로그 하나하나 보면서 블로그 글 쓰고 싶진 않아서 이 글에서는 생략했다.

웹에서 네이티브 어플리케이션 수준의 UX/UI를 구현하는 건 매우 힘들다는 걸 느끼게 됐다. 세상 일이 참 쉽지가 않다.

비록 퇴사했지만 언제나 번창했으면 좋겠다.