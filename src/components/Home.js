import "./CodeEditor.js";
import "./ResultCode.js";
import "./WindowDivider.js";

class Home extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  static get styles() {
    return /* css */ `
      :host {
        display: grid;
        grid-template-columns: 1fr auto var(--width-result-window);
        height: 100dvh;
        overflow: hidden;
      }
    `;
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${Home.styles}</style>

    <code-editor></code-editor>
    <window-divider></window-divider>
    <result-code></result-code>
  `;
  }
}

customElements.define("home-wrapper", Home);
