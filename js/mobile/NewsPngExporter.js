/**
 * Satvika Publisher
 * File: js/mobile/NewsPngExporter.js
 *
 * Responsibility:
 * - Export a news story as a PNG image.
 * - Display the newspaper logo.
 * - Render Telugu news text and photos.
 * - Download or share the generated PNG.
 *
 * This module does not save the news story
 * to the daily edition or master layout.
 */

export class NewsPngExporter {
  constructor(options = {}) {
    this.logoUrl = options.logoUrl || "";

    this.paperName =
      options.paperName || "యువగళం";

    this.containerId =
      options.containerId || "news-png-export-container";

    this.maxPhotos = 3;

    this.imageScale = Math.max(
      1,
      Math.min(
        3,
        Number(options.imageScale) || 2
      )
    );

    this.defaultWidth = 1080;

    this.defaultBackground = "#ffffff";

    this.rendering = false;
  }

  /**
   * Create an off-screen HTML element
   * for rendering the news image.
   */
  createNewsElement(news, options = {}) {
    const width = Math.max(
      320,
      Number(options.width) || this.defaultWidth
    );

    const root = document.createElement("article");

    root.className = "satvika-news-png";

    root.style.cssText = `
      box-sizing: border-box;
      width: ${width}px;
      padding: 32px;
      background: #ffffff;
      color: #222222;
      font-family: "Peddana", "Gautami", sans-serif;
      line-height: 1.5;
      overflow-wrap: anywhere;
      word-break: normal;
    `;

    root.setAttribute("lang", "te");

    root.appendChild(
      this.createLogoSection(options)
    );

    root.appendChild(
      this.createHeadline(news, options)
    );

    this.appendSubheadlines(
      root,
      news.subheadlines,
      options
    );

    if (news.dateline) {
      root.appendChild(
        this.createDateline(
          news.dateline,
          options
        )
      );
    }

    root.appendChild(
      this.createBody(news.body, options)
    );

    this.appendPhotos(
      root,
      news.photos,
      options
    );

    if (options.showFooter !== false) {
      root.appendChild(
        this.createFooter(options)
      );
    }

    return root;
  }

  /**
   * Create the logo and newspaper name.
   */
  createLogoSection(options = {}) {
    const header = document.createElement("header");

    header.style.cssText = `
      text-align: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #333333;
    `;

    const logoUrl = options.logoUrl || this.logoUrl;

    if (logoUrl) {
      const logo = document.createElement("img");

      logo.alt = `${this.paperName} లోగో`;

      logo.src = logoUrl;

      logo.style.cssText = `
        display: block;
        max-width: 100%;
        max-height: 130px;
        object-fit: contain;
        margin: 0 auto 10px;
      `;

      header.appendChild(logo);
    }

    const title = document.createElement("div");

    title.textContent =
      options.paperName || this.paperName;

    title.style.cssText = `
      font-family: "Peddana", "Gautami", sans-serif;
      font-size: 44px;
      font-weight: bold;
      line-height: 1.2;
    `;

    header.appendChild(title);

    return header;
  }

  /**
   * Create the main headline.
   */
  createHeadline(news, options = {}) {
    const headline = document.createElement("h1");

    headline.textContent = news.headline || "";

    headline.style.cssText = `
      margin: 0 0 18px;
      padding: 10px 12px;
      font-family: ${this.safeFont(
        options.headlineFont || "Peddana"
      )};
      font-size: ${this.safeFontSize(
        options.headlineFontSize,
        42
      )}px;
      font-weight: bold;
      line-height: 1.3;
      text-align: ${this.safeAlignment(
        options.headlineAlignment || "center"
      )};
      color: ${this.safeColor(
        options.headlineColor || "#111111"
      )};
      background: ${this.safeColor(
        options.headlineBackground || "#ffffff"
      )};
      overflow-wrap: anywhere;
    `;

    return headline;
  }

  /**
   * Add subheadlines.
   */
  appendSubheadlines(
    root,
    subheadlines,
    options = {}
  ) {
    if (!Array.isArray(subheadlines)) {
      return;
    }

    subheadlines
      .filter((text) => String(text || "").trim())
      .forEach((text) => {
        const sub = document.createElement("div");

        sub.textContent = text;

        sub.style.cssText = `
          margin: 8px 0;
          padding: 6px 10px;
          font-family: ${this.safeFont(
            options.subheadlineFont || "Gautami"
          )};
          font-size: ${this.safeFontSize(
            options.subheadlineFontSize,
            28
          )}px;
          font-weight: bold;
          line-height: 1.4;
          color: ${this.safeColor(
            options.subheadlineColor || "#222222"
          )};
          background: ${this.safeColor(
            options.subheadlineBackground || "#ffffff"
          )};
          border-bottom: ${
            options.subheadlineUnderline === false
              ? "none"
              : "1px solid #777777"
          };
          overflow-wrap: anywhere;
        `;

        root.appendChild(sub);
      });
  }

