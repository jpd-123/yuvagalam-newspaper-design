// File: js/config/bullets.js
// Project: Satvika Publisher
// Purpose: Bullet-style configuration

export const BULLET_STYLES = [
  {
    id: "solid-circle",
    name: "నిండిన వృత్తం",
    symbol: "●"
  },
  {
    id: "hollow-circle",
    name: "ఖాళీ వృత్తం",
    symbol: "○"
  },
  {
    id: "square",
    name: "చతురస్రం",
    symbol: "■"
  },
  {
    id: "small-square",
    name: "చిన్న చతురస్రం",
    symbol: "▪"
  },
  {
    id: "diamond",
    name: "వజ్రం",
    symbol: "◆"
  },
  {
    id: "dash",
    name: "గీత",
    symbol: "—"
  }
];

export const DEFAULT_BULLET_STYLE = "solid-circle";

export function getBulletById(id) {
  return BULLET_STYLES.find((bullet) => bullet.id === id) || null;
}
