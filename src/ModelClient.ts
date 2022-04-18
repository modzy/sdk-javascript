import axios from "axios";
import { compareTwoStrings } from "string-similarity";

import { ApiError } from "./ApiError";
import { Logger } from "./Logger";
import { DEFAULT_URL } from "./constants";

import type {
  ClassInitiator,
  GetModelsParams,
  GetModelDetailsParams,
  Model,
  LatestModel,
  GetModelByIdResponse,
  GetModelDetailsResponse,
  GetModelVersionsByIdResponse,
} from "./types";

interface ModelWithDistance extends GetModelByIdResponse {
  distance: number;
}

export class ModelClient {
  logger: Logger;
  readonly baseUrl: string;
  readonly headers: {
    Authorization: string;
  };

  /**
   * Creates a ModelClient
   * @param {Object} config object
   * @param {string} config.url - base url of modzy api (i.e.: https://app.modzy.com)
   * @param {string} config.apiKey - user's API key
   */
  constructor({ url = DEFAULT_URL, apiKey, logging }: ClassInitiator) {
    this.baseUrl = url;
    this.headers = {
      Authorization: `ApiKey ${apiKey}`,
    };
    this.logger = new Logger(logging);
  }

  /**
   * Get a list of models with very basic info such as modelId, versions, and latestVersion
   * based on specified params. Returns the first 500 models if no params are sent.
   *
   * @param {Object} criteria - Search criteria object
   * @param {string} criteria.modelId - The model's id
   * @param {string} criteria.author - The model publisher's name
   * @param {string} criteria.createdByEmail - The model publisher's email
   * @param {string} criteria.name - The model's name
   * @param {string} criteria.description - The model's description
   * @param {boolean} criteria.isActive - If the model is active or not
   * @param {boolean} criteria.isExpired - If the model is expired or not
   * @param {boolean} criteria.isFeatured - If the model is featured or not
   * @param {string} criteria.lastActiveDateTime - ISO 8601 date string representing when the model was last used
   * @param {string} criteria.expirationDateTime - ISO 8601 date string representing when the model expires
   * @param {number} criteria.page - This api call is paginated. This is the page of results to return
   * @param {number} criteria.perPage - This api call is paginated. This is number of results per page to return
   * @param {string} criteria.sortBy - Sort the results by this key
   * @param {"ASC" | "DESC"} criteria.direction - Sort direction of the results
   */
  getModels({
    modelId,
    author,
    createdByEmail,
    name,
    description,
    isActive,
    isExpired,
    isFeatured,
    lastActiveDateTime,
    expirationDateTime,
    page,
    perPage = 500,
    sortBy,
    direction,
  }: GetModelsParams = {}): Promise<Model[]> {
    const params = {
      modelId,
      author,
      createdByEmail,
      name,
      description,
      isActive,
      isExpired,
      isRecommended: isFeatured,
      lastActiveDateTime,
      expirationDateTime,
      "sort-by": sortBy,
      direction,
      page: page,
      "per-page": perPage,
    };

    let key: keyof typeof params;

    for (key in params) {
      // catch both undefined and null
      if (params?.[key] == null) {
        delete params[key];
      }
    }

    const requestUrl = `${this.baseUrl}/api/models`;
    this.logger.debug(`getModels(${params}) GET ${requestUrl}`);

    return axios
      .get(requestUrl, {
        headers: this.headers,
        params,
      })
      .then(({ data }) => {
        this.logger.info(`getModels response:`, data);
        return data;
      })
      .catch((error) => {
        this.logger.error("getModels error:", error);
        throw new ApiError(error);
      });
  }

  /**
   * DEPRECATED
   * Get first 500 models models, this method is a wrapper of
   * [ModelClient#getModels()]{@link ModelClient#getModels} method.
   * @see {@link ModelClient#getModels}
   * @returns {Model[]} - A list of all Modzy Models
   * @throws {ApiError} Error if there is something wrong with the service or the call
   */
  getAllModels() {
    this.logger.debug("getAllModels called");
    return this.getModels();
  }

  /**
   * Get a list of all active models and their names, descriptions, and active versions
   */
  getActiveModels(): Promise<LatestModel[]> {
    const requestUrl = `${this.baseUrl}/api/models/latest`;

    this.logger.debug(`getActiveModels GET ${requestUrl}`);

    return axios
      .get(requestUrl, {
        headers: this.headers,
      })
      .then((response) => {
        this.logger.info("getActiveModels response", response);
        return response.data;
      })
      .catch((error) => {
        this.logger.error("getActiveModels error", error);
        throw new ApiError(error);
      });
  }