  /**
   * Create the dateline.
   */
  createDateline(dateline, options = {}) {
    const element = document.createElement("div");

    element.textContent = dateline;

    element.style.cssText = `
      margin: 14px 0 10px;
      font-family: ${this.safeFont(
        options.datelineFont || "Gautami"
      )};
      font-size: ${this.safeFontSize(
        options.datelineFontSize,
        22
      )}px;
      font-weight: bold;
      color: ${this.safeColor(
        options.datelineColor || "#cc0000"
      )};
    `;

    return element;
  }

  /**
   * Create the news body.
   */
  createBody(body, options = {}) {
    const element = document.createElement("div");

    element.textContent = body || "";

    element.style.cssText = `
      font-family: ${this.safeFont(
        options.bodyFont || "Gautami"
      )};
      font-size: ${this.safeFontSize(
        options.bodyFontSize,
        23
      )}px;
      line-height: 1.65;
      text-align: justify;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    `;

    return element;
  }

  /**
   * Add up to 3 news photos.
   */
  appendPhotos(root, photos, options = {}) {
    if (!Array.isArray(photos)) {
      return;
    }

    const validPhotos = photos
      .filter((photo) => {
        return (
          photo instanceof File ||
          photo instanceof Blob ||
          (
            typeof photo === "string" &&
            photo.length > 0
          ) ||
          (
            photo &&
            typeof photo.url === "string"
          )
        );
      })
      .slice(0, this.maxPhotos);

    if (validPhotos.length === 0) {
      return;
    }

    const gallery = document.createElement("div");

    gallery.style.cssText = `
      display: grid;
      grid-template-columns: ${
        validPhotos.length === 1
          ? "1fr"
          : "repeat(2, minmax(0, 1fr))"
      };
      gap: 12px;
      margin-top: 20px;
    `;

    validPhotos.forEach((photo) => {
      const image = document.createElement("img");

      image.alt = "వార్తా ఫోటో";

      if (typeof photo === "string") {
        image.src = photo;
      } else if (photo instanceof Blob) {
        image.src = URL.createObjectURL(photo);
      } else if (photo && photo.url) {
        image.src = photo.url;
      }

      image.style.cssText = `
        display: block;
        width: 100%;
        max-height: ${
          Number(options.photoMaxHeight) || 420
        }px;
        object-fit: contain;
        background: #f4f4f4;
      `;

      gallery.appendChild(image);
    });

    root.appendChild(gallery);
  }

  /**
   * Create the footer.
   */
  createFooter(options = {}) {
    const footer = document.createElement("footer");

    footer.textContent =
      options.footerText || this.paperName;

    footer.style.cssText = `
      margin-top: 24px;
      padding-top: 10px;
      border-top: 1px solid #999999;
      text-align: center;
      font-family: "Gautami", sans-serif;
      font-size: 18px;
      color: #555555;
    `;

    return footer;
  }

