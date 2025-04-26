class WindowDivider extends HTMLElement {
  constructor() {
    super();
    this.homeElement = null;
  }

  connectedCallback() {
    this.render();
    this.calculatePosition();
    this.recalculatePositionOnResize();
  }

  calculatePosition() {
    const divider = this.querySelector(".divider");
    this.homeElement = document.querySelector("home-wrapper");

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
      const { width: windowWidth } = this.homeElement.getBoundingClientRect();
      const minWidth = windowWidth * 0.2;
      const maxWidth = windowWidth * 0.8;
      const resultWindowWidth = -(clientX - windowWidth);

      if (resultWindowWidth <= minWidth || resultWindowWidth >= maxWidth) {
        return;
      }

      this.homeElement.style.setProperty("--width-result-window", `${resultWindowWidth}px`);
    });
  }

  recalculatePositionOnResize() {
    const resizeElement = this.homeElement;
    const widthCodeWindow = getComputedStyle(document.documentElement).getPropertyValue("--width-code-window").replace(/[a-zA-Z]/g, "");
    let isfirstRender = true;

    const resizeObserver = new ResizeObserver((entries) => {
      if (isfirstRender) {
        isfirstRender = false;
        return;
      }

      const [entry] = entries;
      const { width } = entry.contentRect;
      const widthResultWindow = width / (Number(widthCodeWindow) + 1);

      this.homeElement.style.setProperty("--width-result-window", `${widthResultWindow}px`);
    });

    resizeObserver.observe(resizeElement);
  }

  static get styles() {
    return /* css */ `
      :host, window-divider {
        & .divider {
          --size: 6px;
          --bg-color: color-mix(in srgb, transparent 90%, #fff);
          --size-pads: calc(var(--size) * 2);
          --cursor: auto;

          width: var(--size);
          height: 100%;
          transition: 0.2s ease-in-out background-color;
          position: relative;
          background-color: var(--bg-color);
          cursor: var(--cursor);

          &:is(:hover, ::before:hover, ::after:hover) {
            --cursor: col-resize;
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
    this.innerHTML = /* html */ `
    <style>${WindowDivider.styles}</style>

    <div class="divider"></div>
  `;
  }
}

customElements.define("window-divider", WindowDivider);