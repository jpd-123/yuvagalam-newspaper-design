/**
 * Satvika Publisher
 * File: js/modules/device-router.js
 *
 * Responsibility:
 * - Detect device layout mode.
 * - Apply responsive layout classes.
 * - Notify the application when the mode changes.
 *
 * This module does not change the newspaper's data.
 */

export class DeviceRouter {
  constructor(options = {}) {
    this.rootElement =
      options.rootElement ||
      document.documentElement;

    this.mobileBreakpoint =
      Number(options.mobileBreakpoint) || 768;

    this.mode = null;

    this.mediaQuery = null;

    this.handleMediaChange =
      this.handleMediaChange.bind(this);

    this.handleResize =
      this.handleResize.bind(this);
  }

  initialize() {
    if (typeof window === "undefined") {
      return this.getState();
    }

    if (window.matchMedia) {
      this.mediaQuery = window.matchMedia(
        `(max-width: ${this.mobileBreakpoint - 1}px)`
      );

      if (this.mediaQuery.addEventListener) {
        this.mediaQuery.addEventListener(
          "change",
          this.handleMediaChange
        );
      } else {
        this.mediaQuery.addListener(
          this.handleMediaChange
        );
      }
    }

    window.addEventListener(
      "resize",
      this.handleResize
    );

    return this.detectDevice();
  }

  detectDevice() {
    const width = window.innerWidth;

    const isMobile =
      width < this.mobileBreakpoint;

    const nextMode = isMobile
      ? "mobile"
      : "laptop";

    this.setMode(nextMode);

    return this.getState();
  }

  handleMediaChange() {
    this.detectDevice();
  }

  handleResize() {
    this.detectDevice();
  }

  setMode(mode) {
    if (!["mobile", "laptop"].includes(mode)) {
      throw new Error(
        "పరికర మోడ్ mobile లేదా laptop అయి ఉండాలి."
      );
    }

    const changed = this.mode !== mode;

    this.mode = mode;

    this.rootElement.classList.toggle(
      "device-mobile",
      mode === "mobile"
    );

    this.rootElement.classList.toggle(
      "device-laptop",
      mode === "laptop"
    );

    this.rootElement.dataset.deviceMode = mode;

    if (changed) {
      document.dispatchEvent(
        new CustomEvent(
          "satvika:device-mode-changed",
          {
            detail: this.getState()
          }
        )
      );
    }
  }

  getState() {
    return {
      mode: this.mode,
      mobileBreakpoint: this.mobileBreakpoint,
      viewportWidth:
        typeof window !== "undefined"
          ? window.innerWidth
          : null,
      viewportHeight:
        typeof window !== "undefined"
          ? window.innerHeight
          : null
    };
  }

  destroy() {
    if (this.mediaQuery) {
      if (this.mediaQuery.removeEventListener) {
        this.mediaQuery.removeEventListener(
          "change",
          this.handleMediaChange
        );
      } else {
        this.mediaQuery.removeListener(
          this.handleMediaChange
        );
      }
    }

    window.removeEventListener(
      "resize",
      this.handleResize
    );
  }
}

export default DeviceRouter;
