"use strict";

class VimComponent extends HTMLElement {
  connectedCallback() {
    try {
      // creation
      const shadow = this.attachShadow({ mode: "open" });
      const vimTemplate = document.querySelector("template");
      if (!vimTemplate) {
        throw new Error("Template not found");
      }
      const linkElem = document.createElement("link");

      // link shadow stylesheet
      linkElem.setAttribute("rel", "stylesheet");
      linkElem.setAttribute("href", "css/shadowstyle.css");

      shadow.appendChild(linkElem);
      shadow.appendChild(vimTemplate.content.cloneNode(true));
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(msg);
    }
  }
}
customElements.define("vim-component", VimComponent);
