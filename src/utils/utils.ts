"use strict";

import {
  isData,
  isDataChild,
  type Data,
  type DataChild,
} from "../types/data.types";

export const fetchData = async (url: string) => {
  try {
    const dataPromise = await fetch(url);
    if (!dataPromise.ok) {
      throw new Error(dataPromise.statusText);
    }
    const data: unknown = await dataPromise.json();
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

export const extractVimTip = (data: Data, node: HTMLElement) => {
  const dataVals: string[] | DataChild[] = Object.values(data);
  const dataChild = dataVals.find((obj) => {
    if (!isDataChild(obj)) {
      return "";
    }
    return obj.htmlId === node.id;
  });
  if (!dataChild) {
    return "";
  }
  return dataChild;
};
