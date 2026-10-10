/**
 * Satvika Publisher
 * File: js/modules/headline-controller.js
 *
 * Responsibility:
 * - Read headline editor fields.
 * - Apply headline formatting to the selected preview.
 * - Dispatch headline change events.
 *
 * Saving headline changes is handled by NewsManager.
 */

export class HeadlineController {
  constructor(options = {}) {
    this.inputId =
      options.inputId || "news-headline";

    this.previewSelector =
      options.previewSelector || "[data-news-headline]";

    this.defaultFontFamily =
      options.fontFamily || "Gautami";

    this.defaultFontSize =
      Number(options.fontSize) || 22;

    this.defaultColor =
      options.color || "#111111";

    this.defaultBackground =
      options.backgroundColor || "transparent";

    this.state = {
      text: "",
      fontFamily: this.defaultFontFamily,
      fontSize: this.defaultFontSize,
      color: this.defaultColor,
      backgroundColor: this.defaultBackground,
      fontWeight: "bold",
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
          this.state.text = this.input.value;
          this.apply();
        }
      );
    }

    this.initialized = true;

    this.apply();
  }

  setText(text) {
    this.state.text = String(text || "");

    if (this.input) {
      this.input.value = this.state.text;
    }

    this.apply();
  }

  setFontFamily(fontFamily) {
    const value = String(fontFamily || "").trim();

    if (!value) {
      throw new Error(
        "హెడ్‌లైన్ ఫాంట్ పేరు ఇవ్వాలి."
      );
    }

    this.state.fontFamily = value;

    this.apply();
  }

  setFontSize(fontSize) {
    const value = Number(fontSize);

    if (
      !Number.isFinite(value) ||
      value < 6 ||
      value > 100
    ) {
      throw new Error(
        "హెడ్‌లైన్ ఫాంట్ సైజు 6 నుంచి 100 మధ్య ఉండాలి."
      );
    }

    this.state.fontSize = value;

    this.apply();
  }

  setColor(color) {
    this.state.color = this.validateColor(
      color
    );

    this.apply();
  }

  setBackgroundColor(color) {
    if (
      color === "transparent" ||
      color === ""
    ) {
      this.state.backgroundColor = "transparent";
    } else {
      this.state.backgroundColor =
        this.validateColor(color);
    }

    this.apply();
  }

  setFontWeight(weight) {
    const allowed = [
      "normal",
      "bold",
      "500",
      "600",
      "700",
      "800",
      "900"
    ];

    if (!allowed.includes(String(weight))) {
      throw new Error(
        "చెల్లని హెడ్‌లైన్ ఫాంట్ బరువు."
      );
    }

    this.state.fontWeight = String(weight);

    this.apply();
  }

  setTextAlign(align) {
    const allowed = [
      "left",
      "center",
      "right",
      "justify"
    ];

    if (!allowed.includes(align)) {
      throw new Error(
        "చెల్లని Text Alignment."
      );
    }

    this.state.textAlign = align;

    this.apply();
  }

  validateColor(color) {
    const value = String(color || "").trim();

    if (
      typeof CSS !== "undefined" &&
      CSS.supports("color", value)
    ) {
      return value;
    }

    throw new Error(
      `చెల్లని రంగు: ${value}`
    );
  }

  apply() {
    const previews = document.querySelectorAll(
      this.previewSelector
    );

    previews.forEach((element) => {
      element.textContent = this.state.text;

      element.style.fontFamily =
        `"${this.state.fontFamily}", sans-serif`;

      element.style.fontSize =
        `${this.state.fontSize}px`;

      element.style.color =
        this.state.color;

      element.style.backgroundColor =
        this.state.backgroundColor;

      element.style.fontWeight =
        this.state.fontWeight;

      element.style.textAlign =
        this.state.textAlign;

      element.style.whiteSpace =
        "pre-wrap";

      element.style.overflowWrap =
        "anywhere";
    });

    document.dispatchEvent(
      new CustomEvent(
        "satvika:headline-changed",
        {
          detail: this.getValue()
        }
      )
    );
  }

  getValue() {
    return {
      ...this.state
    };
  }

  loadValue(value = {}) {
    this.state = {
      ...this.state,
      ...value
    };

    if (this.input) {
      this.input.value = this.state.text;
    }

    this.apply();
  }
}

export default HeadlineController;
