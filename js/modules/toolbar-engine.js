/**
 * Satvika Publisher
 * File: js/modules/toolbar-engine.js
 *
 * Responsibility:
 * - Register toolbar actions.
 * - Route toolbar clicks to registered handlers.
 * - Manage disabled and enabled actions.
 *
 * This module does not implement individual editing tools.
 */

export class ToolbarEngine {
  constructor(options = {}) {
    this.toolbars = new Map();

    this.actions = new Map();

    this.selector =
      options.selector || "[data-toolbar-action]";

    this.boundClickHandler =
      this.handleDocumentClick.bind(this);

    this.initialized = false;
  }

  initialize() {
    if (this.initialized) {
      return;
    }

    document.addEventListener(
      "click",
      this.boundClickHandler
    );

    this.initialized = true;
  }

  /**
   * Register a toolbar container.
   */
  registerToolbar(name, elementOrSelector) {
    let element = elementOrSelector;

    if (typeof elementOrSelector === "string") {
      element = document.querySelector(
        elementOrSelector
      );
    }

    if (!element) {
      console.warn(
        `Toolbar not found: ${name}`
      );

      return false;
    }

    this.toolbars.set(name, element);

    element.dataset.toolbarName = name;

    return true;
  }

  /**
   * Register an action handler.
   */
  registerAction(actionName, handler, options = {}) {
    if (typeof handler !== "function") {
      throw new TypeError(
        "Toolbar action handler తప్పనిసరిగా function కావాలి."
      );
    }

    this.actions.set(actionName, {
      handler,
      toolbar: options.toolbar || null,
      description: options.description || ""
    });
  }

  /**
   * Route toolbar click events.
   */
  async handleDocumentClick(event) {
    const button = event.target.closest(
      this.selector
    );

    if (!button || button.disabled) {
      return;
    }

    const actionName =
      button.dataset.toolbarAction;

    if (!actionName) {
      return;
    }

    const action = this.actions.get(actionName);

    if (!action) {
      console.warn(
        `Toolbar action not registered: ${actionName}`
      );

      return;
    }

    const toolbarName =
      button.closest("[data-toolbar-name]")
        ?.dataset.toolbarName || null;

    if (
      action.toolbar &&
      action.toolbar !== toolbarName
    ) {
      return;
    }

    button.setAttribute(
      "aria-busy",
      "true"
    );

    try {
      await action.handler({
        event,
        button,
        toolbarName,
        actionName
      });

      document.dispatchEvent(
        new CustomEvent(
          "satvika:toolbar-action-completed",
          {
            detail: {
              actionName,
              toolbarName
            }
          }
        )
      );
    } catch (error) {
      console.error(
        `Toolbar action failed: ${actionName}`,
        error
      );

      document.dispatchEvent(
        new CustomEvent(
          "satvika:toolbar-action-error",
          {
            detail: {
              actionName,
              toolbarName,
              message: error.message
            }
          }
        )
      );
    } finally {
      button.removeAttribute("aria-busy");
    }
  }

  /**
   * Enable or disable a toolbar action.
   */
  setActionEnabled(actionName, enabled) {
    const buttons = document.querySelectorAll(
      `${this.selector}[data-toolbar-action="${CSS.escape(actionName)}"]`
    );

    buttons.forEach((button) => {
      button.disabled = !enabled;

      button.setAttribute(
        "aria-disabled",
        String(!enabled)
      );
    });
  }

  /**
   * Disable all actions within a toolbar.
   */
  setToolbarEnabled(toolbarName, enabled) {
    const toolbar = this.toolbars.get(
      toolbarName
    );

    if (!toolbar) {
      return false;
    }

    toolbar
      .querySelectorAll(this.selector)
      .forEach((button) => {
        button.disabled = !enabled;

        button.setAttribute(
          "aria-disabled",
          String(!enabled)
        );
      });

    return true;
  }

  getRegisteredActions() {
    return [...this.actions.entries()].map(
      ([name, action]) => ({
        name,
        toolbar: action.toolbar,
        description: action.description
      })
    );
  }

  destroy() {
    document.removeEventListener(
      "click",
      this.boundClickHandler
    );

    this.toolbars.clear();
    this.actions.clear();

    this.initialized = false;
  }
}

export default ToolbarEngine;
