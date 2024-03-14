"use strict";

class VimComponent extends HTMLElement {
  constructor() {
    super();
  }
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
      console.error((error as Error).message)
    }
  }
}
customElements.define("vim-component", VimComponent);
