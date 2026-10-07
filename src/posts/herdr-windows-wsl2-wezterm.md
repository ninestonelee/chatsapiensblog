---
title: 맥에서 쓰던 HERDR, 윈도우에서도 그대로 쓰는 법 (WezTerm + WSL2 세팅과 삽질 기록)
slug: herdr-windows-wsl2-wezterm
excerpt: 맥에서 쓰던 Ghostty + HERDR 환경을 윈도우에서 WezTerm + WSL2로 재현했습니다. 우분투가 안 켜지는 문제부터 Codex가 윈도우 앱을 못 띄우는 문제까지, 삽질 4가지와 해결법을 정리했어요.
category: Tech
date: 2026.10.07
cover: /posts/herdr-windows/blog-01-herdr-first-run.png
tags: [HERDR, WSL2, WezTerm, ClaudeCode, Codex, GeminiCLI, AI코딩, AI에이전트, 윈도우개발환경, Ollama, 바이브코딩]
---
요즘 Claude Code, Codex, Gemini CLI 같은 AI 코딩 에이전트를 여러 개 띄워놓고 작업하는 분들 많으시죠?

저는 맥에서 **Ghostty 터미널 + HERDR** 조합으로 에이전트들을 관리하면서 꽤 만족하고 있었는데요. 윈도우 PC에서도 같은 환경을 만들고 싶어서 직접 세팅해봤습니다.

결론부터 말하면 **잘 됩니다.** 다만 중간에 예상 못한 문제를 네 번이나 만났어요. 같은 길을 가실 분들을 위해 해결 과정까지 정리해둡니다.

---

## HERDR가 뭔가요?

HERDR는 **AI 코딩 에이전트 전용 터미널 작업 관리자**예요. tmux와 비슷하지만 에이전트에 특화되어 있습니다.

- 여러 에이전트를 탭과 패널로 나눠서 한 화면에 띄울 수 있어요
- 어떤 에이전트가 **작업 중인지, 내 답을 기다리는지, 끝났는지** 사이드바에 표시해줘요
- 터미널 창을 닫아도 **서버가 뒤에서 계속 돌아가서** 에이전트 작업이 끊기지 않아요

마지막 기능이 핵심인데요, 윈도우에서는 이걸 살리는 게 생각보다 까다로웠습니다. (아래 4번 삽질에서 설명할게요)

---

## 최종 구성

```
WezTerm (터미널 창)
└── WSL2 Ubuntu (리눅스 환경)
    └── HERDR (세션·에이전트 관리)
        ├── Claude Code
        ├── Codex
        └── Gemini CLI
```

### 왜 이 조합인가요?

HERDR는 윈도우 네이티브 버전도 정식 지원해요. 하지만 윈도우 버전은 일부 기능(터미널 직접 연결, 업데이트 중 세션 이어받기 등)이 빠져 있어서, 맥과 최대한 비슷하게 쓰려면 **WSL2(윈도우 안의 리눅스)** 에서 돌리는 게 낫다고 판단했어요.

터미널은 **WezTerm**을 골랐습니다.
- Ghostty처럼 GPU로 빠르게 그려주고 설정이 자유로워요
- HERDR 공식 문서에서 "윈도우 WezTerm + WSL의 HERDR" 조합으로 이미지 표시 기능(Kitty 그래픽)까지 검증됐다고 나와요
- 윈도우 기본 터미널(Windows Terminal)은 이 이미지 기능을 지원하지 않아요

역할은 이렇게 나눴어요.
- **WezTerm**: 창, 폰트, 한글 입력, 복사/붙여넣기
- **HERDR**: 탭, 화면 분할, 에이전트 세션 유지
- **WSL2**: 실제 개발 환경

---

## 설치 순서

### 1) HERDR 설치 (Ubuntu 안에서)

```bash
curl -fsSL https://herdr.dev/install.sh | sh
```

한 줄이면 끝나요. 설치 후 `herdr`를 입력하면 실행됩니다.

### 2) WezTerm 설치

처음엔 `winget`으로 설치하려 했는데, 사용자 계정용 설치 파일이 없어서 실패했어요. 그래서 **GitHub 공식 배포 페이지의 포터블(zip) 버전**을 받아서 풀었습니다. 관리자 권한도 필요 없어요.

### 3) WezTerm이 켜지면 바로 HERDR가 뜨게 설정

