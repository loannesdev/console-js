class WindowDivider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    const divider = this.shadowRoot.querySelector(".divider");
    const homeWrapper = document.querySelector("home-wrapper");

    let isDragging = false;

    divider.addEventListener("pointerdown", ({ pointerId }) => {
      divider.setPointerCapture(pointerId);
      isDragging = true;
    });

    divider.addEventListener("pointerup", ({ pointerId }) => {
      divider.releasePointerCapture(pointerId);
      isDragging = false;
    });

    divider.addEventListener("pointermove", (event) => {
      if (!isDragging) return;

      const { clientX } = event;
      const { width: windowWidth } = homeWrapper.getBoundingClientRect();
      const minWidth = windowWidth * 0.2;
      const maxWidth = windowWidth * 0.8;
      const resultWindowWidth = -(clientX - windowWidth);

      if (resultWindowWidth <= minWidth || resultWindowWidth >= maxWidth) {
        return;
      }

      homeWrapper.style.setProperty("--width-result-window", `${resultWindowWidth}px`);
    });
  }

  static get styles() {
    return /* css */ `
      :host {
        & .divider {
          --size: 3px;
          --bg-color: color-mix(in srgb, transparent 90%, #fff);
          --size-pads: calc(var(--size) * 0.4);
          --cursor: auto;

          width: var(--size);
          height: 100%;
          transition: 0.2s ease-in-out background-color;
          position: relative;
          background-color: var(--bg-color);
          cursor: var(--cursor);

          &:is(:hover, ::before:hover, ::after:hover) {
            --cursor: ew-resize;
            --bg-color: #09f;
          }

          &::before,
          &::after {
            content: "";
            width: var(--size-pads);
            height: 100%;
            position: absolute;
          }

          &:before {
            left: calc(var(--size-pads) * -1);
          }

          &:after {
            right: calc(var(--size-pads) * -1);
          }
        }
      }
    `;
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${WindowDivider.styles}</style>

    <div class="divider"></div>
  `;
  }
}

customElements.define("window-divider", WindowDivider);