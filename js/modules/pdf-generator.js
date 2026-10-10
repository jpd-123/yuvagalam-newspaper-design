/**
 * Satvika Publisher
 * File: js/modules/pdf-generator.js
 *
 * Responsibility:
 * - Connect PDF buttons to PdfEngine.
 * - Validate PDF export requests.
 * - Display export status.
 * - Provide print-to-PDF workflow.
 *
 * This module does not implement PDF compression.
 */

import PdfEngine from "../engines/PdfEngine.js";

export class PdfGenerator {
  constructor(options = {}) {
    this.printButtonId =
      options.printButtonId || "print-pdf-button";

    this.socialButtonId =
      options.socialButtonId || "social-pdf-button";

    this.socialSizeId =
      options.socialSizeId || "social-pdf-size";

    this.statusId =
      options.statusId || "app-status";

    this.pdfEngine =
      options.pdfEngine || new PdfEngine();

    this.getPages =
      typeof options.getPages === "function"
        ? options.getPages
        : null;

    this.getPaperSize =
      typeof options.getPaperSize === "function"
        ? options.getPaperSize
        : null;

    this.initialized = false;
  }

  initialize() {
    if (this.initialized) {
      return;
    }

    this.printButton = document.getElementById(
      this.printButtonId
    );

    this.socialButton = document.getElementById(
      this.socialButtonId
    );

    this.socialSizeInput = document.getElementById(
      this.socialSizeId
    );

    if (this.printButton) {
      this.printButton.addEventListener(
        "click",
        () => {
          this.handleExport({
            mode: "print"
          });
        }
      );
    }

    if (this.socialButton) {
      this.socialButton.addEventListener(
        "click",
        () => {
          this.handleExport({
            mode: "social"
          });
        }
      );
    }

    this.initialized = true;
  }

  async handleExport(options = {}) {
    try {
      this.setStatus(
        "PDF కోసం పేజీలను సిద్ధం చేస్తున్నాం..."
      );

      const pages = await this.obtainPages();

      if (!Array.isArray(pages) || pages.length === 0) {
        throw new Error(
          "PDF కోసం వార్తాపత్రిక పేజీలు అందుబాటులో లేవు."
        );
      }

      const paperSize = this.obtainPaperSize();

      if (options.mode === "social") {
        const requestedSizeMB =
          this.readRequestedSizeMB();

        /*
         * The selected size is validated and reported.
         * Actual size control requires a PDF compression
         * pipeline, which is not implemented here.
         */
        this.setStatus(
          `సోషల్ మీడియా PDF అభ్యర్థన సిద్ధమవుతోంది. లక్ష్య పరిమాణం: ${requestedSizeMB} MB.`
        );
      }

      const canvases = pages.every(
        (page) => page instanceof HTMLCanvasElement
      );

      let printWindow;

      if (canvases) {
        printWindow =
          await this.pdfEngine.exportCanvasPages(
            pages,
            {
              paperSize,
              title: "యువగళం - సాత్విక పబ్లిషర్"
            }
          );
      } else {
        printWindow =
          this.pdfEngine.createPrintDocument({
            pages,
            paperSize,
            title: "యువగళం - సాత్విక పబ్లిషర్"
          });
      }

      if (!printWindow) {
        throw new Error(
          "ప్రింట్ విండోను తెరవలేకపోయాం."
        );
      }

      this.setStatus(
        "ప్రింట్ విండో సిద్ధంగా ఉంది. అక్కడ Save as PDF ఎంచుకోండి."
      );

      document.dispatchEvent(
        new CustomEvent(
          "satvika:pdf-export-prepared",
          {
            detail: {
              mode: options.mode || "print",
              pageCount: pages.length,
              paperSize
            }
          }
        )
      );

      return printWindow;
    } catch (error) {
      console.error(
        "PDF export preparation failed:",
        error
      );

      this.setStatus(
        error.message ||
          "PDF సిద్ధం చేయడంలో సమస్య ఏర్పడింది.",
        "error"
      );

      document.dispatchEvent(
        new CustomEvent(
          "satvika:pdf-export-error",
          {
            detail: {
              message: error.message
            }
          }
        )
      );

      return null;
    }
  }

  async obtainPages() {
    if (!this.getPages) {
      throw new Error(
        "PDF కోసం పేజీలను అందించే getPages ఫంక్షన్ ఇంకా అనుసంధానం కాలేదు."
      );
    }

    return await this.getPages();
  }

  obtainPaperSize() {
    if (this.getPaperSize) {
      return this.getPaperSize();
    }

    const sizeInput =
      document.getElementById("paper-size");

    return sizeInput?.value || "A3";
  }

  readRequestedSizeMB() {
    const value = Number(
      this.socialSizeInput?.value ?? 10
    );

    if (
      !Number.isFinite(value) ||
      value < 1 ||
      value > 100
    ) {
      throw new Error(
        "సోషల్ మీడియా PDF లక్ష్య పరిమాణం 1 MB నుంచి 100 MB మధ్య ఉండాలి."
      );
    }

    return value;
  }

  setStatus(message, type = "info") {
    const element = document.getElementById(
      this.statusId
    );

    if (!element) {
      console.info(message);
      return;
    }

    element.textContent = String(message || "");

    element.dataset.statusType = type;

    element.setAttribute(
      "role",
      type === "error" ? "alert" : "status"
    );
  }
}

export default PdfGenerator;
