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

    const inputCode = this.shadowRoot.querySelector(".input-code");

    this.editorInstance = editor.create(inputCode, {
      value: "",
      language: "typescript",
      fontSize: "18px",
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
    });

    this.editorInstance.focus();

    let timer = null;
    const event = new CustomEvent("value-change", { detail: { textValue: "" } });

    if (this.editorInstance) {
      this.editorInstance.onDidChangeModelContent(() => {
        clearTimeout(timer);

        timer = setTimeout(() => {
          event.detail.textValue = this.editorInstance.getValue();
          this.dispatchEvent(event);
        }, 400);
      });
    }
  }

  static get styles() {
    return /* css */`
      :host {
        & .input-code {
          min-height: 100%;
          overflow: auto;
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
    <iframe id="sandbox" hidden></iframe>
  `;
  }
}

customElements.define("code-editor", InputCode);