// File: js/managers/DailyEditionManager.js
// Project: Satvika Publisher
// Purpose: Manage daily newspaper editions

import { DailyEditionModel } from "../models/DailyEditionModel.js";
import { MasterLayoutModel } from "../models/MasterLayoutModel.js";
import { indexedDBManager } from "../storage/IndexedDBManager.js";

export class DailyEditionManager {
  constructor({
    storage = indexedDBManager
  } = {}) {
    this.storage = storage;
  }

  async createFromMaster(masterLayoutId, editionDate = null) {
    const masterRecord = await this.storage.getMaster(masterLayoutId);

    if (!masterRecord) {
      throw new Error("ఎంచుకున్న మాస్టర్ లేఅవుట్ కనుగొనబడలేదు.");
    }

    const master = MasterLayoutModel.fromJSON(masterRecord);

    const edition = DailyEditionModel.createFromMaster(
      master,
      editionDate
    );

    await this.storage.saveEdition(edition.toJSON());

    return edition;
  }

  async getAll() {
    const records = await this.storage.getAllEditions();

    return records
      .map((record) => DailyEditionModel.fromJSON(record))
      .sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
  }

  async getById(id) {
    if (!id) {
      return null;
    }

    const record = await this.storage.getEdition(id);

    return record ? DailyEditionModel.fromJSON(record) : null;
  }

  async save(editionData) {
    const edition = editionData instanceof DailyEditionModel
      ? editionData
      : DailyEditionModel.fromJSON(editionData);

    const validation = edition.validate();

    if (!validation.valid) {
      throw new Error(
        `ఎడిషన్‌లో లోపాలు ఉన్నాయి: ${validation.errors.join(" ")}`
      );
    }

    edition.updatedAt = new Date().toISOString();

    await this.storage.saveEdition(edition.toJSON());

    return edition;
  }

  async updateEdition(id, changes = {}) {
    const edition = await this.getById(id);

    if (!edition) {
      throw new Error("రోజువారీ ఎడిషన్ కనుగొనబడలేదు.");
    }

    if (changes.name !== undefined) {
      edition.rename(changes.name);
    }

    if (changes.editionDate !== undefined) {
      edition.setEditionDate(changes.editionDate);
    }

    if (changes.status !== undefined) {
      edition.setStatus(changes.status);
    }

    if (changes.layout !== undefined) {
      edition.layout = JSON.parse(JSON.stringify(changes.layout));
    }

    return this.save(edition);
  }

  async delete(id) {
    const existing = await this.storage.getEdition(id);

    if (!existing) {
      return false;
    }

    await this.storage.deleteEdition(id);

    return true;
  }

  async addNews(editionId, pageNumber, newsData) {
    const edition = await this.getById(editionId);

    if (!edition) {
      throw new Error("రోజువారీ ఎడిషన్ కనుగొనబడలేదు.");
    }

    edition.addNews(pageNumber, newsData);

    return this.save(edition);
  }

  async removeNews(editionId, pageNumber, newsId) {
    const edition = await this.getById(editionId);

    if (!edition) {
      throw new Error("రోజువారీ ఎడిషన్ కనుగొనబడలేదు.");
    }

    const removed = edition.removeNews(pageNumber, newsId);

    if (removed) {
      await this.save(edition);
    }

    return removed;
  }

  async getEditionsForDate(date) {
    const normalizedDate = String(date || "");

    const editions = await this.getAll();

    return editions.filter(
      (edition) => edition.editionDate === normalizedDate
    );
  }
}

export const dailyEditionManager = new DailyEditionManager();
