---
title: 'How to reload tor relay config'
subtitle: 'Reloading without restarting'
author: 'LiteHell'
date: '2026-06-29T14:12:12.146Z'
category: 'Tor'
tags:
    - 'Tor'
---
To reload relay config, restarting tor works very well.

But sometimes, Tor flags disappear while restarting if unlucky.

To avoid that, you can reload tor config without restarting, by sending SIGHUP signal to tor process.

```bash
# way to use pkill
pkill --signal 1 tor
# way to use kill
kill -1 (tor pid)
```

`1` in command means SIGHUP signal.

The End.