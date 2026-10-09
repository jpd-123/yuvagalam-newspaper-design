// File: js/managers/MasterLayoutManager.js
// Project: Satvika Publisher
// Purpose: Manage master newspaper layouts

import { MasterLayoutModel } from "../models/MasterLayoutModel.js";
import { indexedDBManager } from "../storage/IndexedDBManager.js";

const MAX_MASTER_LAYOUTS = 5;

export class MasterLayoutManager {
  constructor({
    storage = indexedDBManager,
    maxLayouts = MAX_MASTER_LAYOUTS
  } = {}) {
    this.storage = storage;
    this.maxLayouts = maxLayouts;
  }

  async getAll() {
    const records = await this.storage.getAllMasters();

    return records
      .map((record) => MasterLayoutModel.fromJSON(record))
      .sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
  }

  async getById(id) {
    if (!id) {
      return null;
    }

    const record = await this.storage.getMaster(id);

    return record ? MasterLayoutModel.fromJSON(record) : null;
  }

  async save(layoutData) {
    const layout = layoutData instanceof MasterLayoutModel
      ? layoutData
      : MasterLayoutModel.fromJSON(layoutData);

    const validation = layout.validate();

    if (!validation.valid) {
      throw new Error(
        `మాస్టర్ లేఅవుట్‌లో లోపాలు ఉన్నాయి: ${validation.errors.join(" ")}`
      );
    }

    const existing = await this.storage.getMaster(layout.id);

    if (!existing) {
      const layouts = await this.storage.getAllMasters();

      if (layouts.length >= this.maxLayouts) {
        const removable = layouts
          .filter((item) => item.pinned !== true)
          .sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
          });

        if (removable.length === 0) {
          throw new Error(
            "గరిష్ఠంగా 5 మాస్టర్ లేఅవుట్లు మాత్రమే ఉంచవచ్చు. అన్నీ పిన్ చేయబడ్డాయి; కొత్తదాన్ని సేవ్ చేయడానికి ఒకదాన్ని అన్‌పిన్ చేయండి."
          );
        }

        await this.storage.deleteMaster(removable[0].id);
      }
    }

    const record = {
      ...layout.toJSON(),
      pinned: existing?.pinned === true
        ? true
        : layoutData.pinned === true
    };

    await this.storage.saveMaster(record);

    return MasterLayoutModel.fromJSON(record);
  }

  async delete(id) {
    const existing = await this.storage.getMaster(id);

    if (!existing) {
      return false;
    }

    if (existing.pinned === true) {
      throw new Error(
        "ఈ మాస్టర్ లేఅవుట్ పిన్ చేయబడింది. తొలగించే ముందు అన్‌పిన్ చేయండి."
      );
    }

    await this.storage.deleteMaster(id);

    return true;
  }

  async rename(id, newName) {
    const layout = await this.getById(id);

    if (!layout) {
      throw new Error("మాస్టర్ లేఅవుట్ కనుగొనబడలేదు.");
    }

    layout.rename(newName);

    return this.save(layout);
  }

  async setPinned(id, pinned) {
    const record = await this.storage.getMaster(id);

    if (!record) {
      throw new Error("మాస్టర్ లేఅవుట్ కనుగొనబడలేదు.");
    }

    record.pinned = Boolean(pinned);
    record.updatedAt = new Date().toISOString();

    await this.storage.saveMaster(record);

    return MasterLayoutModel.fromJSON(record);
  }

  async duplicate(id, newName) {
    const original = await this.getById(id);

    if (!original) {
      throw new Error("కాపీ చేయాల్సిన మాస్టర్ లేఅవుట్ కనుగొనబడలేదు.");
    }

    const copyData = original.toJSON();

    delete copyData.id;
    delete copyData.createdAt;
    delete copyData.updatedAt;

    copyData.name = String(
      newName || `${original.name} - కాపీ`
    ).trim();

    copyData.pages = copyData.pages.map((page) => ({
      ...page,
      id: undefined,
      news: page.news.map((news) => ({
        ...news,
        id: undefined
      }))
    }));

    return this.save(new MasterLayoutModel(copyData));
  }

  async getCount() {
    const records = await this.storage.getAllMasters();

    return records.length;
  }
}

export const masterLayoutManager = new MasterLayoutManager();
