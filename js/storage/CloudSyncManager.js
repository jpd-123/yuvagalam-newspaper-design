// File: js/storage/CloudSyncManager.js
// Project: Satvika Publisher
// Purpose: Explicitly configured cloud API integration

export class CloudSyncManager {
  constructor({
    endpoint = "",
    getAccessToken = null
  } = {}) {
    this.endpoint = String(endpoint || "").trim().replace(/\/+$/, "");

    this.getAccessToken =
      typeof getAccessToken === "function"
        ? getAccessToken
        : null;
  }

  isConfigured() {
    return this.endpoint.length > 0;
  }

  getEndpoint() {
    if (!this.isConfigured()) {
      throw new Error(
        "Cloud Sync ఇంకా కాన్ఫిగర్ కాలేదు. ముందుగా నిజమైన సర్వర్ API చిరునామా అవసరం."
      );
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(this.endpoint);
    } catch {
      throw new Error("Cloud Sync API చిరునామా చెల్లదు.");
    }

    if (
      parsedUrl.protocol !== "https:" &&
      parsedUrl.hostname !== "localhost" &&
      parsedUrl.hostname !== "127.0.0.1"
    ) {
      throw new Error(
        "Cloud Sync కోసం HTTPS చిరునామా ఉపయోగించండి."
      );
    }

    return this.endpoint;
  }

  async request(path, {
    method = "GET",
    body = undefined
  } = {}) {
    const baseUrl = this.getEndpoint();

    const normalizedPath = String(path || "").replace(/^\/+/, "");

    const url = `${baseUrl}/${normalizedPath}`;

    const headers = {
      Accept: "application/json"
    };

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    if (this.getAccessToken) {
      const token = await this.getAccessToken();

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    let response;

    try {
      response = await fetch(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body)
      });
    } catch (error) {
      throw new Error(
        `Cloud APIకి కనెక్ట్ కాలేకపోయాం: ${error.message}`
      );
    }

    if (!response.ok) {
      throw new Error(
        `Cloud API లోపం: HTTP ${response.status}`
      );
    }

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      throw new Error(
        "Cloud API JSON స్పందన ఇవ్వలేదు. సర్వర్ APIని తనిఖీ చేయండి."
      );
    }

    return response.json();
  }

  async uploadResource(resourceType, data) {
    const allowedResources = [
      "masters",
      "editions",
      "advertisements"
    ];

    if (!allowedResources.includes(resourceType)) {
      throw new Error("ఈ రకమైన డేటాను Cloud Sync చేయలేము.");
    }

    if (!data || typeof data !== "object") {
      throw new Error("సింక్ చేయడానికి చెల్లుబాటు అయ్యే డేటా అవసరం.");
    }

    return this.request(`sync/${resourceType}`, {
      method: "PUT",
      body: data
    });
  }

  async downloadResource(resourceType, id) {
    const allowedResources = [
      "masters",
      "editions",
      "advertisements"
    ];

    if (!allowedResources.includes(resourceType)) {
      throw new Error("ఈ రకమైన డేటాను Cloud Sync చేయలేము.");
    }

    if (!id) {
      throw new Error("డౌన్‌లోడ్ చేయడానికి రికార్డు ID అవసరం.");
    }

    return this.request(
      `sync/${resourceType}/${encodeURIComponent(id)}`
    );
  }

  async getSyncStatus() {
    return {
      configured: this.isConfigured(),
      available: this.isConfigured(),
      message: this.isConfigured()
        ? "Cloud API కాన్ఫిగర్ చేయబడింది. కనెక్షన్‌ను పరీక్షించాలి."
        : "Cloud Sync ఇంకా ప్రారంభించలేదు. API చిరునామా అవసరం."
    };
  }
}

export const cloudSyncManager = new CloudSyncManager();
