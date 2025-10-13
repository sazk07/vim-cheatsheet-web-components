interface Keyword {
  keyword: string;
  description: string;
  additional_keyword2?: string;
  additional_keyword3?: string;
}

export interface DataChild {
  htmlId?: string;
  tip?: string;
  title?: string;
  commands: Keyword[];
}

export interface Data {
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
  languages: { title: string };
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

export function isDataChild(obj: unknown): obj is DataChild {
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

export function isData(obj: unknown): obj is Data {
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
    obj.languages !== null &&
    typeof obj.languages === "object" &&
    "title" in obj.languages &&
    typeof obj.languages.title === "string" &&
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

