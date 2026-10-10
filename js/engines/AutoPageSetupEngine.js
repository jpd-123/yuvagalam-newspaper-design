/**
 * Satvika Publisher
 * File: js/engines/AutoPageSetupEngine.js
 *
 * Responsibility:
 * - Prepare page layout when explicitly requested.
 * - Estimate news box dimensions.
 * - Return layout suggestions without silently overwriting master layouts.
 */

export class AutoPageSetupEngine {
  constructor(options = {}) {
    this.margin = Number(options.margin) || 12;
    this.gap = Number(options.gap) || 6;
    this.headerHeight = Number(options.headerHeight) || 35;
    this.footerHeight = Number(options.footerHeight) || 12;
  }

  setupPage(page, options = {}) {
    if (!page || typeof page !== "object") {
      throw new Error("Auto Page Setup కు చెల్లుబాటు అయ్యే Page అవసరం.");
    }

    const pageWidth = Number(options.pageWidth);
    const pageHeight = Number(options.pageHeight);

    if (
      !Number.isFinite(pageWidth) ||
      !Number.isFinite(pageHeight) ||
      pageWidth <= 0 ||
      pageHeight <= 0
    ) {
      throw new Error("పేజీ వెడల్పు, ఎత్తు సరిగ్గా ఇవ్వాలి.");
    }

    const columns = Math.min(
      16,
      Math.max(1, Number(options.columns) || 5)
    );

    const margin = Math.max(
      0,
      Number(options.margin ?? this.margin)
    );

    const gap = Math.max(
      0,
      Number(options.gap ?? this.gap)
    );

    const availableWidth = pageWidth - margin * 2;
    const availableHeight =
      pageHeight -
      margin * 2 -
      Number(options.headerHeight ?? this.headerHeight) -
      Number(options.footerHeight ?? this.footerHeight);

    if (availableWidth <= 0 || availableHeight <= 0) {
      throw new Error("పేజీ మార్జిన్లు లేదా హెడర్ కొలతలు సరిగా లేవు.");
    }

    const columnWidth =
      (availableWidth - gap * (columns - 1)) / columns;

    const news = Array.isArray(page.news) ? page.news : [];

    const boxes = [];
    let currentY =
      margin + Number(options.headerHeight ?? this.headerHeight);

    let currentColumn = 0;
    let rowHeight = 0;

    const orderedNews = [...news];

    for (const item of orderedNews) {
      const preferredColumns = Math.min(
        columns,
        Math.max(1, Number(item.columnSpan) || 1)
      );

      const preferredHeight = Math.max(
        30,
        Number(item.height) || 100
      );

      if (currentColumn + preferredColumns > columns) {
        currentColumn = 0;
        currentY += rowHeight + gap;
        rowHeight = 0;
      }

      const boxWidth =
        preferredColumns * columnWidth +
        (preferredColumns - 1) * gap;

      if (currentY + preferredHeight > pageHeight - margin) {
        boxes.push({
          newsId: item.id,
          overflow: true,
          reason: "INSUFFICIENT_PAGE_SPACE"
        });

        continue;
      }

      boxes.push({
        newsId: item.id,
        x: margin + currentColumn * (columnWidth + gap),
        y: currentY,
        width: boxWidth,
        height: preferredHeight,
        shape: item.shape || "square",
        overflow: false
      });

      currentColumn += preferredColumns;
      rowHeight = Math.max(rowHeight, preferredHeight);

      if (currentColumn >= columns) {
        currentColumn = 0;
        currentY += rowHeight + gap;
        rowHeight = 0;
      }
    }

    return {
      pageId: page.id || null,
      pageWidth,
      pageHeight,
      columns,
      margin,
      gap,
      availableWidth,
      availableHeight,
      columnWidth,
      boxes,
      remainingSpace: Math.max(
        0,
        pageHeight - margin - currentY - rowHeight
      ),
      overflowNewsIds: boxes
        .filter((box) => box.overflow)
        .map((box) => box.newsId)
    };
  }

  applyLayout(page, layout) {
    if (!page || !layout || !Array.isArray(layout.boxes)) {
      throw new Error("చెల్లుబాటు అయ్యే Page, Layout అవసరం.");
    }

    const positions = new Map(
      layout.boxes
        .filter((box) => !box.overflow)
        .map((box) => [box.newsId, box])
    );

    const updatedNews = (page.news || []).map((item) => {
      const position = positions.get(item.id);

      if (!position) {
        return { ...item };
      }

      return {
        ...item,
        layout: {
          ...(item.layout || {}),
          x: position.x,
          y: position.y,
          width: position.width,
          height: position.height,
          shape: position.shape
        }
      };
    });

    return {
      ...page,
      news: updatedNews
    };
  }
}

export default AutoPageSetupEngine;
