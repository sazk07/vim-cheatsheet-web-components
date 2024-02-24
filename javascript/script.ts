"use strict";

interface Keyword {
  keyword: string;
  description: string;
  additional_keyword2?: string;
  additional_keyword3?: string;
}

interface DataChild {
  htmlId?: string;
  tip?: string;
  title?: string;
  commands: Keyword[];
}

interface Data {
  title: string;
  lang: string;
  lang_tag: string;
  footer: string;
  global: DataChild;
  cursorMovement: DataChild;
  insertMode: DataChild;
  editing: DataChild;
  markingText: DataChild;
  visualCommands: DataChild;
  registers: DataChild;
  cutAndPaste: DataChild;
  diff: DataChild;
  exiting: DataChild;
  specialRegisters: DataChild;
  indentText: DataChild;
  languages: DataChild;
  macros: DataChild;
  marks: DataChild;
  searchAndReplace: DataChild;
  searchMultipleFiles: DataChild;
  tabs: DataChild;
  workingWithMultipleFiles: DataChild;
}

const fetchData = async (url: string): Promise<Data | Error> => {
  try {
    const dataPromise = await fetch(url);
    if (!dataPromise.ok) {
      throw new Error(dataPromise.statusText);
    }
    const data: Data = await dataPromise.json();
    if (!data) {
      throw new Error("No data");
    }
    return data;
  } catch (error) {
    console.error((error as Error).message);
    return error as Error;
  }
};

const retrieveObject = (data: Data, node: HTMLElement) => {
  const dataVals: Array<string | DataChild> = Object.values(data);
  const dataChild: DataChild = dataVals.find((object) => {
    if (typeof object === "object" && object !== null && "htmlId" in object) {
      return object.htmlId === node?.id;
    }
    return false;
  }) as DataChild;
  return dataChild;
};

const createCustomHeadings = (
  elemData: DataChild,
  heading: HTMLHeadingElement,
) => {
  heading.textContent = elemData?.title ?? "";
};

const createCustomLists = (elemData: DataChild, vcUl: HTMLUListElement) => {
  const kbdArray = ["<kbd>", "</kbd>"];
  const sanitizeKeyword = (str: string | undefined): string | undefined => {
    return str?.replace(/</g, "&lt;");
  };
  const { commands } = elemData;
  for (const {
    keyword,
    additional_keyword2,
    additional_keyword3,
    description,
  } of commands) {
    const keywords: string[] = [
      keyword,
      additional_keyword2,
      additional_keyword3,
    ]
      .map(sanitizeKeyword)
      .filter((kw) => kw !== undefined) as string[];

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

const createCustomTips = (elemData: DataChild, tip: HTMLDivElement) => {
  tip.innerHTML = elemData?.tip ?? "";
  if (!tip.innerHTML) {
    tip.style.display = "none";
  }
};

const main = async (): Promise<void> => {
  // Fetch data
  const data = await fetchData("data/en_us.json");
  if (data instanceof Error) {
    const p = document.createElement("p");
    p.textContent = data.message;
    document.body.appendChild(p);
    return;
  }

  // get relevant custom components
  const vimComponentNodes: HTMLElement[] = Array.from(
    document.querySelectorAll("vim-component"),
  );

  // get relevant objects from data
  const dataChild: DataChild[] = vimComponentNodes
    .map((node) => retrieveObject(data, node))

  // Headings, lists and tips
  for (const elemData of dataChild) {
    const vimComponent: HTMLElement =
      document.querySelector(`#${elemData.htmlId}`) ??
      document.createElement("vim-component");
    const vcHeading: HTMLHeadingElement =
      vimComponent.querySelector("[name='heading']") ??
      document.createElement("h2");
    createCustomHeadings(elemData, vcHeading);
    const vcUl: HTMLUListElement =
      vimComponent.querySelector("[name='list']") ??
      document.createElement("ul");
    createCustomLists(elemData, vcUl);
    const vcTip: HTMLDivElement =
      vimComponent.querySelector("[name='tip']") ??
      document.createElement("div");
    createCustomTips(elemData, vcTip);
  }

  // Footer
  const footer: HTMLElement =
    document.querySelector("footer") ?? document.createElement("footer");
  const anchor: HTMLAnchorElement = document.createElement("a");
  anchor.setAttribute(
    "href",
    "https://github.com/sazk07/vim-cheatsheet-web-components",
  );
  anchor.textContent = "GitHub";
  footer.textContent = `${data.footer} `;
  footer.appendChild(anchor);
};

main();
