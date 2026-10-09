// File: js/managers/BrandingManager.js
// Project: Satvika Publisher
// Purpose: Manage newspaper branding and masthead data

import { MasterLayoutModel } from "../models/MasterLayoutModel.js";
import { indexedDBManager } from "../storage/IndexedDBManager.js";

const ALLOWED_BRANDING_FIELDS = [
  "newspaperName",
  "logo",
  "reportersAd",
  "quoteHeading",
  "quoteText",
  "volumeNumber",
  "issueNumber",
  "publicationDay",
  "publicationDate",
  "publicationMonth",
  "publicationYear",
  "pageCountLabel",
  "coverPrice",
  "footerBulletStyle"
];

export class BrandingManager {
  constructor({
    storage = indexedDBManager
  } = {}) {
    this.storage = storage;
  }

  async getBranding(masterLayoutId) {
    const record = await this.storage.getMaster(masterLayoutId);

    if (!record) {
      throw new Error("మాస్టర్ లేఅవుట్ కనుగొనబడలేదు.");
    }

    const master = MasterLayoutModel.fromJSON(record);

    return { ...master.branding };
  }

  async updateBranding(masterLayoutId, changes = {}) {
    const record = await this.storage.getMaster(masterLayoutId);

    if (!record) {
      throw new Error("మాస్టర్ లేఅవుట్ కనుగొనబడలేదు.");
    }

    const master = MasterLayoutModel.fromJSON(record);
    const safeChanges = {};

    for (const field of ALLOWED_BRANDING_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(changes, field)) {
        safeChanges[field] = changes[field];
      }
    }

    if (
      safeChanges.newspaperName !== undefined &&
      !String(safeChanges.newspaperName).trim()
    ) {
      throw new Error("పత్రిక పేరు ఖాళీగా ఉండకూడదు.");
    }

    master.updateBranding(safeChanges);

    const updatedRecord = {
      ...master.toJSON(),
      pinned: record.pinned === true
    };

    await this.storage.saveMaster(updatedRecord);

    return { ...master.branding };
  }

  async updateEditionBranding(edition, changes = {}) {
    if (!edition || !edition.layout) {
      throw new Error("సరైన రోజువారీ ఎడిషన్ అవసరం.");
    }

    if (!edition.layout.branding) {
      edition.layout.branding = {};
    }

    const safeChanges = {};

    for (const field of ALLOWED_BRANDING_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(changes, field)) {
        safeChanges[field] = changes[field];
      }
    }

    if (
      safeChanges.newspaperName !== undefined &&
      !String(safeChanges.newspaperName).trim()
    ) {
      throw new Error("పత్రిక పేరు ఖాళీగా ఉండకూడదు.");
    }

    edition.layout.branding = {
      ...edition.layout.branding,
      ...safeChanges
    };

    edition.updatedAt = new Date().toISOString();

    await this.storage.saveEdition(edition.toJSON());

    return { ...edition.layout.branding };
  }

  async setLogo(masterLayoutId, logoData) {
    if (
      logoData !== null &&
      typeof logoData !== "string"
    ) {
      throw new Error("లోగోను Data URL లేదా URL రూపంలో ఇవ్వాలి.");
    }

    return this.updateBranding(masterLayoutId, {
      logo: logoData
    });
  }

  async setReportersAd(masterLayoutId, adData) {
    if (adData !== null && typeof adData !== "string") {
      throw new Error("విలేకరుల ప్రకటన చిత్ర వివరాలు సరైనవి కావు.");
    }

    return this.updateBranding(masterLayoutId, {
      reportersAd: adData
    });
  }

  async setQuote(masterLayoutId, heading, text) {
    return this.updateBranding(masterLayoutId, {
      quoteHeading: String(heading || ""),
      quoteText: String(text || "")
    });
  }
}

export const brandingManager = new BrandingManager();
