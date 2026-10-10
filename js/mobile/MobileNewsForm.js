/**
 * Satvika Publisher
 * File: js/mobile/MobileNewsForm.js
 *
 * Responsibility:
 * - Collect news details from a mobile device.
 * - Collect headline, subheadlines, dateline and body.
 * - Allow up to 3 photos per news item.
 * - Select a master layout and target page.
 * - Validate the news form before submission.
 *
 * This module collects data.
 * Saving and page insertion are handled separately.
 */

export class MobileNewsForm {
  constructor(options = {}) {
    this.formId =
      options.formId || "mobile-news-form";

    this.masterSelectId =
      options.masterSelectId || "mobile-master-layout";

    this.pageSelectId =
      options.pageSelectId || "mobile-page-number";

    this.photoInputId =
      options.photoInputId || "mobile-news-photos";

    this.maxPhotos = 3;

    this.maxPhotoSize = 10 * 1024 * 1024;

    this.allowedPhotoTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    this.form = null;

    this.photoInput = null;

    this.selectedPhotos = [];

    this.initialized = false;

    this.onSubmit =
      typeof options.onSubmit === "function"
        ? options.onSubmit
        : null;

    this.onStatus =
      typeof options.onStatus === "function"
        ? options.onStatus
        : null;
  }

  /**
   * Initialize the mobile news form.
   */
  initialize() {
    if (typeof document === "undefined") {
      return false;
    }

    this.form = document.getElementById(
      this.formId
    );

    this.photoInput = document.getElementById(
      this.photoInputId
    );

    if (!this.form) {
      console.warn(
        `[MobileNewsForm] Form not found: ${this.formId}`
      );

      return false;
    }

    this.populateMasterLayouts();

    this.populatePageNumbers();

    if (this.photoInput) {
      this.photoInput.addEventListener(
        "change",
        (event) => {
          this.handlePhotoSelection(
            event.target.files
          );
        }
      );
    }

    this.form.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        this.handleSubmit();
      }
    );

    this.initialized = true;

    this.showStatus(
      "వార్త నమోదు ఫారం సిద్ధంగా ఉంది.",
      "success"
    );

    return true;
  }

  /**
   * Populate master layout options 1-5.
   */
  populateMasterLayouts() {
    const select = document.getElementById(
      this.masterSelectId
    );

    if (!select) {
      return;
    }

    const existingValue = select.value;

    select.replaceChildren();

    const placeholder = document.createElement(
      "option"
    );

    placeholder.value = "";

    placeholder.textContent =
      "మాస్టర్ లేఅవుట్ ఎంచుకోండి";

    select.appendChild(placeholder);

    for (let i = 1; i <= 5; i += 1) {
      const option = document.createElement(
        "option"
      );

      option.value = String(i);

      option.textContent =
        `మాస్టర్ లేఅవుట్ ${i}`;

      select.appendChild(option);
    }

    if (existingValue) {
      select.value = existingValue;
    }
  }

  /**
   * Populate target page numbers.
   */
  populatePageNumbers(totalPages = 16) {
    const select = document.getElementById(
      this.pageSelectId
    );

    if (!select) {
      return;
    }

    const previousValue = select.value;

    const count = Math.min(
      16,
      Math.max(
        1,
        Number.parseInt(totalPages, 10) || 16
      )
    );

    select.replaceChildren();

    const placeholder = document.createElement(
      "option"
    );

    placeholder.value = "";

    placeholder.textContent =
      "పేజీ నంబర్ ఎంచుకోండి";

    select.appendChild(placeholder);

    for (let i = 1; i <= count; i += 1) {
      const option = document.createElement(
        "option"
      );

      option.value = String(i);

      option.textContent = `${i}వ పేజీ`;

      select.appendChild(option);
    }

    if (previousValue) {
      select.value = previousValue;
    }
  }

  /**
   * Read and validate selected photos.
   */
  handlePhotoSelection(fileList) {
    const files = Array.from(fileList || []);

    const validPhotos = [];

    for (const file of files) {
      if (validPhotos.length >= this.maxPhotos) {
        this.showStatus(
          "ఒక వార్తకు గరిష్ఠంగా 3 ఫోటోలు మాత్రమే అనుమతి.",
          "error"
        );

        break;
      }

      if (
        !this.allowedPhotoTypes.includes(
          file.type
        )
      ) {
        this.showStatus(
          `${file.name}: JPG, PNG లేదా WebP ఫోటో మాత్రమే ఎంచుకోండి.`,
          "error"
        );

        continue;
      }

      if (file.size > this.maxPhotoSize) {
        this.showStatus(
          `${file.name}: ఫోటో పరిమాణం 10 MB కంటే తక్కువగా ఉండాలి.`,
          "error"
        );

        continue;
      }

      validPhotos.push(file);
    }

    this.selectedPhotos = validPhotos;

    this.renderPhotoPreviews();

    if (this.photoInput) {
      /*
       * Keep the input's selected files aligned
       * with the validated photo list.
       */
      try {
        const dataTransfer = new DataTransfer();

        for (const file of validPhotos) {
          dataTransfer.items.add(file);
        }

        this.photoInput.files =
          dataTransfer.files;
      } catch (error) {
        /*
         * Some browsers restrict programmatic
         * assignment to input.files.
         * selectedPhotos remains authoritative.
         */
        console.warn(
          "[MobileNewsForm] Could not update photo input.",
          error
        );
      }
    }

    if (validPhotos.length > 0) {
      this.showStatus(
        `${validPhotos.length} ఫోటో(లు) ఎంచుకున్నారు.`,
        "success"
      );
    }
  }

  /**
   * Render photo previews when a preview
   * container exists in the HTML.
   */
  renderPhotoPreviews() {
    const container = document.getElementById(
      "mobile-news-photo-previews"
    );

    if (!container) {
      return;
    }

    container.replaceChildren();

    this.selectedPhotos.forEach(
      (file, index) => {
        const wrapper = document.createElement(
          "div"
        );

        wrapper.className =
          "mobile-photo-preview-item";

        const image = document.createElement(
          "img"
        );

        image.alt = `వార్త ఫోటో ${index + 1}`;

        image.className =
          "mobile-news-photo-preview";

        const objectUrl = URL.createObjectURL(
          file
        );

        image.src = objectUrl;

        image.addEventListener(
          "load",
          () => {
            URL.revokeObjectURL(objectUrl);
          },
          { once: true }
        );

        image.addEventListener(
          "error",
          () => {
            URL.revokeObjectURL(objectUrl);
          },
          { once: true }
        );

        const removeButton =
          document.createElement("button");

        removeButton.type = "button";

        removeButton.textContent = "తొలగించు";

        removeButton.setAttribute(
          "aria-label",
          `ఫోటో ${index + 1} తొలగించు`
        );

        removeButton.addEventListener(
          "click",
          () => {
            this.removePhoto(index);
          }
        );

        wrapper.appendChild(image);

        wrapper.appendChild(removeButton);

        container.appendChild(wrapper);
      }
    );
  }

  /**
   * Remove one selected photo.
   */
  removePhoto(index) {
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= this.selectedPhotos.length
    ) {
      return;
    }

    this.selectedPhotos.splice(index, 1);

    if (this.photoInput) {
      try {
        const dataTransfer = new DataTransfer();

        this.selectedPhotos.forEach(
          (file) => {
            dataTransfer.items.add(file);
          }
        );

        this.photoInput.files =
          dataTransfer.files;
      } catch (error) {
        console.warn(
          "[MobileNewsForm] Could not refresh photo input.",
          error
        );
      }
    }

    this.renderPhotoPreviews();

    this.showStatus(
      "ఫోటో తొలగించబడింది.",
      "success"
    );
  }

  /**
   * Read form fields.
   */
  collectFormData() {
    if (!this.form) {
      throw new Error(
        "మొబైల్ వార్త ఫారం ప్రారంభించబడలేదు."
      );
    }

    const formData = new FormData(this.form);

    const getValue = (name) => {
      const value = formData.get(name);

      return typeof value === "string"
        ? value.trim()
        : "";
    };

    const subheadlines = [
      getValue("subheadline1"),
      getValue("subheadline2")
    ].filter(Boolean);

    return {
      id: this.createId(),

      headline: getValue("headline"),

      subheadlines,

      dateline: getValue("dateline"),

      body: getValue("body"),

      masterLayoutId: getValue(
        "masterLayoutId"
      ),

      pageNumber: Number.parseInt(
        getValue("pageNumber"),
        10
      ),

      photos: [...this.selectedPhotos],

      createdAt: new Date().toISOString()
    };
  }

  /**
   * Validate required fields.
   */
  validateNews(news) {
    const errors = [];

    if (!news.headline) {
      errors.push(
        "వార్త హెడ్‌లైన్ నమోదు చేయండి."
      );
    }

    if (!news.body) {
      errors.push(
        "వార్తా వివరణ నమోదు చేయండి."
      );
    }

    if (!news.masterLayoutId) {
      errors.push(
        "మాస్టర్ లేఅవుట్ ఎంచుకోండి."
      );
    }

    const masterNumber = Number.parseInt(
      news.masterLayoutId,
      10
    );

    if (
      !Number.isInteger(masterNumber) ||
      masterNumber < 1 ||
      masterNumber > 5
    ) {
      errors.push(
        "మాస్టర్ లేఅవుట్ 1 నుంచి 5 మధ్య ఉండాలి."
      );
    }

    if (
      !Number.isInteger(news.pageNumber) ||
      news.pageNumber < 1 ||
      news.pageNumber > 16
    ) {
      errors.push(
        "పేజీ నంబర్ 1 నుంచి 16 మధ్య ఉండాలి."
      );
    }

    if (news.photos.length > this.maxPhotos) {
      errors.push(
        "ఒక వార్తకు గరిష్ఠంగా 3 ఫోటోలు మాత్రమే అనుమతి."
      );
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Handle form submission.
   */
  async handleSubmit() {
    try {
      const news = this.collectFormData();

      const result = this.validateNews(news);

      if (!result.valid) {
        this.showStatus(
          result.errors.join("\n"),
          "error"
        );

        return {
          success: false,
          errors: result.errors
        };
      }

      if (!this.onSubmit) {
        this.showStatus(
          "వార్త వివరాలు సిద్ధంగా ఉన్నాయి. సేవ్ చేయడానికి యాప్‌తో అనుసంధానం చేయాలి.",
          "warning"
        );

        return {
          success: false,
          pendingIntegration: true,
          news
        };
      }

      await this.onSubmit(news);

      this.showStatus(
        "వార్త వివరాలు విజయవంతంగా పంపించబడ్డాయి.",
        "success"
      );

      return {
        success: true,
        news
      };
    } catch (error) {
      console.error(
        "[MobileNewsForm] Submission failed:",
        error
      );

      this.showStatus(
        "వార్త వివరాలను ప్రాసెస్ చేయడంలో సమస్య వచ్చింది.",
        "error"
      );

      return {
        success: false,
        error
      };
    }
  }

  /**
   * Display status using the supplied callback
   * or the default status element.
   */
  showStatus(message, type = "info") {
    if (this.onStatus) {
      this.onStatus({
        message,
        type
      });

      return;
    }

    const statusElement =
      document.getElementById(
        "mobile-news-status"
      );

    if (!statusElement) {
      console.info(
        `[MobileNewsForm] ${message}`
      );

      return;
    }

    statusElement.textContent = message;

    statusElement.dataset.statusType = type;

    statusElement.setAttribute(
      "role",
      type === "error"
        ? "alert"
        : "status"
    );
  }

  /**
   * Create a unique local identifier.
   */
  createId() {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }

    return (
      "news-" +
      Date.now() +
      "-" +
      Math.random().toString(36).slice(2, 10)
    );
  }

  /**
   * Reset the form and selected photos.
   */
  reset() {
    if (this.form) {
      this.form.reset();
    }

    this.selectedPhotos = [];

    this.renderPhotoPreviews();

    this.showStatus(
      "వార్త ఫారం ఖాళీ చేయబడింది.",
      "success"
    );
  }

  /**
   * Remove registered event listeners.
   */
  destroy() {
    /*
     * The application currently creates this
     * module for one form lifecycle.
     * Full listener cleanup can be added when
     * the app initialization lifecycle is wired.
     */
    this.initialized = false;

    this.form = null;

    this.photoInput = null;
  }
}

export default MobileNewsForm;
