const dataPromise = await fetch("data/en_us.json");
const data = await dataPromise.json();
if (data.error) {
  console.error(data.error);
}
class VimGlobals extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const vimGlobals = document.createElement("div");
    const vimGlobalsHeader = document.createElement("h2");
    const vimGlobalsUl = document.createElement("ul");
    const keywordHelp = document.createElement("li");
    const keywordSaveAs = document.createElement("li");
    const keywordClose = document.createElement("li");
    const keywordTerminal = document.createElement("li");
    const keywordK = document.createElement("li");
    const well = document.createElement("div");
    const linkElem = document.createElement("link")

    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "css/shadowstyle.css");
    well.setAttribute("class", "well");

    vimGlobalsHeader.textContent = `${data.global.title}`;
    keywordHelp.innerHTML = `
      <kbd>:h[elp] ${data.words.keyword}</kbd> - ${data.global.commands.helpForKeyword}
    `;
    keywordSaveAs.innerHTML = `
      <kbd>:sav[eas] ${data.words.file}</kbd> - ${data.global.commands.saveAsFile}
    `;
    keywordClose.innerHTML = `
      <kbd>:clo[se]</kbd> - ${data.global.commands.closePane}
    `;
    keywordTerminal.innerHTML = `
      <kbd>:ter[minal]</kbd> - ${data.global.commands.colonTerminal}
    `;
    keywordK.innerHTML = `
      <kbd>K</kbd> - ${data.global.commands.K}
    `;
    well.innerHTML = `
      <strong>Tip</strong> ${data.global.tip1}
    `;

    vimGlobals.appendChild(vimGlobalsHeader);
    vimGlobals.appendChild(vimGlobalsUl);
    vimGlobalsUl.appendChild(keywordHelp);
    vimGlobalsUl.appendChild(keywordSaveAs);
    vimGlobalsUl.appendChild(keywordClose);
    vimGlobalsUl.appendChild(keywordTerminal);
    vimGlobalsUl.appendChild(keywordK);
    vimGlobals.appendChild(well);
    shadow.appendChild(linkElem);
    shadow.appendChild(vimGlobals);
  }
}
customElements.define("glvims-component", VimGlobals);
