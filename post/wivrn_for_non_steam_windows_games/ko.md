---
title: 'WiVRn로 리눅스에서 非Steam VR 게임 실행하기'
subtitle: 'umu launcher와 함께하는 삽질'
author: 'LiteHell'
date: '2025-10-19T09:20:54.590Z'
category: 'Linux'
tags:
    - 'Linux'
    - 'VR'
    - 'XR'
last_modified_at: '2025-10-19T16:10:35.056Z'
---
# 들어가는 글
필자는 리눅스를 쓴다. 리눅스에서 VR 게임을 하기 위해 [깻잎](https://social.silicon.moe/@perillamint)님의 추천을 받아 [WiVRn](https://github.com/WiVRn/WiVRn)와 [OpenComposite](https://gitlab.com/znixian/OpenOVR/)[^1]를 설치했다.

깔고 설정해본 결과 리눅스 네이티브 VR 프로그램(예시: [xrgears](https://gitlab.freedesktop.org/monado/demos/xrgears))과 스팀 게임들은 잘 작동했다.

그러나 문제가 있었다. 非[스팀](https://store.steampowered.com/) 윈도우 게임들은 작동하지 않았다.

## 첫시도
스팀 게임들은 VR이 잘 작동한다. 스팀은 Proton을 쓴다. 그러면 非스팀 게임들에서도 Proton을 써보면 되겠네?

### umu-launcher
그래서 [umu-launcher](https://github.com/Open-Wine-Components/umu-launcher)를 시도해보았다. 스팀에 없는 게임을 [Proton](https://github.com/ValveSoftware/Proton)으로 실행하고 싶을 때 이용하는 프로그램이다. (다만 정확히는 Value의 Proton이 아닌 [Proton GE](https://github.com/GloriousEggroll/proton-ge-custom)를 이용하긴 하지만... 이 글에서는 중요하지 않다.)

Proton은 OpenXR/VR 지원이 내장되어 있다. 그래서 [WiVRn의 SteamVR 문서](https://github.com/WiVRn/WiVRn/blob/master/docs/steamvr.md)에 따라 아래 환경변수만 설정하고 실행하면 되리라 예상했는데 안 됐다.
```env
PRESSURE_VESSEL_FILESYSTEMS_RW=/run/user/1000/wivrn/comp_ipc
XR_RUNTIME_JSON=/run/host/usr/share/openxr/1/openxr_wivrn.json
```
왜일까?

#### 원인
열심히 검색을 해보니 [Proton에서 OpenVR/XR를 쓰려면 Steam이 실행되어야 하고](https://github.com/ValveSoftware/Proton/issues/8256), [umu launcher는 Steam을 기본적으로 실행하지 않기 때문이다](https://github.com/GloriousEggroll/proton-ge-custom/issues/214#issuecomment-3230936706).

이걸 어떻게 하면 최소한의 수정으로 해결할 수 있을까?

## 해결책: 그러면 Steam을 실행하면 되잖아?
간단하다. 그냥 Steam을 실행하면 된다. 

일단 Proton이 어디 있는 지 확인해야 한다. 다음 명령어를 실행해서 디버그 로그를 확인하자. (뒤에 `/tmp/2q3ef32t` 부분은 아무렇게나 치면 된다.)
```bash
UMU_LOG=debug umu-run /tmp/2q3ef32t
```

그러면 다음과 같이 콘솔 로그에서 `proton` 위치를 확인할 수 있다. (예시: `/home/foo/.local/share/Steam/compatibilitytools.d/UMU-Proton-9.0-4e/proton`)

```
[umu.umu_run:887] DEBUG: (PosixPath('/home/foo/.local/share/umu/steamrt3/umu'), '--verb', 'waitforexitandrun', '--', PosixPath('/home/foo/.local/share/umu/steamrt3/umu-shim'), PosixPath('/home/foo/.local/share/Steam/compatibilitytools.d/UMU-Proton-9.0-4e/proton'), 'waitforexitandrun', './asdf')
```

해당 `proton` 파일을 에디터로 열면 다음 코드를 확인할 수 있다.
```python
        # CoD: Black Ops 3 workaround
        if os.environ.get("SteamGameId", 0) in [
                    "311210",   # CoD: Black Ops 3
                    "1549250",  # Undecember
                ]:
            argv = [g_proton.wine_bin, "c:\\Program Files (x86)\\Steam\\steam.exe"]
```

이걸 다음과 같이 수정한다.
```python
        if os.environ.get("UMU_RUN_STEAM", 0) == "1":
            argv = [g_proton.wine64_bin, "c:\\windows\\system32\\steam.exe"]
        # CoD: Black Ops 3 workaround
        elif os.environ.get("SteamGameId", 0) in [
                    "311210",   # CoD: Black Ops 3
                    "1549250",  # Undecember
                ]:
            argv = [g_proton.wine_bin, "c:\\Program Files (x86)\\Steam\\steam.exe"]
```

그리고 `UMU_RUN_STEAM` 환경변수와 WiVRn 환경변수를 설정하여 umu launcher로 게임을 실행한다. 다음 스크립트를 참고하자.
```bash
#!/bin/sh
export UMU_RUN_STEAM=1 
export PRESSURE_VESSEL_FILESYSTEMS_RW=/run/user/1000/wivrn/comp_ipc
export XR_RUNTIME_JSON=/run/host/usr/share/openxr/1/openxr_wivrn.json
export PRESSURE_VESSEL_IMPORT_OPENXR_1_RUNTIMES=1
umu-run ./Game.exe
```

그러면 잘 된다.

# 소감
근본적인 해결책은 아니지만 일단 간단히 해결할 수 있는 방법이다. 다른 분들에게 도움이 됐으면 좋겠다...

---
[^1]: [OpenVR](https://github.com/ValveSoftware/openvr)을 이용한 게임이 [OpenXR](https://www.khronos.org/openxr/) API로 작동할 수 있도록 하는 프로그램이다.