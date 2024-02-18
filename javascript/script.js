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

const createCustomHeadings = (data, selectedHeadings, headings) => {
  headings.forEach((componentHeading, index) => {
    componentHeading.textContent = data[selectedHeadings[index]]?.title ?? "";
  });
};

const createCustomLists = (commandsList, listNodes) => {
  listNodes.forEach((componentCommand, index) => {
    commandsList[index].forEach((elem) => {
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
      componentCommand.appendChild(li);
    });
  });
};

const createCustomTips = (data, selectedHeadings, tips) => {
  tips.forEach((componentTip, index) => {
    componentTip.innerHTML = data[selectedHeadings[index]]?.tip ?? "";
    if (!componentTip.innerHTML) {
      componentTip.style.display = "none";
    }
  });
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

  // Headings
  const customComponentHeadings = document.querySelectorAll(".heading");
  createCustomHeadings(data, selectedKeys, customComponentHeadings);

  // Lists
  const customComponentLists = document.querySelectorAll(".list");
  const commandsList = selectedKeys.map((relevantSection) => {
    return Object.values(data[relevantSection]?.commands);
  });
  createCustomLists(commandsList, customComponentLists);

  // Tips
  const customComponentTips = document.querySelectorAll(".tip");
  createCustomTips(data, selectedKeys, customComponentTips);

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
