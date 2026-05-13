import { useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { stex } from "@codemirror/legacy-modes/mode/stex";
import katex from "katex";
import "katex/dist/katex.min.css";
import "./App.css";

const INITIAL_LATEX = String.raw`\int_0^\infty e^{-x^2}\, dx = \frac{\sqrt{\pi}}{2}`;

function App() {
  const [source, setSource] = useState(INITIAL_LATEX);

  const rendered = useMemo(() => {
    try {
      return katex.renderToString(source, {
        displayMode: true,
        throwOnError: false,
        errorColor: "#e06c75",
        strict: "ignore",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return `<span class="render-error">${message}</span>`;
    }
  }, [source]);

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-title">Lemma</span>
        <span className="app-subtitle">LaTeX scratchpad</span>
      </header>
      <main className="panes">
        <section className="pane editor-pane">
          <CodeMirror
            value={source}
            height="100%"
            extensions={[StreamLanguage.define(stex)]}
            onChange={setSource}
            theme="dark"
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: true,
              foldGutter: false,
            }}
          />
        </section>
        <section className="pane preview-pane">
          <div
            className="preview"
            dangerouslySetInnerHTML={{ __html: rendered }}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
