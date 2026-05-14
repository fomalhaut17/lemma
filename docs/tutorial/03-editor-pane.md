# Step 3 — Editor Pane (CodeMirror)

## Goal
빈 캔버스에 **코드 에디터**를 띄웁니다. LaTeX 문법 강조 + 다크 테마. 화면 전체를 차지하게.

(좌/우 2-pane 레이아웃은 Step 6에서 정리합니다. 지금은 에디터만.)

## You'll learn
- **CodeMirror 6**의 모듈러 구조 — 핵심(core) + 언어(language) + 확장(extension)으로 쪼개져 있음
- 왜 우리가 `codemirror` 본체 대신 `@uiw/react-codemirror` 래퍼를 쓰는가
- **Controlled component** 패턴 — 에디터의 값을 React `useState`가 소유

## Steps

### 1. 패키지 설치

```powershell
cd C:\Users\wonseok\playground\lemma-practice
npm install @uiw/react-codemirror @codemirror/legacy-modes
```

각각의 역할:
- **`@uiw/react-codemirror`** — CodeMirror 6를 React 컴포넌트로 감싼 래퍼. 핵심 패키지들(`@codemirror/state`, `view`, `commands` 등)을 함께 끌어옴
- **`@codemirror/legacy-modes`** — CodeMirror 5 시절의 언어 모드들(stex 포함)을 6에서 재사용할 수 있게 해주는 패키지

> **왜 legacy?** CodeMirror 6는 언어별로 LR 파서를 새로 작성하는 방향인데, 아직 LaTeX(stex)용 6 네이티브 파서는 없습니다. 그래서 5의 stream-based 모드를 `StreamLanguage`로 감싸서 씁니다. 충분히 잘 동작합니다.

### 2. `src/App.tsx` 교체

```tsx
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { stex } from "@codemirror/legacy-modes/mode/stex";
import "./App.css";

const INITIAL_LATEX = String.raw`\int_0^\infty e^{-x^2}\, dx = \frac{\sqrt{\pi}}{2}`;

function App() {
  const [source, setSource] = useState(INITIAL_LATEX);

  return (
    <main className="app">
      <CodeMirror
        value={source}
        onChange={setSource}
        height="100vh"
        extensions={[StreamLanguage.define(stex)]}
        theme="dark"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          foldGutter: false,
        }}
      />
    </main>
  );
}

export default App;
```

한 줄씩 짚어봅시다.

- **`useState(INITIAL_LATEX)`** — 에디터 내용을 React state로 보관. CodeMirror는 *controlled*: 우리가 `value`로 넘긴 값이 진실, 사용자 입력은 `onChange`로 받아 state를 갱신
- **`StreamLanguage.define(stex)`** — legacy stex 모드를 CodeMirror 6의 `Extension` 객체로 변환. `extensions` 배열에 넣으면 활성화
- **`theme="dark"`** — `@uiw/react-codemirror`가 기본 제공하는 다크 테마. 나중에 커스텀 테마를 만들 수도 있지만 일단 이걸로 충분
- **`basicSetup`** — 줄 번호, 활성 줄 강조 같은 기본 기능 토글. `foldGutter: false`로 코드 폴딩 거터는 끔 (LaTeX엔 별 의미 없음)

> **String.raw가 뭐죠?** `\`를 두 번 쓰지 않아도 되게 해주는 태그드 템플릿 리터럴입니다. `\int` 같은 백슬래시 토큰을 그대로 쓸 수 있어요. 없으면 `"\\int_0^\\infty ..."`처럼 다 이스케이프해야 함.

### 3. `src/App.css` 정리

에디터가 viewport 전체를 차지하도록.

```css
html,
body,
#root {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.app {
  height: 100vh;
  width: 100vw;
  background: #1e1e1e;
}

.cm-editor {
  height: 100% !important;
  font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
  font-size: 14px;
}
```

- `html/body/#root`의 기본 margin을 죽이고 100% 채우기 — Vite 기본 템플릿이 이걸 안 해줄 때가 있음
- `.cm-editor`는 CodeMirror가 만드는 루트 div의 클래스. 높이를 강제로 100%로 끌어올림
- 모노스페이스 폰트로 — JetBrains Mono나 Fira Code가 깔려 있으면 그걸 쓰고, 없으면 Consolas로 폴백

### 4. 실행

```powershell
npm run tauri dev
```

처음 띄울 때 `npm install`로 새 패키지가 들어왔으므로 Vite가 의존성 prebundle을 다시 합니다. 잠깐 더 걸릴 수 있어요.

## Verify
- [ ] 창에 코드 에디터가 화면 전체를 차지하며 떠 있음
- [ ] 초기값으로 `\int_0^\infty e^{-x^2}\, dx = \frac{\sqrt{\pi}}{2}` 가 보이고, `\int`, `\infty`, `\sqrt`, `\pi` 같은 키워드에 색이 들어가 있음
- [ ] 다크 배경, 좌측에 줄 번호
- [ ] 클릭하고 타이핑하면 글자가 들어감
- [ ] 마우스로 텍스트 선택, 복사·붙여넣기, Ctrl+Z(되돌리기) 모두 동작

## Troubleshooting
- **"Module not found: @codemirror/language"** — `@uiw/react-codemirror`가 알아서 끌어와야 하는 패키지. 보통 자동으로 깔리는데, 아니라면 명시적으로: `npm install @codemirror/language`
- **에디터가 작은 띠 모양으로만 보임** — `.cm-editor` height 규칙이 안 먹은 것. `!important` 빼먹지 않았는지, `App.css`를 실제로 import하는지 확인
- **글자가 안 써짐 (read-only처럼 동작)** — `value`만 넘기고 `onChange`를 안 넘기면 React가 매 렌더마다 초기값으로 덮어씀. controlled component의 함정. `onChange={setSource}` 확인
- **`stex` import 에러** — 경로가 `@codemirror/legacy-modes/mode/stex` (mode 하위). 자동완성에 안 떠도 정확히 이 경로로

## What's happening

### Controlled editor의 데이터 흐름

```
사용자 타이핑
     ↓
CodeMirror가 onChange(newValue) 호출
     ↓
setSource(newValue) → React state 갱신
     ↓
App 재렌더링, value={source}로 다시 내려감
     ↓
CodeMirror가 새 value를 화면에 반영
```

이게 React에서 form 요소를 다루는 정석 패턴(`<input value={x} onChange={...} />`)과 똑같습니다. CodeMirror는 그냥 좀 큰 input일 뿐.

이 패턴이 중요한 이유는 **Step 5**에서 드러납니다. `source`가 React state라서, 같은 state를 보고 KaTeX가 따로 렌더링을 할 수 있죠. 만약 CodeMirror가 내부적으로만 값을 들고 있다면 프리뷰가 그걸 못 봅니다.

### CodeMirror 6의 모듈성
방금 import한 것들이 패키지별로 어디서 왔는지:

```
@uiw/react-codemirror   ← <CodeMirror> 컴포넌트, theme="dark"
@codemirror/language    ← StreamLanguage (legacy bridge)
@codemirror/legacy-modes ← stex 모드 본체
```

각 기능이 별도 패키지로 쪼개진 게 CodeMirror 6의 철학입니다. 안 쓰는 건 번들에 안 들어감. 대신 `extensions` 배열로 조합해 써야 해서, 처음엔 import가 좀 많아 보입니다.

## When you're done
- 에디터가 잘 뜨고 타이핑 잘 되면 "3단계 완료". Step 4(KaTeX 프리뷰)로 갑니다.
- 색이 안 입혀지거나 다른 문제가 있으면 스크린샷이나 에러 메시지 붙여주세요.
