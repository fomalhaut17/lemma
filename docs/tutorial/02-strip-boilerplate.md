# Step 2 — Strip Boilerplate

## Goal
스캐폴드가 만들어 준 데모(`greet` 커맨드, "Welcome to Tauri" UI)를 제거하고 **빈 캔버스**로 만듭니다. 다음 단계부터 우리 코드를 채울 수 있게.

## You'll learn
- Tauri 앱에서 **JS → Rust 호출**(`invoke`)이 어떻게 등록·소비되는가 (지우기 전에 한 번 훑어봅니다)
- `#[tauri::command]`와 `tauri::generate_handler!` 매크로의 역할
- 프론트엔드와 백엔드 양쪽을 **동시에** 손봐야 정합성이 맞는다는 감각

## Before you start
1단계 끝나고 `Ctrl+C`로 dev 서버를 종료한 상태라고 가정합니다. 아직 실행 중이면 멈춰주세요.

```powershell
cd C:\Users\wonseok\playground\lemma-practice
```

이후 명령은 전부 `lemma-practice/` 안에서.

## Steps

### 1. 지우기 전에, 한 번만 보고 갑시다

`src/App.tsx`를 열어보면 대략 이런 코드가 있을 겁니다 (스캐폴드 버전에 따라 약간 다를 수 있음).

```tsx
import { invoke } from "@tauri-apps/api/core";

async function greet() {
  setGreetMsg(await invoke("greet", { name }));
}
```

그리고 `src-tauri/src/lib.rs`에는 짝이 되는 Rust 쪽 코드.

```rust
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

**여기서 일어나는 일:**
- `#[tauri::command]` — 이 함수를 "프론트엔드에서 부를 수 있는 명령"으로 표시
- `tauri::generate_handler![greet]` — 등록된 커맨드 목록. 여기 없으면 `invoke("greet", ...)`는 실패
- 프론트의 `invoke("greet", { name })` — IPC로 Rust의 `greet`을 호출, 결과를 Promise로 받음

지금은 안 쓸 거니까 지웁니다. 나중에 파일 저장/불러오기 같은 걸 추가할 때 이 패턴이 다시 나옵니다.

### 2. `src/App.tsx` 비우기

전체를 다음으로 교체:

```tsx
import "./App.css";

function App() {
  return (
    <main className="app">
      <h1>Lemma</h1>
      <p>LaTeX scratchpad — under construction.</p>
    </main>
  );
}

export default App;
```

- `invoke` import 제거
- `useState`, `greet` 함수 제거
- 데모 UI(폼, 로고들) 제거

### 3. `src/App.css` 비우기

전체 내용을 다음으로 교체:

```css
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: system-ui, sans-serif;
  background: #1e1e1e;
  color: #e0e0e0;
}

.app h1 {
  margin: 0 0 0.25rem;
}

.app p {
  margin: 0;
  opacity: 0.7;
}
```

스캐폴드의 화려한 그라데이션·로고 애니메이션은 다 버립니다.

### 4. `src-tauri/src/lib.rs`에서 `greet` 제거

전체를 다음으로 교체:

```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

- `#[tauri::command] fn greet(...)` 블록 삭제
- `generate_handler![greet]` → `generate_handler![]` (등록할 커맨드 없음)
- `tauri_plugin_opener`는 일단 둡니다 (나중에 외부 링크 열 때 쓸 수도)

> **참고:** `src-tauri/src/main.rs`는 `lib.rs`의 `run()`을 호출만 하는 얇은 파일입니다. 거의 건드릴 일 없음.

### 5. (선택) 안 쓰는 에셋 정리

`src/assets/` 안의 `react.svg`, `public/` 안의 `tauri.svg`, `vite.svg` 같은 로고들은 더 이상 import되지 않으므로 지워도 됩니다. 두고 싶으면 둬도 무방.

### 6. 다시 실행

```powershell
npm run tauri dev
```

이번엔 Rust 캐시가 살아있어서 훨씬 빠르게 뜹니다 (수십 초~1분).

## Verify
- [ ] 창에 큰 글씨 **"Lemma"** 와 그 아래 "LaTeX scratchpad — under construction." 만 보인다
- [ ] 배경이 어두운 회색
- [ ] 브라우저 콘솔(우클릭 → Inspect → Console)에 에러 없음
- [ ] 터미널에 Rust 컴파일 에러 없음

## Troubleshooting
- **"cannot find function `greet` in this scope"** — `generate_handler![greet]`를 `generate_handler![]`로 안 바꿨거나, 반대로 함수만 지우고 핸들러 목록을 안 지웠음
- **흰 화면 + 콘솔에 import 에러** — `App.tsx`에서 import 라인을 다 정리했는지 확인. 안 쓰는 import는 TS가 에러를 띄움
- **창은 떴는데 스타일이 이상** — `App.css` 교체했는지, 그리고 `App.tsx`에서 `import "./App.css"` 빠뜨리지 않았는지

## What's happening
지금 우리는 **앱의 두 절반을 동시에 손봐야 정합성이 맞는다**는 사실을 실제로 겪었습니다.

- 프론트에서 `invoke("greet")`을 지웠으면
- 백엔드에서도 등록(`generate_handler![]`)과 정의(`fn greet`) 둘 다 지워야 함

한쪽만 지우면:
- 함수만 지우고 핸들러에 남기면 → Rust 컴파일 에러
- 핸들러에서 지우고 프론트에 호출이 남으면 → 런타임에 `invoke` 실패 (Promise reject)

이게 Tauri로 일할 때 계속 따라오는 리듬입니다. **커맨드 추가/삭제는 항상 양쪽.**

## When you're done
- 빈 캔버스 창이 잘 뜨면 "2단계 완료"라고 알려주세요. Step 3로 넘어갑니다 (CodeMirror로 에디터 만들기).
- 컴파일 에러나 런타임 에러가 나면 메시지 전체를 그대로 붙여주세요.
