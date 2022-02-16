import axios from "axios";

import { ApiError } from "./ApiError";
import { Logger } from "./Logger";

import type {
  ClassInitiator,
  GetJobHistoryParams,
  JobHistoryResponseItem,
  SubmitJobParams,
  SubmitJobTextParams,
  SubmitJobResponse,
  GetOutputContentsParams,
  SubmitJobJDBCParams,
  SubmitJobAwsS3Params,
  SubmitJobEmbeddedParams,
  EnginesResponse,
  GetJobResponse,
  GetResultResponse,
} from "./types";

export class JobClient {
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
  constructor({
    url = "https://app.modzy.com/api",
    apiKey,
    logging,
  }: ClassInitiator) {
    this.baseUrl = url.endsWith("/") ? url.substring(0, url.length - 1) : url;
    this.headers = {
      Authorization: `ApiKey ${apiKey}`,
    };
    this.logger = new Logger(logging);
  }

  /**
   * Call the Modzy API Service and query on the history of jobs
   */
  getJobHistory({
    user,
    accessKey,
    startDate,
    endDate,
    model,
    status,
    page = 1,
    perPage = 100,
    direction = "DESC",
    sortBy = "createdAt",
  }: GetJobHistoryParams = {}): Promise<JobHistoryResponseItem[]> {
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);

    const params = {
      user: user,
      accessKey: accessKey,
      startDate: startDate || defaultStartDate.toISOString(),
      endDate: endDate,
      model: model,
      status: status,
      "sort-by": sortBy,
      direction: direction,
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

    const requestUrl = `${this.baseUrl}/jobs/history`;
    this.logger.debug(`getJobHistory(${params}) GET ${requestUrl}`);

    return axios
      .get(requestUrl, {
        headers: this.headers,
        params,
      })
      .then((response) => {
        this.logger.info("getJobHistory response", response);
        return response.data;
      })
      .catch((error) => {
        this.logger.error("getJobHistory error", error);
        throw new ApiError(error);
      });
  }

  /**
   * Call the Modzy API Service that return a job instance by it's identifier
   */
  getJob(jobId: string): Promise<GetJobResponse> {
    const requestUrl = `${this.baseUrl}/jobs/${jobId}`;
    this.logger.debug(`getJob GET ${requestUrl}`);

    return axios
      .get(requestUrl, { headers: this.headers })
      .then((response) => {
        this.logger.info("getJobHistory response", response);
        return response.data;
      })
      .catch((error) => {
        this.logger.error("getJobHistory error", error);
        throw new ApiError(error);
      });
  }

  getResult(jobId: string): Promise<GetResultResponse> {
    const requestUrl = `${this.baseUrl}/results/${jobId}`;
    this.logger.debug(`getResult GET ${requestUrl}`);

    return axios
      .get(requestUrl, { headers: this.headers })
      .then((response) => {
        this.logger.info("getResult response", response);
        return response.data;
      })
      .catch((error) => {
        this.logger.error("getResult error", error);
        throw new ApiError(error);
      });
  }

  getOutputContents({
    jobId,
    inputKey,
    outputName,
    responseType = "json",
  }: GetOutputContentsParams): Promise<unknown> {
    const requestUrl = `${this.baseUrl}/results/${jobId}/datasource/${inputKey}/output/${outputName}`;
    this.logger.debug(`getOutputContents GET ${requestUrl}`);

    return axios
      .get(requestUrl, { responseType, headers: this.headers })
      .then((response) => {
        this.logger.info("getOutputContents response", response);
        return response.data;
      })
      .catch((error) => {
        this.logger.error("getOutputContents error", error);
        throw new ApiError(error);
      });
  }

