/**
 * Satvika Publisher
 * File: js/calculators/PageMeasurementCalculator.js
 *
 * Responsibility:
 * - Calculate paper and page dimensions.
 * - Convert between millimetres, centimetres and pixels.
 * - Calculate margins, printable area and column dimensions.
 * - Support newspaper paper-size presets.
 *
 * This file performs calculations only.
 * It does not modify master layouts or daily editions.
 */

const DEFAULT_DPI = 96;

const DEFAULT_MARGINS = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10
};

const BUILT_IN_PAPER_SIZES = {
  A3: {
    name: "A3",
    width: 297,
    height: 420
  },

  A4: {
    name: "A4",
    width: 210,
    height: 297
  },

  Broadsheet: {
    name: "Broadsheet",
    width: 375,
    height: 600
  },

  "District tabloid": {
    name: "District tabloid",
    width: 280,
    height: 430
  },

  Medium: {
    name: "Medium",
    width: 250,
    height: 350
  }
};

export class PageMeasurementCalculator {
  constructor(options = {}) {
    this.dpi = this.validatePositiveNumber(
      options.dpi ?? DEFAULT_DPI,
      "DPI"
    );

    this.defaultMargins = {
      ...DEFAULT_MARGINS,
      ...(options.margins || {})
    };

    this.paperSizes = {
      ...BUILT_IN_PAPER_SIZES,
      ...(options.paperSizes || {})
    };
  }

  /**
   * Validate a positive number.
   */
  validatePositiveNumber(value, label = "Value") {
    const number = Number(value);

    if (!Number.isFinite(number) || number <= 0) {
      throw new Error(`${label} తప్పనిసరిగా సున్నా కంటే ఎక్కువగా ఉండాలి.`);
    }

    return number;
  }

  /**
   * Convert millimetres to centimetres.
   */
  mmToCm(mm) {
    return Number(mm) / 10;
  }

  /**
   * Convert centimetres to millimetres.
   */
  cmToMm(cm) {
    return Number(cm) * 10;
  }

  /**
   * Convert millimetres to inches.
   */
  mmToInches(mm) {
    return Number(mm) / 25.4;
  }

  /**
   * Convert inches to millimetres.
   */
  inchesToMm(inches) {
    return Number(inches) * 25.4;
  }

  /**
   * Convert millimetres to pixels.
   */
  mmToPixels(mm, dpi = this.dpi) {
    const validDpi = this.validatePositiveNumber(dpi, "DPI");

    return (Number(mm) / 25.4) * validDpi;
  }

  /**
   * Convert pixels to millimetres.
   */
  pixelsToMm(pixels, dpi = this.dpi) {
    const validDpi = this.validatePositiveNumber(dpi, "DPI");

    return (Number(pixels) / validDpi) * 25.4;
  }

  /**
   * Return a copy of a known paper-size definition.
   */
  getPaperSize(paperSize) {
    const definition = this.paperSizes[paperSize];

    if (!definition) {
      throw new Error(`తెలియని పేపర్ సైజు: ${paperSize}`);
    }

    return {
      name: definition.name || paperSize,
      width: this.validatePositiveNumber(
        definition.width,
        "Paper width"
      ),
      height: this.validatePositiveNumber(
        definition.height,
        "Paper height"
      )
    };
  }

  /**
   * Calculate the complete page dimensions.
   *
   * All measurements returned here use millimetres,
   * except properties explicitly ending with PX.
   */
  calculatePage(paperSize, options = {}) {
    const paper = this.getPaperSize(paperSize);

    const margins = this.normalizeMargins(
      options.margins || this.defaultMargins
    );

    const printableWidth =
      paper.width - margins.left - margins.right;

    const printableHeight =
      paper.height - margins.top - margins.bottom;

    if (printableWidth <= 0 || printableHeight <= 0) {
      throw new Error(
        "పేజీ మార్జిన్లు ఎక్కువగా ఉన్నాయి. మార్జిన్లను తగ్గించండి."
      );
    }

    return {
      paperSize: paper.name,

      pageWidthMM: paper.width,
      pageHeightMM: paper.height,

      pageWidthCM: this.mmToCm(paper.width),
      pageHeightCM: this.mmToCm(paper.height),

      pageWidthPX: Math.round(
        this.mmToPixels(paper.width)
      ),

      pageHeightPX: Math.round(
        this.mmToPixels(paper.height)
      ),

      margins,

      printableWidthMM: printableWidth,
      printableHeightMM: printableHeight,

      printableWidthPX: Math.round(
        this.mmToPixels(printableWidth)
      ),

      printableHeightPX: Math.round(
        this.mmToPixels(printableHeight)
      ),

      dpi: this.dpi
    };
  }

