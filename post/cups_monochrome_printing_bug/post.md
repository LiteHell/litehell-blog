---
title: '리눅스에서 인쇄가 흑백으로만 되는 CUPS 버그'
subtitle: '아니 왜 색이 안나와'
author: 'LiteHell'
date: '2025-03-12T15:12:14.190Z'
category: 'Linux'
tags:
    - 'CUPS'
---
# 개요
당근마켓에서 복합기를 샀다.

CUPS 서버를 구축해 프린터를 공유하고 테스트 페이지를 인쇄했는데 인쇄가 모노크롬(회색조)으로만 인쇄됐다. 왜일까...

# 해결법
열심히 검색하면서 찾아본 결과 CUPS에서 프린터를 추가할 때 회색조 인쇄를 기본값으로 하는 버그가 있어서 그렇다.

아래 명령어에서 PRINTER 부분만 프린터 이름으로 바꿔서 실행하면 된다.

```bash
sudo lpadmin -p PRINTER -o print-color-mode-default=color
```

끝~

# 참고 문서
- [Stackoverflow 답변](https://askubuntu.com/a/1416784)