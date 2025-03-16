---
title: 'Docker로 테스트하기'
subtitle: 'Docker로 빌드만 하지 말고 테스트도 하자'
author: 'LiteHell'
date: '2023-10-25T14:49:49.041Z'
category: 'Dev'
tags:
    - 'Docker'
last_modified_at: '2024-12-27T13:05:23.710Z'
---
# 들어가는 글
필자는 중앙대학교 공지사항을 [RSS](https://rss.puang.network)로 만들어서 구독한다. RSS로 만든 후 메신지 봇을 붙이면 알아서 알려주니 편하다.

그러나 최근 해당 RSS 프로그램의 테스트가 실패하는 현상이 발견됐다. 확인한 결과, [중앙대학교 SW교육원](https://swedu.cau.ac.kr) 홈페이지의 TLS 인증서 이슈였던 것으로 확인됐다. 따라서 이를 해결하기 위해 일단 실행되고 있는 Docker 컨테이너에 직접 접근해서 해당 사이트의 CA 인증서를 설치했다.

# 기존 테스트 방법의 한계점
버그는 일단 임시방편으로 수정한 것이니 레포에는 반영되지 않았다. 따라서 테스트 실패 메일이 매일매일 내 메일함으로 전송됐다.

어떻게 하면 이 버그를 수정하고 잘 테스트할 수 있을까? 먼저 이 버그를 수정하려면 Dockerfile을 수정해야 한다. Dockerfile에 다음 내용을 추가하여 Docker 이미지 빌드시 CA 인증서를 복사하도록 했다. [LiteHell/cau-rss 레포의 커밋 21013a3](https://github.com/LiteHell/cau-rss/commit/d765d53d61e9370f5a284068ed273570d21013a3)에서 확인할 수 있다.

```Dockerfile
COPY swedu-cert.pem /usr/local/share/ca-certificates/swedu-cert.crt
RUN cat /usr/local/share/ca-certificates/swedu-cert.crt >> /etc/ssl/certs/ca-certificates.crt
```

이제 위 버그 수정도 같이 테스트해야 한다. 아래에 있는 기존의 GitHub Action으로는 이 버그 수정을 테스트할 수 없다. `go test -v ./...` 명령어가 빌드된 Docker 이미지 내에서 실행되는 것이 아니기 때문이다.
```yaml
      - name: Build
        run: go build -v ./...

      - name: Test
        run: go test -v ./...
```

어떻게 하면 테스트할 수 있을까? 답은 간단하다. Docker로 테스트도 하면 된다.

# Docker를 이용한 테스트
## Multi-stage 빌드
Docker는 빌드를 여러 단계로 나누어 진행할 수 있다. 아래 예시 Dockerfile을 보자.

```Dockerfile
FROM node AS base
WORKDIR /app
ADD src package.json package-lock.json tsconfig.json .

RUN npm i
RUN npm bulid

CMD ["npm", "run", "start"]
```

Typescript 프로젝트를 위한 간단한 Dockerfile이다. 이를 다음과 같이 여러개의 단계(stage)로 쪼갤 수 있다.

```Dockerfile
FROM node AS base
WORKDIR /app
ADD src package.json package-lock.json tsconfig.json .

FROM base AS deps
RUN npm i

FROM deps AS build
RUN npm bulid

FROM build AS deployment
CMD ["npm", "run", "start"]

```

위와 같은 Dockerfile을 이용하면 Docker 빌드시 특정 스테이지까지만 빌드할 수 있다. 예를 들어 아래 명령어는 deps 스테이지까지만 빌드한다.
```bash
docker build --target deps
```

스테이지가 직선적이여야 할 필요는 없다. 다음과 같이 스테이지가 중간에 분기하도록 작성할 수도 있다.
```Dockerfile
FROM node AS base
WORKDIR /app
ADD src package.json package-lock.json tsconfig.json .

FROM base AS deps
RUN npm i

FROM deps AS build
RUN npm bulid

FROM build AS english
COPY english .

FROM english AS deployment-international
CMD ["npm", "run", "start", "--lang=english"]

FROM build AS korean
COPY korean .

FROM korean AS deployment-domestic
CMD ["npm", "run", "start", "--lang=korean"]
```

위 Dockerfile의 경우 build 스테이지에서 english 스테이지와 korean 스테이지로 분기한다.

### BuildKit

```Dockerfile
FROM node AS base
WORKDIR /app
ADD src package.json package-lock.json tsconfig.json .

FROM base AS deps
RUN npm i

FROM deps AS build
RUN npm bulid

FROM build AS english
COPY english .

FROM english AS deployment-international
CMD ["npm", "run", "start", "--lang=english"]

FROM build AS korean
COPY korean .

FROM korean AS deployment-domestic
CMD ["npm", "run", "start", "--lang=korean"]
```

위 Dockerfile을 가지고 아래 명령어를 실행한다고 가정해보자.
```bash
docker build --target deployment-domestic
```

위 경우 빌드에 필요한 스테이지는 `base`, `deps`, `build`, `korean`, `deployment-domestic`이다. 그러나 실제로 위 명령어를 실행해보면 불필요한 `english`, `deployment-international` 스테이지도 빌드하는 것을 확인할 수 있다.

이는 도커 레거시 빌더를 이용하기 때문에 생기는 문제이다. [Docker BuildKit](https://docs.docker.com/build/buildkit/)은 사용되지 않는 스테이지를 자동으로 파악하여 불필요한 스테이지는 빌드를 생략한다. 따라서 Docker BuildKit을 설치한 후 다음 명령어로 빌드하면 필요한 스테이지만 빌드할 수 있다.

```bash
DOCKER_BUILDKIT=1 docker build --target deployment-domestic
```

## Multi-stage 빌드를 이용한 테스트
이제 Docker를 이용해 테스트를 하는 방법에 대해 알아보자. 다음은 [cau-rss 레포](https://github.com/LiteHell/cau-rss)의 Dockerfile 내용을 약간 수정한 예시이다.
```Dockerfile
FROM golang:alpine AS base
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY cau_parser ./cau_parser
COPY server ./server

# To avoid tls error from swedu.cau.ac.kr
COPY swedu-cert.pem /usr/local/share/ca-certificates/swedu-cert.crt
RUN cat /usr/local/share/ca-certificates/swedu-cert.crt >> /etc/ssl/certs/ca-certificates.crt

COPY static ./static
COPY html ./html

COPY *.go ./

FROM base AS build
RUN go build -v -o ./app ./
CMD ["/app/app"]

FROM base AS test
RUN ["go", "test" ,"-v", "./..."]

```

`base` 스테이지에서 의존성을 설치한 뒤 각종 필요한 파일들을 복사하고 TLS 인증서 오류 해결을 위한 CA 인증서를 복사한다. `test` 스테이지는 `base` 스테이지에서 테스트 명령어를 실행하는 스테이지이며, `build` 스테이지는 `base` 스테이지를 바탕으로 도커 이미지를 빌드하는 스테이지이다.

따라서 위 Dockerfile을 이용해 `build` 스테이지까지 빌드하면 도커 이미지를 만드는 것이며, `test` 스테이지까지 빌드하면 테스트를 실행하게 되는 것이다. 이를 명령어로 나타내면 다음과 같으며, 캐시로 인해 테스트가 진행되지 않는 것을 방지하기 위해 `--no-cache` 매개변수를 추가했다.

```bash
# Test
DOCKER_BUILDKIT=1 docker build --no-cache --target test .

# Build
DOCKER_BUILDKIT=1 docker build --target build
```

테스트 실패시 Docker 빌드 오류가 발생한다. 이를 응용하면 다음과 같이 테스트 성공시 빌드를 진행하고, 실패시 오류 메세지를 출력하는 bash 스크립트를 작성할 수 있다.
```bash
export DOCKER_BUILDKIT=1

docker build --no-cache --target test .
test_status=$?
if [ $test_status -eq 0 ]; then
  docker build --taget build . --tag example-application
else
  echo "ERROR while testing!"
fi
```

## Github Action을 이용한 활용
GitHub Action을 이용하면 다음과 같이 push시 테스트가 이루어지도록 할 수 있다.

```yaml
name: Test
on: push

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Test
        run: docker build --no-cache --target test .
        env:
          DOCKER_BUILDKIT: 1

```

빌드도 잘 되는지 확인하고 싶다면 빌드하는 job을 하나 더 추가하면 된다.

```yaml
name: Build and test
on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build
        run: docker build --target build .
        env:
          DOCKER_BUILDKIT: 1

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Test
        run: docker build --no-cache --target test .
        env:
          DOCKER_BUILDKIT: 1

```

# 결론
Docker 이미지로 배포를 진행하는 경우, Docker로 테스트도 같이 진행하면 실제 배포 환경과 유사한 환경에서 테스트를 진행할 수 있다는 큰 장점이 있다. 따라서 복잡한 어플리케이션이라면 이 글을 참고해 Docker로 테스트도 같이 하는 것이 좋은 선택이 될 수 있다.