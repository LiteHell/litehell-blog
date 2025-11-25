---
title: 'How to fix libGL (MESA-LOADER) error on 64-bit Fedora'
subtitle: 'Error due to missing 32bit library'
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
# Problem
You may encounter this error when you try to run Windows game with umu-launcher or wine, on 64bit Fedora.

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

# Solution
Solution is very simple. Just install 32bit library.

```bash
sudo dnf install mesa-libGL.i686
```