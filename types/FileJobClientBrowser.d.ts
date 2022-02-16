import { JobClient } from "./JobClient";
import { Logger } from "./Logger";
import { ClassInitiator, SubmitJobFileParams, SubmitJobResponse } from "./types";
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
    uploadFileToOpenJob({ file, jobIdentifier, inputName, inputItemKey, }: {
        file: File;
        jobIdentifier: string;
        inputName: string;
        inputItemKey: string;
    }): Promise<void>;
    submitJobFile({ modelId, version, sources, explain, }: SubmitJobFileParams): Promise<SubmitJobResponse>;
}
