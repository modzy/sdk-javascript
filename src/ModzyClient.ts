import { ModelClient } from "./ModelClient";
import { JobClient } from "./JobClient";
import { FileJobClient } from "./FileJobClient";
import { toBase64 } from "./base64Util";
import { DEFAULT_URL } from "./constants";

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

  constructor({ url = DEFAULT_URL, apiKey, logging }: ClassInitiator) {
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

  /**
   * Get a list of models with very basic info such as modelId, versions, and latestVersion
   * based on specified params. Returns the first 500 models if no params are sent.
   */
  getModels(params: GetModelsParams = {}) {
    return this.modelClient.getModels(params);
  }

  /**
   * Get a list of all active models with information such as names, ids, descriptions,
   * active versions, and image URLs
   */
  getActiveModels() {
    return this.modelClient.getActiveModels();
  }

  /**
   * Get details relevant to all versions of the model with the given modelId
   * @param modelId The model's id
   */
  getModelById(modelId: string) {
    return this.modelClient.getModelById(modelId);
  }

  /**
   * Search for a model that matches a provided name. If the search finds multiple models,
   * it will return the closest match. The output includes all model details (modelId,
   * latestVersion, author, name, versions, and tags).
   */
  getModelByName(name: string) {
    return this.modelClient.getModelByName(name);
  }

  /**
   * Returns a list of all the versions of the model with the specified id. No other
   * information is returned. Using `getModelById()` and pulling the `versions`,
   * `latestVersion`, or `latestActiveVersion` from the response may suit your needs better
   */
  getModelVersionsById(modelId: string) {
    return this.modelClient.getModelVersionsById(modelId);
  }

  /**
   * Returns version details. It includes timeout, requirement, containerImage, loadStatus,
   * runStatus, inputs, outputs, statistics, technicalDetails, sampleInput, sampleOutput,
   * performanceSummary, processing, and others.
   */
  getModelDetails(params: GetModelDetailsParams) {
    return this.modelClient.getModelDetails(params);
  }

  /**
   * Gets a job request sample for this model in JSON format (if it exists).
   */
  getModelVersionInputSample({ modelId, version }: GetModelDetailsParams) {
    return this.modelClient.getModelVersionInputSample({ modelId, version });
  }

  /**
   * Gets the output sample associated with the model and version provided
   */
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

  /**
   * Return the Job details, including the status, total, completed, and failed
   * number of items.
   */
  getJob(jobId: string) {
    return this.jobClient.getJob(jobId);
  }

  /**
   * Send a request to the server in order to cancel a Job
   */
  cancelJob(jobId: string) {
    return this.jobClient.cancelJob(jobId);
  }

  /**
   * Return the current results of a Job execution, including completed, failed, total
   * number of items processed
   */
  getResult(jobId: string) {
    return this.jobClient.getResult(jobId);
  }

  /**
   * Get the contents of a specific job output. Consult the model's api for the output name
   * and file type
   */
  getOutputContents(params: GetOutputContentsParams) {
    return this.jobClient.getOutputContents(params);
  }

  /**
   * Blocks subsequent code execution until the job changes its status to COMPLETED,
   * TIMEDOUT or CANCELED.
   */
  blockUntilJobComplete(jobId: string, options?: { timeout?: number }) {
    return this.jobClient.blockUntilJobComplete(jobId, options);
  }

  /**
   * Gets a list of jobs meeting the search parameter criteria. Returns the latest 100 jobs
   * if no params are sent.
   */
  getJobHistory(params: GetJobHistoryParams = {}) {
    return this.jobClient.getJobHistory(params);
  }

  /**
   * Returns a list of all active processing engines and their status
   */
  getProcessingEngineStatus() {
    return this.jobClient.getProcessingEngineStatus();
  }

  /**
   * Submit a job with plain text inputs
   */
  submitJobText(params: SubmitJobTextParams) {
    return this.jobClient.submitJobText(params);
  }

  /**
   * Submit a job with the input(s) contents encoded in a Base64 data url
   */
  submitJobEmbedded(params: SubmitJobEmbeddedParams) {
    return this.jobClient.submitJobEmbedded(params);
  }

  /**
   * Submit a job with the input(s) stored in a AWS S3 bucket
   */
  submitJobAwsS3(params: SubmitJobAwsS3Params) {
    return this.jobClient.submitJobAwsS3(params);
  }

  /**
   * Submit a job based on a sql query on a database accessed through JDBC.
   */
  submitJobJDBC(params: SubmitJobJDBCParams) {
    return this.jobClient.submitJobJDBC(params);
  }

  /**
   * Submit a job with the input(s) specified as a Blob (browser) or file path (Node)
   */
  submitJobFile(params: SubmitJobFileParams) {
    return this.fileJobClient.submitJobFile(params);
  }

  /**
   * Converts a file path (string) to a data url for embedded job types (node only)
   */
  pathToDataUrl(path: string, mimeType: string) {
    return toBase64({ path, mimeType });
  }

  /**
   *  Converts a JS File Object to a data url for embedded job types (browser only)
   */
  fileToDataUrl(file: File) {
    return toBase64(file);
  }
}
