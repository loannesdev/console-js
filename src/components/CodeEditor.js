import { editor } from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import editorStyles from "monaco-editor/min/vs/editor/editor.main.css?raw";

class InputCode extends HTMLElement {
  constructor() {
    super();
    this.editorInstance = null;
    this.backupKey = "code-backup";
    this.backupCode = localStorage.getItem(this.backupKey) || "";
  }

  connectedCallback() {
    this.render();
    this.initEditor();
    this.getBackupCode();
  }

  initEditor() {
    const mainDOM = getComputedStyle(document.documentElement);
    const currentBgColor = mainDOM.getPropertyValue("--current-bg-color");
    const codeFontSize = mainDOM.getPropertyValue("--code-font-size");
    const inputCode = this.querySelector(".editor");
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
      value: this.backupCode,
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
      wordWrap: "on",
      wordWrapColumn: 80,
      contextmenu: false,
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

  getBackupCode() {
    window.addEventListener("beforeunload", () => {
      localStorage.setItem(this.backupKey, this.editorInstance.getValue());
    });
  }

  static get styles() {
    return /* css */`
      :host, code-editor {
        & .editor {
          min-height: 100%;
          width: calc(100dvw - var(--width-result-window));
        }
      }
    `;
  }

  render() {
    this.innerHTML = /* html */`
    <style>
      ${InputCode.styles}
      ${editorStyles}
    </style>

    <div class="editor"></div>
  `;
  }
}

customElements.define("code-editor", InputCode);