class InputCode extends HTMLElement {
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
        display: flex;

        & .input-code {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          resize: none;
          background-color: var(--color-background);
          border: 0px;
          color: var(--color-text);
          padding: 6px;
          outline: none;
        }
      }
    `;
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${InputCode.styles}</style>

    <textarea
      class="input-code"
      placeholder="Escribe tu código aquí"
      autofocus
    ></textarea>
  `;
  }
}

customElements.define("input-code", InputCode);