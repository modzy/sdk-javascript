import axios from "axios";
import { compareTwoStrings } from "string-similarity";

import { ApiError } from "./ApiError";
import { Logger } from "./Logger";

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
   * @param {string} config.url - base url of modzy api (i.e.: https://app.modzy.com/api)
   * @param {string} config.apiKey - user's API key
   */
  constructor({
    url = "https://app.modzy.com/api",
    apiKey,
    logging,
  }: ClassInitiator) {
    this.baseUrl = url + (url.endsWith("/") ? "" : "/") + "models";
    this.headers = {
      Authorization: `ApiKey ${apiKey}`,
    };
    this.logger = new Logger(logging);
  }

  /**
   * LEGACY
   * Call the Modzy service that retrieve models basic info (modelId, versions, and latestVersion)
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
    direction,
    sortBy,
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

    this.logger.debug(`getModels(${params}) GET ${this.baseUrl}`);

    return axios
      .get(this.baseUrl, {
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
   * LEGACY
   * Call the Modzy service that returns all the models, this
   * method is a wrapper of [ModelClient#getModels()]{@link ModelClient#getModels} method.
   * @see {@link ModelClient#getModels}
   * @returns {Model[]} - A list of all Modzy Models
   * @throws {ApiError} Error if there is something wrong with the service or the call
   */
  getAllModels() {
    this.logger.debug("getAllModels called");
    return this.getModels();
  }

  /**
   * Gets all the models with details
   * @returns {Model[]} - A list of all Modzy Models
   */
  getActiveModels(): Promise<LatestModel[]> {
    const requestUrl = `${this.baseUrl}/latest`;

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
   *
   * Call the Modzy API Service that return a model instance by it's identifier
   *
   * @param {string} modelId - Identifier of the model
   * @returns {Object} A Modzy model
   * @throws {ApiError} Error if there is something wrong with the service or the call
   */
  getModelById(modelId: string): Promise<GetModelByIdResponse> {
    const requestUrl = `${this.baseUrl}/${modelId}`;

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
    const requestUrl = `${this.baseUrl}/${modelId}/versions/${version}`;

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
            url: this.baseUrl,
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
    const requestUrl = `${this.baseUrl}/${modelId}/versions`;

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
    const requestUrl = `${this.baseUrl}/${modelId}/versions/${version}/sample-input`;
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
    const requestUrl = `${this.baseUrl}/${modelId}/versions/${version}/sample-output`;
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
