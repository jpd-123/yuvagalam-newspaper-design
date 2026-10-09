// File: js/config/fonts.js
// Project: Satvika Publisher
// Purpose: Central typography configuration

export const FONT_CONFIG = [
  {
    id: "gautami",
    name: "Gautami",
    cssFamily: "Gautami, sans-serif",
    telugu: true
  },
  {
    id: "peddana",
    name: "Peddana",
    cssFamily: "Peddana, serif",
    telugu: true
  },
  {
    id: "noto-sans-telugu",
    name: "Noto Sans Telugu",
    cssFamily: '"Noto Sans Telugu", sans-serif',
    telugu: true
  },
  {
    id: "noto-serif-telugu",
    name: "Noto Serif Telugu",
    cssFamily: '"Noto Serif Telugu", serif',
    telugu: true
  },
  {
    id: "mandali",
    name: "Mandali",
    cssFamily: "Mandali, sans-serif",
    telugu: true
  },
  {
    id: "ramabhadra",
    name: "Ramabhadra",
    cssFamily: "Ramabhadra, sans-serif",
    telugu: true
  },
  {
    id: "suranna",
    name: "Suranna",
    cssFamily: "Suranna, serif",
    telugu: true
  },
  {
    id: "tenali-ramakrishna",
    name: "Tenali Ramakrishna",
    cssFamily: '"Tenali Ramakrishna", serif',
    telugu: true
  },
  {
    id: "lakki-reddy",
    name: "Lakki Reddy",
    cssFamily: '"Lakki Reddy", cursive',
    telugu: true
  },
  {
    id: "mallanna",
    name: "Mallanna",
    cssFamily: "Mallanna, sans-serif",
    telugu: true
  },
  {
    id: "glegoo",
    name: "Glegoo",
    cssFamily: "Glegoo, serif",
    telugu: true
  },
  {
    id: "system-default",
    name: "System Default",
    cssFamily: "system-ui, sans-serif",
    telugu: true
  }
];

export const DEFAULT_BODY_FONT = "Gautami";
export const DEFAULT_HEADLINE_FONT = "Peddana";
export const DEFAULT_BODY_FONT_SIZE = 12;
export const DEFAULT_HEADLINE_FONT_SIZE = 22;
export const DEFAULT_SUBHEADLINE_FONT_SIZE = 14;

export function getFontById(id) {
  return FONT_CONFIG.find((font) => font.id === id) || null;
}
