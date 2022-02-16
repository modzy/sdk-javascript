import axios from "axios";

import { JobClient } from "./JobClient";
import { Logger } from "./Logger";

import type {
  ClassInitiator,
  SubmitJobFileParams,
  SubmitJobResponse,
} from "./types";

export class FileJobClient {
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
  constructor({
    url = "https://app.modzy.com/api",
    apiKey,
    logging,
  }: ClassInitiator) {
    this.baseUrl = url.endsWith("/") ? url.substring(0, url.length - 1) : url;
    this.headers = {
      Authorization: `ApiKey ${apiKey}`,
    };
    this.jobClient = new JobClient({ url, apiKey });
    this.logger = new Logger(logging);
  }

  uploadFileToOpenJob({
    file,
    jobIdentifier,
    inputName,
    inputItemKey,
  }: {
    file: File;
    jobIdentifier: string;
    inputName: string;
    inputItemKey: string;
  }): Promise<void> {
    this.logger.debug("uploadFileToOpenJob", file.name);

    return new Promise(async (resolve, reject) => {
      const chunkSize = 500 * 1024;

      for (let i = 0; i < file.size; i += chunkSize) {
        const chunk = file.slice(i, i + chunkSize);
        const formData = new FormData();
        formData.append("input", chunk);

        try {
          const requestUrl = `${this.baseUrl}/jobs/${jobIdentifier}/${inputItemKey}/${inputName}`;
          this.logger.debug(`uploadFileToOpenJob POST ${requestUrl}`);
          await axios.post(requestUrl, formData, {
            headers: this.headers,
          });
        } catch (error) {
          reject(error);
        }
      }

      resolve();
    });
  }

  async submitJobFile({
    modelId,
    version,
    sources,
    explain = false,
  }: SubmitJobFileParams): Promise<SubmitJobResponse> {
    // Create an open job
    const job = await this.jobClient.submitJob({
      model: {
        identifier: modelId,
        version: version,
      },
      explain: explain,
    });

    const { jobIdentifier } = job;
    const inputItemKeys = Object.keys(sources);

    // For each set of inputs
    for (const inputItemKey of inputItemKeys) {
      const inputNames = Object.keys(sources[inputItemKey]);

      // For each input in the set
      for (const inputName of inputNames) {
        const file = sources[inputItemKey][inputName];

        // upload chunks
        await this.uploadFileToOpenJob({
          file,
          jobIdentifier: jobIdentifier,
          inputName,
          inputItemKey,
        });
      }
    }

    // Close the open job
    await this.jobClient.closeOpenJob(jobIdentifier);

    return job;
  }
}
