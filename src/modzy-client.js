const logger = require('log4js').getLogger("modzy");


const ModelClient = require('./model-client.js');
const TagClient = require('./tag-client.js');
const JobClient = require('./job-client.js');
const AccountingClient = require('./accounting-client.js');
const ResultClient = require('./result-client.js');

/**
 * Facade class that mask all the interactions with Modzy API
 */
class ModzyClient {

	/**
     * Create a ModzyClient 
     * @param {string} baseURL - base url of modzy api (i.e.: https://modzy.url/api)
     * @param {string} apiKey  - api key to access modzy
     */
	constructor(baseURL, apiKey) {
		if (baseURL === undefined || baseURL === "") {
			logger.error("the baseURL param should be a valid not empty string");
			throw ("Cannot initialize the modzy client: the baseURL param should be a valid not empty string");
		}
		if (apiKey === undefined || apiKey === "") {
			logger.error("the apiKey param should be a valid not empty string");
			throw ("Cannot initialize the modzy client: the apiKey param should be a valid not empty string");
		}
		this.baseURL = baseURL;
		this.apiKey = apiKey;
		this.modelClient = new ModelClient(baseURL, apiKey);
		this.tagClient = new TagClient(baseURL, apiKey);
		this.jobClient = new JobClient(baseURL, apiKey);
		this.resultClient = new ResultClient(baseURL, apiKey);
		this.accountingClient = new AccountingClient(baseURL, apiKey);
	}

    /**
	 * Get the model client initialized 
	 * @see {@link ModelClient}
	 * @return {ModelClient} The model client instance
	 */
	getModelClient() {
		return this.modelClient;
	}

    /**
	 * 
	 * Get the tag client initialized
	 * @see {@link TagClient}
	 * @return {TagClient} The tag client initialized
	 */
	getTagClient() {
		return this.tagClient;
	}

    /**
	 * 
	 * Get the job client initialized
	 * @see {@link JobClient}
	 * @return {JobClient} The job client initialized
	 */
	getJobClient() {
		return this.jobClient;
	}

    /**
	 * 
	 * Get the result client initialized
	 * @see {@link ResultClient}
	 * @return {ResultClient} The result client initialized
	 */
	getResultClient() {
		return this.resultClient;
	}

	/**
	 * Get the accounting client initialized
	 * @see {@link AccountingClient}
	 * @returns {AccountingClient}
	 */
	getAccountingClient(){
		return this.accountingClient;
	}

	/**     	
	 * @see {@link ModelClient#getAllModels}
	 */
	getAllModels() {
		return this.modelClient.getAllModels();
	}

	/**
	 * @see {@link ModelClient#getModels}
	 */
	getModels(modelId = null, author = null, createdByEmail = null, name = null,
		description = null, isActive = null, isExpired = null, isRecommended = null,
		lastActiveDateTime = null, expirationDateTime = null,
		page = null, perPage = 1000, direction = null, sortBy = null
	) {
		return this.modelClient.getModels(modelId, author, createdByEmail, name,
			description, isActive, isExpired, isRecommended,
			lastActiveDateTime, expirationDateTime,
			page, perPage, direction, sortBy);
	}

	/**
	 * @see {@link ModelClient#getModel}
	 */
	getModel(modelId) {
		return this.modelClient.getModel(modelId);
	}

	/**
	 * @see {@link ModelClient#getModelByName}
	 */
	getModelByName(modelId) {
		return this.modelClient.getModelByName(modelId);
	}

	/**
	 * @see {@link ModelClient#getRelatedModels}
	 */
	getRelatedModels(modelId) {
		return this.modelClient.getRelatedModels(modelId);
	}

	/**
	 * @see {@link ModelClient#getModelVersion}
	 */
	getModelVersion(modelId, versionId) {
		return this.modelClient.getModelVersion(modelId, versionId);
	}

	/**
	 * @see {@link ModelClient#getAllTags}
	 */
	getAllTags() {
		return this.tagClient.getAllTags();
	}

	/**
	 * @see {@link ModelClient#getTagsAndModels}
	 */
	getTagsAndModels(...tagsId) {
		return this.tagClient.getTagsAndModels(tagsId);
	}

	/**
	 * 
	 * Create a new job for the model at the specific version with the text inputs provided.
	 * 
	 * @param {string} modelId - the model id string
	 * @param {versionId} versionId - version id string
	 * @param {Object[]} textSources - The source(s) of the model 
	 * @return {Object} the updated instance of the Job returned by Modzy API
	 * @throws {ApiError} If there is something wrong with the service or the call
	 */
	submitJobText(modelId, versionId, textSources) {
		return this.jobClient.submitJob(
			{
				"model": {
					"identifier": modelId,
					"version": versionId
				},
				"input": {
					"type": "text",
					"sources": textSources
				}
			}
		);
	}