  /**
   * Normalize margins and ensure they are non-negative.
   */
  normalizeMargins(margins = {}) {
    const result = {
      top: Number(margins.top ?? 0),
      right: Number(margins.right ?? 0),
      bottom: Number(margins.bottom ?? 0),
      left: Number(margins.left ?? 0)
    };

    for (const [key, value] of Object.entries(result)) {
      if (!Number.isFinite(value) || value < 0) {
        throw new Error(
          `చెల్లని ${key} margin ఇచ్చారు.`
        );
      }
    }

    return result;
  }

  /**
   * Calculate newspaper column measurements.
   *
   * Example:
   * calculateColumns("A3", 5, { gap: 4 })
   */
  calculateColumns(paperSize, columnCount, options = {}) {
    const page = this.calculatePage(paperSize, options);

    const count = Number(columnCount);
    const gap = Number(options.gap ?? 3);

    if (!Number.isInteger(count) || count < 1 || count > 16) {
      throw new Error(
        "కాలమ్‌ల సంఖ్య 1 నుంచి 16 మధ్య ఉండాలి."
      );
    }

    if (!Number.isFinite(gap) || gap < 0) {
      throw new Error(
        "కాలమ్‌ల మధ్య ఖాళీ సున్నా లేదా అంతకంటే ఎక్కువగా ఉండాలి."
      );
    }

    const totalGap = gap * (count - 1);

    const availableWidth =
      page.printableWidthMM - totalGap;

    if (availableWidth <= 0) {
      throw new Error(
        "కాలమ్‌ల మధ్య ఖాళీ కారణంగా ఉపయోగించగల వెడల్పు సరిపోవడం లేదు."
      );
    }

    const columnWidth = availableWidth / count;

    return {
      paperSize,
      columnCount: count,
      columnGapMM: gap,
      totalGapMM: totalGap,
      columnWidthMM: columnWidth,
      columnWidthPX: Math.round(
        this.mmToPixels(columnWidth)
      ),
      printableWidthMM: page.printableWidthMM
    };
  }

  /**
   * Calculate a box's area in square millimetres.
   */
  calculateArea(width, height) {
    const validWidth = this.validatePositiveNumber(
      width,
      "Width"
    );

    const validHeight = this.validatePositiveNumber(
      height,
      "Height"
    );

    return validWidth * validHeight;
  }

  /**
   * Calculate a rectangle's perimeter.
   */
  calculatePerimeter(width, height) {
    const validWidth = this.validatePositiveNumber(
      width,
      "Width"
    );

    const validHeight = this.validatePositiveNumber(
      height,
      "Height"
    );

    return 2 * (validWidth + validHeight);
  }

  /**
   * Check whether a box fits inside a page.
   */
  fitsInsidePage(box, pageWidth, pageHeight) {
    const x = Number(box.x ?? 0);
    const y = Number(box.y ?? 0);
    const width = Number(box.width);
    const height = Number(box.height);

    if (
      ![x, y, width, height, pageWidth, pageHeight].every(
        Number.isFinite
      ) ||
      width <= 0 ||
      height <= 0 ||
      pageWidth <= 0 ||
      pageHeight <= 0
    ) {
      return false;
    }

    return (
      x >= 0 &&
      y >= 0 &&
      x + width <= pageWidth &&
      y + height <= pageHeight
    );
  }

  /**
   * Return all supported paper sizes.
   */
  getSupportedPaperSizes() {
    return Object.entries(this.paperSizes).map(
      ([key, value]) => ({
        id: key,
        name: value.name || key,
        width: value.width,
        height: value.height
      })
    );
  }
}

export default PageMeasurementCalculator;