  /**
   * Utility method that waits until the job finishes.
   *
   * This method first checks the status of the job and waits until the job reaches
   * the completed/error status by passing through the submitted and in_progress states.
   */
  blockUntilJobComplete(
    jobId: string,
    { timeout = 2000 } = {}
  ): Promise<GetJobResponse> {
    this.logger.debug(`blockUntilJobComplete ${jobId}, timeout ${timeout}`);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.getJob(jobId)
          .then((updatedJob) => {
            if (
              updatedJob.status === "SUBMITTED" ||
              updatedJob.status === "IN_PROGRESS"
            ) {
              resolve(
                this.blockUntilJobComplete(updatedJob.jobIdentifier, {
                  timeout,
                })
              );
            }
            this.logger.debug(
              `blockUntilJobComplete(${updatedJob.jobIdentifier}}) :: returning :: ${updatedJob.status}`
            );
            resolve(updatedJob);
          })
          .catch((error) => {
            this.logger.error("blockUntilJobComplete error", error);
            reject(error);
          });
      }, timeout);
    });
  }

  /**
   * Cancel a job by its identifier
   */
  cancelJob(jobId: string) {
    const requestUrl = `${this.baseUrl}/jobs/${jobId}`;
    this.logger.debug(`cancelJob DELETE ${requestUrl}`);

    return axios
      .delete(requestUrl, {
        headers: this.headers,
      })
      .then((response) => {
        this.logger.info("cancelJob response", response);
        return response.data;
      })
      .catch((error) => {
        this.logger.error("cancelJob error", error);
        throw new ApiError(error);
      });
  }

  closeOpenJob(jobId: string) {
    const requestUrl = `${this.baseUrl}/jobs/${jobId}/close`;
    this.logger.debug(`closeOpenJob POST ${requestUrl}`);

    return axios
      .post(requestUrl, {}, { headers: this.headers })
      .then((response) => {
        this.logger.info("closeOpenJob response", response);
        return response.data;
      })
      .catch((error) => {
        this.logger.error("closeOpenJob error", error);
        throw new ApiError(error);
      });
  }

  getProcessingEngineStatus(): Promise<EnginesResponse> {
    const requestUrl = `${this.baseUrl}/resources/processing/engines`;
    this.logger.debug(`getProcessingEngineStatus GET ${requestUrl}`);

    return axios
      .get(requestUrl, { headers: this.headers })
      .then((response) => {
        this.logger.info("getProcessingEngineStatus response", response);
        return response.data;
      })
      .catch((error) => {
        this.logger.error("getProcessingEngineStatus error", error);
        throw new ApiError(error);
      });
  }

  submitJob(job: SubmitJobParams): Promise<SubmitJobResponse> {
    const requestUrl = `${this.baseUrl}/jobs`;
    this.logger.debug(`submitJob POST ${requestUrl}`);

    return axios
      .post(requestUrl, job, {
        headers: this.headers,
      })
      .then((response) => {
        this.logger.info("submitJob response", response);
        return response.data;
      })
      .catch((error) => {
        this.logger.error("submitJob error", error);
        throw new ApiError(error);
      });
  }

  /**
   * Create a new job for a specific model and version with the text inputs provided.
   */
  submitJobText({
    modelId,
    version,
    sources,
    explain = false,
  }: SubmitJobTextParams): Promise<SubmitJobResponse> {
    this.logger.debug("submitJobText called");

    return this.submitJob({
      model: {
        identifier: modelId,
        version: version,
      },
      explain: explain,
      input: {
        type: "text",
        sources: sources,
      },
    });
  }

  submitJobEmbedded({
    modelId,
    version,
    sources,
    explain = false,
  }: SubmitJobEmbeddedParams): Promise<SubmitJobResponse> {
    this.logger.debug("submitJobEmbedded called");

    return this.submitJob({
      model: {
        identifier: modelId,
        version,
      },
      explain,
      input: {
        type: "embedded",
        sources,
      },
    });
  }

  /**
   * Create a new job for a specific model and version with the aws-s3 inputs provided.
   */
  submitJobAwsS3({
    modelId,
    version,
    accessKeyID,
    secretAccessKey,
    region,
    sources,
    explain = false,
  }: SubmitJobAwsS3Params): Promise<SubmitJobResponse> {
    this.logger.debug("submitJobAwsS3 called");

    return this.submitJob({
      model: {
        identifier: modelId,
        version: version,
      },
      explain: explain,
      input: {
        type: "aws-s3",
        accessKeyID: accessKeyID,
        secretAccessKey: secretAccessKey,
        region: region,
        sources: sources,
      },
    });
  }

  /**
   * Create a new job for a specific model and version with the jdbc query provided,
   *
   * Modzy will create a data source with the parameters provided and will execute
   * the query, then will match the inputs defined of the model with the columns
   * of the result set.
   */
  submitJobJDBC({
    modelId,
    version,
    url,
    username,
    password,
    driver,
    query,
    explain = false,
  }: SubmitJobJDBCParams): Promise<SubmitJobResponse> {
    this.logger.debug("submitJobJDBC called");

    return this.submitJob({
      model: {
        identifier: modelId,
        version: version,
      },
      explain: explain,
      input: {
        type: "jdbc",
        url: url,
        username: username,
        password: password,
        driver: driver,
        query: query,
      },
    });
  }
}
