import "./InputCode.js";

class Home extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  static get styles() {
    return /* css */`
      :host {
        display: grid;
        grid-template-columns: 1fr 1fr;
        height: 100dvh;
      }
    `;
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${Home.styles}</style>

    <input-code></input-code>
    <textarea style="background-color: var(--current-bg-color); color: var(--current-text-color); resize: none; border: 0px; outline: none; cursor-pointer: none;"></textarea>
  `;
  }
}

customElements.define("home-wrapper", Home);