/**
 * Satvika Publisher
 * File: js/engines/CanvasEngine.js
 *
 * Responsibility:
 * - Manage the newspaper canvas.
 * - Calculate canvas dimensions.
 * - Draw basic page elements, text and images.
 * - Export canvas as an image.
 */

import { PAPER_SIZES } from "../config/paper-sizes.js";

export class CanvasEngine {
  constructor(canvas, options = {}) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error("CanvasEngine కు చెల్లుబాటు అయ్యే Canvas అవసరం.");
    }

    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    if (!this.context) {
      throw new Error("Canvas 2D context అందుబాటులో లేదు.");
    }

    this.dpi = Number(options.dpi) || 96;
    this.backgroundColor = options.backgroundColor || "#ffffff";

    this.paperSize = null;
    this.pageWidth = 0;
    this.pageHeight = 0;

    this.scale = 1;
    this.elements = [];
  }

  /**
   * Configure paper dimensions.
   *
   * Dimensions are expressed in millimetres.
   */
  setPaperSize(paperSize) {
    const definition = this.getPaperDefinition(paperSize);

    if (!definition) {
      throw new Error(`తెలియని పేపర్ సైజు: ${paperSize}`);
    }

    this.paperSize = paperSize;

    this.pageWidth = Number(definition.width);
    this.pageHeight = Number(definition.height);

    if (
      !Number.isFinite(this.pageWidth) ||
      !Number.isFinite(this.pageHeight) ||
      this.pageWidth <= 0 ||
      this.pageHeight <= 0
    ) {
      throw new Error("పేపర్ కొలతలు సరిగ్గా లేవు.");
    }

    this.resizeCanvas();

    return this.getDimensions();
  }

  getPaperDefinition(paperSize) {
    const sizes = PAPER_SIZES || {};

    if (Array.isArray(sizes)) {
      return sizes.find(
        (item) =>
          item.id === paperSize ||
          item.name === paperSize ||
          item.label === paperSize
      );
    }

    return sizes[paperSize] || null;
  }

  millimetresToPixels(mm) {
    return (Number(mm) / 25.4) * this.dpi;
  }

  resizeCanvas() {
    if (!this.pageWidth || !this.pageHeight) {
      return;
    }

    this.canvas.width = Math.round(
      this.millimetresToPixels(this.pageWidth)
    );

    this.canvas.height = Math.round(
      this.millimetresToPixels(this.pageHeight)
    );

    this.render();
  }

  getDimensions() {
    return {
      paperSize: this.paperSize,
      widthMM: this.pageWidth,
      heightMM: this.pageHeight,
      widthPX: this.canvas.width,
      heightPX: this.canvas.height,
      dpi: this.dpi
    };
  }

  clear() {
    this.context.save();

    this.context.setTransform(1, 0, 0, 1, 0, 0);

    this.context.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    this.context.fillStyle = this.backgroundColor;

    this.context.fillRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    this.context.restore();
  }

  setElements(elements = []) {
    if (!Array.isArray(elements)) {
      throw new TypeError("Canvas elements తప్పనిసరిగా Array కావాలి.");
    }

    this.elements = elements;
    this.render();
  }

  addElement(element) {
    if (!element || typeof element !== "object") {
      throw new TypeError("చెల్లుబాటు అయ్యే Element ఇవ్వండి.");
    }

    this.elements.push(element);
    this.render();
  }

  removeElement(elementId) {
    this.elements = this.elements.filter(
      (element) => element.id !== elementId
    );

    this.render();
  }

  render() {
    this.clear();

    for (const element of this.elements) {
      try {
        this.drawElement(element);
      } catch (error) {
        console.error("Canvas element గీయడంలో సమస్య:", error);
      }
    }
  }

  drawElement(element) {
    if (!element || typeof element !== "object") {
      return;
    }

    const ctx = this.context;

    const x = Number(element.x) || 0;
    const y = Number(element.y) || 0;
    const width = Number(element.width) || 0;
    const height = Number(element.height) || 0;

    ctx.save();

    if (element.type === "text") {
      this.drawText(element, x, y, width, height);
    } else if (element.type === "rectangle") {
      ctx.fillStyle = element.backgroundColor || "#ffffff";

      ctx.fillRect(x, y, width, height);

      if (element.borderColor) {
        ctx.strokeStyle = element.borderColor;
        ctx.lineWidth = Number(element.borderWidth) || 1;

        ctx.strokeRect(x, y, width, height);
      }
    } else if (element.type === "line") {
      ctx.strokeStyle = element.color || "#000000";
      ctx.lineWidth = Number(element.lineWidth) || 1;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y + height);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawText(element, x, y, width, height) {
    const ctx = this.context;

    const fontSize = Number(element.fontSize) || 18;
    const fontFamily = element.fontFamily || "Gautami";

    ctx.font = `${element.fontWeight || "normal"} ${fontSize}px "${fontFamily}"`;

    ctx.fillStyle = element.color || "#222222";
    ctx.textBaseline = "top";

    if (element.backgroundColor) {
      ctx.fillStyle = element.backgroundColor;
      ctx.fillRect(x, y, width, height);

      ctx.fillStyle = element.color || "#222222";
    }

    const text = String(element.text || "");
    const lines = text.split("\n");
    const lineHeight = Number(element.lineHeight) || fontSize * 1.35;

    let currentY = y;

    for (const line of lines) {
      if (height > 0 && currentY - y + lineHeight > height) {
        break;
      }

      ctx.fillText(line, x, currentY, width || undefined);
      currentY += lineHeight;
    }
  }

  async drawImage(imageSource, x, y, width, height) {
    const image = await this.loadImage(imageSource);

    this.context.drawImage(
      image,
      Number(x) || 0,
      Number(y) || 0,
      Number(width) || image.width,
      Number(height) || image.height
    );

    return true;
  }

  loadImage(source) {
    return new Promise((resolve, reject) => {
      if (source instanceof HTMLImageElement && source.complete) {
        resolve(source);
        return;
      }

      const image = new Image();

      image.onload = () => resolve(image);
      image.onerror = () => reject(
        new Error("ఫొటోను లోడ్ చేయలేకపోయాం.")
      );

      image.src =
        source instanceof HTMLImageElement ? source.src : String(source);
    });
  }

  exportPNG(options = {}) {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("PNG ఫైల్ రూపొందించలేకపోయాం."));
            return;
          }

          resolve(blob);
        },
        "image/png",
        options.quality
      );
    });
  }

  downloadPNG(filename = "satvika-newspaper-page.png") {
    const link = document.createElement("a");

    link.download = filename;
    link.href = this.canvas.toDataURL("image/png");

    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

export default CanvasEngine;
