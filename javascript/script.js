"use strict";

const fetchData = async (url) => {
  try {
    const dataPromise = await fetch(url);
    if (!dataPromise.ok) {
      throw new Error(dataPromise.statusText);
    }
    const data = await dataPromise.json();
    if (!data) {
      throw new Error("No data");
    }
    return data;
  } catch (error) {
    console.error(error.message);
    return error;
  }
};

const retrieveObject = (data, node) => {
  const dataVals = Object.values(data);
  const dataChild = dataVals.find((object) => {
    if (typeof object === "object" && object !== null && "htmlId" in object) {
      return object.htmlId === node?.id;
    }
    return false;
  });
  return dataChild;
};

const createCustomHeadings = (elemData, heading) => {
  heading.textContent = elemData?.title ?? "";
};

const createCustomLists = (elemData, vcUl) => {
  const kbdArray = ["<kbd>", "</kbd>"];
  const sanitizeKeyword = (str) => {
    return str?.replace(/</g, "&lt;");
  };
  const { commands } = elemData;
  for (const {
    keyword,
    additional_keyword2,
    additional_keyword3,
    description,
  } of commands) {
    const keywords = [keyword, additional_keyword2, additional_keyword3]
      .map(sanitizeKeyword)
      .filter((kw) => kw !== undefined);

    const keywordString = keywords
      .map((kw, idx) => {
        const prefix = idx === 0 ? "" : " or ";
        return `${prefix}${kbdArray[0]}${kw}${kbdArray[1]}`;
      })
      .join("");

    const li = document.createElement("li");
    li.innerHTML = `${keywordString} - ${description}`;
    vcUl.appendChild(li);
  }
};

const createCustomTips = (elemData, tip) => {
  tip.innerHTML = elemData?.tip ?? "";
  if (!tip.innerHTML) {
    tip.style.display = "none";
  }
};
const main = async () => {
  // Fetch data
  const data = await fetchData("data/en_us.json");

  if (data instanceof Error) {
    const p = document.createElement("p");
    p.textContent = data.message;
    document.body.appendChild(p);
    return;
  }

  // get relevant custom components
  const vimComponentNodes = Array.from(
    document.querySelectorAll("vim-component"),
  );

  // get relevant objects from data
  const dataChild = vimComponentNodes.map((node) => retrieveObject(data, node));

  // Headings, lists and tips
  for (const elemData of dataChild) {
    const vimComponent =
      document.querySelector(`#${elemData.htmlId}`) ??
      document.createElement("vim-component");
    const vcHeading =
      vimComponent.querySelector("[name='heading']") ??
      document.createElement("h2");
    createCustomHeadings(elemData, vcHeading);
    const vcUl =
      vimComponent.querySelector("[name='list']") ??
      document.createElement("ul");
    createCustomLists(elemData, vcUl);
    const vcTip =
      vimComponent.querySelector("[name='tip']") ??
      document.createElement("div");
    createCustomTips(elemData, vcTip);
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

main();
