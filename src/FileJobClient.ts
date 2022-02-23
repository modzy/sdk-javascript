import axios from "axios";
import { parse as parseUrl } from "url";
import FormData from "form-data";
import * as http from "http";

import { JobClient } from "./JobClient";
import { ApiError } from "./ApiError";
import { Logger } from "./Logger";
import { humanReadToBytes, byteArrayToChunks, fileToChunks } from "./nodeUtils";
import { DEFAULT_URL } from "./constants";

import type {
  ClassInitiator,
  SubmitJobResponse,
  SubmitJobFileParams,
} from "./types";

interface SubmitOptions extends http.RequestOptions {
  protocol?: "https:" | "http:";
}

export class FileJobClient {
  logger: Logger;
  jobClient: JobClient;
  readonly baseUrl: string;
  readonly headers: {
    Authorization: string;
  };

  /**
   * Creates a JobClient
   * @param {Object} config object
   * @param {string} config.url - base url of modzy api (i.e.: https://app.modzy.com)
   * @param {string} config.apiKey - user's API key
   */
  constructor({ url = DEFAULT_URL, apiKey, logging }: ClassInitiator) {
    this.baseUrl = url;
    this.headers = {
      Authorization: `ApiKey ${apiKey}`,
    };
    this.jobClient = new JobClient({ url, apiKey });
    this.logger = new Logger(logging);
  }

  _getFeatures() {
    const requestURL = `${this.baseUrl}/api/jobs/features`;
    this.logger.debug(`_getFeatures GET ${requestURL}`);

    return axios
      .get(requestURL, { headers: this.headers })
      .then((response) => {
        this.logger.info("_getFeatures response", response);
        return response.data;
      })
      .catch((error) => {
        this.logger.error("_getFeatures error", error);
        throw new ApiError(error);
      });
  }

  _appendInputChunk(
    requestURL: string,
    asyncGenerator: any,
    chunkSize: number,
    dataItemKey: string,
    chunkCount: number
  ) {
    return asyncGenerator.next().then((entry: any) => {
      const logger = this.logger;

      if (entry && entry.value) {
        return new Promise((resolve, reject) => {
          logger.debug(
            `_appendInputChunk(${requestURL}) [${chunkCount}] POST ${entry.value.length} bytes`
          );

          const requestObject = parseUrl(requestURL) as SubmitOptions;
          requestObject.headers = this.headers;
          const data = new FormData({ maxDataSize: chunkSize });
          data.append("input", entry.value, dataItemKey);
          data.submit(requestObject, function (error, response) {
            logger.info(
              `appendInputChunk(${requestURL}) [${chunkCount}] :: ${response.statusCode} ${response.statusMessage}`
            );

            if (error || (response?.statusCode && response.statusCode >= 400)) {
              logger.error("appendInputChunk error", error);
              reject(error);
            }
            resolve(response.resume());
          });
        }).then((_) => {
          return this._appendInputChunk(
            requestURL,
            asyncGenerator,
            chunkSize,
            dataItemKey,
            chunkCount + 1
          );
        });
      }
      return null;
    });
  }

  _appendInput(
    job: SubmitJobResponse,
    inputItemKey: string,
    dataItemKey: string,
    inputValue: any,
    chunkSize: number
  ) {
    const requestURL = `${this.baseUrl}/api/jobs/${job.jobIdentifier}/${inputItemKey}/${dataItemKey}`;
    this.logger.debug("_appendInput called");
    let iterator;

    if (inputValue?.byteLength !== undefined) {
      iterator = byteArrayToChunks(inputValue, chunkSize);
    } else {
      iterator = fileToChunks(inputValue, chunkSize);
    }

    return this._appendInputChunk(
      requestURL,
      iterator,
      chunkSize,
      dataItemKey,
      0
    );
  }

  submitJobFile({
    modelId,
    version,
    sources,
    explain = false,
  }: SubmitJobFileParams): Promise<SubmitJobResponse> {
    let job = {} as SubmitJobResponse;

    this.logger.debug("submitJobFile called");

    return this.jobClient
      .submitJob({
        model: {
          identifier: modelId,
          version: version,
        },
        explain: explain,
      })
      .then((openJob) => {
        job = openJob;
        this.logger.debug("open job", job);
        return this._getFeatures();
      })
      .then((features) => {
        try {
          return humanReadToBytes(features["inputChunkMaximumSize"]);
        } catch (error) {
          this.logger.error(
            `unexpected error extracting inputChunkMaximumSize from ${features}, error: ${error}`
          );
          return 1024 * 1024; //default 1Mi
        }
      })
      .then((maxChunkSize) => {
        let inputPromise = Promise.resolve(job);
        Object.keys(sources).forEach((inputItemKey) => {
          Object.keys(sources[inputItemKey]).forEach((dataItemKey) => {
            inputPromise = inputPromise.then(() =>
              this._appendInput(
                job,
                inputItemKey,
                dataItemKey,
                sources[inputItemKey][dataItemKey],
                maxChunkSize
              )
            );
          });
        });
        return inputPromise;
      })
      .then(() => {
        return this.jobClient.closeOpenJob(job.jobIdentifier);
      })
      .catch((apiError) => {
        this.logger.error("submitJobFile error", apiError);
        //Try to cancel the job
        return this.jobClient
          .cancelJob(job.jobIdentifier)
          .then(() => {
            throw apiError;
          })
          .catch(() => {
            throw apiError;
          });
      });
  }
}
