# Step 1 — Scaffolding the Project

## Goal
Tauri + React + TypeScript 프로젝트를 새로 만들고, 데스크탑 창이 한 번 뜨는 것까지.

## You'll learn
- Tauri 앱이 **두 프로세스**(Rust backend + WebView frontend)로 구성된다는 것
- `create-tauri-app`이 만들어주는 디렉토리 구조의 의미
- `npm run tauri dev`가 뒤에서 무엇을 띄우는가

## Prerequisites
다음이 설치되어 있어야 합니다.

```powershell
node --version   # v18 이상
rustc --version  # 아무 버전이든 설치되어 있으면 OK
```

- 둘 다 OK면 그대로 진행
- Rust가 없다면: https://rustup.rs 에서 설치
- Node가 없다면: https://nodejs.org (LTS)
- (Windows) Microsoft C++ Build Tools와 WebView2가 필요한데, Win11이면 보통 다 깔려 있습니다. 1번 단계가 컴파일 에러를 내면 그때 다루죠.

## Steps

### 1. 스캐폴드 생성

`lemma` 옆에 `lemma-practice`라는 새 디렉토리로 만듭니다. 완성본(`lemma`)은 레퍼런스로 두고, 우리는 비어 있는 상태에서 시작.

```powershell
cd C:\Users\wonseok\playground
npm create tauri-app@latest lemma-practice
```

대화형 프롬프트가 뜹니다. 다음과 같이 선택하세요.

| 질문 | 선택 |
|------|------|
| Identifier | `com.lemma.practice` (또는 엔터로 기본값) |
| Choose which language to use for your frontend | **TypeScript / JavaScript** |
| Choose your package manager | **npm** |
| Choose your UI template | **React** |
| Choose your UI flavor | **TypeScript** |

### 2. 의존성 설치

```powershell
cd lemma-practice
npm install
```

### 3. 첫 실행

```powershell
npm run tauri dev
```

처음에는 Rust 크레이트들을 컴파일하느라 **수 분** 걸립니다 (이후엔 캐시됨). 컴파일이 끝나면 데스크탑 창이 하나 뜨고 "Welcome to Tauri!" 페이지가 보입니다.

종료는 터미널에서 `Ctrl+C`.

## Verify
- [ ] 데스크탑 창이 새로 떴다 (브라우저 탭 아님)
- [ ] 창 안에 "Welcome to Tauri!" 같은 React UI가 보인다
- [ ] 터미널에 Vite 로그와 Tauri 로그가 함께 찍힌다

## What's happening

```
┌─────────────────┐         ┌─────────────────┐
│  Rust backend   │ <─IPC─> │  WebView (UI)   │
│  (src-tauri/)   │         │  (src/, Vite)   │
└─────────────────┘         └─────────────────┘
```

- **`src/`** — 평범한 React + Vite 프로젝트. 브라우저에서 띄워도 동작함
- **`src-tauri/`** — Rust 프로젝트. 윈도우 생성, 파일 I/O, OS API 접근을 담당
- **`src-tauri/tauri.conf.json`** — 두 영역을 연결하는 설정 파일. 어떤 URL을 띄울지, 윈도우 크기, 권한 등
- **`npm run tauri dev`** — 내부적으로 두 가지를 동시에 함:
  1. Vite dev 서버를 `localhost:1420`에서 띄움
  2. Rust 앱을 빌드해서 실행 → Rust가 WebView를 만들고 그 URL을 띄움

### Electron과의 차이 (간단히)
Electron은 Chromium을 통째로 번들합니다 (앱 하나가 ~150MB). Tauri는 OS의 기본 WebView를 씁니다 (Windows = WebView2/Edge, macOS = WKWebView). 그래서 바이너리가 훨씬 가볍고(~수 MB), Rust로 백엔드를 짤 수 있습니다.

### 핵심 디렉토리 구조 (`lemma-practice/` 안)
```
lemma-practice/
├── src/                  ← React (여기서 UI 작업 대부분)
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
├── src-tauri/            ← Rust (시스템 레벨 작업)
│   ├── src/
│   │   ├── main.rs       ← 앱 진입점
│   │   └── lib.rs        ← 커맨드 등록
│   ├── Cargo.toml        ← Rust 의존성
│   └── tauri.conf.json   ← Tauri 설정
├── index.html            ← Vite 진입점
├── vite.config.ts
├── package.json          ← Node 의존성
└── tsconfig.json
```

`lemma` 완성본의 구조와 비교해 보세요. 거의 동일할 겁니다 — 우리가 단계마다 채워 넣을 부분만 비어있는 상태.

## When you're done
- 창이 잘 떴고 종료까지 했다면 "1단계 완료"라고 알려주세요. Step 2로 넘어갑니다 (보일러플레이트 정리).
- 막힌 지점이 있으면 에러 메시지를 그대로 붙여주세요. 함께 해결한 뒤 진행하죠.
