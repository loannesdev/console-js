class ResultCode extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.sandboxElement = null;
    this.sandboxContent = null;
  }

  connectedCallback() {
    this.render();
    this.initSandbox();
    this.codeExecution();
  }

  initSandbox() {
    this.sandboxElement = this.shadowRoot.querySelector("iframe#sandbox");
    this.sandboxContent = this.sandboxElement.contentDocument || this.sandboxElement.contentWindow.document;

    this.sandboxContent.open();
    this.sandboxContent.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
        </body>
      </html>
    `);
    this.sandboxContent.close();
  }

  codeExecution() {
    const codeEditor = document.querySelector("home-wrapper").shadowRoot.querySelector("code-editor");
    const consoleElement = this.shadowRoot.querySelector(".console");
    let arrayResult = [];

    codeEditor.addEventListener("value-change", (event) => { // Custom event
      const { detail: { textValue } } = event;
      const script = document.createElement("script");
      const scriptElement = this.sandboxContent.body.querySelector("script");
      arrayResult = []; // Reset the array of results

      if (scriptElement) {
        scriptElement.remove(); // Remove old script element
      }

      if (!textValue.length) { // If the text value is empty, clear the console
        consoleElement.textContent = "";
      }

      script.type = "module";
      script.textContent = `
        // Get the console object & set the log message to the parent window ---
        const originalLog = console.log;

          console.log = (message) => {
          window.parent.postMessage(message, "*");
        };
        // ---

        try {
          eval(${JSON.stringify(textValue)});
        }

        catch (error) {
          console.log(error);
        }
      `;

      this.sandboxContent.body.append(script);
    });

    window.addEventListener("message", (event) => {
      if (!event?.data?.length) {
        return;
      }

      if (typeof event.data === "object") {
        const json = JSON.stringify(event.data, null, 2);
        arrayResult.push(json);
      }

      else {
        arrayResult.push(event.data);
      }

      consoleElement.textContent = arrayResult.join("\n\n");
    });
  }

  static get styles() {
    return /* css */ `
      :host {
        width: var(--width-result-window);

        & .console {
          width: 100%;
          height: 100%;
          margin: 0;
          font-size: var(--code-font-size);
          padding: var(--code-padding);
        }
      }
    `;
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${ResultCode.styles}</style>

    <pre class="console"></pre>
    <iframe id="sandbox" hidden></iframe>
  `;
  }
}

customElements.define("result-code", ResultCode);
