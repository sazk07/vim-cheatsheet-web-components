"use strict";

const fetchData = async (url) => {
  try {
    const dataPromise = await fetch(url);
    const data = await dataPromise.json();
    if (!data) {
      throw new Error(dataPromise.error);
    }
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const createCustomHeadings = (data, kw, heading) => {
  heading.textContent = data[kw]?.title ?? "";
};

const createCustomLists = (commandsList, vcUl) => {
  commandsList.forEach((elem) => {
    const { keyword, additional_keyword2, additional_keyword3, description } =
      elem;
    const kbdArray = ["<kbd>", "</kbd>"];
    const sanitizeKeyword = (str) => str?.replace(/</g, "&lt;");
    const keywords = [keyword, additional_keyword2, additional_keyword3]
      ?.map(sanitizeKeyword)
      .filter(Boolean);
    const keywordString = keywords
      .map((kw, i) => {
        const prefix = i === 0 ? "" : " or ";
        return `${prefix}${kbdArray[0]}${kw}${kbdArray[1]}`;
      })
      .join("");
    const li = document.createElement("li");
    li.innerHTML = `${keywordString} - ${description}`;
    vcUl.appendChild(li);
  });
};

const createCustomTips = (data, kw, tip) => {
  tip.innerHTML = data[kw]?.tip ?? "";
  if (!tip.innerHTML) {
    tip.style.display = "none";
  }
};

const main = async () => {
  // Fetch data
  const data = await fetchData("data/en_us.json");
  if (!data) {
    throw new Error("Failed to fetch data");
  }

  const dataKeys = Object.keys(data);
  const selectedKeys = dataKeys?.filter((kw) => {
    return (
      kw !== "title" &&
      kw !== "lang" &&
      kw !== "lang_tag" &&
      kw !== "languages" &&
      kw !== "footer"
    );
  });

  const vimComponentIds = Array.from(
    document.querySelectorAll("vim-component"),
    (vimComponent) => vimComponent.id,
  );
  const kwIdObj = selectedKeys.reduce(
    (acc, key, i) => ({ ...acc, [key]: vimComponentIds[i] }),
    {},
  );

  // Headings, lists and tips
  for (const [kw, val] of Object.entries(kwIdObj)) {
    const vimComponent = document.querySelector(`#${val}`);
    const vcHeading = vimComponent.querySelector("[name='heading']");
    createCustomHeadings(data, kw, vcHeading);
    const vcUl = vimComponent.querySelector("[name='list']");
    createCustomLists(data[kw]?.commands, vcUl);
    const vcTip = vimComponent.querySelector("[name='tip']");
    createCustomTips(data, kw, vcTip);
  }
  // Footer
  const footer = document.querySelector("footer");
  const anchor = document.createElement("a");
  anchor.setAttribute(
    "href",
    "https://github.com/sazk07/sazk07.github.io/vim-cheatsheet",
  );
  anchor.textContent = "GitHub";
  footer.textContent = `${data.footer} `;
  footer.appendChild(anchor);
};

main();
