---
title: 'Tailscale을 이용한 두개 이상의 네트워크 만들기'
subtitle: '계정 두개 만들 필요 X'
author: 'LiteHell'
date: '2025-11-01T13:28:27.541Z'
category: 'Tor'
tags:
    - 'Tailscale'
    - 'VPN'
    - 'Network'
    - 'Infra'
---
# 들어가는 글
필자는 [Tailscale](https://tailscale.com/)을 쓴다. Tailscale은 [Wireguard](https://www.wireguard.com/)에 기반한 VPN 서비스인데, 직접 VPN 서버를 구축하는 것보다[^1] 훨씬 편리해서 애용하고 있다.

[그러다가 최근에 Tor 릴레이를 본격적으로 시작하게 됐다.](https://asianaonion.org)[^2] [2024년의 회고](/post/retrospective_of_2024/) 글에 고대역폭 Tor 릴레이를 만들어보고 싶다고 적고 알아보다가 사정이 생겨서 일단 국내에 VPS 여러개를 만드는 식으로 시작했다.[^2]

알다시피, 외부에 노출되는 포트는 최소화하는 게 모범적이다. 특히 SSH 포트라면 더욱 그렇다. 이는 Tailscale로 내부망을 만들면 쉽게 해결된다.

Tailscale을 이용하면 기본적으로 다음과 같은 내부망이 구축된다.

![Tailscale을 이용한 네트워크](./single_tailnet.svg)

그러나 개인적으로는 Tor 릴레이들의 네트워크는 따로 두고 싶었다. 즉 다음 구성과 같이 네트워크를 구축하고 싶었다.

![목표 네트워크 구성도](./target_network_struct.svg)

개인 네트워크와 Tor 네트워크 간에는 분리하되 개인 네트워크내 특정한 기기(이하 "터미널")는 Tor 릴레이에 SSH를 접속할 수 있어야 한다. 그러나 Tor 릴레이는 터미널을 포함한 개인 네트워크에 접속할 수 없어야 한다.

Tailscale 계정 2개 만드는 거 말고 다른 방법이 없을까? [검색해보니 Tailscale의 ACL 기능을 이용하면 된다고 한다.](https://www.reddit.com/r/Tailscale/comments/10q4ztn/comment/j6nx04c/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button) 한 번 해보자.

# ACL을 이용한 분리된 네트워크 분리
네트워크를 분리하기 위해서는 서버에 태그를 추가한 뒤 태그를 기준으로 ACL 규칙을 추가해야 한다.
일단 Tailscale에서 Access Control에 들어간다.

![Tailscale Access Control 메뉴 위치](./ACL%20menu.png)

## 태그 추가
Tags 페이지에서 Create tag 버튼을 눌러 태그를 추가한다.
태그 이름이 바뀌면 노드에 태그 다는 작업을 다시 해야 하니 대충 짓지 말자.

![Tailscale 태그 목록](./tags.png)

태그를 생성했다면 `Edit ACL tags` 기능으로 노드에 태그를 단다.
모든 노드에 태그를 달도록 하자.

![Tailscale 노드 메뉴](./Edit%20ACL%20tags.png)

설명을 위해 이 글에서는 태그 A와 B가 생성되었으며 모든 노드는 태그 A나 B 둘 중 하나에만 속한다고 가정한다.

## ACL 규칙 추가
이제 [General Access rules](https://login.tailscale.com/admin/acls/visual/general-access-rules) 탭에서 ACL 규칙을 추가하자. 처음 들어가면 다음 기본 ACL 규칙만 있을 것이다. 삭제하자.

![기본 ACL 규칙](./Default%20ACL.png)

A 태그가 달린 노드 간의 통신을 무제한 허용하는 ACL 규칙을 추가한다.

![A 태그 ACL 규칙](./A%20tag%20acl.png)

B 태그가 달린 노드간에도 똑같이 추가한다.

![B 태그 ACL 규칙](./B%20tag%20acl.png)

그러면 다음과 같이 네트워크가 구성된다.

![네트워크 A와 B](./network%20A%20and%20B.png)

A의 노드는 B 네트워크내 노드의 존재를 알 수 없으며 그 반대도 동일하다. 따라서 A 네트워크내의 노드와 B 네트워크 내의 노드 간에는 통신할 수 없다.

## SSH 터미널 추가
약간만 더 응용하면 네트워크 A와 B 내의 노드로 SSH 접속을 할 수 있는 터미널을 추가할 수도 있다.
SSH 터미널로 이용할 노드에 `terminal` 태그를 추가하고 다음 ACL 규칙을 추가한다. (Tailscale내에 [JSON editor](https://login.tailscale.com/admin/acls/file)로 편집할 수 있다.)[^3]

```json
    {
        "src": ["tag:terminal"],
        "dst": ["tag:A", "tag:B"],
        "ip":  ["tcp:22"],
    }
```

그러면 다음과 같은 네트워크를 구성할 수 있다. Terminal은 A나 B내의 노드로 SSH(TCP 22포트) 접속을 할 수 있다. 그러나 A나 B 내의 노드는 Terminal 노드로 연결할 수 없다.

![A-B-Terminal 네트워크 구조도](./a%20and%20b%20and%20terminal.png)

# 결론
이를 응용하면 들어가는 글에서 밝힌 네트워크 구조를 만들 수 있다. 괜히 귀찮게 Tailscale 계정을 2개 만들 필요가 없다. Tailscale이 참 잘 만들어졌다.

---
[^1]: VPN 서버를 직접 구축할 시에는 [SoftEther VPN](https://www.softether.org/), [OpenVPN](https://openvpn.net/client/), [Wireguard](https://www.wireguard.com/) 등의 선택지가 있는데 뭘 쓰던 간에 귀찮다는 건 똑같다.
[^2]: 외국의 경우 [Emerald Onion](https://emeraldonion.org/)이나 [Menhera.org](https://www.menhera.org/)와 같이 AS(Autonomous system)를 할당받아 Tor 릴레이를 운영하는 단체도 있다. 개인적으로도 이를 원했으나 이를 위해선 [KINX](https://kinx.net)랑 소통을 해야하기도 하고, 무엇보다 견적이 개인적으로 감당할 수 없을 것 같단 예상이 들어 일단 VPS로 시작했다.
[^3]: 스크린샷 찍기 귀찮아져서 JSON으로 올렸다.ㅎ