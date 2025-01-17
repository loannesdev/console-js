class ResultCode extends HTMLElement {
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
        background-color: red;
        
        & .console {
          width: 100%;
          height: 100%;
          margin: 0;
        }
      }
    `;
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${ResultCode.styles}</style>

    <pre class="console">

    </pre>
  `;
  }
}

customElements.define("result-code", ResultCode);