`C:\Users\<사용자>\.wezterm.lua` 파일에 이렇게 적어두면, WezTerm 아이콘만 누르면 우분투에서 HERDR가 바로 실행돼요.

```lua
local wezterm = require 'wezterm'
local config = wezterm.config_builder()

-- WezTerm을 켜면 우분투에서 HERDR 실행
config.default_prog = { 'wsl.exe', '-d', 'Ubuntu', '--cd', '~', '--', 'bash', '-lc', '~/.local/bin/herdr; exec bash -l' }

-- 한글은 맑은 고딕으로
config.font = wezterm.font_with_fallback { 'JetBrains Mono', 'Malgun Gothic' }
config.use_ime = true

-- 탭과 분할은 HERDR가 하니까 WezTerm 탭바는 숨김
config.hide_tab_bar_if_only_one_tab = true

-- Shift+우클릭으로 붙여넣기
config.mouse_bindings = {
  { event = { Down = { streak = 1, button = 'Right' } }, mods = 'SHIFT',
    action = wezterm.action.PasteFrom 'Clipboard' },
}

return config
```

![HERDR 첫 실행 화면](/posts/herdr-windows/blog-01-herdr-first-run.png)
*WezTerm을 켜자 바로 HERDR가 실행된 모습*

### 4) AI 에이전트 설치

우분투 안에 Claude Code, Codex, Gemini CLI를 설치했어요. `sudo` 없이 설치하려고 npm 설치 경로를 홈 폴더로 바꿨습니다.

```bash
mkdir -p ~/.npm-global
npm config set prefix ~/.npm-global
echo 'export PATH="$HOME/.local/bin:$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc

curl -fsSL https://claude.ai/install.sh | bash      # Claude Code
npm install -g @openai/codex @google/gemini-cli      # Codex, Gemini CLI
```

HERDR가 에이전트 상태(작업 중 / 대기 / 완료)를 정확히 알 수 있게 연동도 켜줍니다.

```bash
herdr integration install claude
herdr integration install codex
```

> 팁: 윈도우에도 codex를 설치해뒀다면, 우분투에서 윈도우용 codex가 먼저 잡힐 수 있어요. 위처럼 PATH 순서를 앞에 두면 리눅스용이 먼저 실행됩니다.

---

## 삽질 기록 (여기가 진짜 본론)

### 삽질 1. 우분투가 아예 안 켜진다

설치하려고 보니 원래 깔려 있던 우분투가 이런 에러를 내면서 안 켜지더라고요.

```
디스크 '...ext4.vhdx'을(를) WSL2에 연결하지 못함: 매개 변수가 틀립니다.
오류 코드: Wsl/Service/CreateInstance/MountDisk/HCS/E_INVALIDARG
```

디스크 파일이 깨졌나 싶어서 하나씩 확인해봤어요.
- 파일은 멀쩡히 있음 (약 14GB)
- 압축·암호화 안 되어 있음
- 다른 프로그램이 잡고 있지도 않음
- 파일 헤더도 정상

그런데 **파일 권한 목록**을 열어보니 원인이 나왔어요. 권한 항목이 무려 **1,638개**나 붙어 있었습니다. 같은 PC에서 멀쩡히 돌아가는 도커 디스크는 8개였고요.

WSL은 켜질 때마다 디스크 파일에 가상머신용 권한을 하나씩 추가하는데, 이게 지워지지 않고 계속 쌓여서 **윈도우 권한 목록의 크기 한도에 거의 꽉 찬 상태**였던 거예요. 새 권한을 못 붙이니 "매개 변수가 틀립니다"라는 엉뚱한 에러가 났던 거죠.

**해결:** 쌓여 있던 가상머신 권한(`S-1-5-83-`으로 시작하는 항목)만 지웠더니 바로 켜졌어요. 디스크 안 데이터는 그대로였고, 혹시 몰라 원래 권한은 백업해뒀습니다.

```powershell
$f = "<ext4.vhdx 경로>"
$a = Get-Acl $f
$a.Sddl | Set-Content .\acl-backup.sddl          # 백업
$a.Access | ? { $_.IdentityReference.Value -like 'S-1-5-83-*' -and -not $_.IsInherited } |
  % { [void]$a.RemoveAccessRuleSpecific($_) }
Set-Acl $f $a
```

> 같은 에러로 검색해도 딱 맞는 해결책이 안 나와서 고생했어요. 우분투가 이 에러로 안 켜지면 디스크 파일 권한 개수부터 확인해보세요.

