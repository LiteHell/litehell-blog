---
title: 'How to run non-Steam Windows game on Linux with WiVRn'
subtitle: 'Troubleshooting with umu-launcher'
author: 'LiteHell'
date: '2025-10-19T09:20:54.590Z'
category: 'Linux'
tags:
    - 'Linux'
    - 'VR'
    - 'XR'
translated_at: '2025-10-19T16:10:12.951Z'
---
# Introduction
I use Linux for laptop. I installed [WiVRn](https://github.com/WiVRn/WiVRn) and [OpenComposite](https://gitlab.com/znixian/OpenOVR/)[^1] for VR gaming on Linux, as recommended by [perillamint](https://social.silicon.moe/@perillamint).

It works well for Linux native VR programs (e.g. [xrgears](https://gitlab.freedesktop.org/monado/demos/xrgears)) and Steam games.

However, it had a problem that non-Steam Windows games don't work.

## First try
Steam games works well for VR. Steam uses Proton. Then, Why don't I use Proton for non-Steam games?


### umu-launcher
Therefore, I tried [umu-launcher](https://github.com/Open-Wine-Components/umu-launcher), a program to run [Proton](https://github.com/ValveSoftware/Proton) for games not in Steam. (Actually, It uses [Proton GE](https://github.com/GloriousEggroll/proton-ge-custom), not Proton by Valve. But, it doesn't matter in this post.)

Proton includes OpenXR/VR support. So I expected it will work well if I set environment variables following [SteamVR documentation of WinVR](https://github.com/WiVRn/WiVRn/blob/master/docs/steamvr.md). But it didn't work.
```env
PRESSURE_VESSEL_FILESYSTEMS_RW=/run/user/1000/wivrn/comp_ipc
XR_RUNTIME_JSON=/run/host/usr/share/openxr/1/openxr_wivrn.json
```
Why?

#### Reason
After some googling, I found that [It needs Steam to be launched to use OpenVR/XR on Proton](https://github.com/ValveSoftware/Proton/issues/8256), and [umu launcher doesn't launch Steam by default](https://github.com/GloriousEggroll/proton-ge-custom/issues/214#issuecomment-3230936706).

How can I resolve it with minimum efforts?

## Solution: Then run Steam :D
Simple. Just run Steam. 

Firstly, Let's check where the Proton is. Check debug log by running this command (Type `/tmp/2q3ef32t` part randomly. It doesn't matter)
```bash
UMU_LOG=debug umu-run /tmp/2q3ef32t
```

Then, you can see the location of `proton` from the console log. (e.g. `/home/foo/.local/share/Steam/compatibilitytools.d/UMU-Proton-9.0-4e/proton`) The below is example part of console log.

```
[umu.umu_run:887] DEBUG: (PosixPath('/home/foo/.local/share/umu/steamrt3/umu'), '--verb', 'waitforexitandrun', '--', PosixPath('/home/foo/.local/share/umu/steamrt3/umu-shim'), PosixPath('/home/foo/.local/share/Steam/compatibilitytools.d/UMU-Proton-9.0-4e/proton'), 'waitforexitandrun', './asdf')
```

Find this code from the `proton` file with editor
```python
        # CoD: Black Ops 3 workaround
        if os.environ.get("SteamGameId", 0) in [
                    "311210",   # CoD: Black Ops 3
                    "1549250",  # Undecember
                ]:
            argv = [g_proton.wine_bin, "c:\\Program Files (x86)\\Steam\\steam.exe"]
```

Replace above code to below.
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

Finally, Run game `UMU_RUN_STEAM` environment variable and WiVRn-related environment variables. Check this script for details.
```bash
#!/bin/sh
export UMU_RUN_STEAM=1 
export PRESSURE_VESSEL_FILESYSTEMS_RW=/run/user/1000/wivrn/comp_ipc
export XR_RUNTIME_JSON=/run/host/usr/share/openxr/1/openxr_wivrn.json
export PRESSURE_VESSEL_IMPORT_OPENXR_1_RUNTIMES=1
umu-run ./Game.exe
```

Then It works.

# Final words
It's not fundamental solution but simple solution. I wish it could help...

---
[^1]: The program that makes games using [OpenVR](https://github.com/ValveSoftware/openvr) be able to run with [OpenXR](https://www.khronos.org/openxr/) API.