class Home extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get styles() {
    return /* css */`
      h1 {
        color: red;
      }
    `;
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${Home.styles}</style>

    <h1>Hello World!</h1>
  `;
  }
}

customElements.define('home-component', Home);