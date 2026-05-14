# Step 4 — Preview Pane (KaTeX)

## Goal
**KaTeX**로 LaTeX 수식을 렌더링해 화면에 띄웁니다. 아직 에디터와는 연결하지 않습니다 — 고정된 문자열 하나를 렌더링하는 것까지만. (연결은 Step 5.)

이번 단계 동안 에디터는 잠시 옆으로 치워두고, 새 도구(KaTeX) 하나에만 집중합니다.

## You'll learn
- **KaTeX**가 LaTeX 문자열을 받아 HTML 문자열로 변환한다는 사실 (서버사이드도 가능한 이유)
- React에서 HTML 문자열을 DOM에 주입하는 방법 — `dangerouslySetInnerHTML`과 그 이름이 무서운 이유
- `throwOnError: false`로 사용자 입력 같은 **신뢰할 수 없는 LaTeX**를 안전하게 다루는 패턴

## Steps

### 1. 패키지 설치

```powershell
cd C:\Users\wonseok\playground\lemma-practice
npm install katex
npm install -D @types/katex
```

- **`katex`** — 수식 렌더링 엔진 본체
- **`@types/katex`** — TypeScript 타입 정의 (개발 시에만 필요해서 `-D`)

### 2. `src/App.tsx` 교체

에디터는 일단 import만 둔 채 화면에서 빼고, KaTeX 렌더링 결과만 띄웁니다.

```tsx
import katex from "katex";
import "katex/dist/katex.min.css";
import "./App.css";

const SAMPLE = String.raw`\int_0^\infty e^{-x^2}\, dx = \frac{\sqrt{\pi}}{2}`;

function App() {
  const html = katex.renderToString(SAMPLE, {
    displayMode: true,
    throwOnError: false,
    errorColor: "#e06c75",
    strict: "ignore",
  });

  return (
    <main className="app">
      <div
        className="preview"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}

export default App;
```

옵션들 의미:
- **`displayMode: true`** — 블록 수식(`$$...$$`처럼 가운데 정렬, 큰 글씨). `false`면 인라인 (`$...$`)
- **`throwOnError: false`** — 잘못된 LaTeX가 들어와도 throw하지 않고, 에러를 빨간 글씨로 렌더에 포함시킴. 사용자가 직접 입력할 거니까 필수
- **`errorColor`** — 위 옵션이 켜졌을 때 에러 표시 색
- **`strict: "ignore"`** — KaTeX가 비표준 LaTeX 문법을 만났을 때 경고를 띄우는데, 그걸 끔. 콘솔 노이즈 줄이기용

### 3. `src/App.css` 교체

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
  background: #1f1f1f;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f0f0f0;
}

.preview {
  padding: 32px 24px;
}

.preview .katex {
  font-size: 1.6em;
}
```

- 화면 중앙에 수식 하나
- `.katex` 클래스는 KaTeX가 자기 출력 루트에 붙이는 클래스. 폰트 크기를 키워서 잘 보이게

### 4. 실행

```powershell
npm run tauri dev
```

## Verify
- [ ] 창 한가운데 수식 `∫₀^∞ e^{-x²} dx = √π/2` 가 **수학 폰트**로 예쁘게 보임
- [ ] `\int` 기호가 키 큰 적분 기호로, 분수가 가로선과 함께 정렬돼 있음 (CSS가 잘 로드된 것)
- [ ] 콘솔에 KaTeX 관련 경고나 에러 없음

만약 수식이 그냥 `\int_0^\infty e^{-x^2}` 같은 **raw 텍스트**로 보인다면 CSS import (`"katex/dist/katex.min.css"`)가 빠진 것입니다.

### (선택) 에러 처리 확인
`SAMPLE` 값을 일부러 망가뜨려 보세요. 예: `\int_0^\infty \unknowncmd dx`.
- `throwOnError: false` 덕에 앱이 죽지 않고, `\unknowncmd` 부분만 빨갛게 표시되며 나머지는 정상 렌더됨

## Troubleshooting
- **수식 위치가 raw 글자로만 보임** — `import "katex/dist/katex.min.css"` 누락. KaTeX는 HTML + CSS 조합이라 CSS 없이는 모양이 안 나옴
- **`Cannot find module 'katex'`** — `npm install katex`가 안 됐거나, dev 서버를 다시 시작 안 한 것. `Ctrl+C` 후 `npm run tauri dev`
- **`Property 'renderToString' does not exist on type ...`** — `@types/katex`가 안 깔렸음
- **TS가 `import katex from "katex"`를 거부** — `tsconfig.json`에 `"esModuleInterop": true` 가 있는지 확인 (Vite 템플릿은 기본으로 켜져 있음)

## What's happening

### KaTeX는 그냥 함수다
KaTeX의 핵심은 한 줄 요약 가능합니다.

```
katex.renderToString(latex: string, options) → string (HTML)
```

LaTeX 문자열을 받아서 HTML 문자열을 뱉습니다. 그게 전부예요. 브라우저 API에 의존하는 부분이 없어서 Node에서도 서버사이드 렌더 가능하고, 그래서 SSR 친화적입니다.

수학 폰트(KaTeX_Main, KaTeX_Math 등)와 정렬 규칙은 함께 들어 있는 CSS가 담당합니다. JS가 HTML을 만들고, CSS가 모양을 입히는 분담.

### `dangerouslySetInnerHTML`의 이름이 길고 무서운 이유
React는 일반적으로 JSX로 표현된 트리를 그립니다. 임의의 HTML 문자열을 DOM에 그대로 집어넣는 건 **XSS 위험이 있습니다** — 그 문자열에 `<script>` 같은 게 섞이면 그대로 실행되거든요.

그래서 React는 일부러 길고 거슬리는 이름을 줬습니다. "당신이 이 문자열을 신뢰한다고 명시적으로 인정해야만 쓰겠다"는 의도.

지금은 KaTeX가 출력하는 HTML만 넣으니 안전합니다. KaTeX는 입력 LaTeX에서 임의의 HTML/JS를 만들지 않습니다 — 정해진 수학 마크업만 출력. 사용자가 `<script>alert('hi')</script>`를 LaTeX 박스에 넣어도 KaTeX는 그걸 그냥 텍스트로 처리합니다.

### 왜 React 컴포넌트가 아니라 함수?
`react-katex` 같은 컴포넌트 래퍼도 있습니다. 우리가 굳이 `renderToString` + `dangerouslySetInnerHTML` 조합을 쓰는 이유:
- **의존성 적음** — KaTeX 본체만 있으면 됨
- **렌더 시점 명확함** — `useMemo`로 캐시하기 쉬움 (Step 5에서 활용)
- **`react-katex`는 내부적으로 같은 일을 함** — 그냥 추상화 한 겹 덧대는 셈

원리를 한 번 보고 나면 컴포넌트 래퍼는 언제든 갈아끼울 수 있습니다.

## What's next
Step 5에서는:
1. Step 3의 에디터를 다시 살리고
2. 에디터의 입력값(`useState`)을 그대로 KaTeX에 흘려보내서
3. **타이핑할 때마다 프리뷰가 갱신**되는 라이브 미리보기를 만듭니다

지금은 한쪽 다리, 다음 단계에서 두 다리가 연결됩니다.

## When you're done
- 수식이 예쁘게 보이면 "4단계 완료". Step 5로 갑니다.
- 모양이 깨지면 어떻게 깨졌는지(스크린샷 또는 묘사)와 콘솔 에러를 알려주세요.
