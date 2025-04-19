import { editor } from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import editorStyles from "monaco-editor/min/vs/editor/editor.main.css?raw";

class InputCode extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.editorInstance = null;
  }

  connectedCallback() {
    this.render();
    this.initEditor();
  }

  initEditor() {
    const mainDOM = getComputedStyle(document.documentElement);
    const currentBgColor = mainDOM.getPropertyValue("--current-bg-color");
    const codeFontSize = mainDOM.getPropertyValue("--code-font-size");
    const inputCode = this.shadowRoot.querySelector(".input-code");
    const codePadding = mainDOM.getPropertyValue("--code-padding");
    let timer = null;

    self.MonacoEnvironment = {
      getWorker(_, label) {
        if (label === "javascript" || label === "typescript") {
          return new tsWorker();
        }

        return new editorWorker();
      }
    };

    editor.defineTheme("custom-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": currentBgColor,
      }
    });

    this.editorInstance = editor.create(inputCode, {
      value: "",
      language: "typescript",
      fontSize: codeFontSize,
      minimap: { enabled: false },
      tabSize: 2,
      fontLigatures: true,
      letterSpacing: 0,
      cursorBlinking: "expand",
      lineNumbers: "off",
      cursorStyle: "line",
      bracketPairColorization: { enabled: true },
      theme: "custom-theme",
      stickyScroll: {
        enabled: true,
      },
      automaticLayout: true,
      placeholder: "Escribe tu código aquí...",
      padding: {
        top: `${codePadding}`,
        bottom: `${codePadding}`,
        left: `${codePadding}`,
        right: `${codePadding}`,
      },
    });

    this.editorInstance.focus();

    if (this.editorInstance) {
      const event = new CustomEvent("value-change", { detail: { textValue: "" } });
      let isFirstExecution = true;

      this.editorInstance.onDidChangeModelLanguageConfiguration(() => {
        if (isFirstExecution) {
          event.detail.textValue = this.editorInstance.getValue();
          this.dispatchEvent(event);
          isFirstExecution = false;
        }
      });

      this.editorInstance.onDidChangeModelContent(() => {
        clearTimeout(timer);
        event.detail.textValue = this.editorInstance.getValue();

        timer = setTimeout(() => {
          this.dispatchEvent(event);
        }, 200);
      });

      this.dispatchEvent(event);
    }
  }

  static get styles() {
    return /* css */`
      :host {
        & .input-code {
          min-height: 100%;
          width: calc(100dvw - var(--width-result-window));
        }
      }
    `;
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>
      ${InputCode.styles}
      ${editorStyles}
    </style>

    <div class="input-code"></div>
  `;
  }
}

customElements.define("code-editor", InputCode);