// File: js/managers/AdvertisementManager.js
// Project: Satvika Publisher
// Purpose: Manage saved advertisements

import { AdvertisementModel } from "../models/AdvertisementModel.js";
import { indexedDBManager } from "../storage/IndexedDBManager.js";

const MAX_ADVERTISEMENTS = 10;

export class AdvertisementManager {
  constructor({
    storage = indexedDBManager,
    maxAdvertisements = MAX_ADVERTISEMENTS
  } = {}) {
    this.storage = storage;
    this.maxAdvertisements = maxAdvertisements;
  }

  async getAll() {
    const records = await this.storage.getAllAdvertisements();

    return records
      .map((record) => AdvertisementModel.fromJSON(record))
      .sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }

  async getById(id) {
    const records = await this.storage.getAllAdvertisements();

    const record = records.find((item) => item.id === id);

    return record ? AdvertisementModel.fromJSON(record) : null;
  }

  async save(advertisementData) {
    const advertisement =
      advertisementData instanceof AdvertisementModel
        ? advertisementData
        : AdvertisementModel.fromJSON(advertisementData);

    const validation = advertisement.validate();

    if (!validation.valid) {
      throw new Error(validation.errors.join(" "));
    }

    const existing = await this.storage.getAllAdvertisements();

    const isUpdate = existing.some(
      (item) => item.id === advertisement.id
    );

    if (!isUpdate && existing.length >= this.maxAdvertisements) {
      const removable = existing
        .filter((item) => item.pinned !== true)
        .sort((a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });

      if (removable.length === 0) {
        throw new Error(
          "గరిష్ఠంగా 10 ప్రకటనలు మాత్రమే ఉంచవచ్చు. అన్ని ప్రకటనలు పిన్ చేయబడ్డాయి; కొత్త ప్రకటనను సేవ్ చేయడానికి ఒకదాన్ని అన్‌పిన్ చేయండి."
        );
      }

      await this.storage.deleteAdvertisement(removable[0].id);
    }

    advertisement.updatedAt = new Date().toISOString();

    await this.storage.saveAdvertisement(
      advertisement.toJSON()
    );

    return advertisement;
  }

  async delete(id) {
    const advertisement = await this.getById(id);

    if (!advertisement) {
      return false;
    }

    if (advertisement.pinned) {
      throw new Error(
        "ఈ ప్రకటన పిన్ చేయబడింది. తొలగించే ముందు అన్‌పిన్ చేయండి."
      );
    }

    await this.storage.deleteAdvertisement(id);

    return true;
  }

  async setPinned(id, pinned) {
    const advertisement = await this.getById(id);

    if (!advertisement) {
      throw new Error("ప్రకటన కనుగొనబడలేదు.");
    }

    advertisement.setPinned(pinned);

    await this.storage.saveAdvertisement(
      advertisement.toJSON()
    );

    return advertisement;
  }

  async rename(id, newName) {
    const advertisement = await this.getById(id);

    if (!advertisement) {
      throw new Error("ప్రకటన కనుగొనబడలేదు.");
    }

    advertisement.rename(newName);

    await this.storage.saveAdvertisement(
      advertisement.toJSON()
    );

    return advertisement;
  }

  async getCount() {
    const records = await this.storage.getAllAdvertisements();

    return records.length;
  }
}

export const advertisementManager = new AdvertisementManager();
