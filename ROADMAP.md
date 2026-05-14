# Roadmap

이 문서는 lemma의 진행 상황과 다음에 할 일을 가볍게 추적합니다. 정식 스펙이 아니라 **살아있는 메모** — 단계가 끝날 때마다 갱신.

## Status
- **Now:** 튜토리얼 작성 중 (Step 1 사용자 완료, Step 2 작성됨 — 사용자 따라하기 대기)
- **Current code state:** Initial commit (`950b87b`) — App.tsx 한 파일, CodeMirror + KaTeX 라이브 프리뷰

## Tutorial track
신입/입문자가 따라하며 lemma를 처음부터 다시 만들어보는 코스. `docs/tutorial/` 참조.

- [x] **01 — Scaffold** · Tauri + React + TS 프로젝트 생성, 첫 실행 (`docs/tutorial/01-scaffold.md`)
- [ ] **02 — Strip boilerplate** · 기본 `greet` 커맨드 제거, UI 비우기 (`docs/tutorial/02-strip-boilerplate.md`)
- [ ] **03 — Editor pane** · CodeMirror 설치 + stex 모드 + 다크 테마
- [ ] **04 — Preview pane** · KaTeX 설치 + 정적 렌더링
- [ ] **05 — Wire it up** · `useState`/`useMemo`로 에디터-프리뷰 연결
- [ ] **06 — Layout & styling** · 2-pane 레이아웃, 앱 헤더, CSS
- [ ] **07 — Build** · `tauri build`로 배포용 바이너리 생성

> 각 단계는 그 직전 단계가 끝난 시점에서 결정/조정합니다. 위 항목은 잠정 계획이라 진행하면서 바뀔 수 있음.

## Feature backlog
튜토리얼 이후 또는 별개로 추가하고 싶은 기능. 우선순위 미정.

- [ ] 파일 열기/저장 (`.tex`) — Tauri `fs` plugin
- [ ] 최근 파일 / 자동 저장
- [ ] 다중 문서 (탭)
- [ ] 프리앰블·매크로 영역 분리 (KaTeX `macros` 옵션)
- [ ] 익스포트: HTML / PDF / 이미지
- [ ] 동기 스크롤 (에디터 ↔ 프리뷰)
- [ ] 다크/라이트 테마 토글
- [ ] 단축키 (Ctrl+S, Ctrl+O, 등)
- [ ] 커스텀 KaTeX 매크로 설정 UI

## Done
- [x] 초기 프로젝트 스캐폴드
- [x] CodeMirror 에디터 + KaTeX 라이브 프리뷰 (단일 화면 MVP)
- [x] GitHub 공개 (https://github.com/fomalhaut17/lemma)
- [x] 튜토리얼 문서 골격
