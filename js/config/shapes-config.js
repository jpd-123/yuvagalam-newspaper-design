// File: js/config/shapes-config.js
// Project: Satvika Publisher
// Purpose: News-shape configuration

export const NEWS_SHAPES = [
  {
    id: "square",
    name: "చతురస్ర వార్త",
    cssClass: "shape-square",
    resizable: true,
    fixedShape: false,
    description: "వెడల్పు, ఎత్తు అవసరానికి అనుగుణంగా మారవచ్చు."
  },
  {
    id: "circle",
    name: "వృత్తాకార వార్త",
    cssClass: "shape-circle",
    resizable: true,
    fixedShape: true,
    description: "వృత్తాకార రూపం మారకుండా పరిమాణం మార్చవచ్చు."
  },
  {
    id: "egg",
    name: "ఎగ్ వార్త",
    cssClass: "shape-egg",
    resizable: true,
    fixedShape: true,
    description: "గుడ్డు ఆకారం అలాగే ఉండాలి."
  },
  {
    id: "half-egg-left",
    name: "హాఫ్ ఎగ్ లెఫ్ట్",
    cssClass: "shape-half-egg-left",
    resizable: true,
    fixedShape: true,
    description: "ఎడమవైపు సగం గుడ్డు ఆకారం."
  },
  {
    id: "half-egg-right",
    name: "హాఫ్ ఎగ్ రైట్",
    cssClass: "shape-half-egg-right",
    resizable: true,
    fixedShape: true,
    description: "కుడివైపు సగం గుడ్డు ఆకారం."
  }
];

export const DEFAULT_NEWS_SHAPE = "square";

export function getNewsShapeById(id) {
  return NEWS_SHAPES.find((shape) => shape.id === id) || null;
}
