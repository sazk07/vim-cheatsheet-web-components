// create the custom component
class VimComponent extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    // creation
    const shadow = this.attachShadow({ mode: "open" });
    const vimTemplate = document.querySelector("template");
    const linkElem = document.createElement("link");

    // link shadow stylesheet
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "css/shadowstyle.css");

    shadow.appendChild(linkElem);
    shadow.appendChild(vimTemplate.content.cloneNode(true));
  }
}
customElements.define("vim-component", VimComponent);

