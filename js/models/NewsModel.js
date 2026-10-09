// File: js/models/NewsModel.js
// Project: Satvika Publisher
// Purpose: News data model

import {
  DEFAULT_HEADLINE_COLOR,
  DEFAULT_TEXT_COLOR,
  DEFAULT_BACKGROUND_COLOR
} from "../config/colors.js";

import {
  DEFAULT_HEADLINE_FONT,
  DEFAULT_BODY_FONT,
  DEFAULT_HEADLINE_FONT_SIZE,
  DEFAULT_SUBHEADLINE_FONT_SIZE,
  DEFAULT_BODY_FONT_SIZE
} from "../config/fonts.js";

import { DEFAULT_NEWS_SHAPE } from "../config/shapes-config.js";

function createId(prefix = "item") {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function normalizeText(value) {
  return typeof value === "string" ? value : "";
}

function normalizePhotos(photos) {
  if (!Array.isArray(photos)) {
    return [];
  }

  return photos.slice(0, 3).map((photo) => {
    if (typeof photo === "string") {
      return {
        id: createId("photo"),
        src: photo,
        alt: "",
        shape: "rectangle",
        size: "medium"
      };
    }

    return {
      id: photo.id || createId("photo"),
      src: normalizeText(photo.src),
      alt: normalizeText(photo.alt),
      shape: photo.shape || "rectangle",
      size: photo.size || "medium",
      position: photo.position || "right",
      width: Number.isFinite(Number(photo.width))
        ? Number(photo.width)
        : null,
      height: Number.isFinite(Number(photo.height))
        ? Number(photo.height)
        : null
    };
  });
}

export class NewsModel {
  constructor(data = {}) {
    this.id = data.id || createId("news");

    this.headline = normalizeText(data.headline);

    this.subheadlines = Array.isArray(data.subheadlines)
      ? data.subheadlines.map(normalizeText).filter(Boolean).slice(0, 5)
      : normalizeText(data.subheadlines)
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .slice(0, 5);

    this.dateline = normalizeText(data.dateline);
    this.body = normalizeText(data.body);

    this.pageNumber = Number.isInteger(Number(data.pageNumber))
      && Number(data.pageNumber) >= 1
      ? Number(data.pageNumber)
      : 1;

    this.shape = data.shape || DEFAULT_NEWS_SHAPE;

    this.headlineStyle = {
      fontFamily:
        data.headlineStyle?.fontFamily || DEFAULT_HEADLINE_FONT,
      fontSize: Number(data.headlineStyle?.fontSize)
        || DEFAULT_HEADLINE_FONT_SIZE,
      color: data.headlineStyle?.color || DEFAULT_HEADLINE_COLOR,
      backgroundColor:
        data.headlineStyle?.backgroundColor || DEFAULT_BACKGROUND_COLOR,
      bold: data.headlineStyle?.bold !== false,
      underline: data.headlineStyle?.underline || "none"
    };

    this.subheadlineStyle = {
      fontFamily:
        data.subheadlineStyle?.fontFamily || DEFAULT_BODY_FONT,
      fontSize: Number(data.subheadlineStyle?.fontSize)
        || DEFAULT_SUBHEADLINE_FONT_SIZE,
      color: data.subheadlineStyle?.color || DEFAULT_TEXT_COLOR,
      backgroundColor:
        data.subheadlineStyle?.backgroundColor || "transparent",
      bold: data.subheadlineStyle?.bold !== false,
      underline: data.subheadlineStyle?.underline || "none"
    };

    this.bodyStyle = {
      fontFamily: data.bodyStyle?.fontFamily || DEFAULT_BODY_FONT,
      fontSize: Number(data.bodyStyle?.fontSize)
        || DEFAULT_BODY_FONT_SIZE,
      color: data.bodyStyle?.color || DEFAULT_TEXT_COLOR,
      lineHeight: Number(data.bodyStyle?.lineHeight) || 1.35
    };

    this.photos = normalizePhotos(data.photos);

    this.layout = {
      width: Number(data.layout?.width) || null,
      height: Number(data.layout?.height) || null,
      columnSpan: Number(data.layout?.columnSpan) || 1,
      rowSpan: Number(data.layout?.rowSpan) || 1,
      order: Number.isInteger(data.layout?.order)
        ? data.layout.order
        : 0
    };

    this.flow = {
      continuation: Boolean(data.flow?.continuation),
      continuationPage: Number(data.flow?.continuationPage) || null,
      continuationText: normalizeText(data.flow?.continuationText)
    };

    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  update(changes = {}) {
    if ("headline" in changes) {
      this.headline = normalizeText(changes.headline);
    }

    if ("subheadlines" in changes) {
      this.subheadlines = Array.isArray(changes.subheadlines)
        ? changes.subheadlines.map(normalizeText).filter(Boolean).slice(0, 5)
        : normalizeText(changes.subheadlines)
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .slice(0, 5);
    }

    if ("dateline" in changes) {
      this.dateline = normalizeText(changes.dateline);
    }

    if ("body" in changes) {
      this.body = normalizeText(changes.body);
    }

    if ("pageNumber" in changes) {
      const page = Number(changes.pageNumber);

      if (!Number.isInteger(page) || page < 1) {
        throw new Error("వార్త పేజీ సంఖ్య కనీసం 1 ఉండాలి.");
      }

      this.pageNumber = page;
    }

    if ("shape" in changes) {
      this.shape = changes.shape || DEFAULT_NEWS_SHAPE;
    }

    if ("photos" in changes) {
      this.photos = normalizePhotos(changes.photos);
    }

    if ("headlineStyle" in changes) {
      this.headlineStyle = {
        ...this.headlineStyle,
        ...changes.headlineStyle
      };
    }

    if ("subheadlineStyle" in changes) {
      this.subheadlineStyle = {
        ...this.subheadlineStyle,
        ...changes.subheadlineStyle
      };
    }

    if ("bodyStyle" in changes) {
      this.bodyStyle = {
        ...this.bodyStyle,
        ...changes.bodyStyle
      };
    }

    if ("layout" in changes) {
      this.layout = {
        ...this.layout,
        ...changes.layout
      };
    }

    if ("flow" in changes) {
      this.flow = {
        ...this.flow,
        ...changes.flow
      };
    }

    this.updatedAt = new Date().toISOString();

    return this;
  }

  validate() {
    const errors = [];

    if (!this.headline.trim()) {
      errors.push("వార్త హెడ్‌లైన్ ఖాళీగా ఉంది.");
    }

    if (!Number.isInteger(this.pageNumber) || this.pageNumber < 1) {
      errors.push("వార్త పేజీ సంఖ్య చెల్లదు.");
    }

    if (this.photos.length > 3) {
      errors.push("ఒక వార్తకు గరిష్ఠంగా 3 ఫొటోలు మాత్రమే అనుమతి.");
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      id: this.id,
      headline: this.headline,
      subheadlines: [...this.subheadlines],
      dateline: this.dateline,
      body: this.body,
      pageNumber: this.pageNumber,
      shape: this.shape,
      headlineStyle: { ...this.headlineStyle },
      subheadlineStyle: { ...this.subheadlineStyle },
      bodyStyle: { ...this.bodyStyle },
      photos: this.photos.map((photo) => ({ ...photo })),
      layout: { ...this.layout },
      flow: { ...this.flow },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromJSON(data) {
    return new NewsModel(data);
  }
      }
