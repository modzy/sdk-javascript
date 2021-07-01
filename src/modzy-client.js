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
	 * @see {@link JobClient#submitJobText}
	 */
	submitJobText(modelId, versionId, textSources) {
		return this.jobClient.submitJobText(modelId, versionId, textSources);
	}

	/**
	 * @see {@link JobClient#submitJobEmbedded}
	 */
	submitJobEmbedded(modelId, versionId, mediaType, embeddedSources) {
		return this.jobClient.submitJobEmbedded(modelId, versionId, mediaType, embeddedSources);
	}

	/**
	 * @see {@link JobClient#submitJobEmbedded}
	 */
	submitJobFiles(modelId, versionId, fileSources) {
		return this.jobClient.submitJobFiles(modelId, versionId, fileSources);
	}

	/**
	 * @see {@link JobClient#submitJobAWSS3}
	 */
	submitJobAWSS3(modelId, versionId, accessKeyID, secretAccessKey, region, awss3Sources) {
		return this.jobClient.submitJobAWSS3(modelId, versionId, accessKeyID, secretAccessKey, region, awss3Sources);
	}

	/**
	 * @see {@link JobClient#submitJobJDBC}
	 */
	submitJobJDBC(modelId, versionId, url, username, password, driver, query) {
		return this.jobClient.submitJobJDBC(modelId, versionId, url, username, password, driver, query);
	}

	/**
	 * @see {@link JobClient#blockUntilComplete}
	 */
	blockUntilComplete(job) {
		return this.jobClient.blockUntilComplete(job);
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