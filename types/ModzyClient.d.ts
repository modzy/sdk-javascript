import { ModelClient } from "./ModelClient";
import { JobClient } from "./JobClient";
import { FileJobClient } from "./FileJobClient";
import { ClassInitiator, GetModelsParams, GetModelDetailsParams, GetJobHistoryParams, SubmitJobTextParams, GetOutputContentsParams, SubmitJobFileParams, SubmitJobEmbeddedParams, SubmitJobAwsS3Params, SubmitJobJDBCParams } from "./types";
export declare class ModzyClient {
    modelClient: ModelClient;
    jobClient: JobClient;
    fileJobClient: FileJobClient;
    constructor({ url, apiKey, logging, }: ClassInitiator);
    /**
     * Get the ModelClient instance
     * @see {@link ModelClient}
     */
    getModelClient(): ModelClient;
    getModels(params?: GetModelsParams): Promise<import("./types").Model[]>;
    getAllModels(): Promise<import("./types").Model[]>;
    getActiveModels(): Promise<import("./types").LatestModel[]>;
    getModelById(modelId: string): Promise<import("./types").GetModelByIdResponse>;
    getModelDetails(params: GetModelDetailsParams): Promise<import("./types").GetModelDetailsResponse>;
    getModelByName(name: string): Promise<import("./types").GetModelByIdResponse>;
    getModelVersionsById(modelId: string): Promise<import("./types").GetModelVersionsByIdResponse>;
    getModelVersionInputSample({ modelId, version }: GetModelDetailsParams): Promise<any>;
    getModelVersionOutputSample({ modelId, version }: GetModelDetailsParams): Promise<any>;
    /**
     * Get the JobClient instance
     * @see {@link JobClient}
     */
    getJobClient(): JobClient;
    getJob(jobId: string): Promise<import("./types").GetJobResponse>;
    cancelJob(jobId: string): Promise<any>;
    getResult(jobId: string): Promise<any>;
    getOutputContents(params: GetOutputContentsParams): Promise<any>;
    blockUntilJobComplete(jobId: string, options?: {
        timeout?: number;
    }): Promise<import("./types").GetJobResponse>;
    getJobHistory(params?: GetJobHistoryParams): Promise<import("./types").JobHistoryResponseItem[]>;
    getProcessingEngineStatus(): Promise<import("./types").EnginesResponse>;
    submitJobText(params: SubmitJobTextParams): Promise<import("./types").SubmitJobResponse>;
    submitJobEmbedded(params: SubmitJobEmbeddedParams): Promise<import("./types").SubmitJobResponse>;
    submitJobAwsS3(params: SubmitJobAwsS3Params): Promise<import("./types").SubmitJobResponse>;
    submitJobJDBC(params: SubmitJobJDBCParams): Promise<import("./types").SubmitJobResponse>;
    submitJobFile(params: SubmitJobFileParams): Promise<import("./types").SubmitJobResponse>;
    pathToDataUrl(path: string, mimeType: string): Promise<string>;
    fileToDataUrl(file: File): Promise<string>;
}
