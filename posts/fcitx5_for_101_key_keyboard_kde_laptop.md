---
title: '한글 입력을 위한 fcitx5 설치'
subtitle: 'KDE 노트북에서의 버그없는 한글 입력을 위한 삽질기'
author: 'LiteHell'
date: '2023-10-17T12:34:16.790Z'
category: 'Linux'
tags:
    - 'Linux'
    - 'Korean'
    - 'Hangul'
    - 'IM'
    - 'KDE'
last_modified_at: '2023-10-17T14:32:47.687Z'
---
# 서론
필자는 초창기에 [ibus](https://github.com/ibus/ibus)를 썼었다. ibus는 웬만한 프로그램에서 아무 버그없이 잘 작동한다. 딱 한가지, 리브레오피스에서 공백 입력이 안 된다는 치명적인 버그만 빼면 말이다.

그래서 ibus 다음으로 [하모니카에서 유지보수하는 nimf](https://github.com/hamonikr/nimf)를 썼었다. nimf는 리브레오피스에서의 치명적인 버그는 없었지만, 엔터키를 누르면 텍스트가 사라지는 버그가 있었다. 근데 이 버그, 처음에만 짜증나지 좀 지나면 적응된다. 그래서 적응해서 쓰다가 생각해보니 '이건 좀 아닌 것 같다'싶어서 다른 입력기를 설치했다.

본 블로그 글은 [Arch Linux](https://archlinux.org/)를 기준으로 설명한다.

## KDE에서의 키보드 레이아웃
입력기를 바꾸기 위해 삽질하는 과정에서 한글키가 오른쪽 Alt키로 인식되는 현상을 확인했다. 분명히 아치 리눅스 설치 초기에 매핑을 했었는데, 시스템 업데이트를 하는 과정에서 원상복구가 된 것 같다. 그래서 이번에는 KDE 설정 프로그램을 이용해 한글키와 한자키를 매핑했다.

![KDE 키보드 설정 프로그램](/img/kde_keyboard_settings.png)

위와 같이 시스템 설정 프로그램의 **입력 장치 🠞 키보드** 화면에서 **오른쪽 Alt 키를 한/영 키로 만들기**, **오른쪽 Ctrl 키를 한자 키로 만들기** 항목을 체크하면 된다. (키보드 레이아웃에 따라 약간 다를 수 있다.) 노트북 등의 101/104키 호환 레이아웃이라면 위 과정을 반드시 거쳐야 한다.

### 한/영, 한자키 인식여부 확인방법
본인 키보드가 101/104키인지 106키인지 헷갈린다면 <del>키보드 키 갯수 세지말고</del> 먼저 `xev` 프로그램을 설치한다.
```bash
sudo pacman -S xorg-xev
```

그리고 콘솔 창에서 xev 프로그램을 실행한다.
```bash
xev
```

xev 프로그램 창을 활성화하고 한글키랑 한자키를 눌러본다. 다음과 같이 콘솔 창에 *Hangul*이나 *Hangul_Hanja*키가 인식된 메세지가 출력되면 한/영 키, 한자 키가 정상적으로 인식되는 것이다.
```
KeyRelease event, serial 39, synthetic NO, window 0x9000001,
    root 0x79b, subw 0x0, time 1234567, (-10, 10), root:(10, 10),
    state 0x0, keycode 108 (keysym 0xff31, Hangul), same_screen YES,
```
```
KeyPress event, serial 39, synthetic NO, window 0x9000001,
    root 0x79b, subw 0x0, time 1234567, (10, 10), root:(10, 10),
    state 0x0, keycode 105 (keysym 0xff34, Hangul_Hanja), same_screen YES,
```

만약 위와 같은 메세지가 안 뜨고 Alt_R이나 Control_R이 인식된다면 <a href="#kde에서의-키보드-레이아웃">위에 써진 내용</a>에 따라 매핑하면 된다.

## fcitx5 설치 방법
먼저, 다음 명령어를 실행해 fcitx5를 설치한다.

```bash
sudo pacman -S fcitx5-im fcitx-hangul
```

`/etc/environment` 파일에 다음 내용을 추가한다. 입력기로 fcitx를 쓰도록 지정하는 작업이다.
<!-- ini파일이 아니지만 syntax highlighting을 위해 형식을 ini으로 지정함 --->
```ini
GTK_IM_MODULE=fcitx
QT_IM_MODULE=fcitx
QT4_IM_MODULE=fcitx
QT5_IM_MODULE=fcitx
XMODIFIERS=@im=fcitx
```

그 다음에 `~/.xprofile` 파일에 다음 내용을 추가한다. 부팅시에 fcitx5가 실행되도록 한다.
```bash
fcitx5 -d
```

재부팅하고 `env | grep fcitx` 명령어를 실행해 환경변수가 제대로 변경됐는지 확인해보자. 제대로 변경됐다면 다음과 같이 뜰 것이다.
```bash
GTK_IM_MODULE=fcitx
QT4_IM_MODULE=fcitx
XMODIFIERS=@im=fcitx
QT5_IM_MODULE=fcitx
QT_IM_MODULE=fcitx
``` 

만약 환경변수가 제대로 변경되지 않았다면 `~/.xprofile` 파일에서 `fcitx5 -d` 위에 다음 내용을 추가하고 재부팅한다. 그러면 환경변수가 정상적으로 변경될 것이다.
```bash
export $(/usr/lib/systemd/user-environment-generators/30-systemd-environment-d-generator)
```

## fcitx5 설정
`fcitx5-configtool` 명령어를 실행하면 다음 창이 뜬다.
![fcitx5 KDE 설정 창](/img/fcitx5_settings_first_screen.png)

위 화면에서 한국어가 안 보이면 **입력기 추가**버튼을 눌러서 추가한다. (입력기 추가 화면에서 한국어가 안 보이면 **현재 언어만 표시** 옵션을 해제하면 된다.)

밑에서 **전역 옵션 구성하기...** 버튼을 누르면 다음 화면이 뜬다.

![fcitx5 KDE 설정 창](/img/fcitx5_global_settings.png)

**Trigger Input Method**가 한/영을 전환하는 단축키 설정이다. 오른쪽의 **+** 버튼을 눌러 한글 키를 추가하면 된다.

fcitx5는 기본적으로 한/영을 전환할때 작은 툴팁을 표시한다. 거슬리면 위 화면에서 **Show Input Method Information when switch input method**를 체크 해제하면 된다.

이제 한글 입력을 버그없이 잘 할 수 있게 됐다. 끝!