  /**
   * Render news HTML into a PNG image.
   *
   * html2canvas must be loaded by the application.
   */
  async exportToBlob(news, options = {}) {
    if (typeof document === "undefined") {
      throw new Error(
        "PNG రూపొందించడానికి బ్రౌజర్ అవసరం."
      );
    }

    if (typeof window.html2canvas !== "function") {
      throw new Error(
        "html2canvas లైబ్రరీ అందుబాటులో లేదు."
      );
    }

    if (this.rendering) {
      throw new Error(
        "ఇప్పటికే ఒక PNG రూపొందుతోంది. దయచేసి వేచి ఉండండి."
      );
    }

    if (!news || !news.headline) {
      throw new Error(
        "PNG రూపొందించడానికి వార్త హెడ్‌లైన్ అవసరం."
      );
    }

    this.rendering = true;

    let container = null;

    try {
      await this.waitForFonts();

      container = document.createElement("div");

      container.id = this.containerId;

      container.style.cssText = `
        position: fixed;
        left: -100000px;
        top: 0;
        width: max-content;
        z-index: -1;
        background: #ffffff;
        pointer-events: none;
      `;

      const newsElement = this.createNewsElement(
        news,
        options
      );

      container.appendChild(newsElement);

      document.body.appendChild(container);

      await this.waitForImages(newsElement);

      const canvas = await window.html2canvas(
        newsElement,
        {
          backgroundColor: this.defaultBackground,
          scale: this.imageScale,
          useCORS: true,
          logging: false
        }
      );

      return await new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(
                new Error(
                  "PNG చిత్రాన్ని రూపొందించలేకపోయాం."
                )
              );

              return;
            }

            resolve(blob);
          },
          "image/png"
        );
      });
    } finally {
      if (container) {
        container.remove();
      }

      this.rendering = false;
    }
  }

  /**
   * Download the PNG image.
   */
  async download(news, options = {}) {
    const blob = await this.exportToBlob(
      news,
      options
    );

    const url = URL.createObjectURL(blob);

    try {
      const link = document.createElement("a");

      link.href = url;

      link.download =
        options.filename ||
        this.createFilename(news);

      document.body.appendChild(link);

      link.click();

      link.remove();

      return {
        success: true,
        filename: link.download,
        size: blob.size
      };
    } finally {
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    }
  }

  /**
   * Share the PNG on supported mobile browsers.
   */
  async share(news, options = {}) {
    const blob = await this.exportToBlob(
      news,
      options
    );

    const filename =
      options.filename ||
      this.createFilename(news);

    const file = new File(
      [blob],
      filename,
      {
        type: "image/png"
      }
    );

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({
        files: [file]
      })
    ) {
      await navigator.share({
        title: news.headline || this.paperName,
        text: news.headline || "",
        files: [file]
      });

      return {
        success: true,
        method: "share"
      };
    }

    /*
     * Sharing is not supported.
     * Download the image instead.
     */
    const url = URL.createObjectURL(blob);

    try {
      const link = document.createElement("a");

      link.href = url;

      link.download = filename;

      document.body.appendChild(link);

      link.click();

      link.remove();
    } finally {
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    }

    return {
      success: true,
      method: "download-fallback"
    };
  }

  /**
   * Wait for browser fonts to become ready.
   */
  async waitForFonts() {
    if (
      document.fonts &&
      document.fonts.ready
    ) {
      await document.fonts.ready;
    }
  }

  /**
   * Wait for images in the rendered element.
   */
  async waitForImages(root) {
    const images = Array.from(
      root.querySelectorAll("img")
    );

    await Promise.all(
      images.map((image) => {
        if (image.complete && image.naturalWidth > 0) {
          return Promise.resolve();
        }

        return new Promise((resolve) => {
          image.addEventListener(
            "load",
            resolve,
            { once: true }
          );

          image.addEventListener(
            "error",
            resolve,
            { once: true }
          );
        });
      })
    );
  }

  /**
   * Generate a safe filename.
   */
  createFilename(news) {
    const headline = String(
      news.headline || "news"
    )
      .replace(/[\\/:*?"<>|]/g, "")
      .trim()
      .slice(0, 60);

    const safeHeadline = headline || "news";

    return `Satvika_${safeHeadline}.png`;
  }

  /**
   * Validate a CSS font family value.
   */
  safeFont(font) {
    const allowedFonts = [
      "Peddana",
      "Gautami",
      "Noto Sans Telugu",
      "serif",
      "sans-serif"
    ];

    return allowedFonts.includes(font)
      ? `"${font}"`
      : '"Gautami", sans-serif';
  }

  /**
   * Validate font size.
   */
  safeFontSize(value, fallback) {
    const size = Number(value);

    if (!Number.isFinite(size)) {
      return fallback;
    }

    return Math.max(
      12,
      Math.min(100, size)
    );
  }

  /**
   * Validate CSS color input.
   */
  safeColor(value) {
    const color = String(value || "").trim();

    if (
      /^#[0-9a-fA-F]{3,8}$/.test(color) ||
      /^(rgb|rgba|hsl|hsla)\([\d\s.,%+-]+\)$/i.test(
        color
      ) ||
      /^[a-zA-Z]{3,20}$/.test(color)
    ) {
      return color;
    }

    return "#222222";
  }

  /**
   * Validate text alignment.
   */
  safeAlignment(value) {
    const allowed = [
      "left",
      "right",
      "center",
      "justify"
    ];

    return allowed.includes(value)
      ? value
      : "center";
  }
}

export default NewsPngExporter;
