---
title: '떨어져 있는 커밋 합치기'
subtitle: '의외로 간단한 git interactive rebase 활용법'
author: 'LiteHell'
date: '2023-01-10T05:32:23.209Z'
category: 'Dev'
tags:
    - 'Git'
---
# 들어가는 글
글에 들어가기에 앞서, 이 글의 예시에서 rebase 전의 커밋 순서는 다음과 같다고 가정하자: ... → First commit → Secod commit → Third commit → Bugfix related to third commit → Bugfix related to second commit → Fourth commit → Second bugfix related to third commit

# 연속된 커밋 합치기
[git rebase -i](https://git-scm.com/docs/git-rebase)를 이용하면 간단하게 연속된 커밋을 합칠 수 있다.
```
pick 89b7a0c First commit
reword 7d62023 Secod commit
pick d3c0a39 Third commit
fixup 4eb60d0 Bugfix related to third commit
pick 69a520d Bugfix related to second commit
pick 584974e Fourth commit
pick 3f9e8fa Second bugfix related to third commit
```

위 to-do를 실행하면 `reword`로 커밋 `7d62023`의 메세지를 수정하게 된다. (이 예시에서는 오타를 정정했다고 가정하자.) 그리고 `fixup`으로 연속하는 커밋 `d3c0a39`와 `4eb60d0`을 합치고, 커밋 `4eb60d0`의 메세지는 버려지게 된다. (메세지도 같이 합치고 싶다면 `squash`를 쓰면 된다.)

이를 실행하면 git 히스토리는 다음과 같이 된다: First commit → Second commit → Third commit → Bugfix related to second commit → Fourth commit → Second bugfix related to third commit

그렇다면 우리는 여기서 궁금증이 생긴다. 연속하지 않는 커밋을 합치고 싶을 땐 어떻게 하면 될까?

## 연속하지 않는 커밋 합치기
답은 간단하다. 그냥 to-do에서 커밋 순서를 바꾸면 된다.
```
pick 89b7a0c First commit
reword 7d62023 Secod commit
fixup 69a520d Bugfix related to second commit
pick d3c0a39 Third commit
fixup 4eb60d0 Bugfix related to third commit
fixup 3f9e8fa Second bugfix related to third commit
pick 584974e Fourth commit
```

interactive rebase에서 커밋 순서를 무조건 동일하게 해야할 필요는 없다. 연속하지 않는 커밋을 합쳐야 한다면 그냥 순서를 바꿔서 합치면 된다. (이 예시에서도 `reword`로 커밋 `7d62023`의 오타를 정정했다고 가정하자.)

위와 같이 실행하면 git 히스토리는 다음과 같다: First commit → Second commit → Third commit → Fourth commit. Git History가 깔끔하게 된 것을 확인할 수 있다.