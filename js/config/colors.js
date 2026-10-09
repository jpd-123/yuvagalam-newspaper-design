// File: js/config/colors.js
// Project: Satvika Publisher
// Purpose: Central color configuration

export const DARK_COLORS = [
  { name: "డార్క్ బ్లాక్", value: "#222222" },
  { name: "డార్క్ గ్రీన్", value: "#174A32" },
  { name: "డార్క్ బ్లూ", value: "#173B65" },
  { name: "డార్క్ రెడ్", value: "#8B1E2D" },
  { name: "డార్క్ బ్రౌన్", value: "#593B2A" },
  { name: "డార్క్ పర్పుల్", value: "#512D6D" },
  { name: "డార్క్ టీల్", value: "#155E63" },
  { name: "డార్క్ గ్రే", value: "#414141" },
  { name: "డార్క్ నేవీ", value: "#172554" },
  { name: "డార్క్ మెరూన్", value: "#681C32" }
];

export const LIGHT_COLORS = [
  { name: "లైట్ గ్రే", value: "#F1F1F1" },
  { name: "లైట్ గ్రీన్", value: "#E2F0E8" },
  { name: "లైట్ బ్లూ", value: "#E3ECF8" },
  { name: "లైట్ రెడ్", value: "#F9E3E5" },
  { name: "లైట్ యెల్లో", value: "#FFF4CC" },
  { name: "లైట్ పింక్", value: "#F8E5EF" },
  { name: "లైట్ పర్పుల్", value: "#EEE5F7" },
  { name: "లైట్ సియాన్", value: "#DFF4F4" },
  { name: "లైట్ ఆరెంజ్", value: "#FBE8D5" },
  { name: "వైట్", value: "#FFFFFF" }
];

export const DEFAULT_TEXT_COLOR = "#222222";
export const DEFAULT_HEADLINE_COLOR = "#173B65";
export const DEFAULT_DATELINE_COLOR = "#B4232F";
export const DEFAULT_BACKGROUND_COLOR = "#FFFFFF";

export function getColorByValue(value) {
  return [...DARK_COLORS, ...LIGHT_COLORS].find(
    (color) => color.value.toLowerCase() === String(value).toLowerCase()
  ) || null;
}
