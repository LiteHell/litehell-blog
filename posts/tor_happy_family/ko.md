---
title: 'Tor Relay Family를 구성하는 새로운 방법'
subtitle: 'Tor 0.4.9.5에서 도입된 happy family 기능'
author: 'LiteHell'
date: '2026-03-03T10:53:26.034Z'
category: 'Tor'
tags:
    - 'Tor'
    - 'AsianaOnion'
---
# 들어가는 글
Tor 릴레이를 여러개 운영하고 있다. Relay Family 설정하는 게 좀 귀찮았는데 이제 좀 편해져서 이에 대해 글을 써보려 한다.

## Tor가 뭔가요?
먼저 Tor가 뭔지 모르시는 분들을 위해 간단히 소개하겠다. [Tor](https://www.torproject.org)는 인터넷이 검열되는 국가에서 자유롭고 익명인 인터넷 접근을 보장하여 표현과 반검열의 자유와 보장하는 프로젝트이다. 따라서 Tor라는 소프트웨어를 개발/보급하는데, 이 소프트웨어는 트래픽을 암호화하고 여러 무작위의 중간 노드(이하 "릴레이")를 거치도록 하여, 국가(혹은 ISP)의 검열 및 감시를 회피한다.[^1]

따라서 Tor 프로젝트가 운영되기 위해서는 유의미하게 많은 릴레이가 필요하다. 이 릴레이들은 여러 나라에 골고루 분포되어 있으며, 자원봉사자들에 의해 운영되고 있다.

그리고 필자또한 [릴레이를 운영하고 있다.](https://asianaonion.org)

# 여러개의 릴레이를 운영한다면
한 사람(혹은 단체, 이하 "주체")이 여러 릴레이를 동시에 운영할 수 있다. 익명성을 강화하고 공격에 방어하기 위해서는, 다양한 주체가 운영하는 노드를 이용해야 한다. 이를 위해 Tor 릴레이 설정 파일내에서는 `MyFamily`라는 필드가 있다.

## MyFamily
`MyFamily` 필드는 운영 주체가 동일한 다른 릴레이의 Fingerprint를 적는 필드이다.

```
MyFamily 9D5F9A925BA8EE2A1A162A0B2C988AA10DEC9645 F0671FB5BE103EFC63AA630E3BC941753F97E5C9
```

서로 양방향으로 설정되어 있어야 동일한 Family에 속한 것으로(운영 주체가 동일한 것으로) 판단된다. 즉 `A` 릴레이의 `MyFamily` 설정에 `B`의 Fingerprint가 있고, `B` 릴레이의 `MyFamily`에 `A`의 Fingerprint가 있어야 동일한 릴레이 패밀리로 인식된다.[^2]

### 문제점
릴레이가 하나 늘어나면 모든 릴레이의 설정 파일을 수정해야 한다. 따라서 릴레이를 많이 운영하는 주체 입장에서는 매우 번거롭다.

## Happy Family
[Tor 재단에서는 이를 해결하기 위해 Happy Family라는 기능을 도입했다.](https://blog.torproject.org/happy-families/) 이 기능은 기존의 `MyFamily` 필드처럼 모든 릴레이의 Fingerprint를 일일히 열거하지 않아도 된다는 장점이 있다.

### 적용방법
먼저 모든 릴레이의 Tor 버전을 0.4.9.5 이상으로 업데이트한다. 그리고 Tor 0.4.9.5 이상 버전이 설치된 컴퓨터[^3] `tor --keygen-family (파일 이름)` 명령어를 실행한다.

```bash
litehell@litehell-laptop-fedora:/tmp/happy-family$ tor --keygen-family example
Feb 24 19:35:09.355 [notice] Tor 0.4.9.5 running on Linux with Libevent 2.1.12-stable, OpenSSL 3.5.4, Zlib 1.3.1.zlib-ng, Liblzma 5.8.1, Libzstd 1.5.7 and Glibc 2.42 as libc.
Feb 24 19:35:09.355 [notice] Tor can't help you if you use it wrong! Learn how to be safe at https://support.torproject.org/faq/staying-anonymous/
Feb 24 19:35:09.355 [notice] Read configuration file "/etc/tor/torrc".
Feb 24 19:35:09.358 [notice] Processing configuration path "/etc/tor/torrc.d/*.conf" at recursion level 1.
# Generated example.secret_family_key
FamilyId NVkbKefZZHYJPUoJgd37MSgT7GmHY8FtAZAX2KUSDhQ
```

그러면 다음과 같이 Happy Family 기능에 이용될 공개키와 개인키 파일이 생성된 것을 확인할 수 있다. 개인키는 유출되어선 안된다.
```bash
litehell@litehell-laptop-fedora:/tmp/happy-family$ ls
example.public_family_id  example.secret_family_key

litehell@litehell-laptop-fedora:/tmp/happy-family$ cat example.public_family_id 
NVkbKefZZHYJPUoJgd37MSgT7GmHY8FtAZAX2KUSDhQ
```

이제 위 공개키와 개인키를 모든 릴레이에 적용하면 된다. 먼저 tor 릴레이 설정 파일 내에 다음과 같이 공개키를 넣는다. (아래의 있는 공개키는 예시이다. 그러니 `NVkbKefZZHYJPUoJgd37MSgT7GmHY8FtAZAX2KUSDhQ` 부분을 본인의 공개키로 바꾸자.)

```
FamilyId NVkbKefZZHYJPUoJgd37MSgT7GmHY8FtAZAX2KUSDhQ
```

그리고 Tor 릴레이 서버의 `/var/lib/tor/keys` 디렉토리 내에 비밀키 파일을 복사한다.

`chmod`, `chgrp`, `chown` 명령어를 이용해 권한과 소유권을 잘 설정해주자. 대충 다른 키파일과 똑같이 설정하면 보안상 문제는 없다.

공개키를 설정 파일 내에 적고 개인키 파일을 복사했다면, 이제 Tor를 재시작하면 된다. 아예 Tor 릴레이 프로세스를 껐다 켜도 되긴 하지만, `SIGHUP` 시그널만 넣어도 충분하다. (e.g. `pkill --signal 1 tor`)

그러면 잘 적용됐을 것이다.

### 주의사항
Happy family 기능은 2026년 2월 Tor 0.4.9.5 stable버전에서 정식 배포됐다, 해당 버전이 널리 배포되기까지는 시간이 걸릴 것으로 예상된다. 따라서 아쉽지만 당분간 `MyFamily` 필드를 같이 이용해야 한다.

# 결론
Tor 릴레이 하나 추가하거나 바꿀때마다 다른 모든 릴레이의 설정을 바꿔야 해서 되게 귀찮았다. 그래서 조만간 자동화를 해야하나 싶은 생각이 들었는데, 다행히도 해당 부분이 개선이 되서 좋다.

---
[^1]: 다만 익명성을 확실히 보장받기 위해서는 몇가지 조심해야할 사항이 있다. 이와 관하여는 [2024 디지털 보안 가이드 (디지털정의네트워크, 국문)](https://guide.jinbo.net/digital-security-2024/)나 [전자 프론티어 재단의 Surveillance Self-Defense (영문)](https://ssd.eff.org/)를 참고하자.
[^2]: 악의적 공격자가 릴레이 운영 주체를 속이는 것을 막기 위함이다.
[^3]: 굳이 릴레이 서버여야할 필요는 없다.