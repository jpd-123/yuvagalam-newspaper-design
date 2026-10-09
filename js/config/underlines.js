// File: js/config/underlines.js
// Project: Satvika Publisher
// Purpose: Underline-style configuration

export const UNDERLINE_STYLES = [
  {
    id: "single",
    name: "సింగిల్ లైన్",
    css: "solid",
    thickness: 1
  },
  {
    id: "double",
    name: "డబుల్ లైన్",
    css: "double",
    thickness: 3
  }
];

export const DEFAULT_UNDERLINE_STYLE = "single";

export function getUnderlineById(id) {
  return UNDERLINE_STYLES.find((style) => style.id === id) || null;
}
