import { Logger } from "./Logger";
import { ClassInitiator, GetJobHistoryParams, JobHistoryResponseItem, SubmitJobParams, SubmitJobTextParams, SubmitJobResponse, GetOutputContentsParams, SubmitJobJDBCParams, SubmitJobAwsS3Params, SubmitJobEmbeddedParams, EnginesResponse, GetJobResponse, GetResultResponse } from "./types";
export declare class JobClient {
    logger: Logger;
    readonly baseUrl: string;
    readonly headers: {
        Authorization: string;
    };
    /**
     * Creates a JobClient
     * @param {Object} config object
     * @param {string} config.url - base url of modzy api (i.e.: https://app.modzy.com/api)
     * @param {string} config.apiKey - user's API key
     */
    constructor({ url, apiKey, logging, }: ClassInitiator);
    /**
     * Call the Modzy API Service and query on the history of jobs
     */
    getJobHistory({ user, accessKey, startDate, endDate, model, status, page, perPage, direction, sortBy, }?: GetJobHistoryParams): Promise<JobHistoryResponseItem[]>;
    /**
     * Call the Modzy API Service that return a job instance by it's identifier
     */
    getJob(jobId: string): Promise<GetJobResponse>;
    getResult(jobId: string): Promise<GetResultResponse>;
    getOutputContents({ jobId, inputKey, outputName, responseType, }: GetOutputContentsParams): Promise<unknown>;
    /**
     * Utility method that waits until the job finishes.
     *
     * This method first checks the status of the job and waits until the job reaches
     * the completed/error status by passing through the submitted and in_progress states.
     */
    blockUntilJobComplete(jobId: string, { timeout }?: {
        timeout?: number | undefined;
    }): Promise<GetJobResponse>;
    /**
     * Cancel a job by its identifier
     */
    cancelJob(jobId: string): Promise<any>;
    closeOpenJob(jobId: string): Promise<any>;
    getProcessingEngineStatus(): Promise<EnginesResponse>;
    submitJob(job: SubmitJobParams): Promise<SubmitJobResponse>;
    /**
     * Create a new job for a specific model and version with the text inputs provided.
     */
    submitJobText({ modelId, version, sources, explain, }: SubmitJobTextParams): Promise<SubmitJobResponse>;
    submitJobEmbedded({ modelId, version, sources, explain, }: SubmitJobEmbeddedParams): Promise<SubmitJobResponse>;
    /**
     * Create a new job for a specific model and version with the aws-s3 inputs provided.
     */
    submitJobAwsS3({ modelId, version, accessKeyID, secretAccessKey, region, sources, explain, }: SubmitJobAwsS3Params): Promise<SubmitJobResponse>;
    /**
     * Create a new job for a specific model and version with the jdbc query provided,
     *
     * Modzy will create a data source with the parameters provided and will execute
     * the query, then will match the inputs defined of the model with the columns
     * of the result set.
     */
    submitJobJDBC({ modelId, version, url, username, password, driver, query, explain, }: SubmitJobJDBCParams): Promise<SubmitJobResponse>;
}
