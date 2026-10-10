/**
 * Satvika Publisher
 * File: js/modules/photo-controller.js
 *
 * Responsibility:
 * - Read selected photo files.
 * - Validate supported image types and sizes.
 * - Display photo previews.
 * - Remove selected photos.
 *
 * Persistent photo storage is handled by PhotoManager.
 */

export class PhotoController {
  constructor(options = {}) {
    this.inputId =
      options.inputId || "news-photo-files";

    this.previewContainerId =
      options.previewContainerId ||
      "news-photo-previews";

    this.maxPhotos = Math.min(
      3,
      Math.max(1, Number(options.maxPhotos) || 3)
    );

    this.maxFileSize =
      Number(options.maxFileSize) ||
      10 * 1024 * 1024;

    this.allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp"
    ]);

    this.photos = [];

    this.initialized = false;
  }

  initialize() {
    if (this.initialized) {
      return;
    }

    this.input = document.getElementById(
      this.inputId
    );

    this.previewContainer =
      document.getElementById(
        this.previewContainerId
      );

    if (this.input) {
      this.input.addEventListener(
        "change",
        (event) => {
          this.handleFiles(
            event.target.files
          );
        }
      );
    }

    this.initialized = true;

    this.render();
  }

  validateFile(file) {
    if (!file) {
      throw new Error(
        "ఫొటో ఫైల్ ఎంచుకోండి."
      );
    }

    if (!this.allowedTypes.has(file.type)) {
      throw new Error(
        `${file.name}: JPG, PNG లేదా WebP ఫైల్ మాత్రమే ఎంచుకోండి.`
      );
    }

    if (file.size > this.maxFileSize) {
      throw new Error(
        `${file.name}: ఫొటో 10 MB పరిమితిని మించింది.`
      );
    }

    return true;
  }

  async handleFiles(fileList) {
    const files = Array.from(fileList || []);

    const availableSlots =
      this.maxPhotos - this.photos.length;

    if (availableSlots <= 0) {
      this.showMessage(
        `ఒక వార్తకు గరిష్ఠంగా ${this.maxPhotos} ఫొటోలు మాత్రమే జోడించవచ్చు.`,
        "error"
      );

      this.clearInput();
      return;
    }

    const acceptedFiles = files.slice(
      0,
      availableSlots
    );

    const rejectedCount =
      files.length - acceptedFiles.length;

    for (const file of acceptedFiles) {
      try {
        this.validateFile(file);

        const photo = await this.loadPhoto(file);

        this.photos.push(photo);
      } catch (error) {
        console.error(
          "Photo selection error:",
          error
        );

        this.showMessage(
          error.message,
          "error"
        );
      }
    }

    if (rejectedCount > 0) {
      this.showMessage(
        `మరిన్ని ${rejectedCount} ఫొటోలు జోడించలేదు. ఒక వార్తకు గరిష్ఠంగా ${this.maxPhotos} ఫొటోలు మాత్రమే అనుమతి ఉంది.`,
        "error"
      );
    }

    this.render();
    this.dispatchChange();
    this.clearInput();
  }

  loadPhoto(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);

      const image = new Image();

      image.onload = () => {
        resolve({
          id: this.createId(),
          file,
          url,
          name: file.name,
          type: file.type,
          size: file.size,
          width: image.naturalWidth,
          height: image.naturalHeight
        });
      };

      image.onerror = () => {
        URL.revokeObjectURL(url);

        reject(
          new Error(
            `${file.name}: ఫొటోను తెరవలేకపోయాం.`
          )
        );
      };

      image.src = url;
    });
  }

  createId() {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }

    return `photo-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}`;
  }

  render() {
    if (!this.previewContainer) {
      this.previewContainer =
        document.getElementById(
          this.previewContainerId
        );
    }

    if (!this.previewContainer) {
      return;
    }

    this.previewContainer.replaceChildren();

    this.photos.forEach((photo, index) => {
      const wrapper = document.createElement("div");

      wrapper.className = "photo-preview-item";
      wrapper.dataset.photoId = photo.id;

      const image = document.createElement("img");

      image.src = photo.url;
      image.alt = photo.name;

      image.style.maxWidth = "140px";
      image.style.maxHeight = "120px";
      image.style.objectFit = "contain";

      const caption = document.createElement("div");

      caption.textContent =
        `${index + 1}. ${photo.name}`;

      const removeButton =
        document.createElement("button");

      removeButton.type = "button";
      removeButton.textContent = "తొలగించు";

      removeButton.setAttribute(
        "aria-label",
        `${photo.name} ఫొటోను తొలగించు`
      );

      removeButton.addEventListener(
        "click",
        () => this.removePhoto(photo.id)
      );

      wrapper.append(
        image,
        caption,
        removeButton
      );

      this.previewContainer.appendChild(
        wrapper
      );
    });
  }

  removePhoto(photoId) {
    const index = this.photos.findIndex(
      (photo) => photo.id === photoId
    );

    if (index === -1) {
      return false;
    }

    const [photo] = this.photos.splice(
      index,
      1
    );

    URL.revokeObjectURL(photo.url);

    this.render();
    this.dispatchChange();

    return true;
  }

  clear() {
    this.photos.forEach((photo) => {
      URL.revokeObjectURL(photo.url);
    });

    this.photos = [];

    this.clearInput();
    this.render();
    this.dispatchChange();
  }

  clearInput() {
    if (this.input) {
      this.input.value = "";
    }
  }

  getPhotos() {
    return this.photos.map((photo) => ({
      id: photo.id,
      file: photo.file,
      name: photo.name,
      type: photo.type,
      size: photo.size,
      width: photo.width,
      height: photo.height
    }));
  }

  async getPhotosAsDataURLs() {
    const results = [];

    for (const photo of this.photos) {
      const dataURL = await new Promise(
        (resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            resolve(reader.result);
          };

          reader.onerror = () => {
            reject(
              new Error(
                `${photo.name} ఫొటోను చదవలేకపోయాం.`
              )
            );
          };

          reader.readAsDataURL(photo.file);
        }
      );

      results.push({
        id: photo.id,
        name: photo.name,
        type: photo.type,
        dataURL
      });
    }

    return results;
  }

  showMessage(message, type = "info") {
    document.dispatchEvent(
      new CustomEvent(
        "satvika:photo-message",
        {
          detail: {
            message,
            type
          }
        }
      )
    );
  }

  dispatchChange() {
    document.dispatchEvent(
      new CustomEvent(
        "satvika:photos-changed",
        {
          detail: {
            photos: this.getPhotos(),
            count: this.photos.length,
            maxPhotos: this.maxPhotos
          }
        }
      )
    );
  }

  destroy() {
    this.clear();
    this.initialized = false;
  }
}

export default PhotoController;