### 삽질 2. 우분투에서 윈도우의 Ollama에 연결이 안 된다

저는 윈도우에서 Ollama로 로컬 AI 모델을 돌리고 있는데요, 우분투 안에서 `localhost:11434`로 접속하면 연결이 안 됐어요. WSL이 기본적으로 윈도우와 네트워크를 분리해서 쓰기 때문이에요.

**해결:** `C:\Users\<사용자>\.wslconfig`에 **mirrored 네트워킹**을 켰습니다. 이러면 우분투가 윈도우와 네트워크를 공유해서 `localhost`로 바로 접속돼요.

같은 파일에 메모리 설정도 같이 했어요.
- WSL 메모리 상한을 8GB로 (기본은 PC 메모리의 절반인 16GB)
- 안 쓰는 캐시 메모리를 윈도우에 돌려주는 옵션

### 삽질 3. 창을 닫으면 HERDR 세션이 날아간다

HERDR의 핵심이 "창을 닫아도 작업이 계속된다"인데, 윈도우에서는 WezTerm 창을 닫고 다시 열면 세션이 전부 사라져 있었어요.

원인은 WSL이었어요. **WSL은 터미널이 모두 닫히고 15초가 지나면 우분투를 자동으로 꺼버려요.** 그때 HERDR 서버도 같이 꺼지는 거죠.

**해결:** `.wslconfig`에 자동 종료를 끄는 설정을 추가했습니다.

최종 `.wslconfig`는 이렇게 됐어요.

```ini
[general]
instanceIdleTimeout=-1      # 창을 닫아도 우분투 유지 (HERDR 세션 유지)

[wsl2]
networkingMode=mirrored     # 윈도우의 Ollama에 localhost로 접속
memory=8GB                  # WSL 메모리 상한

[experimental]
autoMemoryReclaim=gradual   # 남는 메모리를 윈도우에 반환
```

> 주의: `autoMemoryReclaim`을 `[wsl2]` 아래에 두면 최신 WSL(3.0.1)에서 "알 수 없는 키" 경고가 떠요. `[experimental]` 아래에 둬야 합니다.

설정 후 창을 닫고 30초 뒤에 다시 열어봤더니, 작업하던 탭과 폴더 위치는 물론이고 **치다 만 명령어까지** 그대로 남아 있었어요.

![창을 닫았다 열어도 유지된 HERDR 세션](/posts/herdr-windows/blog-02-herdr-session-kept.png)
*창을 닫았다 다시 열어도 2번 탭과 작업 폴더, 입력하던 글자까지 그대로*

### 삽질 4. 우분투의 Codex가 윈도우 앱을 실행하지 못한다

제가 만들고 있는 앱은 윈도우용 Electron 앱이에요. 우분투의 Codex에게 "앱 실행해서 화면 확인해줘"라고 했더니 실행도, 화면 캡처도 못 하더라고요. Codex 작업 기록에는 이런 메시지가 남아 있었어요.

```
UtilBindVsockAnyPort: socket failed
```

원래 WSL에서는 `powershell.exe`나 `.exe` 파일을 그냥 실행할 수 있어요. 그런데 이때 WSL이 윈도우와 통신하는 연결을 하나 열어야 하는데, **Codex의 보안 샌드박스가 그 연결을 막고 있었던** 거예요.

직접 테스트해보니:
- 샌드박스 켠 상태: 실패
- 샌드박스 켜고 네트워크만 허용: 그래도 실패
- 샌드박스 끈 상태: 성공

**해결:** 두 가지 명령을 만들었어요.

① **`codex-win`**: 윈도우 앱을 다룰 때만 쓰는 "샌드박스 끈 Codex"

```bash
alias codex-win="codex --sandbox danger-full-access"
```

평소에는 그냥 `codex`(안전 모드)를 쓰고, 앱 실행이나 화면 확인이 필요할 때만 `codex-win`을 씁니다.

② **`winshot`**: 우분투에서 윈도우 화면을 캡처하는 명령

```bash
winshot               # 윈도우 전체 화면
winshot -p electron   # 특정 앱 창만
winshot --list        # 열린 창 목록
```

PowerShell 스크립트로 화면을 PNG로 저장하고, 그 파일 경로를 알려주는 방식이에요. Codex가 그 이미지를 바로 열어볼 수 있어서, 이제 **코드 수정 → 앱 실행 → 화면 캡처 → 확인**을 Codex가 혼자 할 수 있게 됐어요.