    /**
	 * 
	 * Create a new job for the model at the specific version with the embedded inputs provided.
	 * 
	 * @param {string} modelId - the model id string
	 * @param {string} versionId - version id string
	 * @param {string} mediaType - the media type of the embedded source
	 * @param {Object[]} embeddedSources the source(s) of the model 
	 * @return {Object} the updated instance of the Job returned by Modzy API
	 * @throws {ApiError} if there is something wrong with the service or the call
	 */
	submitJobEmbedded(modelId, versionId, mediaType, embeddedSources) {
		let encodedSources = {};
		Object.keys(embeddedSources).forEach(
			sourceKey => {
				let source = {};
				Object.keys(embeddedSources[sourceKey]).forEach(
					key => {
						source[key] =
							"data:" + mediaType +
							";base64," +
							Buffer.from(embeddedSources[sourceKey][key], 'binary').toString('base64');
						logger.debug("source[" + sourceKey + "][" + key + "] :: " + source[key]);
					}
				);
				encodedSources[sourceKey] = source;
			}
		);
		return this.jobClient.submitJob(
			{
				"model": {
					"identifier": modelId,
					"version": versionId
				},
				"input": {
					"type": "embedded",
					"sources": encodedSources
				}
			}
		);
	}

    /**
	 * 
	 * Create a new job for the model at the specific version with the aws-s3 inputs provided.
	 * 
	 * @param {string} modelId - the model id string
	 * @param {string} versionId - version id string
     * @param {string} accessKeyID - access key of aws-s3
     * @param {string} secretAccessKey - secret access key of aws-s3
     * @param {string} region - aws-s3 region
	 * @param {Object[]} awss3Sources - the source(s) of the model 
	 * @return {Object} the updated instance of the Job returned by Modzy API
	 * @throws {ApiError} if there is something wrong with the service or the call
	 */
	submitJobAWSS3(modelId, versionId, accessKeyID, secretAccessKey, region, awss3Sources) {
		return this.jobClient.submitJob(
			{
				"model": {
					"identifier": modelId,
					"version": versionId
				},
				"input": {
					"type": "aws-s3",
					"accessKeyID": accessKeyID,
					"secretAccessKey": secretAccessKey,
					"region": region,
					"sources": awss3Sources
				}
			}
		);
	}

	/**
	 * 
	 * Create a new job for the model at the specific version with the jdbc query provided,
	 * 
	 * Modzy will create a data source with the parameters provided and will execute 
	 * the query provided, then will match the inputs defined of the model with the columns 
	 * of the resultset.
	 * 
	 * @param {string} modelId - the model id string
	 * @param {string} versionId - version id string
     * @param {string} url - connection url to the database
     * @param {string} username - database username
     * @param {string} password - database password
	 * @param {string} driver - fully qualified name of the driver class for jdbc
	 * @param {string} query - the query to get the inputs of the model
	 * @return {Object} the updated instance of the Job returned by Modzy API
	 * @throws {ApiError} if there is something wrong with the service or the call
	 */
	submitJobJDBC(modelId, versionId, url, username, password, driver, query) {
		return this.jobClient.submitJob(
			{
				"model": {
					"identifier": modelId,
					"version": versionId
				},
				"input": {
					"type": "jdbc",
					"url": url,
					"username": username,
					"password": password,
					"driver": driver,
					"query": query
				}
			}
		);
	}

    /**
	 * 
	 * Utility method that wait until the job finish.
	 * 
	 * This method first check the status of the job and wait until the job reach
	 * the completed/error status by passing through  the submitted and in_progress state.
	 * 
	 * @param {Object} job The job to block	 
	 * @return {Object} A updated instance of the job in a final state
	 * @throws {ApiError} if there is something wrong with the service or the call
	 */
	blockUntilComplete(job) {
		logger.debug(`blockUntilComplete(${job.jobIdentifier}}) :: ${job.status}`);
		return new Promise(
			(resolve, reject) => {
				setTimeout(
					() => {
						this.jobClient.getJob(job.jobIdentifier)
							.then(
								(updatedJob) => {
									if (updatedJob.status === "SUBMITTED" || updatedJob.status === "IN_PROGRESS") {
										resolve(this.blockUntilComplete(updatedJob));
									}
									logger.debug(`blockUntilComplete(${updatedJob.jobIdentifier}}) :: returning :: ${updatedJob.status}`);
									resolve(updatedJob);
								}
							)
							.catch(
								(error) => {
									logger.error(error);
									reject(error);
								}
							);
					},
					2000
				);
			}
		);		
	}

   /**
	* 
	* @see {@link JobClient#getJobHistory}     
	*/
   	getJobHistory(user, accessKey, startDate, endDate, jobIdentifiers, status, page, perPage=1000, direction, sortBy) {
		return this.jobClient.getJobHistory(user, accessKey, startDate, endDate, jobIdentifiers, status, page, perPage, direction, sortBy);
	}

	/**
	 * @see {@link JobClient#getJob}     
    */
	getJob(jobId) {
		return this.jobClient.getJob(jobId);
	}

	/**
	 * @see {@link JobClient#cancelJob}     
    */
	cancelJob(jobId) {
		return this.jobClient.cancelJob(jobId);
	}

    /**
	 *@see {@link ResultClient#getResult}
	 */
	getResult(jobIdentifier) {
		return this.resultClient.getResult(jobIdentifier);
	}

}

module.exports = ModzyClient;