import { JobClient } from "./JobClient";
import { Logger } from "./Logger";
import { ClassInitiator, SubmitJobResponse, SubmitJobFileParams } from "./types";
export declare class FileJobClient {
    logger: Logger;
    readonly baseUrl: string;
    readonly headers: {
        Authorization: string;
    };
    jobClient: JobClient;
    /**
     * Creates a JobClient
     * @param {Object} config object
     * @param {string} config.url - base url of modzy api (i.e.: https://app.modzy.com/api)
     * @param {string} config.apiKey - user's API key
     */
    constructor({ url, apiKey, logging, }: ClassInitiator);
    _getFeatures(): Promise<any>;
    _appendInputChunk(requestURL: string, asyncGenerator: any, chunkSize: number, dataItemKey: string, chunkCount: number): any;
    _appendInput(job: SubmitJobResponse, inputItemKey: string, dataItemKey: string, inputValue: any, chunkSize: number): any;
    submitJobFile({ modelId, version, sources, explain, }: SubmitJobFileParams): Promise<SubmitJobResponse>;
}
