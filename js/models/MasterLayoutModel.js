// File: js/models/MasterLayoutModel.js
// Project: Satvika Publisher
// Purpose: Master newspaper layout data model

import { PAPER_SIZES, getPaperSizeById } from "../config/paper-sizes.js";
import { PageModel } from "./PageModel.js";

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return `master-${globalThis.crypto.randomUUID()}`;
  }

  return `master-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export class MasterLayoutModel {
  constructor(data = {}) {
    this.id = data.id || createId();

    this.name = String(data.name || "కొత్త మాస్టర్ లేఅవుట్").trim();

    this.paperSize = data.paperSize || "A3";

    const paper = getPaperSizeById(this.paperSize) || PAPER_SIZES[0];

    this.widthMm = Number(data.widthMm) || paper.widthMm;
    this.heightMm = Number(data.heightMm) || paper.heightMm;

    this.pageCount = Number.isInteger(Number(data.pageCount))
      && Number(data.pageCount) >= 1
      && Number(data.pageCount) <= 16
      ? Number(data.pageCount)
      : 6;

    this.columns = Number.isInteger(Number(data.columns))
      && Number(data.columns) >= 1
      ? Number(data.columns)
      : paper.defaultColumns;

    this.branding = {
      newspaperName: data.branding?.newspaperName || "యువగళం",
      logo: data.branding?.logo || null,
      reportersAd: data.branding?.reportersAd || null,
      quoteHeading: data.branding?.quoteHeading || "మంచి మాట",
      quoteText: data.branding?.quoteText || "",
      volumeNumber: data.branding?.volumeNumber || "",
      issueNumber: data.branding?.issueNumber || "",
      publicationDay: data.branding?.publicationDay || "",
      publicationDate: data.branding?.publicationDate || "",
      publicationMonth: data.branding?.publicationMonth || "",
      publicationYear: data.branding?.publicationYear || "",
      pageCountLabel: data.branding?.pageCountLabel || "",
      coverPrice: data.branding?.coverPrice || "",
      footerBulletStyle: data.branding?.footerBulletStyle || "solid-circle"
    };

    this.pages = Array.isArray(data.pages)
      ? data.pages.map((page) =>
          page instanceof PageModel ? page : new PageModel(page)
        )
      : [];

    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();

    this.version = Number.isInteger(data.version) ? data.version : 1;
  }

  rename(name) {
    const nextName = String(name || "").trim();

    if (!nextName) {
      throw new Error("మాస్టర్ లేఅవుట్ పేరు ఖాళీగా ఉండకూడదు.");
    }

    this.name = nextName;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  updateBranding(changes = {}) {
    this.branding = {
      ...this.branding,
      ...changes
    };

    this.updatedAt = new Date().toISOString();

    return this;
  }

  setPageCount(count) {
    const pageCount = Number(count);

    if (!Number.isInteger(pageCount) || pageCount < 1 || pageCount > 16) {
      throw new Error("పేజీల సంఖ్య 1 నుంచి 16 మధ్య ఉండాలి.");
    }

    this.pageCount = pageCount;

    this.pages = this.pages.filter(
      (page) => page.pageNumber <= pageCount
    );

    this.updatedAt = new Date().toISOString();

    return this;
  }

  setPaperSize(paperSizeId) {
    const paper = getPaperSizeById(paperSizeId);

    if (!paper) {
      throw new Error("ఎంచుకున్న పేపర్ సైజు చెల్లదు.");
    }

    this.paperSize = paper.id;
    this.widthMm = paper.widthMm;
    this.heightMm = paper.heightMm;
    this.columns = paper.defaultColumns;

    for (const page of this.pages) {
      page.updateDimensions({
        widthMm: paper.widthMm,
        heightMm: paper.heightMm,
        columns: paper.defaultColumns
      });
    }

    this.updatedAt = new Date().toISOString();

    return this;
  }

  getPage(pageNumber) {
    return this.pages.find(
      (page) => page.pageNumber === Number(pageNumber)
    ) || null;
  }

  addPage(pageData = {}) {
    const pageNumber = Number(pageData.pageNumber);

    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      pageNumber > this.pageCount
    ) {
      throw new Error("పేజీ సంఖ్య మాస్టర్ పరిధిలో లేదు.");
    }

    const existingPage = this.getPage(pageNumber);

    if (existingPage) {
      throw new Error(`పేజీ ${pageNumber} ఇప్పటికే ఉంది.`);
    }

    const page = new PageModel({
      ...pageData,
      pageNumber,
      widthMm: this.widthMm,
      heightMm: this.heightMm,
      columns: this.columns
    });

    this.pages.push(page);
    this.pages.sort((a, b) => a.pageNumber - b.pageNumber);

    this.updatedAt = new Date().toISOString();

    return page;
  }

  validate() {
    const errors = [];

    if (!this.name) {
      errors.push("మాస్టర్ లేఅవుట్ పేరు అవసరం.");
    }

    if (!getPaperSizeById(this.paperSize)) {
      errors.push("పేపర్ సైజు చెల్లదు.");
    }

    if (this.pageCount < 1 || this.pageCount > 16) {
      errors.push("పేజీల సంఖ్య 1 నుంచి 16 మధ్య ఉండాలి.");
    }

    const pageNumbers = new Set();

    for (const page of this.pages) {
      if (pageNumbers.has(page.pageNumber)) {
        errors.push(`పేజీ ${page.pageNumber} రెండుసార్లు ఉంది.`);
      }

      pageNumbers.add(page.pageNumber);

      for (const news of page.news) {
        const result = news.validate();

        if (!result.valid) {
          errors.push(
            `పేజీ ${page.pageNumber}: ${result.errors.join(" ")}`
          );
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
      name: this.name,
      paperSize: this.paperSize,
      widthMm: this.widthMm,
      heightMm: this.heightMm,
      pageCount: this.pageCount,
      columns: this.columns,
      branding: { ...this.branding },
      pages: this.pages.map((page) => page.toJSON()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      version: this.version
    };
  }

  static fromJSON(data) {
    return new MasterLayoutModel(data);
  }
         }
