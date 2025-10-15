import type { DataChild } from "../types/data.types";

export const createCustomHeadings = (
  elemData: DataChild,
  heading: HTMLHeadingElement,
) => {
  heading.textContent = elemData.title ?? "";
};

export const createCustomLists = (
  elemData: DataChild,
  vcUl: HTMLUListElement,
) => {
  const sanitizeKeyword = (str: string | undefined) => {
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
        return `${prefix}<kbd>${kw}</kbd>`;
      })
      .join("");

    const li = document.createElement("li");
    li.innerHTML = `${keywordString} - ${description}`;
    vcUl.appendChild(li);
  }
};

export const createCustomTips = (elemData: DataChild, tip: HTMLDivElement) => {
  tip.innerHTML = elemData.tip ?? "";
  if (!tip.innerHTML) {
    tip.style.display = "none";
  }
};
