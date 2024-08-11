---
title: 'Rust와 SDL2'
subtitle: '게임 개발에 Rust를 써보셨나요?'
author: 'LiteHell'
date: '2024-08-11T14:35:24.968Z'
category: 'Dev'
series: 'bidrum'
tags:
    - 'Game'
---
# 들어가는 글
*※ 참고: 이 시리즈의 글은 시간순 작성을 최대한 목표하고 있으나, 글의 짜임새나 가독성을 위해 미리시점이나 과거시점의 이야기가 섞이거나 순서가 일부 달라질 수 있습니다.*

내가 만들고 싶은 게임은 아케이드 리듬게임이였다. 마침 내 방에 라즈베리 파이(4B Rev 1.2)가 있어서, 라즈베리 파이로 게임을 구동하고 싶었다. Unity나 Unreal Engine으로 만든 게임이 라즈베리 파이 위에서 돌아갈까? 아마도 돌아가지 않을 것이다. 실제로 돌려본 적은 없지만 라즈베리 파이가 성능이 좋은 편은 아니니까.

그래서 필자는 마침 [Rust](https://www.rust-lang.org/) 프로그래밍 언어를 한 번 써보고 싶은 생각도 있었기에, Rust로 직접 게임을 만들어보기로 결심했다. 게임 엔진을 쓰면 나중에 게임이 유명해졌을 때 라이선스비를 내야 한다는 것도 하나의 이유였다. (좀 과한 김칫국이긴 하지만...) 그래서 유니티니 언리얼이니 하는 게임 엔진을 쓰지 않고 Rust로 기초부터 쌓아올리기 시작했다.


# SDL2를 이용한 게임 프로그래밍
Rust에는 [rust-sdl2](https://github.com/Rust-SDL2/rust-sdl2)라는 라이브러리 바인딩이 있다. SDL2는 오디오, 키보드, 마우스, 그래픽, 조이스틱을 다를 수 있게 하는 크로스플랫폼 라이브러리이다. 즉, 그래픽이나 마우스 등에 대한 Direct3D/OpenGL 등의 운영체제/플랫폼 종속적인 API를 추상화하고 단일한 인터페이스로 통일하여 크로스 플랫폼으로 개발할 수 있게 하는 라이브러리이다.

따라서 SDL2를 이용하면 Mac OS X/Windows/Linux에서 크로스플랫폼으로 실행할 수 있고, 라이브러리도 별로 무겁지 않다. 그래서 SDL2를 이용하게 됐다.

## SDL2
SDL2는 rust-sdl 레포 내의 예제 코드를 보면서 따라하면 사용하기 쉽다. SDL2는 먼저 Window(창)을 만든 뒤, Window의 Canvas에 원하는 것을 그리고 렌더링하고 클리어하는 것을 반복한다. 이를 순서대로 나타내면 다음과 같다.

> (A) Window 생성 → (B) Window의 Canvas를 Clear한다 → (C) Canvas에 뭔가를 그린다. → (D) Window의 Canvas를 Present한다. → (E) 화면이 표시한다. → (F) B로 되돌아간다.

학부 수준의 컴퓨터그래픽스 수업을 들었거나 OpenGL 프로그래밍을 조금이라도 맛보았다면 매우 이해하기 쉬울 것이다.

SDL2는 키보드나 조이스틱 인식을 위한 EventPump 기능을 제공한다. 키보드 인풋이 들어오면 EventPump에 Event가 생성된다. 게임은 이 EventPump에 Event가 있는지 확인하여 만약 Event가 있다면 해당 Event의 데이터를 활용해 키보드 인풋을 처리할 수 있다. 게임 특성상 이 EventPump은 디버깅 용으로만 주로 이용됐다.

## GameCommonContext
위에서 언급한 바에 같이 그래픽을 렌더링하기 위해서는 Canvas 객체에 대한 접근이 필요하다. 그래서 초기 게임 초기화시 Canvas와 Window, SDL Context 등을 담은 GameCommonContext 객체를 만들고 이를 함수간에 서로 주고받는 형태로 빠르게 게임을 구현했다.

```rust
use kira::manager::AudioManager;
use sdl2::{render::Canvas, EventPump, video::Window};

pub(crate) struct GameCommonContext {
    pub(crate) coins: u32,
    pub(crate) price: u32,
    pub(crate) sdl_context: sdl2::Sdl,
    pub(crate) audio_manager: AudioManager,
    pub(crate) canvas: Canvas<Window>,
    pub(crate) event_pump: EventPump,
}
```

(속성은 나중에 게임이 개발되면 될 수록 더 늘어난다.)

그리고 이는 추후 대규모 리팩토링으로 Rust의 특징을 온몸으로 깨닫는 계기가 됐다.... 나중에 소유권이랑 lifetime 문제가 미친 듯이 터져나와서 그거 씨름하느라 엄청 고생하게 됐다.


## Rust에서의 시리얼 통신
게임을 장구 하드웨어와 연동하기 위해서는 시리얼 통신이 필요하다.

Arduino Leonardo 등 HID 에뮬레이션을 지원하는 보드가 있으면 장구 하드웨어에서 키보드 인풋을 주도록 할 수도 있다. 그런데 당장 내 방에 있는 게 Arduino UNO 호환보드(흔히 "짭두이노"라고 불리는 보드)밖에 없었다. 그래서 시리얼 통신으로 구현했다. 나중의 미래에 레오나르도 보드를 사서 키보드 인풋으로도 구현해보긴 했는데.... 딱따구리마냥 장구 채를 갖다대기만 해도 장구 채를 미친듯이 연타한 것마냥 동작하는 버그가 있어서 그냥 시리얼 통신을 계속 쓰게 됐다.

Rust에서는 시리얼 통신을 어떻게 할까? 고맙게도 [serialport](https://docs.rs/serialport/latest/serialport/)라는 라이브러리가 있다. 이를 이용해 장구 하드웨어와의 시리얼 통신 코드를 작성했다. 그리고 장구 하드웨어로부터 인풋을 읽는 코드를 멀티쓰레딩으로 분리하고 `AtomicU8`을 이용하여 게임 쓰레드와 인풋 쓰레드 간에 장구 인풋 상태를 서로 공유했다.

왜 뜬끔없이 `AtomicU8`이냐? 장구 컨트롤러의 상태를 나타내는 데에는 4개의 비트만 있으면 충분하다. 그래서 컨트롤러는 1바이트의 데이터를 무한히 연속적으로 보낸다. 이 1바이트를 해석하는 코드는 다음과 같다.

```rust
pub(crate) fn parse_janggu_bits(bits: u8) -> JangguState {
    JangguState {
        궁채: if bits & 1 != 0 {
            Some(DrumPane::채편)
        } else if bits & 2 != 0 {
            Some(DrumPane::북편)
        } else {
            None
        },
        북채: if bits & 4 != 0 {
            Some(DrumPane::채편)
        } else if bits & 8 != 0 {
            Some(DrumPane::북편)
        } else {
            None
        },
    }
}
```

장구 컨트롤러와 연동하는 쓰레드는 컨트롤러로부터 시리얼 통신으로 받은 데이터를 바로 `GameCommonContext` 개체의 `janggu_bits_ptr` 필드에 저장한다.

```rust
// ... (생략) ....

pub(crate) struct GameCommonContext {
   // ... (생략) ...
   pub(crate) janggu_bits_ptr: Arc<AtomicU8>,
}

impl GameCommonContext {
    pub(crate) fn read_janggu_state(&self) -> JangguState {
        return parse_janggu_bits(
            self.janggu_bits_ptr
                .load(std::sync::atomic::Ordering::Relaxed),
        );
    }
}

```

게임 쓰레드에서 장구의 상태를 확인할 때는 `read_janggu_state` 메소드를 이용한다.

추후 미래에 `AtomicU8`을 없애고 Product-Consumer Lock으로 `JangguState` 객체를 직접 공유해보기도 했는데, 렉이 너무 심해서 그냥 `AtomicU8`을 계속 쓰게 됐다.

# 결론
Rust를 이용한 게임 개발은 초창기에는 할만했는데 뒤로 갈수록 어려웠다. 소유권, 대여, lifetime 문제를 해결하느라 골머리를 참 많이 썩었다. 그래서 결론적으로 짧은 기간 안에 게임을 개발해야 한다면 Rust는 별로 좋은 선택이 아니지 않을까라는 생각이 들었다.