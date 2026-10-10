/**
 * Satvika Publisher
 * File: js/calculators/RemainingSpaceCalculator.js
 *
 * Responsibility:
 * - Calculate available page space.
 * - Calculate occupied and remaining vertical space.
 * - Detect boxes outside the printable area.
 * - Estimate whether additional news can fit.
 * - Report overlaps between layout boxes.
 *
 * This file does not move, delete or resize news.
 */

export class RemainingSpaceCalculator {
  constructor(options = {}) {
    this.defaultMarginTop = Math.max(
      0,
      Number(options.marginTop ?? 10)
    );

    this.defaultMarginBottom = Math.max(
      0,
      Number(options.marginBottom ?? 10)
    );

    this.defaultGap = Math.max(
      0,
      Number(options.gap ?? 4)
    );
  }

  validateDimension(value, label) {
    const number = Number(value);

    if (!Number.isFinite(number) || number <= 0) {
      throw new Error(
        `${label} సున్నా కంటే ఎక్కువగా ఉండాలి.`
      );
    }

    return number;
  }

  normalizeBox(box, index = 0) {
    const x = Number(box.x ?? 0);
    const y = Number(box.y ?? 0);
    const width = Number(box.width);
    const height = Number(box.height);

    if (
      ![x, y, width, height].every(Number.isFinite) ||
      width <= 0 ||
      height <= 0
    ) {
      throw new Error(
        `బాక్స్ ${index + 1} కొలతలు సరిగ్గా లేవు.`
      );
    }

    return {
      ...box,
      id: box.id ?? `box-${index + 1}`,
      x,
      y,
      width,
      height,
      right: x + width,
      bottom: y + height
    };
  }

  /**
   * Calculate total usable vertical space.
   */
  calculateAvailableHeight(options = {}) {
    const pageHeight = this.validateDimension(
      options.pageHeight,
      "Page height"
    );

    const marginTop = Math.max(
      0,
      Number(
        options.marginTop ??
        this.defaultMarginTop
      )
    );

    const marginBottom = Math.max(
      0,
      Number(
        options.marginBottom ??
        this.defaultMarginBottom
      )
    );

    const headerHeight = Math.max(
      0,
      Number(options.headerHeight ?? 0)
    );

    const footerHeight = Math.max(
      0,
      Number(options.footerHeight ?? 0)
    );

    const reservedHeight =
      marginTop +
      marginBottom +
      headerHeight +
      footerHeight;

    const availableHeight =
      pageHeight - reservedHeight;

    if (availableHeight < 0) {
      throw new Error(
        "హెడర్, ఫుటర్, మార్జిన్లకు కేటాయించిన స్థలం పేజీ ఎత్తును మించింది."
      );
    }

    return {
      pageHeight,
      marginTop,
      marginBottom,
      headerHeight,
      footerHeight,
      reservedHeight,
      availableHeight
    };
  }

  /**
   * Calculate remaining space from layout boxes.
   *
   * Coordinates are expected to use the same unit,
   * normally millimetres or CSS pixels.
   */
  calculateRemainingSpace(options = {}) {
    const pageWidth = this.validateDimension(
      options.pageWidth,
      "Page width"
    );

    const pageHeight = this.validateDimension(
      options.pageHeight,
      "Page height"
    );

    const marginTop = Math.max(
      0,
      Number(
        options.marginTop ??
        this.defaultMarginTop
      )
    );

    const marginBottom = Math.max(
      0,
      Number(
        options.marginBottom ??
        this.defaultMarginBottom
      )
    );

    const headerHeight = Math.max(
      0,
      Number(options.headerHeight ?? 0)
    );

    const footerHeight = Math.max(
      0,
      Number(options.footerHeight ?? 0)
    );

    const boxes = (options.boxes || []).map(
      (box, index) => this.normalizeBox(box, index)
    );

    const contentTop = marginTop + headerHeight;

    const contentBottom =
      pageHeight - marginBottom - footerHeight;

    const availableHeight = Math.max(
      0,
      contentBottom - contentTop
    );

    const contentBoxes = boxes.filter(
      (box) => box.bottom > contentTop &&
        box.y < contentBottom
    );

    let lowestOccupiedY = contentTop;

    for (const box of contentBoxes) {
      lowestOccupiedY = Math.max(
        lowestOccupiedY,
        box.bottom
      );
    }

    const bottomRemaining = Math.max(
      0,
      contentBottom - lowestOccupiedY
    );

    const occupiedVerticalSpan = Math.max(
      0,
      lowestOccupiedY - contentTop
    );

    const overflowBoxes = boxes.filter(
      (box) =>
        box.x < 0 ||
        box.y < 0 ||
        box.right > pageWidth ||
        box.bottom > pageHeight
    );

    const overlaps = this.detectOverlaps(boxes);

    const totalBoxArea = boxes.reduce(
      (total, box) =>
        total + box.width * box.height,
      0
    );

    const pageArea = pageWidth * pageHeight;

    return {
      pageWidth,
      pageHeight,

      contentTop,
      contentBottom,

      availableHeight,

      lowestOccupiedY,
      occupiedVerticalSpan,

      bottomRemaining,

      boxCount: boxes.length,

      totalBoxArea,
      pageArea,

      approximateAreaUsagePercent:
        pageArea > 0
          ? Math.min(
              100,
              (totalBoxArea / pageArea) * 100
            )
          : 0,

      overflowCount: overflowBoxes.length,

      overflowBoxIds: overflowBoxes.map(
        (box) => box.id
      ),

      overlapCount: overlaps.length,
      overlaps,

      isPageOverflowing:
        overflowBoxes.length > 0,

      hasBottomGap:
        bottomRemaining > 0
    };
  }