  /**
   * Get model instance by it's identifier
   */
  getModelById(modelId: string): Promise<GetModelByIdResponse> {
    const requestUrl = `${this.baseUrl}/api/models/${modelId}`;

    this.logger.debug(`getModelById GET ${requestUrl}`);

    return axios
      .get(requestUrl, { headers: this.headers })
      .then((response) => {
        this.logger.info("getModelById response", response);
        return response.data;
      })
      .catch((error) => {
        this.logger.error("getModelById error", error);
        throw new ApiError(error);
      });
  }

  getModelDetails({
    modelId,
    version,
  }: GetModelDetailsParams): Promise<GetModelDetailsResponse> {
    const requestUrl = `${this.baseUrl}/api/models/${modelId}/versions/${version}`;

    this.logger.debug(`getModelVersion GET ${requestUrl}`);

    return axios
      .get(requestUrl, { headers: this.headers })
      .then((response) => {
        this.logger.info("getModelVersion response", response);
        return response.data;
      })
      .catch((error) => {
        this.logger.error("getModelVersion error", error);
        throw new ApiError(error);
      });
  }

  getModelByName(name: string): Promise<GetModelByIdResponse> {
    this.logger.debug("getModelByName called");

    return this.getModels({
      name,
      sortBy: "name",
      perPage: 20,
    })
      .then((models) => {
        if (models !== null && models.length > 0) {
          if (models.length > 1) {
            return Promise.all(
              models.map((model) => this.getModelById(model.modelId))
            ).then((models2) => {
              const modelsWithDistance = models2
                .map((model) => {
                  const newModel: ModelWithDistance = {
                    ...model,
                    distance: compareTwoStrings(name, model.name),
                  };
                  return newModel;
                })
                .sort((a, b) => a.distance - b.distance);

              modelsWithDistance.forEach((model) =>
                this.logger.debug(
                  `${model.modelId} ${model.name} ${model.distance}`
                )
              );

              this.logger.debug(
                `getModelByName(${name}) model ${
                  modelsWithDistance[modelsWithDistance.length - 1].modelId
                } :: ${modelsWithDistance[modelsWithDistance.length - 1].name}`
              );

              return modelsWithDistance[modelsWithDistance.length - 1];
            });
          }
          this.logger.debug(
            `getModelByName(${name}) model ${models[0].modelId} `
          );

          return this.getModelById(models[0].modelId);
        } else {
          throw new ApiError(null, {
            url: `${this.baseUrl}/api/models`,
            code: 400,
            message: `Model ${name} not found`,
          });
        }
      })
      .catch((error) => {
        this.logger.error("getModelByName error", error);
        throw error;
      });
  }

  /**
   * Returns a list of all the versions of the model with the specified id
   */
  getModelVersionsById(modelId: string): Promise<GetModelVersionsByIdResponse> {
    const requestUrl = `${this.baseUrl}/api/models/${modelId}/versions`;

    this.logger.debug(`getModelVersionsById GET ${requestUrl}`);

    return axios
      .get(requestUrl, { headers: this.headers })
      .then((response) => {
        this.logger.info("getModelVersionsById response", response);
        return response.data;
      })
      .catch((error) => {
        this.logger.error("getModelVersionsById error", error);
        throw new ApiError(error);
      });
  }

  getModelVersionInputSample({ modelId, version }: GetModelDetailsParams) {
    const requestUrl = `${this.baseUrl}/api/models/${modelId}/versions/${version}/sample-input`;
    this.logger.debug(`getModelVersionInputSample GET ${requestUrl}`);
    return axios
      .get(requestUrl, { headers: this.headers })
      .then((response) => {
        this.logger.info("getModelVersionInputSample response", response);
        return response.data;
      })
      .catch((error) => {
        this.logger.error("getModelVersionInputSample error", error);
        throw new ApiError(error);
      });
  }

  getModelVersionOutputSample({ modelId, version }: GetModelDetailsParams) {
    const requestUrl = `${this.baseUrl}/api/models/${modelId}/versions/${version}/sample-output`;
    this.logger.debug(`getModelVersionOutputSample GET ${requestUrl}`);

    return axios
      .get(requestUrl, { headers: this.headers })
      .then((response) => {
        this.logger.info("getModelVersionOutputSample response", response);
        return response.data;
      })
      .catch((error) => {
        this.logger.error("getModelVersionOutputSample error", error);
        throw new ApiError(error);
      });
  }
}
