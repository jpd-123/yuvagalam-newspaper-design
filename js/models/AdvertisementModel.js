// File: js/models/AdvertisementModel.js
// Project: Satvika Publisher
// Purpose: Advertisement data model

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return `ad-${globalThis.crypto.randomUUID()}`;
  }

  return `ad-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export class AdvertisementModel {
  constructor(data = {}) {
    this.id = data.id || createId();

    this.name = String(data.name || "కొత్త ప్రకటన").trim();

    this.imageData = data.imageData || null;
    this.fileName = data.fileName || "";
    this.mimeType = data.mimeType || "";

    this.width = Number(data.width) || null;
    this.height = Number(data.height) || null;

    this.pinned = data.pinned === true;
    this.active = data.active !== false;

    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  rename(name) {
    const nextName = String(name || "").trim();

    if (!nextName) {
      throw new Error("ప్రకటన పేరు ఖాళీగా ఉండకూడదు.");
    }

    this.name = nextName;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  setImage({
    imageData,
    fileName = "",
    mimeType = "",
    width = null,
    height = null
  }) {
    if (typeof imageData !== "string" || !imageData.trim()) {
      throw new Error("ప్రకటన చిత్ర డేటా అవసరం.");
    }

    if (
      mimeType &&
      !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(
        mimeType
      )
    ) {
      throw new Error("ఈ ప్రకటన చిత్ర ఫార్మాట్‌కు మద్దతు లేదు.");
    }

    this.imageData = imageData;
    this.fileName = fileName;
    this.mimeType = mimeType;
    this.width = Number(width) || null;
    this.height = Number(height) || null;
    this.updatedAt = new Date().toISOString();

    return this;
  }

  setPinned(pinned) {
    this.pinned = Boolean(pinned);
    this.updatedAt = new Date().toISOString();

    return this;
  }

  setActive(active) {
    this.active = Boolean(active);
    this.updatedAt = new Date().toISOString();

    return this;
  }

  validate() {
    const errors = [];

    if (!this.name) {
      errors.push("ప్రకటన పేరు అవసరం.");
    }

    if (!this.imageData) {
      errors.push("ప్రకటన చిత్రం ఇంకా జోడించలేదు.");
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
      imageData: this.imageData,
      fileName: this.fileName,
      mimeType: this.mimeType,
      width: this.width,
      height: this.height,
      pinned: this.pinned,
      active: this.active,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromJSON(data) {
    return new AdvertisementModel(data);
  }
}