  /**
   * Detect intersections between boxes.
   */
  detectOverlaps(boxes = []) {
    const overlaps = [];

    for (let i = 0; i < boxes.length; i += 1) {
      for (let j = i + 1; j < boxes.length; j += 1) {
        const first = boxes[i];
        const second = boxes[j];

        const intersects =
          first.x < second.right &&
          first.right > second.x &&
          first.y < second.bottom &&
          first.bottom > second.y;

        if (intersects) {
          overlaps.push({
            firstId: first.id,
            secondId: second.id,

            overlapWidth: Math.max(
              0,
              Math.min(first.right, second.right) -
              Math.max(first.x, second.x)
            ),

            overlapHeight: Math.max(
              0,
              Math.min(first.bottom, second.bottom) -
              Math.max(first.y, second.y)
            )
          });
        }
      }
    }

    return overlaps;
  }

  /**
   * Estimate how much vertical space a new box requires.
   */
  canFitBox(options = {}) {
    const remaining = this.validateDimension(
      options.remainingHeight,
      "Remaining height"
    );

    const required = this.validateDimension(
      options.requiredHeight,
      "Required height"
    );

    const gap = Math.max(
      0,
      Number(options.gap ?? this.defaultGap)
    );

    const totalRequired = required + gap;

    return {
      canFit: totalRequired <= remaining,
      remainingHeight: remaining,
      requiredHeight: required,
      gap,
      totalRequired,
      shortage: Math.max(
        0,
        totalRequired - remaining
      )
    };
  }

  /**
   * Return suggested actions when the page has unused space.
   *
   * Suggestions only: no layout changes are performed.
   */
  suggestActions(result, options = {}) {
    if (!result || typeof result !== "object") {
      throw new Error(
        "స్థల విశ్లేషణ ఫలితం అవసరం."
      );
    }

    const suggestions = [];

    if (result.isPageOverflowing) {
      suggestions.push({
        action: "RESIZE_OR_REFLOW",
        priority: "high",
        message:
          "కొన్ని బాక్సులు పేజీ సరిహద్దులను దాటాయి. పరిమాణాలు లేదా లేఅవుట్ సరిచూడండి."
      });
    }

    if (result.overlapCount > 0) {
      suggestions.push({
        action: "FIX_OVERLAPS",
        priority: "high",
        message:
          "కొన్ని వార్తా బాక్సులు ఒకదానిపై మరొకటి పడుతున్నాయి."
      });
    }

    if (
      !result.isPageOverflowing &&
      result.bottomRemaining > 30
    ) {
      suggestions.push({
        action: "USE_REMAINING_SPACE",
        priority: "medium",
        message:
          "పేజీ దిగువన ఖాళీ ఉంది. అవసరాన్ని బట్టి వార్త, ప్రకటన లేదా ఖాళీని తగ్గించే ఎంపికను పరిశీలించండి."
      });
    }

    if (
      options.hasPendingNews &&
      result.bottomRemaining > 0
    ) {
      suggestions.push({
        action: "CHECK_PENDING_NEWS",
        priority: "medium",
        message:
          "మిగిలిన స్థలంలో అదనపు వార్త సరిపోతుందో NewsSizeCalculator సహాయంతో తనిఖీ చేయండి."
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        action: "NO_CHANGE",
        priority: "low",
        message:
          "ప్రస్తుతం గుర్తించిన ఓవర్‌ఫ్లో లేదా ఓవర్‌ల్యాప్ సమస్యలు లేవు."
      });
    }

    return suggestions;
  }
}

export default RemainingSpaceCalculator;
