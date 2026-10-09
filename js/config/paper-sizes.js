// File: js/config/paper-sizes.js
// Project: Satvika Publisher
// Purpose: Newspaper paper-size configuration

export const PAPER_SIZES = [
  {
    id: "A3",
    name: "A3",
    widthMm: 297,
    heightMm: 420,
    defaultColumns: 5
  },
  {
    id: "A4",
    name: "A4",
    widthMm: 210,
    heightMm: 297,
    defaultColumns: 3
  },
  {
    id: "BROADSHEET",
    name: "Broadsheet",
    widthMm: 375,
    heightMm: 600,
    defaultColumns: 8
  },
  {
    id: "DISTRICT_TABLOID",
    name: "District Tabloid",
    widthMm: 280,
    heightMm: 400,
    defaultColumns: 4
  },
  {
    id: "MEDIUM",
    name: "Medium",
    widthMm: 250,
    heightMm: 350,
    defaultColumns: 4
  }
];

export const MIN_PAGE_COUNT = 1;
export const MAX_PAGE_COUNT = 16;
export const DEFAULT_PAGE_COUNT = 6;

export function getPaperSizeById(id) {
  return PAPER_SIZES.find((paper) => paper.id === id) || null;
}

export function isValidPageCount(pageCount) {
  const count = Number(pageCount);

  return (
    Number.isInteger(count) &&
    count >= MIN_PAGE_COUNT &&
    count <= MAX_PAGE_COUNT
  );
}
