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

function isKeyword(obj: unknown): obj is Keyword {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "keyword" in obj &&
    typeof obj.keyword === "string" &&
    "description" in obj &&
    typeof obj.description === "string" &&
    (!("additional_keyword2" in obj) ||
      typeof obj.additional_keyword2 === "string") &&
    (!("additional_keyword3" in obj) ||
      typeof obj.additional_keyword3 === "string")
  );
}

function isDataChild(obj: unknown): obj is DataChild {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "commands" in obj &&
    Array.isArray(obj.commands) &&
    obj.commands.every((item) => isKeyword(item)) &&
    (!("htmlId" in obj) || typeof obj.htmlId === "string") &&
    (!("tip" in obj) || typeof obj.tip === "string") &&
    (!("title" in obj) || typeof obj.title === "string")
  );
}

function isData(obj: unknown): obj is Data {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "title" in obj &&
    typeof obj.title === "string" &&
    "lang" in obj &&
    typeof obj.lang === "string" &&
    "lang_tag" in obj &&
    typeof obj.lang_tag === "string" &&
    "footer" in obj &&
    typeof obj.footer === "string" &&
    "global" in obj &&
    isDataChild(obj.global) &&
    "cursorMovement" in obj &&
    isDataChild(obj.cursorMovement) &&
    "insertMode" in obj &&
    isDataChild(obj.insertMode) &&
    "editing" in obj &&
    isDataChild(obj.editing) &&
    "markingText" in obj &&
    isDataChild(obj.markingText) &&
    "visualCommands" in obj &&
    isDataChild(obj.visualCommands) &&
    "registers" in obj &&
    isDataChild(obj.registers) &&
    "cutAndPaste" in obj &&
    isDataChild(obj.cutAndPaste) &&
    "diff" in obj &&
    isDataChild(obj.diff) &&
    "exiting" in obj &&
    isDataChild(obj.exiting) &&
    "specialRegisters" in obj &&
    isDataChild(obj.specialRegisters) &&
    "indentText" in obj &&
    isDataChild(obj.indentText) &&
    "languages" in obj &&
    isDataChild(obj.languages) &&
    "macros" in obj &&
    isDataChild(obj.macros) &&
    "marks" in obj &&
    isDataChild(obj.marks) &&
    "searchAndReplace" in obj &&
    isDataChild(obj.searchAndReplace) &&
    "searchMultipleFiles" in obj &&
    isDataChild(obj.searchMultipleFiles) &&
    "tabs" in obj &&
    isDataChild(obj.tabs) &&
    "workingWithMultipleFiles" in obj &&
    isDataChild(obj.workingWithMultipleFiles)
  );
}

const fetchData = async (url: string): Promise<Data | string> => {
  try {
    const dataPromise = await fetch(url);
    if (!dataPromise.ok) {
      throw new Error(dataPromise.statusText);
    }
    const data = (await dataPromise.json()) as Data[];
    if (!isData(data)) {
      throw new Error("Invalid data format received from API");
    }
    return data;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(msg);
    return msg;
  }
};

const retrieveObject = (data: Data, node: HTMLElement) => {
  const dataVals: string[] | DataChild[] = Object.values(data);
  const dataChild = dataVals.find((object) => {
    if (!isDataChild(object)) {
      return "";
    }
    return object.htmlId === node.id;
  });
  if (!dataChild) {
    return "";
  }
  return dataChild;
};

const createCustomHeadings = (
  elemData: DataChild,
  heading: HTMLHeadingElement,
) => {
  heading.textContent = elemData.title ?? "";
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
    const keywords = [
      keyword,
      additional_keyword2,
      additional_keyword3,
    ]
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
  const dataChild: DataChild[] = vimComponentNodes.map((node) =>
    retrieveObject(data, node),
  );

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