마지막으로 `~/.codex/AGENTS.md`에 이 내용을 적어두면 Codex가 매번 설명하지 않아도 알아서 사용해요.

> 주의: `codex-win`은 샌드박스가 꺼져서 PC 전체 파일에 접근할 수 있어요. 꼭 필요할 때만 쓰세요.

---

## 그 외 알아두면 좋은 것

### 윈도우 폴더 접근

우분투에서 윈도우 드라이브는 `/mnt/c`, `/mnt/e`처럼 보여요. 자주 쓰는 폴더는 바로가기를 만들어두면 편해요.

```bash
ln -s /mnt/c/Users/<사용자>/Dropbox ~/dropbox
ln -s /mnt/c/work/<프로젝트폴더> ~/blog
```

이제 `cd ~/blog`만 치면 프로젝트 폴더로 이동해요.

NAS 같은 **네트워크 드라이브는 자동으로 연결되지 않아요.** `/etc/fstab`에 한 줄 추가하면 우분투가 켜질 때 자동으로 붙습니다.

```
Z: /mnt/z drvfs metadata,uid=1001,gid=1001,nofail 0 0
```

- `uid`/`gid`는 `id 사용자명`으로 확인한 값을 넣으세요 (저는 1000이 아니라 1001이었어요)
- `nofail`을 넣어야 NAS가 꺼져 있어도 우분투가 문제없이 켜져요

> 주의: 윈도우에서 `npm install`한 프로젝트는 우분투에서 `npm install`이나 `npm run`을 하지 마세요. 윈도우용으로 설치된 모듈과 충돌할 수 있어요. 코드 수정은 우분투에서, 앱 실행은 윈도우에서 하는 게 안전합니다.

### 복사 / 붙여넣기

HERDR 화면에서는 우클릭이 HERDR 메뉴로 쓰여서 처음에 당황했어요.

| 하고 싶은 것 | 방법 |
|---|---|
| 복사 | 마우스로 드래그하면 자동 복사 |
| 붙여넣기 | `Ctrl+Shift+V` 또는 `Shift+Insert` 또는 `Shift+우클릭` |

`Ctrl+V`는 Claude Code 같은 에이전트에서 **이미지 붙여넣기**로 쓰이니까, 텍스트는 `Ctrl+Shift+V`로 붙여넣는 습관을 들이면 좋아요.

### 한글 입력

HERDR의 단축키는 `Ctrl+B`를 누른 다음 다른 키를 누르는 방식이에요. 그런데 **한글 입력 상태면 다음 키가 한글로 들어가서** 단축키가 안 먹어요.

맥이나 윈도우 네이티브 HERDR에는 자동으로 영문 전환해주는 옵션이 있지만, **WSL 안에서는 동작하지 않아요.** 단축키 쓰기 전에 한/영 키로 영문 전환하는 걸 잊지 마세요.

한글을 칠 때 글자 조합 위치가 이상하게 뜨면, HERDR 설정(`~/.config/herdr/config.toml`)에 아래를 넣어보세요.

```toml
[ui]
host_cursor = "native"
```

---

## 마무리

정리하면 이렇습니다.

| 문제 | 해결 |
|---|---|
| 우분투가 안 켜짐 (E_INVALIDARG) | 디스크 파일에 쌓인 권한 항목 정리 |
| 윈도우 Ollama 연결 안 됨 | `.wslconfig`에 mirrored 네트워킹 |
| 창 닫으면 HERDR 세션 사라짐 | `instanceIdleTimeout=-1` |
| Codex가 윈도우 앱 실행 못 함 | `codex-win` + `winshot` |

처음엔 "윈도우에서 맥처럼 쓰기는 어렵겠지" 싶었는데, 몇 가지만 손보니 오히려 **윈도우의 Ollama와 우분투의 에이전트들을 한 화면에서 같이 쓰는** 꽤 괜찮은 환경이 됐어요.

참고로 제 PC는 i7-6700 / RAM 32GB / GTX 1060 6GB인데, 에이전트 세 개까지 설치를 마친 뒤 우분투가 실제로 쓰는 메모리는 700MB 정도였어요. 오래된 PC여도 부담 없이 세팅할 수 있습니다.

윈도우에서 AI 에이전트 여러 개 굴리고 싶은 분들께 도움이 되면 좋겠습니다.


