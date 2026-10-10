/**
 * Satvika Publisher
 * File: js/engines/NewsShapeEngine.js
 *
 * Responsibility:
 * - Calculate news box shapes.
 * - Draw supported shapes on Canvas.
 * - Provide hit-testing for selection.
 */

export class NewsShapeEngine {
  constructor() {
    this.supportedShapes = [
      "square",
      "circle",
      "ball",
      "egg",
      "half-egg-left",
      "half-egg-right"
    ];
  }

  normalizeShape(shape) {
    const value = String(shape || "square")
      .trim()
      .toLowerCase();

    return this.supportedShapes.includes(value)
      ? value
      : "square";
  }

  getBounds(box) {
    const x = Number(box.x) || 0;
    const y = Number(box.y) || 0;
    const width = Math.max(0, Number(box.width) || 0);
    const height = Math.max(0, Number(box.height) || 0);

    return { x, y, width, height };
  }

  draw(context, box) {
    if (!context || !box) {
      throw new Error("Shape గీయడానికి Context, Box అవసరం.");
    }

    const bounds = this.getBounds(box);
    const shape = this.normalizeShape(box.shape);

    context.save();
    context.beginPath();

    this.createPath(context, shape, bounds);

    context.fillStyle = box.backgroundColor || "#ffffff";
    context.fill();

    if (box.borderColor) {
      context.strokeStyle = box.borderColor;
      context.lineWidth = Number(box.borderWidth) || 1;
      context.stroke();
    }

    context.restore();

    return bounds;
  }

  createPath(context, shape, bounds) {
    const { x, y, width, height } = bounds;

    switch (shape) {
      case "circle":
      case "ball": {
        const radius = Math.min(width, height) / 2;

        context.ellipse(
          x + width / 2,
          y + height / 2,
          radius,
          radius,
          0,
          0,
          Math.PI * 2
        );
        break;
      }

      case "egg": {
        context.ellipse(
          x + width / 2,
          y + height / 2,
          width / 2,
          height / 2,
          0,
          0,
          Math.PI * 2
        );
        break;
      }

      case "half-egg-left": {
        context.moveTo(x + width, y);
        context.lineTo(x + width, y + height);
        context.lineTo(x + width / 2, y + height);
        context.ellipse(
          x + width / 2,
          y + height / 2,
          width / 2,
          height / 2,
          0,
          Math.PI / 2,
          Math.PI * 1.5
        );
        context.closePath();
        break;
      }

      case "half-egg-right": {
        context.moveTo(x, y);
        context.lineTo(x, y + height);
        context.lineTo(x + width / 2, y + height);
        context.ellipse(
          x + width / 2,
          y + height / 2,
          width / 2,
          height / 2,
          0,
          Math.PI / 2,
          -Math.PI / 2,
          true
        );
        context.closePath();
        break;
      }

      case "square":
      default:
        context.rect(x, y, width, height);
        break;
    }
  }

  containsPoint(box, pointX, pointY) {
    const bounds = this.getBounds(box);
    const shape = this.normalizeShape(box.shape);

    const { x, y, width, height } = bounds;

    if (
      pointX < x ||
      pointY < y ||
      pointX > x + width ||
      pointY > y + height
    ) {
      return false;
    }

    if (shape === "square") {
      return true;
    }

    if (shape === "circle" || shape === "ball") {
      const radius = Math.min(width, height) / 2;
      const centerX = x + width / 2;
      const centerY = y + height / 2;

      const dx = pointX - centerX;
      const dy = pointY - centerY;

      return dx * dx + dy * dy <= radius * radius;
    }

    const normalizedX = (pointX - x) / Math.max(width, 1);
    const normalizedY = (pointY - y) / Math.max(height, 1);

    const ellipseValue =
      ((normalizedX - 0.5) ** 2) / 0.25 +
      ((normalizedY - 0.5) ** 2) / 0.25;

    if (shape === "egg") {
      return ellipseValue <= 1;
    }

    if (shape === "half-egg-left") {
      return normalizedX <= 0.5 || ellipseValue <= 1;
    }

    if (shape === "half-egg-right") {
      return normalizedX >= 0.5 || ellipseValue <= 1;
    }

    return true;
  }

  createShapeBox(options = {}) {
    return {
      id: options.id || crypto.randomUUID(),
      type: "news",
      shape: this.normalizeShape(options.shape),
      x: Number(options.x) || 0,
      y: Number(options.y) || 0,
      width: Math.max(1, Number(options.width) || 100),
      height: Math.max(1, Number(options.height) || 100),
      backgroundColor: options.backgroundColor || "#ffffff",
      borderColor: options.borderColor || "#777777",
      borderWidth: Number(options.borderWidth) || 1
    };
  }
}

export default NewsShapeEngine;
