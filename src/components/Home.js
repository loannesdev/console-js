import "./InputCode.js";
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
        --width-result-window: 1fr;
        --bg: green;

        display: grid;
        grid-template-columns: 1fr auto var(--width-result-window);
        height: 100dvh;
      }
    `;
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${Home.styles}</style>

    <input-code></input-code>
    <window-divider></window-divider>
    <result-code></result-code>
  `;
  }
}

customElements.define("home-wrapper", Home);
