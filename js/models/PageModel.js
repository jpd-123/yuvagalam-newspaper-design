// File: js/models/PageModel.js
// Project: Satvika Publisher
// Purpose: Newspaper page data model

import { NewsModel } from "./NewsModel.js";

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return `page-${globalThis.crypto.randomUUID()}`;
  }

  return `page-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export class PageModel {
  constructor(data = {}) {
    this.id = data.id || createId();

    this.pageNumber = Number.isInteger(Number(data.pageNumber))
      && Number(data.pageNumber) >= 1
      ? Number(data.pageNumber)
      : 1;

    this.widthMm = Number(data.widthMm) || 297;
    this.heightMm = Number(data.heightMm) || 420;

    this.columns = Number.isInteger(Number(data.columns))
      && Number(data.columns) >= 1
      ? Number(data.columns)
      : 5;

    this.header = {
      showLogo: data.header?.showLogo !== false,
      showNewspaperName: data.header?.showNewspaperName !== false,
      showPageNumber: data.header?.showPageNumber !== false,
      sectionLabel: data.header?.sectionLabel || ""
    };

    this.news = Array.isArray(data.news)
      ? data.news.map((item) =>
          item instanceof NewsModel ? item : new NewsModel(item)
        )
      : [];

    this.advertisements = Array.isArray(data.advertisements)
      ? data.advertisements.map((item) => ({ ...item }))
      : [];

    this.layoutSettings = {
      marginTopMm: Number(data.layoutSettings?.marginTopMm) || 5,
      marginRightMm: Number(data.layoutSettings?.marginRightMm) || 5,
      marginBottomMm: Number(data.layoutSettings?.marginBottomMm) || 5,
      marginLeftMm: Number(data.layoutSettings?.marginLeftMm) || 5,
      gapMm: Number(data.layoutSettings?.gapMm) || 2
    };

    this.autoSetup = {
      lastRunAt: data.autoSetup?.lastRunAt || null,
      remainingSpaceMm: Number(data.autoSetup?.remainingSpaceMm) || 0
    };

    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  addNews(newsData) {
    const news = newsData instanceof NewsModel
      ? newsData
      : new NewsModel({
          ...newsData,
          pageNumber: this.pageNumber
        });

    news.pageNumber = this.pageNumber;
    this.news.push(news);
    this.updatedAt = new Date().toISOString();

    return news;
  }

  removeNews(newsId) {
    const originalLength = this.news.length;

    this.news = this.news.filter((news) => news.id !== newsId);

    const removed = this.news.length !== originalLength;

    if (removed) {
      this.updatedAt = new Date().toISOString();
    }

    return removed;
  }

  getNewsById(newsId) {
    return this.news.find((news) => news.id === newsId) || null;
  }

  addAdvertisement(advertisement) {
    if (!advertisement || !advertisement.id) {
      throw new Error("చెల్లుబాటు అయ్యే ప్రకటన వివరాలు అవసరం.");
    }

    this.advertisements.push({ ...advertisement });
    this.updatedAt = new Date().toISOString();

    return advertisement;
  }

  removeAdvertisement(advertisementId) {
    const originalLength = this.advertisements.length;

    this.advertisements = this.advertisements.filter(
      (advertisement) => advertisement.id !== advertisementId
    );

    const removed = this.advertisements.length !== originalLength;

    if (removed) {
      this.updatedAt = new Date().toISOString();
    }

    return removed;
  }

  updateDimensions({ widthMm, heightMm, columns } = {}) {
    if (widthMm !== undefined) {
      if (!Number.isFinite(Number(widthMm)) || Number(widthMm) <= 0) {
        throw new Error("పేజీ వెడల్పు సరిగ్గా లేదు.");
      }

      this.widthMm = Number(widthMm);
    }

    if (heightMm !== undefined) {
      if (!Number.isFinite(Number(heightMm)) || Number(heightMm) <= 0) {
        throw new Error("పేజీ ఎత్తు సరిగ్గా లేదు.");
      }

      this.heightMm = Number(heightMm);
    }

    if (columns !== undefined) {
      if (!Number.isInteger(Number(columns)) || Number(columns) < 1) {
        throw new Error("కాలమ్‌ల సంఖ్య కనీసం 1 ఉండాలి.");
      }

      this.columns = Number(columns);
    }

    this.updatedAt = new Date().toISOString();

    return this;
  }

  toJSON() {
    return {
      id: this.id,
      pageNumber: this.pageNumber,
      widthMm: this.widthMm,
      heightMm: this.heightMm,
      columns: this.columns,
      header: { ...this.header },
      news: this.news.map((news) => news.toJSON()),
      advertisements: this.advertisements.map((item) => ({ ...item })),
      layoutSettings: { ...this.layoutSettings },
      autoSetup: { ...this.autoSetup },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromJSON(data) {
    return new PageModel(data);
  }
}
