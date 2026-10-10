/**
 * Satvika Publisher
 * File: js/engines/NewsFlowEngine.js
 *
 * Responsibility:
 * - Prepare continuation data for overflowing news.
 * - Keep the original news unchanged.
 * - Return first-page and continuation-page content.
 */

export class NewsFlowEngine {
  constructor(options = {}) {
    this.defaultFirstPageLabel =
      options.firstPageLabel || "(తరువాయి భాగం తదుపరి పేజీలో)";

    this.defaultContinuationLabel =
      options.continuationLabel || "(మొదటి పేజీ తరువాయి)";
  }

  splitNews(news, options = {}) {
    if (!news || typeof news !== "object") {
      throw new Error("విభజించడానికి చెల్లుబాటు అయ్యే వార్త అవసరం.");
    }

    const body = String(news.body || "");
    const paragraphs = body
      .split(/\r?\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    if (paragraphs.length < 2) {
      return {
        success: false,
        reason: "NOT_ENOUGH_PARAGRAPHS",
        message: "వార్తలో కనీసం రెండు పేరాలు ఉండాలి."
      };
    }

    let splitIndex = Number(options.splitAfterParagraph);

    if (!Number.isInteger(splitIndex)) {
      splitIndex = Math.max(1, Math.ceil(paragraphs.length / 2));
    }

    splitIndex = Math.min(
      paragraphs.length - 1,
      Math.max(1, splitIndex)
    );

    const firstBody = paragraphs
      .slice(0, splitIndex)
      .join("\n\n");

    const continuationBody = paragraphs
      .slice(splitIndex)
      .join("\n\n");

    const firstPageLabel =
      options.firstPageLabel || this.defaultFirstPageLabel;

    const continuationLabel =
      options.continuationLabel || this.defaultContinuationLabel;

    const firstPageNews = {
      ...news,
      body: firstBody,
      continuationNotice: firstPageLabel,
      continuation: true,
      continuationPart: 1,
      continuationTargetPage: options.targetPage || null
    };

    const continuationNews = {
      ...news,
      id: this.createContinuationId(news.id),
      headline: news.headline || "",
      subheadlines: [],
      dateline: "",
      body: continuationBody,
      continuationNotice: continuationLabel,
      continuation: true,
      continuationPart: 2,
      originalNewsId: news.id,
      continuationSourcePage: options.sourcePage || null,
      photos: options.movePhotosToContinuation
        ? [...(news.photos || [])]
        : []
    };

    return {
      success: true,
      originalNewsId: news.id,
      firstPageNews,
      continuationNews,
      splitAfterParagraph: splitIndex,
      firstParagraphCount: splitIndex,
      continuationParagraphCount:
        paragraphs.length - splitIndex
    };
  }

  createContinuationId(originalId) {
    const suffix =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    return `${originalId || "news"}-continuation-${suffix}`;
  }

  getContinuationLabel(pageNumber) {
    const number = Number(pageNumber);

    if (!Number.isInteger(number) || number < 1) {
      throw new Error("చెల్లుబాటు అయ్యే పేజీ నంబర్ ఇవ్వండి.");
    }

    return `(మొదటి పేజీ తరువాయి — ${number}వ పేజీ)`;
  }
}

export default NewsFlowEngine;
