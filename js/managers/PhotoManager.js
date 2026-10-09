// File: js/managers/PhotoManager.js
// Project: Satvika Publisher
// Purpose: News photo processing and storage

import { indexedDBManager } from "../storage/IndexedDBManager.js";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;
const MAX_PHOTOS_PER_STORY = 3;

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return `photo-${globalThis.crypto.randomUUID()}`;
  }

  return `photo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);

    reader.onerror = () => {
      reject(new Error("ఫొటో ఫైల్‌ను చదవలేకపోయాం."));
    };

    reader.readAsDataURL(file);
  });
}

function getImageDimensions(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight
      });
    };

    image.onerror = () => {
      reject(new Error("చిత్రం తెరవలేకపోయాం."));
    };

    image.src = dataUrl;
  });
}

export class PhotoManager {
  constructor({
    storage = indexedDBManager,
    maxFileSizeBytes = MAX_FILE_SIZE_BYTES,
    maxPhotosPerStory = MAX_PHOTOS_PER_STORY
  } = {}) {
    this.storage = storage;
    this.maxFileSizeBytes = maxFileSizeBytes;
    this.maxPhotosPerStory = maxPhotosPerStory;
  }

  validateFile(file) {
    if (!file) {
      throw new Error("ముందుగా ఫొటోను ఎంచుకోండి.");
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      throw new Error(
        "JPG, PNG, WebP లేదా GIF ఫార్మాట్‌లోని ఫొటోను ఎంచుకోండి."
      );
    }

    if (file.size <= 0) {
      throw new Error("ఎంచుకున్న ఫొటో ఖాళీగా ఉంది.");
    }

    if (file.size > this.maxFileSizeBytes) {
      throw new Error(
        "ఫొటో పరిమాణం 15 MB కంటే ఎక్కువగా ఉంది. చిన్న ఫైల్‌ను ఎంచుకోండి."
      );
    }

    return true;
  }

  async prepareFile(file) {
    this.validateFile(file);

    const dataUrl = await readFileAsDataURL(file);
    const dimensions = await getImageDimensions(dataUrl);

    return {
      id: createId(),
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      dataUrl,
      width: dimensions.width,
      height: dimensions.height,
      shape: "rectangle",
      displaySize: "medium",
      position: "right",
      createdAt: new Date().toISOString()
    };
  }

  async addPhotoToStory(editionId, pageNumber, newsId, file) {
    const record = await this.storage.getEdition(editionId);

    if (!record) {
      throw new Error("రోజువారీ ఎడిషన్ కనుగొనబడలేదు.");
    }

    const page = record.layout?.pages?.find(
      (item) => Number(item.pageNumber) === Number(pageNumber)
    );

    if (!page) {
      throw new Error("ఎంచుకున్న పేజీ కనుగొనబడలేదు.");
    }

    const news = (page.news || []).find(
      (item) => item.id === newsId
    );

    if (!news) {
      throw new Error("ఫొటో జోడించాల్సిన వార్త కనుగొనబడలేదు.");
    }

    if (!Array.isArray(news.photos)) {
      news.photos = [];
    }

    if (news.photos.length >= this.maxPhotosPerStory) {
      throw new Error(
        "ఒక వార్తకు గరిష్ఠంగా 3 ఫొటోలు మాత్రమే జోడించవచ్చు."
      );
    }

    const photo = await this.prepareFile(file);

    news.photos.push({
      id: photo.id,
      src: photo.dataUrl,
      alt: photo.fileName,
      shape: photo.shape,
      size: photo.displaySize,
      position: photo.position,
      width: photo.width,
      height: photo.height
    });

    news.updatedAt = new Date().toISOString();
    record.updatedAt = new Date().toISOString();

    await this.storage.saveEdition(record);

    return photo;
  }

  async removePhotoFromStory(
    editionId,
    pageNumber,
    newsId,
    photoId
  ) {
    const record = await this.storage.getEdition(editionId);

    if (!record) {
      throw new Error("రోజువారీ ఎడిషన్ కనుగొనబడలేదు.");
    }

    const page = record.layout?.pages?.find(
      (item) => Number(item.pageNumber) === Number(pageNumber)
    );

    const news = page?.news?.find(
      (item) => item.id === newsId
    );

    if (!news || !Array.isArray(news.photos)) {
      return false;
    }

    const oldLength = news.photos.length;

    news.photos = news.photos.filter(
      (photo) => photo.id !== photoId
    );

    if (news.photos.length === oldLength) {
      return false;
    }

    news.updatedAt = new Date().toISOString();
    record.updatedAt = new Date().toISOString();

    await this.storage.saveEdition(record);

    return true;
  }

  async setPhotoLayout(
    editionId,
    pageNumber,
    newsId,
    photoId,
    changes = {}
  ) {
    const allowedSizes = ["large", "medium", "small"];

    const allowedShapes = [
      "rectangle",
      "circle",
      "oval",
      "rounded"
    ];

    const allowedPositions = [
      "left",
      "right",
      "top",
      "bottom"
    ];

    const record = await this.storage.getEdition(editionId);

    if (!record) {
      throw new Error("రోజువారీ ఎడిషన్ కనుగొనబడలేదు.");
    }

    const page = record.layout?.pages?.find(
      (item) => Number(item.pageNumber) === Number(pageNumber)
    );

    const news = page?.news?.find(
      (item) => item.id === newsId
    );

    const photo = news?.photos?.find(
      (item) => item.id === photoId
    );

    if (!photo) {
      throw new Error("ఫొటో కనుగొనబడలేదు.");
    }

    if (
      changes.size !== undefined &&
      !allowedSizes.includes(changes.size)
    ) {
      throw new Error("ఫొటో పరిమాణం చెల్లదు.");
    }

    if (
      changes.shape !== undefined &&
      !allowedShapes.includes(changes.shape)
    ) {
      throw new Error("ఫొటో ఆకారం చెల్లదు.");
    }

    if (
      changes.position !== undefined &&
      !allowedPositions.includes(changes.position)
    ) {
      throw new Error("ఫొటో స్థానం చెల్లదు.");
    }

    if (changes.size !== undefined) {
      photo.size = changes.size;
    }

    if (changes.shape !== undefined) {
      photo.shape = changes.shape;
    }

    if (changes.position !== undefined) {
      photo.position = changes.position;
    }

    news.updatedAt = new Date().toISOString();
    record.updatedAt = new Date().toISOString();

    await this.storage.saveEdition(record);

    return { ...photo };
  }

  async savePhotoAsset(file) {
    const photo = await this.prepareFile(file);

    await this.storage.savePhoto({
      id: photo.id,
      fileName: photo.fileName,
      mimeType: photo.mimeType,
      sizeBytes: photo.sizeBytes,
      dataUrl: photo.dataUrl,
      width: photo.width,
      height: photo.height,
      createdAt: photo.createdAt
    });

    return photo;
  }

  async getPhotoAsset(photoId) {
    return this.storage.getPhoto(photoId);
  }

  async deletePhotoAsset(photoId) {
    return this.storage.deletePhoto(photoId);
  }
}

export const photoManager = new PhotoManager();
