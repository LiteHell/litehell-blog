---
title: 'Firebase 처음 써본 이야기'
subtitle: '데이터베이스 스카마 설계하기 귀찮을 때'
author: 'LiteHell'
date: '2021-02-28T22:40:29+09:00'
category: 'Dev'
tags:
    - 'Firebase'
    - 'React'
---
# 발단
[전 글](/post/oauth2_and_oidc)에서 동아리 인증 시스템을 만들 때, 동아리 소개 홈페이지도 같이 만들었다. 동아리 홈페이지를 만들어두면 나중에 홍보할 때 써먹을 수 있겠다는 판단이 들어서였다. 그래서 그때 당시(2020년 초)에 [GitHub Pages](https://pages.github.com/)와 [Creative 템플릿](https://startbootstrap.com/theme/creative)을 이용해 간단히 제작했다.

그 다음 연도(2021년 초)에 회장이 바뀌고 회장 전화번호를 수정하면서 [Bootstrap](https://getbootstrap.com) 의존성을 걷어내고 순수 CSS와 HTML, JS(+jQuery)로만 재작성했다. 그 때 당시에는 1페이지의 홈페이지로, 간단한 동아리 소개와 회장단 연락처, 동아리 가입신청 링크만 있었다.

이때 당시에는, 홈페이지 수정이 1년에 한 두번만 있을 것이라고 생각했었다. 그래서 그냥 간단하게 GitHub Pages를 이용해서 게시했다. 어처피 내가 곧 군대를 가게 될지라도 수정해주고 가면 될 것이라 판단도 있었다.

# 수정 가능한 형태
그러나 새 회장은 홈페이지를 보다 더 적극적으로 이용하고자 했다. 그래서 내게 홈페이지를 자신이 수정 가능하게 해달라는 부탁을 했고, 나는 공부도 해볼 겸 나쁘지 않겠다 싶어서 그 요청을 수락했다.

## 웹사이트 디자인
먼저 웹 사이트를 수정 가능한 형태로 하려면 웹 사이트 디자인을 먼저 생각해야 한다. 앞서 말한 2020년 초 디자인이 간단한 카드형태였는데, 그때의 디자인을 살리면 괜찮겠다고 생각했다. 그래서 웹 사이트를 "제목, 내용" 이 두가지로 이루어진 "카드"들의 집합으로 정의하고 디자인했다.

결과는 꽤 그럴싸하게 나왔다. 간단한 CSS 애니메이션을 주니 보기 좋더라. 나는 디자인 지식이 전무한 공학도이기 때문에 근사한 디자인보다는 그럴싸한 디자인이 최선이었다.

## RDB를 써볼까?
처음에는 [MariaDB](https://www.mariadb.org)같은 관계형 데이터베이스를 이용하려 했다. 근데 MariaDB를 이용하려면 먼저 데이터베이스 스카마를 설계해야 하는 데 이게 너무 귀찮았다.
그래서 [MongoDB](https://www.mongodb.com/)를 써볼까란 생각도 했었는데 MongoDB를 서버에 설치하는 것도 귀찮았다. 그래서 '어떻게 할까...' 생각하고 있었는데 마침 교내 학술동아리 발표에서 [Firebase](https://firebase.google.com)에 관해 말하더라. 생각해보니 Firebase를 써보는 것도 나쁘지 않겠다는 생각이 들었다.

# Firebase를 써보았다.
그래서 Firebase를 썼다. Firebase는 Google에서 출시한 데이터베이스/스토리지/호스팅 등을 한 데 몪아놓은 서비스로, 번잡한 서버구성 없이 바로 사용할 수 있다는 것이 특징이다.
Firebase의 데이터베이스는 두 가지 종류가 있다. 가장 먼저 나온 것이 실시간 데이터베이스이고, 그 다음에 나온 것이 Cloud Firestore이다. 실시간 데이터베이스는 데이터를 **하나의 JSON 트리**로 보고, Cloud Firestore를 데이터를 **여러개의 JSON 문서들의 집합**(MongoDB를 떠올리면 이해가 쉽다)로 본다.
어처피 동아리 소개 홈페이지는 하나의 페이지로 이루어져 있기에, 하나의 페이지를 만드는데 필요한 데이터는 하나일 것이라고 생각했다. 따라서 실시간 데이터베이스를 채택했다.

## Thounghts in React
이번 동아리 소개 홈페이지를 만들 때는 [React.js](https://reactjs.org)를 채택했다. [저번](/post/oauth2_and_oidc)에는 Vue를 썼으니 이번에는 React를 써보자는 것이 그 이유였다.
이번 홈페이지를 만드는 데 있어 복잡도가 그리 높지 않았기에, Redux와 같은 스토어를 이용하지 않았다. 따라서 데이터가 아래로 내려갔다가 위로 다시 올라오는 방식으로 모든 코드를 작성했다.

본 홈페이지에서 필요한 페이지들은 다음과 같다.
 - `/` : 메인 페이지
 - `/edit` : 편집 페이지
 - `/edit/preview` : 편집할 때 미리보는 페이지

메인 페이지와 미리보기 페이지는 데이터를 편집할 필요가 없기 때문에 단방향의 데이터 흐름만 구현하면 된다. 따라서 해당 페이지들은 Firebase 데이터베이스에서 데이터를 받아 하위 컴포넌트에 전달하는 방식으로 이루어져 있다. 다만 약간의 차이점이 있다면 메인 페이지는 데이터를 한 번만 받고 (`once` 메소드) 미리보기 페이지는 데이터가 바뀌면 다시 받는다는 점 (`on` 메소드)이 있다.

그러나 편집 페이지는 데이터를 수정해야 하므로 양방향의 데이터 흐름이 필요하다. 따라서 데이터를 하위 컴포넌트에 전달해 표현하고, 수정이 발생하면 하위 컴포넌트에서 상위 컴포넌트로 계속 올라가다 종착지에서 데이터를 수정하는 [React스러운 사고방식](https://ko.reactjs.org/docs/thinking-in-react.html)으로 작성했다.

하위 컴포넌트에서 텍스트 입력 등 변경사항이 발생해 상위 컴포넌트로 올라갈 때 새로운 변경사항이 반영된 데이터를 같이 전달한다. 모든 하위 컴포넌트들은 자신이 담당하는 데이터만을 가지므로 이는 "웹사이트 전체 데이터"의 일부이다. 이 데이터를 전달받은 상위 컴포넌트는 이 전달받은 데이터를 자신이 관리하는 데이터(prop의 값)에 병합한 데이터를 자신의 상위 컴포넌트로 올려보낸다. 이 상위 컴포넌트들은 하위 컴포넌트보다 더 많은 데이터를 관리하므로, 데이터의 규모는 점점 커지게 된다. 따라서 이를 계속 반복하다 보면, 새로운 변경사항이 반영된 "웹사이트 전체의 데이터"를 받게 된다. 이 "웹사이트 전체의 데이터"를 Firebase 실시간 데이터베이스에 저장하게 함으로써 편집 기능을 구현했다.

데이터베이스에 저장한 이후의 데이터를 표현하는 방식에 관해서는, 데이터베이스에 값이 저장되는 순간 Firebase에서 value 이벤트를 발생시키고, 이에 연결된 이벤트 리스너가 페이지의 prop를 수정하게 된다. 따라서 페이지의 prop이 수정됨에 따라 하위 컴포넌트들의 prop도 같이 수정되게 되므로 별도의 특별한 코드가 필요하지 않았다.

## 파일 핸들링
Firebase는 파일 저장을 위한 Storage 기능도 지원한다. Storage에 저장할 때 mime-type만 지정하면 이미지 표시에는 딱히 큰 지장이 없으므로 파일 이름을 [cuid](https://github.com/ericelliott/cuid) 라이브러리를 이용해 난수로 저장하게 했다. 다만 그러면 편집 페이지에서 볼 때 불편한 점이 있으므로 커스텀 메타데이터로 본래 파일이름도 같이 저장하게 했다.

## Firebase와 인증 통합
Firebase에서 OpenID Connect를 지원했기에, 기존 동아리의 인증 시스템과 Firebase를 통합하는 것은 그리 어렵지 않았다. 다만 의외의 복병은 Firebase가 Id Token Authorization Grant만을 지원한다는 점이였다. 따라서 Authorization code grant만을 지원하던 인증 시스템을 수정하는 번거로움이 약간 있었다.

Firebase의 인증을 통합할때는 [Google Identity Platform](https://cloud.google.com/identity-platform)을 이용하면 된다. 데이터베이스나 스토리지의 보안 규칙을 작성할 때 `auth.token.firebase.sign_in_attributes` 속성으로 ID 토큰의 커스텀 속성에 접근할 수 있으므로 이를 이용해 기존 인증 시스템의 권한 관리도 통합할 수 있었다.

## 결론
Firebase는 서비스를 빠르게 개발하는 데에 좋은 것 같다.