import { Logger } from "./Logger";
import { ClassInitiator, GetModelsParams, GetModelDetailsParams, Model, LatestModel, GetModelByIdResponse, GetModelDetailsResponse, GetModelVersionsByIdResponse } from "./types";
export declare class ModelClient {
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
    constructor({ url, apiKey, logging, }: ClassInitiator);
    /**
     * LEGACY
     * Call the Modzy service that retrieve models basic info (modelId, versions, and latestVersion)
     */
    getModels({ modelId, author, createdByEmail, name, description, isActive, isExpired, isFeatured, lastActiveDateTime, expirationDateTime, page, perPage, direction, sortBy, }?: GetModelsParams): Promise<Model[]>;
    /**
     * LEGACY
     * Call the Modzy service that returns all the models, this
     * method is a wrapper of [ModelClient#getModels()]{@link ModelClient#getModels} method.
     * @see {@link ModelClient#getModels}
     * @returns {Model[]} - A list of all Modzy Models
     * @throws {ApiError} Error if there is something wrong with the service or the call
     */
    getAllModels(): Promise<Model[]>;
    /**
     * Gets all the models with details
     * @returns {Model[]} - A list of all Modzy Models
     */
    getActiveModels(): Promise<LatestModel[]>;
    /**
     *
     * Call the Modzy API Service that return a model instance by it's identifier
     *
     * @param {string} modelId - Identifier of the model
     * @returns {Object} A Modzy model
     * @throws {ApiError} Error if there is something wrong with the service or the call
     */
    getModelById(modelId: string): Promise<GetModelByIdResponse>;
    getModelDetails({ modelId, version, }: GetModelDetailsParams): Promise<GetModelDetailsResponse>;
    getModelByName(name: string): Promise<GetModelByIdResponse>;
    /**
     * Returns a list of all the versions of the model with the specified id
     */
    getModelVersionsById(modelId: string): Promise<GetModelVersionsByIdResponse>;
    getModelVersionInputSample({ modelId, version }: GetModelDetailsParams): Promise<any>;
    getModelVersionOutputSample({ modelId, version }: GetModelDetailsParams): Promise<any>;
}
