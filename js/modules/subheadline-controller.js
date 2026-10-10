/**
 * Satvika Publisher
 * File: js/modules/subheadline-controller.js
 *
 * Responsibility:
 * - Manage subheadline text and formatting.
 * - Render subheadline previews.
 * - Support underline and bullet formatting.
 *
 * Persistent storage is handled by NewsManager.
 */

export class SubheadlineController {
  constructor(options = {}) {
    this.inputId =
      options.inputId || "news-subheadlines";

    this.previewSelector =
      options.previewSelector ||
      "[data-news-subheadlines]";

    this.state = {
      items: [],
      fontFamily: "Gautami",
      fontSize: 14,
      color: "#222222",
      backgroundColor: "transparent",
      fontWeight: "normal",
      underline: "none",
      bullet: "none",
      textAlign: "left"
    };

    this.initialized = false;
  }

  initialize() {
    if (this.initialized) {
      return;
    }

    this.input = document.getElementById(
      this.inputId
    );

    if (this.input) {
      this.input.addEventListener(
        "input",
        () => {
          this.setItems(this.input.value);
        }
      );
    }

    this.initialized = true;

    this.apply();
  }

  normalizeItems(items) {
    if (Array.isArray(items)) {
      return items
        .map((item) => {
          if (typeof item === "string") {
            return item.trim();
          }

          return String(item?.text || "").trim();
        })
        .filter(Boolean);
    }

    return String(items || "")
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  setItems(items) {
    this.state.items = this.normalizeItems(items);

    if (this.input) {
      this.input.value =
        this.state.items.join("\n");
    }

    this.apply();
  }

  addItem(text) {
    const value = String(text || "").trim();

    if (!value) {
      throw new Error(
        "సబ్‌హెడ్‌లైన్ ఖాళీగా ఉండకూడదు."
      );
    }

    this.state.items.push(value);

    if (this.input) {
      this.input.value =
        this.state.items.join("\n");
    }

    this.apply();
  }

  removeItem(index) {
    const position = Number(index);

    if (
      !Number.isInteger(position) ||
      position < 0 ||
      position >= this.state.items.length
    ) {
      throw new Error(
        "సబ్‌హెడ్‌లైన్ నంబర్ సరిగ్గా లేదు."
      );
    }

    this.state.items.splice(position, 1);

    if (this.input) {
      this.input.value =
        this.state.items.join("\n");
    }

    this.apply();
  }

  setFontFamily(value) {
    this.state.fontFamily = this.requireText(
      value,
      "Font family"
    );

    this.apply();
  }

  setFontSize(value) {
    const size = Number(value);

    if (
      !Number.isFinite(size) ||
      size < 6 ||
      size > 72
    ) {
      throw new Error(
        "సబ్‌హెడ్‌లైన్ ఫాంట్ సైజు 6 నుంచి 72 మధ్య ఉండాలి."
      );
    }

    this.state.fontSize = size;

    this.apply();
  }

  setColor(value) {
    this.state.color = this.validateColor(value);

    this.apply();
  }

  setBackgroundColor(value) {
    if (
      value === "transparent" ||
      value === ""
    ) {
      this.state.backgroundColor = "transparent";
    } else {
      this.state.backgroundColor =
        this.validateColor(value);
    }

    this.apply();
  }

  setFontWeight(value) {
    const allowed = [
      "normal",
      "bold",
      "500",
      "600",
      "700",
      "800",
      "900"
    ];

    if (!allowed.includes(String(value))) {
      throw new Error(
        "చెల్లని సబ్‌హెడ్‌లైన్ ఫాంట్ బరువు."
      );
    }

    this.state.fontWeight = String(value);

    this.apply();
  }

  setUnderline(value) {
    const allowed = [
      "none",
      "solid",
      "double"
    ];

    if (!allowed.includes(value)) {
      throw new Error(
        "Underline ఎంపిక none, solid లేదా double అయి ఉండాలి."
      );
    }

    this.state.underline = value;

    this.apply();
  }

  setBullet(value) {
    const allowed = [
      "none",
      "disc",
      "square",
      "circle",
      "dash"
    ];

    if (!allowed.includes(value)) {
      throw new Error(
        "చెల్లని Bullet Style."
      );
    }

    this.state.bullet = value;

    this.apply();
  }

  setTextAlign(value) {
    const allowed = [
      "left",
      "center",
      "right",
      "justify"
    ];

    if (!allowed.includes(value)) {
      throw new Error(
        "చెల్లని Text Alignment."
      );
    }

    this.state.textAlign = value;

    this.apply();
  }

  requireText(value, label) {
    const text = String(value || "").trim();

    if (!text) {
      throw new Error(
        `${label} తప్పనిసరిగా ఇవ్వాలి.`
      );
    }

    return text;
  }

  validateColor(value) {
    const color = String(value || "").trim();

    if (
      typeof CSS !== "undefined" &&
      CSS.supports("color", color)
    ) {
      return color;
    }

    throw new Error(
      `చెల్లని రంగు: ${color}`
    );
  }

  apply() {
    const containers = document.querySelectorAll(
      this.previewSelector
    );

    containers.forEach((container) => {
      container.replaceChildren();
/**
 * Satvika Publisher
 * File: js/modules/subheadline-controller.js
 *
 * Responsibility:
 * - Manage subheadline text and formatting.
 * - Render subheadline previews.
 * - Support underline and bullet formatting.
 *
 * Persistent storage is handled by NewsManager.
 */

export class SubheadlineController {
  constructor(options = {}) {
    this.inputId =
      options.inputId || "news-subheadlines";

    this.previewSelector =
      options.previewSelector ||
      "[data-news-subheadlines]";

    this.state = {
      items: [],
      fontFamily: "Gautami",
      fontSize: 14,
      color: "#222222",
      backgroundColor: "transparent",
      fontWeight: "normal",
      underline: "none",
      bullet: "none",
      textAlign: "left"
    };

    this.initialized = false;
  }

  initialize() {
    if (this.initialized) {
      return;
    }

    this.input = document.getElementById(
      this.inputId
    );

    if (this.input) {
      this.input.addEventListener(
        "input",
        () => {
          this.setItems(this.input.value);
        }
      );
    }

    this.initialized = true;

    this.apply();
  }

  normalizeItems(items) {
    if (Array.isArray(items)) {
      return items
        .map((item) => {
          if (typeof item === "string") {
            return item.trim();
          }

          return String(item?.text || "").trim();
        })
        .filter(Boolean);
    }

    return String(items || "")
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  setItems(items) {
    this.state.items = this.normalizeItems(items);

    if (this.input) {
      this.input.value =
        this.state.items.join("\n");
    }

    this.apply();
  }

  addItem(text) {
    const value = String(text || "").trim();

    if (!value) {
      throw new Error(
        "సబ్‌హెడ్‌లైన్ ఖాళీగా ఉండకూడదు."
      );
    }

    this.state.items.push(value);

    if (this.input) {
      this.input.value =
        this.state.items.join("\n");
    }

    this.apply();
  }

  removeItem(index) {
    const position = Number(index);

    if (
      !Number.isInteger(position) ||
      position < 0 ||
      position >= this.state.items.length
    ) {
      throw new Error(
        "సబ్‌హెడ్‌లైన్ నంబర్ సరిగ్గా లేదు."
      );
    }

    this.state.items.splice(position, 1);

    if (this.input) {
      this.input.value =
        this.state.items.join("\n");
    }

    this.apply();
  }

  setFontFamily(value) {
    this.state.fontFamily = this.requireText(
      value,
      "Font family"
    );

    this.apply();
  }

  setFontSize(value) {
    const size = Number(value);

    if (
      !Number.isFinite(size) ||
      size < 6 ||
      size > 72
    ) {
      throw new Error(
        "సబ్‌హెడ్‌లైన్ ఫాంట్ సైజు 6 నుంచి 72 మధ్య ఉండాలి."
      );
    }

    this.state.fontSize = size;

    this.apply();
  }

  setColor(value) {
    this.state.color = this.validateColor(value);

    this.apply();
  }

  setBackgroundColor(value) {
    if (
      value === "transparent" ||
      value === ""
    ) {
      this.state.backgroundColor = "transparent";
    } else {
      this.state.backgroundColor =
        this.validateColor(value);
    }

    this.apply();
  }

  setFontWeight(value) {
    const allowed = [
      "normal",
      "bold",
      "500",
      "600",
      "700",
      "800",
      "900"
    ];

    if (!allowed.includes(String(value))) {
      throw new Error(
        "చెల్లని సబ్‌హెడ్‌లైన్ ఫాంట్ బరువు."
      );
    }

    this.state.fontWeight = String(value);

    this.apply();
  }

  setUnderline(value) {
    const allowed = [
      "none",
      "solid",
      "double"
    ];

    if (!allowed.includes(value)) {
      throw new Error(
        "Underline ఎంపిక none, solid లేదా double అయి ఉండాలి."
      );
    }

    this.state.underline = value;

    this.apply();
  }

  setBullet(value) {
    const allowed = [
      "none",
      "disc",
      "square",
      "circle",
      "dash"
    ];

    if (!allowed.includes(value)) {
      throw new Error(
        "చెల్లని Bullet Style."
      );
    }

    this.state.bullet = value;

    this.apply();
  }

  setTextAlign(value) {
    const allowed = [
      "left",
      "center",
      "right",
      "justify"
    ];

    if (!allowed.includes(value)) {
      throw new Error(
        "చెల్లని Text Alignment."
      );
    }

    this.state.textAlign = value;

    this.apply();
  }

  requireText(value, label) {
    const text = String(value || "").trim();

    if (!text) {
      throw new Error(
        `${label} తప్పనిసరిగా ఇవ్వాలి.`
      );
    }

    return text;
  }

  validateColor(value) {
    const color = String(value || "").trim();

    if (
      typeof CSS !== "undefined" &&
      CSS.supports("color", color)
    ) {
      return color;
    }

    throw new Error(
      `చెల్లని రంగు: ${color}`
    );
  }

  apply() {
    const containers = document.querySelectorAll(
      this.previewSelector
    );

    containers.forEach((container) => {
      container.replaceChildren();

      this.state.items.forEach((text) => {
        const item = document.createElement("div");

        item.className = "news-subheadline-item";
        item.textContent = text;

        item.style.fontFamily =
          `"${this.state.fontFamily}", sans-serif`;

        item.style.fontSize =
          `${this.state.fontSize}px`;

        item.style.color =
          this.state.color;

        item.style.backgroundColor =
          this.state.backgroundColor;

        item.style.fontWeight =
          this.state.fontWeight;

        item.style.textAlign =
          this.state.textAlign;

        item.style.textDecoration =
          this.state.underline === "none"
            ? "none"
            : `underline ${this.state.underline}`;

        item.style.whiteSpace = "pre-wrap";
        item.style.overflowWrap = "anywhere";

        if (this.state.bullet !== "none") {
          const marker = document.createElement("span");

          marker.className =
            "news-subheadline-bullet";

          marker.setAttribute(
            "aria-hidden",
            "true"
          );

          marker.textContent =
            this.getBulletCharacter();

          marker.style.marginRight = "5px";

          item.prepend(marker);
        }

        container.appendChild(item);
      });
    });

    document.dispatchEvent(
      new CustomEvent(
        "satvika:subheadlines-changed",
        {
          detail: this.getValue()
        }
      )
    );
  }

  getBulletCharacter() {
    const characters = {
      disc: "•",
      square: "▪",
      circle: "○",
      dash: "–",
      none: ""
    };

    return characters[this.state.bullet] || "";
  }

  getValue() {
    return {
      ...this.state,
      items: [...this.state.items]
    };
  }

  loadValue(value = {}) {
    this.state = {
      ...this.state,
      ...value,
      items: this.normalizeItems(
        value.items ?? this.state.items
      )
    };

    if (this.input) {
      this.input.value =
        this.state.items.join("\n");
    }

    this.apply();
  }
}

export default SubheadlineController;neCo
