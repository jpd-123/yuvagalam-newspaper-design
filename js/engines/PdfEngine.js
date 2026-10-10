/**
 * Satvika Publisher
 * File: js/engines/PdfEngine.js
 *
 * Responsibility:
 * - Prepare printable newspaper pages.
 * - Open a print-ready document.
 * - Provide browser-based Save as PDF workflow.
 *
 * Note:
 * - This engine does not promise a specific PDF file size.
 * - Exact PDF size control requires a compression/export pipeline.
 */

export class PdfEngine {
  constructor(options = {}) {
    this.documentTitle =
      options.documentTitle || "Satvika Publisher";

    this.defaultPaperSize = options.paperSize || "A3";
  }

  validatePages(pages) {
    if (!Array.isArray(pages) || pages.length === 0) {
      throw new Error("PDF కోసం కనీసం ఒక పేజీ అవసరం.");
    }

    return true;
  }

  createPrintDocument(options = {}) {
    const pages = options.pages || [];

    this.validatePages(pages);

    const paperSize = options.paperSize || this.defaultPaperSize;

    const pageDimensions = this.getPaperCSS(paperSize);

    const printWindow = window.open(
      "",
      "_blank",
      "noopener,noreferrer"
    );

    if (!printWindow) {
      throw new Error(
        "ప్రింట్ విండో తెరవబడలేదు. బ్రౌజర్ Pop-up అనుమతులను పరిశీలించండి."
      );
    }

    const html = this.buildHTML(
      pages,
      pageDimensions,
      options
    );

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    return printWindow;
  }

  getPaperCSS(paperSize) {
    const sizes = {
      A3: "297mm 420mm",
      A4: "210mm 297mm",
      Broadsheet: "375mm 600mm",
      "District tabloid": "280mm 430mm",
      Medium: "250mm 350mm"
    };

    return sizes[paperSize] || sizes.A3;
  }

  buildHTML(pages, pageDimensions, options = {}) {
    const title = this.escapeHTML(
      options.title || this.documentTitle
    );

    const pageHTML = pages
      .map((page, index) => {
        const content =
          typeof page.html === "string"
            ? page.html
            : "";

        return `
          <section class="newspaper-page">
            ${content}
          </section>
        `;
      })
      .join("\n");

    return `<!DOCTYPE html>
<html lang="te">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>

  <style>
    @page {
      size: ${pageDimensions};
      margin: 0;
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #111111;
    }

    body {
      font-family: "Gautami", "Noto Sans Telugu", sans-serif;
    }

    .newspaper-page {
      position: relative;
      width: 100%;
      min-height: 100vh;
      padding: 10mm;
      overflow: hidden;
      background: #ffffff;
      page-break-after: always;
      break-after: page;
    }

    .newspaper-page:last-child {
      page-break-after: auto;
      break-after: auto;
    }

    img {
      max-width: 100%;
    }

    @media print {
      html,
      body {
        margin: 0;
        padding: 0;
      }

      .newspaper-page {
        width: 100%;
        min-height: 0;
        height: 100%;
        padding: 10mm;
        overflow: hidden;
      }
    }
  </style>
</head>

<body>
  ${pageHTML}

  <script>
    window.addEventListener("load", function () {
      document.fonts.ready.then(function () {
        setTimeout(function () {
          window.focus();
          window.print();
        }, 300);
      });
    });
  </script>
</body>
</html>`;
  }

  escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  async exportCanvasPages(canvases, options = {}) {
    if (!Array.isArray(canvases) || canvases.length === 0) {
      throw new Error("PDF కోసం Canvas పేజీలు అవసరం.");
    }

    const pages = [];

    for (const canvas of canvases) {
      if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error("చెల్లని Canvas పేజీ గుర్తించబడింది.");
      }

      const dataURL = canvas.toDataURL("image/png");

      pages.push({
        html: `
          <div style="
            width:100%;
            height:100%;
            display:flex;
            align-items:center;
            justify-content:center;
          ">
            <img
              src="${dataURL}"
              alt="Newspaper page"
              style="width:100%;height:auto;object-fit:contain;"
            >
          </div>
        `
      });
    }

    return this.createPrintDocument({
      pages,
      paperSize: options.paperSize || this.defaultPaperSize,
      title: options.title || this.documentTitle
    });
  }
}

export default PdfEngine;
      
