---
title: 'Tor relay config 다시 로드하는 방법'
subtitle: '재시작 안하고 config만 다시 읽는 방법'
author: 'LiteHell'
date: '2026-06-29T14:12:12.146Z'
category: 'Tor'
tags:
    - 'Tor'
---
Tor 릴레이 config를 수정하고 tor를 재시작하면 수정된 config가 적용된다.

너무 당연한 이야기긴 한데... 이게 가끔 재수없으면 Flag(Tor 릴레이는 Fast나 Stable과 같은 Flag가 붙는다)가 사라진다.

그런 경우에는 tor 프로세스에 SIGHUP 시그널만 날리면 tor 재시작 없이 수정된 config 적용만 할 수 있다.

```bash
# pkill 쓰는 방법
pkill --signal 1 tor
# kill 쓰는 방법
kill -1 (tor pid)
```

명령어에서 1은 SIGHUP을 의미한다.

끝