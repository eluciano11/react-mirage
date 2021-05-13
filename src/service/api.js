function NetworkError({ res, data }) {
  this.type = res.status === 403 ? "ForbiddenError" : "UnhandledError";
  this.errors = data.errors || {};
}

class FetchAdapter {
  baseUrl;

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async processResponse(res) {
    if (res.status >= 200 && res.status <= 299) {
      try {
        const data = await res.json();

        return data;
      } catch {
        return {};
      }
    } else {
      const data = await res.json();

      throw new NetworkError({ res, data });
    }
  }

  getBaseUrl(options) {
    if (options && options.baseUrl) {
      return options.baseUrl;
    }

    return this.baseUrl;
  }

  async get(endpoint, options) {
    const baseUrl = this.getBaseUrl(options);
    const res = await fetch(`${baseUrl}${endpoint}`);
    const data = await this.processResponse(res);

    return data;
  }

  async post(endpoint, params, options) {
    const baseUrl = this.getBaseUrl(options);
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      body: JSON.stringify(params),
    });
    const data = await this.processResponse(res);

    return data;
  }

  async delete(endpoint, options) {
    const baseUrl = this.getBaseUrl(options);
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: "DELETE",
    });

    const data = await this.processResponse(res);

    return data;
  }

  async patch(endpoint, params, options) {
    const baseUrl = this.getBaseUrl(options);
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: "PATCH",
      body: JSON.stringify(params),
    });
    const data = await this.processResponse(res);

    return data;
  }
}

class ApiService {
  adapter;

  constructor(adapter) {
    this.adapter = adapter;
  }

  async get(endpoint, options) {
    const res = await this.adapter.get(endpoint, options);

    return res;
  }

  async post(endpoint, params, options) {
    const res = await this.adapter.post(endpoint, params, options);

    return res;
  }

  async delete(endpoint, options) {
    const res = await this.adapter.delete(endpoint, options);

    return res;
  }

  async patch(endpoint, params, options) {
    const res = await this.adapter.patch(endpoint, params, options);

    return res;
  }
}

const adapter = new FetchAdapter("");

export default new ApiService(adapter);
