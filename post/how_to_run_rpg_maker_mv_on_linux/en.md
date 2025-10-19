---
title: 'How to run RPG Maker MV games on Linux'
subtitle: 'when it does not work well with wine'
author: 'LiteHell'
date: '2025-02-18T11:02:55.344Z'
category: 'Linux'
tags:
    - 'Game'
    - 'Wine'
last_modified_at: '2025-10-19T16:52:08.538Z'
translated_at: '2025-10-19T16:52:05.437Z'
---
# Introduction
I tried to run games, developed with RPG Maker MV, but it stucks at loading.

# Solution
I thought installing Windows on VM, but I found `nwjs.dll` file. The structure of `package.json` in the `www` directory of the game is also similar with the one of nwjs applications.

What if I just use nwjs binary for Linux? I tried it, and it actually worked.

1. Download Linux binaries from [nwjs homepage](https://nwjs.io/) (No need to use SDK versions)
1. Find a directory having `package.json` (Usually `www` directory)
1. Run the nwjs binary, downloading in the Step 1, with the directory found in the Step 2 as parameter. (e.g. `~/nwjs-binary/nwjs ~/game/www`)
1. If it didn't work, the `package.json` file might have empty `name`. Update the `name` property of `package.json` file to arbitary random value.

If you follow this guide, it should work. It might not work for some games, but... it works for me.