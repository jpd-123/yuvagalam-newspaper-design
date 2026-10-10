/**
 * Satvika Publisher
 * File: js/modules/welcome-screen.js
 *
 * Responsibility:
 * - Manage the welcome screen.
 * - Open the main application.
 * - Display welcome and startup status.
 */

export class WelcomeScreen {
  constructor(options = {}) {
    this.openButtonId =
      options.openButtonId || "open-project-button";

    this.statusId =
      options.statusId || "welcome-status";

    this.welcomeScreenId =
      options.welcomeScreenId || "welcome-screen";

    this.appShellId =
      options.appShellId || "app-shell";

    this.onOpen =
      typeof options.onOpen === "function"
        ? options.onOpen
        : null;

    this.initialized = false;
  }

  initialize() {
    if (this.initialized) {
      return;
    }

    this.openButton = document.getElementById(
      this.openButtonId
    );

    this.statusElement = document.getElementById(
      this.statusId
    );

    this.welcomeScreen = document.getElementById(
      this.welcomeScreenId
    );

    this.appShell = document.getElementById(
      this.appShellId
    );

    if (!this.openButton) {
      console.warn(
        `Welcome button not found: ${this.openButtonId}`
      );

      return;
    }

    this.openButton.addEventListener(
      "click",
      () => this.openApplication()
    );

    this.initialized = true;

    this.setStatus(
      "సాత్విక పబ్లిషర్‌కు స్వాగతం!"
    );
  }

  setStatus(message, type = "info") {
    if (!this.statusElement) {
      this.statusElement = document.getElementById(
        this.statusId
      );
    }

    if (!this.statusElement) {
      return;
    }

    this.statusElement.textContent = String(
      message || ""
    );

    this.statusElement.dataset.statusType = type;

    this.statusElement.setAttribute(
      "role",
      type === "error" ? "alert" : "status"
    );
  }

  async openApplication() {
    if (!this.openButton) {
      return;
    }

    this.openButton.disabled = true;

    this.setStatus(
      "సాత్విక పబ్లిషర్ ప్రారంభమవుతోంది..."
    );

    try {
      if (this.onOpen) {
        await this.onOpen();
      }

      this.showApplication();

      this.setStatus(
        "సాత్విక పబ్లిషర్ సిద్ధంగా ఉంది."
      );

      document.dispatchEvent(
        new CustomEvent("satvika:application-opened")
      );
    } catch (error) {
      console.error(
        "Application startup failed:",
        error
      );

      this.setStatus(
        error.message ||
          "అప్లికేషన్ ప్రారంభించడంలో సమస్య ఏర్పడింది.",
        "error"
      );
    } finally {
      this.openButton.disabled = false;
    }
  }

  showApplication() {
    if (!this.welcomeScreen) {
      this.welcomeScreen = document.getElementById(
        this.welcomeScreenId
      );
    }

    if (!this.appShell) {
      this.appShell = document.getElementById(
        this.appShellId
      );
    }

    if (this.welcomeScreen) {
      this.welcomeScreen.hidden = true;
      this.welcomeScreen.setAttribute(
        "aria-hidden",
        "true"
      );
    }

    if (this.appShell) {
      this.appShell.hidden = false;
      this.appShell.setAttribute(
        "aria-hidden",
        "false"
      );
    }
  }

  showWelcomeScreen() {
    if (this.welcomeScreen) {
      this.welcomeScreen.hidden = false;
      this.welcomeScreen.setAttribute(
        "aria-hidden",
        "false"
      );
    }

    if (this.appShell) {
      this.appShell.hidden = true;
      this.appShell.setAttribute(
        "aria-hidden",
        "true"
      );
    }

    this.setStatus(
      "సాత్విక పబ్లిషర్‌కు స్వాగతం!"
    );
  }
}

export default WelcomeScreen;
