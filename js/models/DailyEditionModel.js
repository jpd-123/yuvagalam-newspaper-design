// File: js/models/DailyEditionModel.js
// Project: Satvika Publisher
// Purpose: Daily newspaper edition data model

import { MasterLayoutModel } from "./MasterLayoutModel.js";

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return `edition-${globalThis.crypto.randomUUID()}`;
  }

  return `edition-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export class DailyEditionModel {
  constructor(data = {}) {
    this.id = data.id || createId();

    this.masterLayoutId = data.masterLayoutId || null;

    this.name = String(data.name || "రోజువారీ ఎడిషన్").trim();

    this.editionDate = data.editionDate || new Date()
      .toISOString()
      .slice(0, 10);

    this.status = ["draft", "ready", "published"].includes(data.status)
      ? data.status
      : "draft";

    this.layout = data.layout
      ? deepClone(data.layout)
      : null;

    this.isMasterCopy = data.isMasterCopy === true;

    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static createFromMaster(masterLayout, editionDate = null) {
    const master = masterLayout instanceof MasterLayoutModel
      ? masterLayout
      : MasterLayoutModel.fromJSON(masterLayout);

    const date = editionDate || new Date().toISOString().slice(0, 10);

    const snapshot = deepClone(master.toJSON());

    // The daily edition gets its own copy of the master layout.
    // Changes to this snapshot do not mutate the original master object.
    return new DailyEditionModel({
      name: `${master.name} - ${date}`,
      masterLayoutId: master.id,
      editionDate: date,
      layout: snapshot,
      isMasterCopy: true,
      status: "draft"
    });
  }

  rename(name) {
    const nextName = String(name || "").trim();

    if (!nextName) {
      throw new Error("ఎడిషన్ పేరు ఖాళీగా ఉండకూడదు.");
    }

    this.name = nextName;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  setEditionDate(date) {
    const value = String(date || "");

    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error("ఎడిషన్ తేదీ సరైన రూపంలో లేదు.");
    }

    const parsed = new Date(`${value}T00:00:00Z`);

    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== value
    ) {
      throw new Error("చెల్లుబాటు అయ్యే తేదీని నమోదు చేయండి.");
    }

    this.editionDate = value;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  setStatus(status) {
    const allowed = ["draft", "ready", "published"];

    if (!allowed.includes(status)) {
      throw new Error("ఎడిషన్ స్థితి చెల్లదు.");
    }

    this.status = status;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  getPage(pageNumber) {
    const pages = this.layout?.pages;

    if (!Array.isArray(pages)) {
      return null;
    }

    return pages.find(
      (page) => Number(page.pageNumber) === Number(pageNumber)
    ) || null;
  }

  addNews(pageNumber, newsData) {
    const page = this.getPage(pageNumber);

    if (!page) {
      throw new Error(`పేజీ ${pageNumber} ఎడిషన్‌లో లేదు.`);
    }

    if (!Array.isArray(page.news)) {
      page.news = [];
    }

    const news = {
      ...deepClone(newsData),
      pageNumber: Number(pageNumber)
    };

    if (!news.id) {
      news.id = createId();
    }

    page.news.push(news);
    this.updatedAt = new Date().toISOString();

    return news;
  }

  removeNews(pageNumber, newsId) {
    const page = this.getPage(pageNumber);

    if (!page || !Array.isArray(page.news)) {
      return false;
    }

    const originalLength = page.news.length;

    page.news = page.news.filter((news) => news.id !== newsId);

    const removed = page.news.length !== originalLength;

    if (removed) {
      this.updatedAt = new Date().toISOString();
    }

    return removed;
  }

  validate() {
    const errors = [];

    if (!this.name) {
      errors.push("ఎడిషన్ పేరు అవసరం.");
    }

    if (!this.layout || !Array.isArray(this.layout.pages)) {
      errors.push("ఎడిషన్‌లో పేజీ లేఅవుట్ లేదు.");
    }

    if (this.layout && this.layout.pageCount) {
      for (const page of this.layout.pages || []) {
        if (
          page.pageNumber < 1 ||
          page.pageNumber > this.layout.pageCount
        ) {
          errors.push(`చెల్లని పేజీ సంఖ్య: ${page.pageNumber}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      id: this.id,
      masterLayoutId: this.masterLayoutId,
      name: this.name,
      editionDate: this.editionDate,
      status: this.status,
      layout: this.layout ? deepClone(this.layout) : null,
      isMasterCopy: this.isMasterCopy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromJSON(data) {
    return new DailyEditionModel(data);
  }
  }
