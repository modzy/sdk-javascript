import { ModelClient } from "./ModelClient";
import { JobClient } from "./JobClient";
import { FileJobClient } from "./FileJobClient";
import { toBase64 } from "./base64Util";

import type {
  ClassInitiator,
  GetModelsParams,
  GetModelDetailsParams,
  GetJobHistoryParams,
  SubmitJobTextParams,
  GetOutputContentsParams,
  SubmitJobFileParams,
  SubmitJobEmbeddedParams,
  SubmitJobAwsS3Params,
  SubmitJobJDBCParams,
} from "./types";

export class ModzyClient {
  modelClient: ModelClient;
  jobClient: JobClient;
  fileJobClient: FileJobClient;

  constructor({
    url = "https://app.modzy.com/api",
    apiKey,
    logging,
  }: ClassInitiator) {
    if (!url) {
      console.error("url should be a valid, not-empty string");
      throw "Cannot initialize the modzy client: the url should be a valid, not-empty string";
    }
    if (!apiKey) {
      console.error("apiKey should be a valid, not-empty string");
      throw "Cannot initialize the modzy client: apiKey should be a valid, not-empty string";
    }
    this.modelClient = new ModelClient({ url, apiKey, logging });
    this.jobClient = new JobClient({ url, apiKey, logging });
    this.fileJobClient = new FileJobClient({ url, apiKey, logging });
  }

  /**
   * Get the ModelClient instance
   * @see {@link ModelClient}
   */
  getModelClient() {
    return this.modelClient;
  }
  getModels(params: GetModelsParams = {}) {
    return this.modelClient.getModels(params);
  }
  getAllModels() {
    return this.modelClient.getAllModels();
  }
  getActiveModels() {
    return this.modelClient.getActiveModels();
  }
  getModelById(modelId: string) {
    return this.modelClient.getModelById(modelId);
  }
  getModelDetails(params: GetModelDetailsParams) {
    return this.modelClient.getModelDetails(params);
  }
  getModelByName(name: string) {
    return this.modelClient.getModelByName(name);
  }
  getModelVersionsById(modelId: string) {
    return this.modelClient.getModelVersionsById(modelId);
  }
  getModelVersionInputSample({ modelId, version }: GetModelDetailsParams) {
    return this.modelClient.getModelVersionInputSample({ modelId, version });
  }
  getModelVersionOutputSample({ modelId, version }: GetModelDetailsParams) {
    return this.modelClient.getModelVersionOutputSample({ modelId, version });
  }

  /**
   * Get the JobClient instance
   * @see {@link JobClient}
   */
  getJobClient() {
    return this.jobClient;
  }
  getJob(jobId: string) {
    return this.jobClient.getJob(jobId);
  }
  cancelJob(jobId: string) {
    return this.jobClient.cancelJob(jobId);
  }
  getResult(jobId: string) {
    return this.jobClient.getResult(jobId);
  }
  getOutputContents(params: GetOutputContentsParams) {
    return this.jobClient.getOutputContents(params);
  }
  blockUntilJobComplete(jobId: string, options?: { timeout?: number }) {
    return this.jobClient.blockUntilJobComplete(jobId, options);
  }
  getJobHistory(params: GetJobHistoryParams = {}) {
    return this.jobClient.getJobHistory(params);
  }
  getProcessingEngineStatus() {
    return this.jobClient.getProcessingEngineStatus();
  }
  submitJobText(params: SubmitJobTextParams) {
    return this.jobClient.submitJobText(params);
  }
  submitJobEmbedded(params: SubmitJobEmbeddedParams) {
    return this.jobClient.submitJobEmbedded(params);
  }
  submitJobAwsS3(params: SubmitJobAwsS3Params) {
    return this.jobClient.submitJobAwsS3(params);
  }
  submitJobJDBC(params: SubmitJobJDBCParams) {
    return this.jobClient.submitJobJDBC(params);
  }
  submitJobFile(params: SubmitJobFileParams) {
    return this.fileJobClient.submitJobFile(params);
  }
  pathToDataUrl(path: string, mimeType: string) {
    return toBase64({ path, mimeType });
  }
  fileToDataUrl(file: File) {
    return toBase64(file);
  }
}
