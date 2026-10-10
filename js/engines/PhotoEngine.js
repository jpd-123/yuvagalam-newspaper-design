/**
 * Satvika Publisher
 * File: js/engines/PhotoEngine.js
 *
 * Responsibility:
 * - Load image files.
 * - Calculate fit and crop dimensions.
 * - Draw photos using supported shapes.
 * - Export resized image blobs.
 */

export class PhotoEngine {
  constructor(options = {}) {
    this.maxFileSize = Number(options.maxFileSize) || 10 * 1024 * 1024;
    this.allowedTypes = options.allowedTypes || [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];
  }

  validateFile(file) {
    if (!(file instanceof File)) {
      throw new Error("చెల్లుబాటు అయ్యే ఫొటో ఫైల్ ఎంచుకోండి.");
    }

    if (!this.allowedTypes.includes(file.type)) {
      throw new Error("JPG, PNG లేదా WebP ఫొటోలను మాత్రమే ఉపయోగించండి.");
    }

    if (file.size > this.maxFileSize) {
      throw new Error("ఫొటో పరిమాణం అనుమతించిన పరిమితిని మించింది.");
    }

    return true;
  }

  loadFile(file) {
    this.validateFile(file);

    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();

      image.onload = () => {
        URL.revokeObjectURL(url);

        resolve({
          image,
          width: image.naturalWidth,
          height: image.naturalHeight,
          name: file.name,
          type: file.type,
          size: file.size
        });
      };

      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("ఫొటోను తెరవలేకపోయాం."));
      };

      image.src = url;
    });
  }

  calculateFit(sourceWidth, sourceHeight, boxWidth, boxHeight) {
    const scale = Math.min(
      boxWidth / sourceWidth,
      boxHeight / sourceHeight
    );

    const width = sourceWidth * scale;
    const height = sourceHeight * scale;

    return {
      x: (boxWidth - width) / 2,
      y: (boxHeight - height) / 2,
      width,
      height,
      scale
    };
  }

  calculateCover(sourceWidth, sourceHeight, boxWidth, boxHeight) {
    const scale = Math.max(
      boxWidth / sourceWidth,
      boxHeight / sourceHeight
    );

    const width = sourceWidth * scale;
    const height = sourceHeight * scale;

    return {
      x: (boxWidth - width) / 2,
      y: (boxHeight - height) / 2,
      width,
      height,
      scale
    };
  }

  draw(context, image, box, options = {}) {
    if (!context || !image || !box) {
      throw new Error("ఫొటో గీయడానికి అవసరమైన వివరాలు లేవు.");
    }

    const x = Number(box.x) || 0;
    const y = Number(box.y) || 0;
    const width = Math.max(1, Number(box.width) || 1);
    const height = Math.max(1, Number(box.height) || 1);

    const mode = options.mode || "cover";
    const shape = options.shape || "rectangle";

    context.save();
    context.beginPath();

    this.createClipPath(
      context,
      shape,
      x,
      y,
      width,
      height
    );

    context.clip();

    const dimensions =
      mode === "contain"
        ? this.calculateFit(
            image.naturalWidth || image.width,
            image.naturalHeight || image.height,
            width,
            height
          )
        : this.calculateCover(
            image.naturalWidth || image.width,
            image.naturalHeight || image.height,
            width,
            height
          );

    context.drawImage(
      image,
      x + dimensions.x,
      y + dimensions.y,
      dimensions.width,
      dimensions.height
    );

    context.restore();

    return dimensions;
  }

  createClipPath(context, shape, x, y, width, height) {
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

      case "egg":
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

      default:
        context.rect(x, y, width, height);
    }
  }

  resizeImage(image, options = {}) {
    const maxWidth = Math.max(
      1,
      Number(options.maxWidth) || 1200
    );

    const maxHeight = Math.max(
      1,
      Number(options.maxHeight) || 1200
    );

    const scale = Math.min(
      1,
      maxWidth / image.naturalWidth,
      maxHeight / image.naturalHeight
    );

    const width = Math.max(
      1,
      Math.round(image.naturalWidth * scale)
    );

    const height = Math.max(
      1,
      Math.round(image.naturalHeight * scale)
    );

    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("ఫొటో రీసైజ్ చేయడానికి Canvas అందుబాటులో లేదు.");
    }

    context.drawImage(image, 0, 0, width, height);

    const type = options.type || "image/jpeg";
    const quality = Math.min(
      1,
      Math.max(0.1, Number(options.quality) || 0.85)
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("రీసైజ్ చేసిన ఫొటోను సేవ్ చేయలేకపోయాం."));
            return;
          }

          resolve({
            blob,
            width,
            height,
            type
          });
        },
        type,
        quality
      );
    });
  }
}

export default PhotoEngine;
