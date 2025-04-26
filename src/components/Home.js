import "./CodeEditor.js";
import "./CodeResult.js";
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
        grid-template-columns: var(--width-code-window) auto var(--width-result-window);
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
    <code-result></code-result>
  `;
  }
}

customElements.define("home-wrapper", Home);
