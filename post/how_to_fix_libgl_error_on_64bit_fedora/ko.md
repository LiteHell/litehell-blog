---
title: '64비트 페도라에서 libGL (MESA-LOADER) 오류 해결하는 방법'
subtitle: '32비트 라이브러리가 없어서 생기는 문제'
author: 'LiteHell'
date: '2025-11-25T13:11:43.828Z'
category: 'Linux'
tags:
    - 'Linux'
    - 'Fedora'
    - 'umu'
    - 'umu-launcher'
    - 'Game'
---
# 문제
64비트 페도라에서 umu-launcher나 wine으로 게임을 실행하면 다음과 같은 오류가 발생할 수 있다.

```
libGL error: MESA-LOADER: failed to open iris: /usr/lib/pressure-vessel/overrides/lib/x86_64-linux-gnu/dri/iris_dri.so: wrong ELF class: ELFCLASS64 (search paths /usr/lib/pressure-vessel/overrides/lib/x86_64-linux-gnu/dri)
libGL error: failed to load driver: iris
libGL error: MESA-LOADER: failed to open swrast: /usr/lib/pressure-vessel/overrides/lib/x86_64-linux-gnu/dri/swrast_dri.so: wrong ELF class: ELFCLASS64 (search paths /usr/lib/pressure-vessel/overrides/lib/x86_64-linux-gnu/dri)
libGL error: failed to load driver: swrast
X Error of failed request:  GLXBadContext
  Major opcode of failed request:  150 (GLX)
  Minor opcode of failed request:  6 (X_GLXIsDirect)
  Serial number of failed request:  537
  Current serial number in output stream:  536

```

# 해결방법
이거 그냥 32비트 라이브러리가 설치되어 있지 않아서 그렇다. 32비트 라이브러리를 설치하면 해결된다.

```bash
sudo dnf install mesa-libGL.i686
```

끝