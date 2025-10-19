---
title: 'Linux에서 RPG Maker MV로 제작된 게임 실행하기'
subtitle: 'wine으로 실행이 잘 안 될 때'
author: 'LiteHell'
date: '2025-02-18T11:02:55.344Z'
category: 'Linux'
tags:
    - 'Game'
    - 'Wine'
last_modified_at: '2025-10-19T16:52:08.538Z'
---
# 서문
RPG Maker MV로 제작된 게임을 리눅스에서 wine으로 실행했는 데 자꾸 로딩에서 걸렸다.

# 해결법
그냥 Windows를 가상 머신으로 깔까 고민하던 와중 nwjs.dll을 발견했다. 게임 `www` 폴더 내 `package.json`의 구조도 nwjs 어플리케이션의 `package.json`과 유사했다.

그러면 그냥 리눅스용 nwjs 바이너리를 받아서 직접 실행하면 되지 않을까? 실제로 해본 결과 매우 잘 됐다. 그냥 nwjs 바이너리를 받아서 직접 실행하면 된다.

1. [nwjs 홈페이지](https://nwjs.io/)에서 리눅스용 nwjs 바이너리를 다운받는다. (SDK 버전을 다운받아야 할 필요는 없다.)
1. `package.json` 파일이 있는 폴더를 찾는다. (일반적으로 `www` 폴더임.)
1. 그 `www` 폴더를 1번에서 받은 nwjs 바이너리로 실행시키면 된다. (e.g. `~/nwjs-binary/nwjs ~/game/www`)
1. 만약 잘 안되면 `package.json`의 `name` 값이 빈 문자열이라 그런 걸 수도 있다. `name` 값을 아무렇게나 친 값으로 바꿔주면 된다.

이러면 실행이 매우 잘 된다. 게임에 따라서 안 될 수도 있긴 한데... 나는 잘 됐다.

끝