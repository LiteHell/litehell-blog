---
title: 'Linux에서 OneDrive 이용하기'
subtitle: 'rclone을 이용한 OneDrive 이용 방법'
author: 'LiteHell'
date: '2025-10-06T03:12:04.274Z'
category: 'Linux'
tags:
    - 'Linux'
    - 'OneDrive'
    - 'rclone'
---

# 서론
[중앙대학교](https://www.cau.ac.kr)에서는 MS Office와 OneDrive를 무료로 제공한다. 그래서 잘 쓰고 있다가 노트북을 리눅스로 밀어버린 이후에도 [onedriver](https://github.com/jstaf/onedriver)를 이용하여 사용하고 있었다.[^1] 그러다가 졸업하고 공짜 OneDrive가 끊기면서 개인 OneDrive로 옮겼다가 자취방에 NAS를 만들려 시도하면서 노트북에서 OneDrive를 아예 밀었다. 근데 NAS를 막상 만들어보니 HDD 2개가 동시에 고장나더라... 그래서 OneDrive를 잘 안쓰는 상태로 계속 지내다가 연휴에 모처럼 시간이 나서 리눅스 노트북에 OneDrive를 간단히 세팅하기로 했다.

# OneDrive를 써보자.
이제 리눅스 노트북에 OneDrive를 세팅해보자.

## 방법
리눅스에서 OneDrive를 세팅하려면 세가지 방법이 있다.

- [rclone](https://rclone.org/)
- [onedriver](https://github.com/jstaf/onedriver)
- [onedrive](https://github.com/abraunegg/onedrive)

onedriver는 [FUSE](https://en.wikipedia.org/wiki/Filesystem_in_Userspace)를 이용하는 방식이고 onedrive는 로컬 디렉토리를 OneDrive와 동기화하는 방식이다. rclone은 둘 다 가능하다.

개인적인 경험으로 onedrive는 아무래도 디스크 용량이 많이 필요했고, onedriver는 내 기억상 OneNote 관련 이상한 버그가 하나 있었다.[^2] 그래서 이번에는 rclone을 썼다.

## rclone
> Rclone is a command-line program to manage files on cloud storage.

rclone은 클라우드 파일 관리를 위한 프로그램이다. 윈도우에서도 사용 가능하며, 여러 클라우드 서비스를 지원한다.

본 글에서는 rclone을 이용해 FUSE로 mount하는 방법을 설명한다.

### rclone 설치
필자는 [Arch Linux](https://archlinux.org)를 이용한다. `pacman`이나 선호하는 패키지 매니저를 이용하여 설치하면 된다.

```bash
sudo pacman -Sy rclone
```

일반적인 리눅스 이용자라면 다음 명령어로 설치할 수 있다. `curl`과 `bash`는 설치되어 있어야 한다.

```bash
sudo -v ; curl https://rclone.org/install.sh | sudo bash
```

### App 

### rclone config
rclone을 설치했다면 이제 rclone 설정을 생성해야 한다. 다음 명령어를 실행하자. `onedrive_personal` 부분은 독자가 원하는 대로 변경해도 된다.

```bash
rclone config create onedrive_personal onedrive --all
```

맨 처음에 아래와 같은 `client_id`와 `client_secret` 설정 화면이 나온다. 이 두가지는 선택이긴 한데 설정하면 좋다.[^3] 설정하는 방법에 대해서는 [rclone 공식 홈페이지](https://rclone.org/onedrive/)의 **Creating Client ID for OneDrive Personal**이나 **Creating Client ID for OneDrive Business**(학교나 회사의 OneDrive를 쓰는 경우)를 참고하자.

```
$ rclone config create test onedrive --all
Option client_id.
OAuth Client Id.
Leave blank normally.
Enter a value. Press Enter to leave empty.
client_id> 

Option client_secret.
OAuth Client Secret.
Leave blank normally.
Enter a value. Press Enter to leave empty.
client_secret> 
```

region은 1로 한다.

```
Option region.
Choose national cloud region for OneDrive.
Choose a number from below, or type in your own value of type string.
Press Enter for the default (global).
 1 / Microsoft Cloud Global
   \ (global)
 2 / Microsoft Cloud for US Government
   \ (us)
 3 / Microsoft Cloud Germany (deprecated - try global region first).
   \ (de)
 4 / Azure and Office 365 operated by Vnet Group in China
   \ (cn)
region> 1
```

tenant는 빈 칸으로 하면 된다.

```
Option tenant.
ID of the service principal's tenant. Also called its directory ID.
Set this if using
- Client Credential flow
Enter a value. Press Enter to leave empty.
tenant> 
```

고급 설정은 필요 없다.
```
Edit advanced config?
y) Yes
n) No (default)
y/n> 
```

여기서 엔터를 누르면 웹 브라우저가 열린다. 웹 브라우저에서 로그인하면 된다.
```
Use web browser to automatically authenticate rclone with remote?
 * Say Y if the machine running rclone has a web browser you can use
 * Say N if running rclone on a (remote) machine without web browser access
If not sure try Y. If Y failed, try N.

y) Yes (default)
n) No
y/n> 
```

로그인을 완료하면 터미널에서 다음과 같은 질문이 뜬다. 1을 입력하자.
```
Option config_type.
Type of connection
Choose a number from below, or type in an existing value of type string.
Press Enter for the default (onedrive).
 1 / OneDrive Personal or Business
   \ (onedrive)
 2 / Root Sharepoint site
   \ (sharepoint)
   / Sharepoint site name or URL
 3 | E.g. mysite or https://contoso.sharepoint.com/sites/mysite
   \ (url)
 4 / Search for a Sharepoint site
   \ (search)
 5 / Type in driveID (advanced)
   \ (driveid)
 6 / Type in SiteID (advanced)
   \ (siteid)
   / Sharepoint server-relative path (advanced)
 7 | E.g. /teams/hr
   \ (path)
config_type> 
```

아래와 같이 driveid를 선택하는 화면이 뜬다. 그냥 엔터를 눌러 기본값을 선택하자.
```
Option config_driveid.
Select drive you want to use
Choose a number from below, or type in your own value of type string.
Press Enter for the default (DDDDDDD).
 1 / redacted1 (personal)
   \ (AAAAAAA)
 2 / redacted2 (personal)
   \ (BBBBBBB)
 3 / redacted3 (personal)
   \ (CCCCCCC)
 4 / OneDrive (personal)
   \ (DDDDDDD)
config_driveid> 
```

URL을 눌러 원드라이브가 정상적으로 표시되는 지 확인하자. 원하는 원드라이브가 표시된다면 y를 입력하자.
```
Drive OK?

Found drive "root" of type "personal"
URL: https://onedrive.live.com?cid=redacted
```

그러면 이제 config 생성이 끝난다.

### rclone mount
이제 rclone mount를 하자. 필자가 이용하는 rclone mount 명령어는 다음과 같다.

```bash
rclone mount --vfs-cache-mode full --stats=10s --stats-log-level NOTICE --log-file=/var/log/rclone/rclone-onedrive.log --log-file-max-size 1M --log-file-max-backups 15 onedrive_personal: ~/OneDrive
```
위 명령어를 실행하여 `~/OneDrive`에 원드라이브가 마운트되는지 확인해보자. 참고로 로그 디렉토리는 명령어를 실행하는 계정이 소유하고 있어야 하며, 마운트될 디렉토리는 미리 생성되어 있어야 한다. (이에 관련해서는 아래 명령어를 참고하자.)

```bash
sudo mkdir /var/log/rclone
sudo chown -R $(whoami) /var/log/rclone
mkdir ~/OneDrive
```

### crontab
잘 된다면 이제 부팅될 때마다 rclone mount 명령어가 실행되도록 설정하자. 처음에는 무지성으로 `~/.profile` 파일에 집어넣었는데 생각해보니 이 파일 터미널 창 켰을 때 자동실행되는 파일이잖아? 그래서 KDE 자동 시작 설정을 이용하려고 했는데 재부팅하면 자동 시작 설정이 초기화되는 버그가 있었다. 왜...?

그러면 대충 남은 선택지가 `systemd` 이용하는 방법인데 systemd unit 파일 만들기가 귀찮았다. 그래서 어떻게 하면 가장 덜 귀찮게 할 수 있을까 생각했는데

![빨간 옷을 입은 어린이가 한 손을 들며 "아하!"하는 듯한 모습](aha.jpg)

crontab을 쓰면 되잖아?

아치 리눅스는 crontab이 기본적으로 설치되어 있지 않다. 바로 설치하자.

```bash
sudo pacman -Sy cronie
sudo systemctl enable cronie
```

`~/.autostart.sh` 파일을 아래와 같이 만들자. rclone 명령어를 입력할 때는 `--daemon` 옵션 추가해서 입력하면 된다.
```bash
#/bin/sh
rclone mount --daemon --vfs-cache-mode full --stats=10s --stats-log-level NOTICE --log-file=/var/log/rclone/rclone-onedrive.log --log-file-max-size 1M --log-file-max-backups 15 onedrive: ~/OneDrive
```

그리고 `crontab -e` 명령어를 실행하고 다음 내용을 추가하자. `litehell` 부분은 독자의 사용자 계정명으로 알아서 바꾸면 된다.
```bash
@reboot /bin/sh /home/litehell/.autostart.sh
```

이제 재부팅하면 잘 되는 걸 확인할 수 있다. 메데타시~

## 결론
NAS 만든답시고 HDD 2개 샀다가 2개 다 고장나는 기적을 본 뒤 OneDrive도 클라우드도 잘 안쓰는 채로 지냈었다. 뭐 건들고 설정하는 게 귀찮아서 그런건데... 이제 설정했으니 잘 쓰지 않을까 싶다.

---

[^1]: 그때 노트북 SSD 용량이 많지 않아서 [onedrive](https://github.com/abraunegg/onedrive)는 고려하지 않았다.
[^2]: OneNote 파일이 무한 증식하는 버그가 있었던 것 같은데... 확실하진 않다.
[^3]: 필자는 설정했다.