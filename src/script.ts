"use strict";

import {
  createCustomHeadings,
  createCustomLists,
  createCustomTips,
} from "./utils/customUi";
import { extractVimTip, fetchData } from "./utils/utils";

const main = async () => {
  // Fetch data
  const data = await fetchData("data/en_us.json");
  if (typeof data === "string") {
    const p = document.createElement("p");
    p.textContent = data;
    document.body.appendChild(p);
    return;
  }

  // get relevant custom components
  const vimComponentNodes: HTMLElement[] = Array.from(
    document.querySelectorAll("vim-component"),
  );

  // get relevant objects from data
  const vimTips = vimComponentNodes.map((node) => extractVimTip(data, node));

  // Headings, lists and tips
  for (const vimTip of vimTips) {
    if (typeof vimTip === "string") {
      continue;
    }
    const vimComponent: HTMLElement =
      document.querySelector(`#${vimTip.htmlId?.toString() ?? ""}`) ??
      document.createElement("vim-component");
    const vcHeading: HTMLHeadingElement =
      vimComponent.querySelector("[name='heading']") ??
      document.createElement("h2");
    createCustomHeadings(vimTip, vcHeading);
    const vcUl: HTMLUListElement =
      vimComponent.querySelector("[name='list']") ??
      document.createElement("ul");
    createCustomLists(vimTip, vcUl);
    const vcTip: HTMLDivElement =
      vimComponent.querySelector("[name='tip']") ??
      document.createElement("div");
    createCustomTips(vimTip, vcTip);
  }

  // Footer
  const footer =
    document.querySelector("footer") ?? document.createElement("footer");
  const anchor = document.createElement("a");
  anchor.setAttribute(
    "href",
    "https://github.com/sazk07/vim-cheatsheet-web-components",
  );
  anchor.textContent = "GitHub";
  footer.textContent = `${data.footer} `;
  footer.appendChild(anchor);
};

try {
  await main();
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(msg);
  const p = document.createElement("p");
  p.textContent = msg;
  document.body.appendChild(p);
}
