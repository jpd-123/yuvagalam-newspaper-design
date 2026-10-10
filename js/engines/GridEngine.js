/**
 * Satvika Publisher
 * File: js/engines/GridEngine.js
 *
 * Responsibility:
 * - Calculate newspaper grid positions.
 * - Detect overlapping boxes.
 * - Calculate flexible box dimensions.
 */

export class GridEngine {
  constructor(options = {}) {
    this.columns = Math.max(
      1,
      Number(options.columns) || 5
    );

    this.gap = Math.max(
      0,
      Number(options.gap) || 4
    );

    this.margin = Math.max(
      0,
      Number(options.margin) || 10
    );
  }

  calculateGrid(options = {}) {
    const pageWidth = Number(options.pageWidth);
    const pageHeight = Number(options.pageHeight);

    const columns = Math.max(
      1,
      Number(options.columns) || this.columns
    );

    const margin = Math.max(
      0,
      Number(options.margin ?? this.margin)
    );

    const gap = Math.max(
      0,
      Number(options.gap ?? this.gap)
    );

    if (
      !Number.isFinite(pageWidth) ||
      !Number.isFinite(pageHeight) ||
      pageWidth <= 0 ||
      pageHeight <= 0
    ) {
      throw new Error("గ్రిడ్ కోసం పేజీ కొలతలు సరిగ్గా ఇవ్వాలి.");
    }

    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;

    const columnWidth =
      (usableWidth - gap * (columns - 1)) / columns;

    if (columnWidth <= 0 || usableHeight <= 0) {
      throw new Error("గ్రిడ్ కొలతలు సరిగ్గా లేవు.");
    }

    return {
      pageWidth,
      pageHeight,
      columns,
      margin,
      gap,
      usableWidth,
      usableHeight,
      columnWidth,
      columnPositions: Array.from(
        { length: columns },
        (_, index) => margin + index * (columnWidth + gap)
      )
    };
  }

  getBoxPosition(grid, column, row, options = {}) {
    const span = Math.min(
      grid.columns,
      Math.max(1, Number(options.columnSpan) || 1)
    );

    const rowHeight = Math.max(
      1,
      Number(options.rowHeight) || 100
    );

    const columnIndex = Math.min(
      grid.columns - span,
      Math.max(0, Number(column) || 0)
    );

    const rowIndex = Math.max(0, Number(row) || 0);

    const width =
      span * grid.columnWidth +
      (span - 1) * grid.gap;

    return {
      x: grid.columnPositions[columnIndex],
      y: grid.margin + rowIndex * (rowHeight + grid.gap),
      width,
      height: rowHeight,
      column: columnIndex,
      row: rowIndex,
      columnSpan: span
    };
  }

  detectOverlaps(boxes = []) {
    const overlaps = [];

    for (let i = 0; i < boxes.length; i += 1) {
      for (let j = i + 1; j < boxes.length; j += 1) {
        const a = boxes[i];
        const b = boxes[j];

        if (this.intersects(a, b)) {
          overlaps.push({
            firstId: a.id || i,
            secondId: b.id || j
          });
        }
      }
    }

    return overlaps;
  }

  intersects(a, b) {
    const ax = Number(a.x) || 0;
    const ay = Number(a.y) || 0;
    const aw = Math.max(0, Number(a.width) || 0);
    const ah = Math.max(0, Number(a.height) || 0);

    const bx = Number(b.x) || 0;
    const by = Number(b.y) || 0;
    const bw = Math.max(0, Number(b.width) || 0);
    const bh = Math.max(0, Number(b.height) || 0);

    return (
      ax < bx + bw &&
      ax + aw > bx &&
      ay < by + bh &&
      ay + ah > by
    );
  }

  clampBox(box, pageWidth, pageHeight) {
    const width = Math.min(
      Math.max(1, Number(box.width) || 1),
      pageWidth
    );

    const height = Math.min(
      Math.max(1, Number(box.height) || 1),
      pageHeight
    );

    const x = Math.min(
      Math.max(0, Number(box.x) || 0),
      pageWidth - width
    );

    const y = Math.min(
      Math.max(0, Number(box.y) || 0),
      pageHeight - height
    );

    return {
      ...box,
      x,
      y,
      width,
      height
    };
  }
}

export default GridEngine;
