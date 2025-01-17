import "./InputCode.js";
import "./ResultCode.js";

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
        grid-template-columns: 1fr 1fr;
        height: 100dvh;

        & .divider {
          width: 320px;
          background-color: color-mix(in srgb, transparent 80%, #fff);
          height: 100%;

          &:hover {
            cursor: ew-resize;
          }
        }
      }
    `;
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${Home.styles}</style>

    <input-code></input-code>
    <result-code></result-code>
  `;
  }
}

customElements.define("home-wrapper", Home);
