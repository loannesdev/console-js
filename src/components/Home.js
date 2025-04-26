import "./CodeEditor.js";
import "./ResultCode.js";
import "./WindowDivider.js";

class Home extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  static get styles() {
    return /* css */ `
      :host, home-wrapper {
        display: grid;
        grid-template-columns: 1.2fr auto var(--width-result-window);
        height: 100dvh;
        width: 100dvw;
        overflow: hidden;
      }
    `;
  }

  render() {
    this.innerHTML = /* html */ `
    <style>${Home.styles}</style>

    <code-editor></code-editor>
    <window-divider></window-divider>
    <result-code></result-code>
  `;
  }
}

customElements.define("home-wrapper", Home);
