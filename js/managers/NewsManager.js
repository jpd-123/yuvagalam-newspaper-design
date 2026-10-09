// File: js/managers/NewsManager.js
// Project: Satvika Publisher
// Purpose: Manage news stories in daily editions

import { NewsModel } from "../models/NewsModel.js";
import { indexedDBManager } from "../storage/IndexedDBManager.js";

export class NewsManager {
  constructor({
    storage = indexedDBManager
  } = {}) {
    this.storage = storage;
  }

  async getEditionRecord(editionId) {
    const record = await this.storage.getEdition(editionId);

    if (!record) {
      throw new Error("రోజువారీ ఎడిషన్ కనుగొనబడలేదు.");
    }

    if (!record.layout || !Array.isArray(record.layout.pages)) {
      throw new Error("ఎడిషన్ పేజీల సమాచారం సరిగా లేదు.");
    }

    return record;
  }

  getPage(record, pageNumber) {
    const page = record.layout.pages.find(
      (item) => Number(item.pageNumber) === Number(pageNumber)
    );

    if (!page) {
      throw new Error(`పేజీ ${pageNumber} కనుగొనబడలేదు.`);
    }

    if (!Array.isArray(page.news)) {
      page.news = [];
    }

    return page;
  }

  async addNews(editionId, pageNumber, newsData) {
    const record = await this.getEditionRecord(editionId);
    const page = this.getPage(record, pageNumber);

    const news = new NewsModel({
      ...newsData,
      pageNumber: Number(pageNumber)
    });

    const validation = news.validate();

    if (!validation.valid) {
      throw new Error(validation.errors.join(" "));
    }

    page.news.push(news.toJSON());

    record.updatedAt = new Date().toISOString();

    await this.storage.saveEdition(record);

    return news;
  }

  async updateNews(editionId, pageNumber, newsId, changes) {
    const record = await this.getEditionRecord(editionId);
    const page = this.getPage(record, pageNumber);

    const index = page.news.findIndex(
      (item) => item.id === newsId
    );

    if (index === -1) {
      throw new Error("సవరించాల్సిన వార్త కనుగొనబడలేదు.");
    }

    const news = NewsModel.fromJSON(page.news[index]);

    news.update(changes);

    const validation = news.validate();

    if (!validation.valid) {
      throw new Error(validation.errors.join(" "));
    }

    page.news[index] = news.toJSON();

    record.updatedAt = new Date().toISOString();

    await this.storage.saveEdition(record);

    return news;
  }

  async deleteNews(editionId, pageNumber, newsId) {
    const record = await this.getEditionRecord(editionId);
    const page = this.getPage(record, pageNumber);

    const oldLength = page.news.length;

    page.news = page.news.filter(
      (news) => news.id !== newsId
    );

    if (page.news.length === oldLength) {
      return false;
    }

    record.updatedAt = new Date().toISOString();

    await this.storage.saveEdition(record);

    return true;
  }

  async getNewsById(editionId, newsId) {
    const record = await this.getEditionRecord(editionId);

    for (const page of record.layout.pages) {
      const news = (page.news || []).find(
        (item) => item.id === newsId
      );

      if (news) {
        return {
          pageNumber: page.pageNumber,
          news: NewsModel.fromJSON(news)
        };
      }
    }

    return null;
  }

  async getNewsForPage(editionId, pageNumber) {
    const record = await this.getEditionRecord(editionId);
    const page = this.getPage(record, pageNumber);

    return page.news.map((news) => NewsModel.fromJSON(news));
  }

  async moveNews(
    editionId,
    sourcePageNumber,
    targetPageNumber,
    newsId
  ) {
    if (Number(sourcePageNumber) === Number(targetPageNumber)) {
      throw new Error("వార్త ఇప్పటికే ఆ పేజీలోనే ఉంది.");
    }

    const record = await this.getEditionRecord(editionId);

    const sourcePage = this.getPage(record, sourcePageNumber);
    const targetPage = this.getPage(record, targetPageNumber);

    const index = sourcePage.news.findIndex(
      (news) => news.id === newsId
    );

    if (index === -1) {
      throw new Error("తరలించాల్సిన వార్త కనుగొనబడలేదు.");
    }

    const [news] = sourcePage.news.splice(index, 1);

    news.pageNumber = Number(targetPageNumber);
    news.updatedAt = new Date().toISOString();

    targetPage.news.push(news);

    record.updatedAt = new Date().toISOString();

    await this.storage.saveEdition(record);

    return NewsModel.fromJSON(news);
  }

  async getAllNews(editionId) {
    const record = await this.getEditionRecord(editionId);
    const results = [];

    for (const page of record.layout.pages) {
      for (const news of page.news || []) {
        results.push({
          pageNumber: page.pageNumber,
          news: NewsModel.fromJSON(news)
        });
      }
    }

    return results;
  }
}

export const newsManager = new NewsManager();
