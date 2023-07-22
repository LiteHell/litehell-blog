---
title: 'Mastodon 서버 구축하기'
subtitle: '6$짜리 VPS와 CloudFlare를 이용한 인스턴스 구축'
author: 'LiteHell'
date: '2023-07-22T15:55:38.110Z'
category: 'Dev'
tags:
    - 'Mastodon'
    - 'ActivityPub'
---
# 트위터와 페디버스
확실히 요즘 트위터는 달라졌다. 일론 머스크가 인수한 이후의 트위터는 확실히 뭔가 달라졌다. 뭔가 보여주겠다는 의지의 표출인가?

이런 새로워진 트위터에 적응하지 못한 사람들은 [마스토돈](https://joinmastodon.org)이나 [미스키](https://misskey-hub.net/) 등의 [ActivityPub](https://www.w3.org/TR/activitypub/)를 구현한 분산형 SNS 인스턴스로 이주하고 있다. 국내의 이런 분산형 SNS는 대표적으로 다음과 같다.

- [트잉여](https://twingyeo.kr/)
- [플래닛](https://planet.moe/)
- [큐돈](https://qdon.space/)
- [애니워크](https://ani.work/)
- [SifNet Mastodon](https://social.silicon.moe)
- [hotomoe](https://hoto.moe)

위와 같이 서로 AcitivtyPub 등의 프로토콜을 이용해 통신하는 SNS 서비스들의 집합을 **Fediverse**(페디버스)라 일컬는다. 페디버스는 서버간에 서로 통신할 수 있기 때문에 다른 서버에 있는 사용자와도 소통할 수 있다. 즉, 서버 A에서 서버 B에 있는 사람을 팔로우할 수도 있다.

# Mastodon 설치
분산형 SNS이니 당연히 본인이 직접 서버를 구축하는 것도 가능하다. 따라서 직접 VPS에 마스토돈을 설치했다. VPS 운영체제로는 데비안을 택했고, 사양은 Vultr $6 VPS로 했다.

설치 자체는 [공식 홈페이지의 문서](https://docs.joinmastodon.org/admin/install/)를 따르는 식으로 진행했으나 중간중간 삽질을 약간 했다.

## root 계정 전환
마스토돈을 설치하기 위해서는 먼저 root 계정으로 전환한다. `su` 명령어를 이용하면 된다.

## 의존성 설치
그 다음, 의존성을 설치해야 한다. 의존성 설치 자체는 공식 홈페이지에 있는 명령어를 복사-붙여넣기하면 끝난다.

첫번째로 다음 명령어를 실행해 node.js v16을 설치한다.

```bash
curl -sL https://deb.nodesource.com/setup_16.x | bash -
```

그리고 다음 명령어를 실행해 PostgreSQL와 기타 다른 의존성들을 설치한다.

```bash
apt install -y curl wget gnupg apt-transport-https lsb-release ca-certificates
wget -O /usr/share/keyrings/postgresql.asc https://www.postgresql.org/media/keys/ACCC4CF8.asc
echo "deb [signed-by=/usr/share/keyrings/postgresql.asc] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/postgresql.list
apt update
apt install -y \
  imagemagick ffmpeg libpq-dev libxml2-dev libxslt1-dev file git-core \
  g++ libprotobuf-dev protobuf-compiler pkg-config nodejs gcc autoconf \
  bison build-essential libssl-dev libyaml-dev libreadline6-dev \
  zlib1g-dev libncurses5-dev libffi-dev libgdbm-dev \
  nginx redis-server redis-tools postgresql postgresql-contrib \
  certbot python3-certbot-nginx libidn11-dev libicu-dev libjemalloc-dev
```

### nodejs 버전 확인
다만 여기서 주의해야 하는 것이 있다. 시스템에 따라서 nodejs 16버전이 아닌 그보다 더 최신 버전이 설치됐었을 수도 있다.
상관없지 않냐고? 상관있다, nodejs v16 버전이 아니면 나중에 webpack precompile 과정에서 오류가 난다.

설치된 nodejs의 버전은 `node --version` 명령어로 확인할 수 있다.

```bash
$ node --version
v18.13.0
```

이는 데비안 apt 레포지토리에 있는 `nodejs` 패키지 버전이 16보다 더 최신이기 때문에 발생한 문제이다. 이를 해결하기 위해서는 먼저 `sudo apt-cache policy nodejs`를 실행해 어떤 버전이 설치 가능한지 확인해야 한다.

```bash
$ sudo apt-cache policy nodejs
nodejs:
  Installed: 18.13.0+dfsg1-1
  Candidate: 18.13.0+dfsg1-1
  Version table:
 *** 18.13.0+dfsg1-1 500
        500 https://deb.debian.org/debian bookworm/main amd64 Packages
        500 https://debian.mirror.constant.com bookworm/main amd64 Packages
     16.20.1-deb-1nodesource1 500
        500 https://deb.nodesource.com/node_16.x bookworm/main amd64 Packages
        100 /var/lib/dpkg/status
```

위 예시에서는 `18.13.0+dfsg1-1`과 `16.20.1-deb-1nodesource1` 버전이 설치 가능하다. 우리가 필요한 것은 nodejs v16대 버전이니 `16.20.1-deb-1nodesource1`을 설치할 것이다.

apt에서 특정한 버전을 지정해 설치하기 위해서는 다음과 같이 명령어를 실행하면 된다.

```bash
$ sudo apt install nodejs=16.20.1-deb-1nodesource1
```

그러면 nodejs v16이 정상적으로 설치된 것을 확인할 수 있다.

### Yarn 설치
위에서 nodejs, PostregreSQL 등의 의존성을 다 설치했으면 [Yarn](https://yarnpkg.com)을 설치해야 한다. Yarn은 다음 명령어로 설치한다.

``` bash
corepack enable
yarn set version classic
```

혹시 위 명령어가 작동하지 않는다면 다음과 같이 npm을 이용해 설치할 수도 있다.
```bash
sudo npm i -g yarn
```

만약 위 npm을 이용한 명령어가 npm이 설치되어 있지 않아 실행되지 않는다면 아래 명령어로 npm을 실치할 수 있다.
```bash
curl -qL https://www.npmjs.com/install.sh | sh
```

## Ruby 설치
이제 Ruby를 설치해야 한다. 먼저 `mastodon`이라는 이름의 리눅스 계정을 생성한다.

```bash
adduser --disabled-login mastodon
```

그리고 쉘을 지정한다. (안 하면 `sudo su - mastodon` 명령어가 오류날 수 있다.) 아래 명령어에서는 쉘을 bash로 지정했는데, 쉘이 무조건 bash여야 할 필요는 없다. 선호하는 쉘이 있다면 그 쉘로 지정해도 된다.
```bash
chsh -s /bin/bash mastodon
```

이제 mastodon으로 계정을 전환하자.
```bash
sudo su - mastodon
```

다음 명령어를 모두 실행해 Ruby를 설치한다.
```bash
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
cd ~/.rbenv && src/configure && make -C src
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exec bash
git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
RUBY_CONFIGURE_OPTS=--with-jemalloc rbenv install 3.0.6
rbenv global 3.0.6
```

Ruby 설치가 완료됐다면 bundler도 설치한다.
```bash
gem install bundler --no-document
```

Ruby와 bundler 설치를 마쳤다면 root 유저로 되돌아간다.
```bash
exit
```

## PostgreSQL 설정
공식 문서에서 pgTune을 쓰고 싶으면 쓰라고 나와있는데 필자는 귀찮아서 건너뛰었다.

PostgreSQL 설정을 위해 다음 명령어로 PostgreSQL 쉘을 띄운다.
```bash
sudo -u postgres psql
```

PostgreSQL 쉘이 띄워졌으면 다음 쿼리를 실행해서 SQL 계정을 생성한다.
```sql
CREATE USER mastodon CREATEDB;
```

계정이 생성됐으면 다음 명령을 쳐서 쉘을 빠져나온다.
```sql
\q
```

## 마스토돈 다운로드
이제 마스토돈을 다운로드하고 설정할 때가 왔다. 먼저 mastodon 계정으로 전환한다.
```bash
sudo su - mastodon
```

다음 명령어를 실행해 최신 stable 버전의 mastodon을 다운로드한다.
```bash
git clone https://github.com/mastodon/mastodon.git live && cd live
git checkout $(git tag -l | grep -v 'rc[0-9]*$' | sort -V | tail -n 1)
```

이제 Ruby 의존성과 JavaScript 의존성을 설치한다.
```bash
bundle config deployment 'true'
bundle config without 'development test'
bundle install -j$(getconf _NPROCESSORS_ONLN)
yarn install --pure-lockfile
```

## 서버 swap 설정 및 nodejs heap 용량 설정
마스토돈 설정(바로 다음 문단)을 하는 과정에서 Javascript heap out of memory 오류가 발생할 수 있다. 이는 서버에 RAM이 부족하기 때문이다. 이를 해결하기 위해서는 RAM을 더 꽂거나 swap 파일을 형성하고, 그 다음 node 설정을 수정해야 한다.

먼저 swap파일을 생성하는 방법은 다음과 같다. 용량은 적절하게 바꾸면 된다.
```bash
sudo fallocate -l 2G /tmp-swapfile
sudo chmod 600 /tmp-swapfile
sudo mkswap /tmp-swapfile
```

생성된 swap파일은 다음과 같이 적용할 수 있다.
```bash
sudo swapon /tmp-swapfile
```

위 명령어로 적용된 swap파일은 재부팅이 될 시 다시 적용되지 않으므로 재부팅을 하면 위 명령어를 다시 쳐줘야 한다. 따라서 swap 파일을 영구적으로 적용하기 위해서는 `/etc/fstab` 파일을 수정해야 하나, 본 글에서는 마스토돈을 설정하는 동안에만 임시적으로 이용할 swap 파일을 생성하는 것이므로 이 파일을 수정하는 방법에 대해서 언급하지 않는다.

이제 node 설정을 바꾸어야 한다. 먼저 현재 할당한 힙 용량을 다음 명령어로 확인한다.
```bash
node -e 'console.log(v8.getHeapStatistics().heap_size_limit/(1024*1024))'
```

실행하면 다음과 같이 뜰 것이다.
```bash
$ node -e 'console.log(v8.getHeapStatistics().heap_size_limit/(1024*1024))'
495.75
```

위 용량을 참고해서 위 용량보다 적당히 더 큰 용량으로 힙 용량을 설정하면 된다. 힙 용량의 설정은 다음 명령어를 마스토돈 설정 명령어 실행 직전에 실행함으로써 할 수 있다.
```bash
export NODE_OPTIONS=--max_old_space_size=800
```

## 마스토돈 설정
다음 명령어를 실행해 마스토돈 서버를 설정한다.
```bash
RAILS_ENV=production bundle exec rake mastodon:setup
```

만약 Javascript heap out of memory 오류가 떴다면 바로 윗 문단에 따라 힙 용량 및 swap 설정을 하고 다음 명령어를 실행하면 된다.

```bash
RAILS_ENV=production bundle exec rails assets:precompile
```

성공적으로 실행됐을 시 마스토돈 관리자 비밀번호가 표시될 것이다. 잊지 말고 메모하도록 하자.

## nginx 설정
다음 명령어를 실행한다.
```bash
cp /home/mastodon/live/dist/nginx.conf /etc/nginx/sites-available/mastodon
ln -s /etc/nginx/sites-available/mastodon /etc/nginx/sites-enabled/mastodon
```

`/etc/nginx/sites-available/mastodon` 파일에서 `example.com`을 모두 자신의 마스토돈 도메인(내 경우에는 `social.litehell.info`)로 바꾼다. 그리고 다음 명령어를 실행한다.

```bash
systemctl reload nginx
```

## CloudFlare Origin Certificate 설정
필자는 CloudFlare Origin Certificate를 쓴다. CloudFlare에서 Origin Certificate를 생성한 뒤 서버에 저장하고, `/etc/nginx/sites-available/mastodon` 파일에서 `ssl_certificate` 속성과 `ssl_certificate_key`를 다운받은 서버/서버 개인키 경로로 수정하면 된다.

## systemd 설정
아래 명령어를 실행한다.
```bash
cp /home/mastodon/live/dist/mastodon-*.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now mastodon-web mastodon-sidekiq mastodon-streaming

```

그러면 마스토돈이 실행될 것이다. 이제 즐기면 된다.

## CloudFlare 최적화로 인한 사이트 깨짐 문제 해결
![CSS가 정상적으로 불러와지지 않은 마스토돈 인스턴스의 스크린샷](/img/broken_css_mastodon.png)

CloudFlare를 쓰면 위와 같이 마스토돈이 깨지는 문제를 겪을 수 있다.
이는, 무결성을 위해 HTML 내에 CSS 파일의 해시가 포함되어있는데, CloudFlare가 CSS를 자동 최적화하면서 CSS 파일이 변경되고, 이로 인해 해시가 불일치됨에 따라 웹브라우저가 CSS를 불러오지 않음으로써 발생하는 문제이다.

이 문제는 CloudFlare에서 Auto Minify를 비활성화하고 모든 캐시를 삭제하여 해결할 수 있다.

## 릴레이 연결
마스토돈에 혼자 있으면 외롭다. 이를 극복하기 위해서는 릴레이를 연결해야 한다. 페디버스 내에서 인스턴스는 기본적으로 게시물을 팔로워가 있는 서버에만 전송한다. 따라서 타 서버의 팔로워가 없는 인스턴스는 외로울 수 밖에 없다. 이를 극복하기 위해 릴레이가 있다.

릴레이는 구독하는 서버들간에 게시물을 나눈다. 릴레이에 구독된 인스턴스가 게시물을 릴레이로 보내면, 릴레이가 구독된 모든 서버들에게 게시물을 전송하는 방식이다. 따라서 릴레이내에 있는 서버간에는 팔로워가 있는지의 여부와 상관없이 게시물이 서로 공유된다.

한국어권 릴레이는 다음 세가지 릴레이가 있다. 이 릴레이는 모두 화이트리스트이다.
 - [한국 Mastodon 인스턴스 연합(가칭) 릴레이](https://relay.mastodon.kr)
 - [인터스텔라 릴레이 커뮤니티](https://interstellar.flights)
 - [musubi.moe](https://relay.musubi.moe)

위 릴레이에 가입하기 위해서는 각 릴레이에서 요구하는 조건을 모두 만족시킨 뒤 릴레이측에 가입 신청을 하면 된다. 가입 신청 방법 및 조건은 릴레이마다 다르다. 가입 신청이 받아들여지면 릴레이 관리 페이지(`/admin/relays`)에서 해당 릴레이에서 안내하는 주소를 추가하면 된다. 참고로 내 경험상 개인 인스턴스라고 딱히 안 받아주진 않았다. 조건만 맞으면 받아주는 것 같으니 조건이 맞는다면 부담없이 신청해보자.

모든 릴레이가 화이트리스트인 것은 아니다. [RelayList](https://relaylist.com)에서 Registeration이 open으로 되어있는 릴레이는 가입신청을 하지 않아도 되는 릴레이들이다. 다만 대규모 릴레이는 구독이 처리되는 데 시간이 좀 오래 걸릴 수 있다.

[#FediBuzz Relay](https://relay.fedi.buzz/) 서비스를 이용하면 특정 마스토돈 인스턴스의 타임라인을 릴레이를 통해 구독할 수도 있다. 해당 사이트의 안내를 따르면 특정 인스턴스의 타임라인을 구독할 수 있다.

## public/system 용량 문제
`public/system` 디렉토리는 용량을 많이 잡아먹는다. 다음 두 가지 방법 중 하나를 택하여 해결하면 된다.

- S3-Compatible Object Storage 쓰기
- [마스토돈 공식 홈페이지의 Running periodic cleanup tasks 문단](https://docs.joinmastodon.org/admin/setup/#cleanup)에 따라 crontab을 생성하고 마스토돈이 설치된 디렉토리에서 다음 명령어 모두 실행하기
  ```bash
RAILS_ENV=production ./bin/tootctl accounts prune
RAILS_ENV=production ./bin/tootctl cache clear
RAILS_ENV=production ./bin/tootctl media remove --days=0
RAILS_ENV=production ./bin/tootctl media remove --prune-profiles --days=0
RAILS_ENV=production ./bin/tootctl preview_cards remove --days=0
  ```
  - crontab과 위 명령어만으로 부족하면 그냥 대용량 하드디스크 하나 꽂고 `/etc/fstab` 파일 수정해서 `public/system` 디렉토리에 영구 마운트해버리기 (좀 무식하게 보일 수도 있지만 간단하고 직빵이다)

마음에 드는 방법을 택하도록 하자.