const axios  = require('axios').default;
const logger = require('log4js').getLogger("modzy.job-client");
const fs = require('fs');
const FormData = require('form-data');
const ApiError = require('./api-error.js');
const parseUrl = require('url').parse;
const humanReadToBytes = require("./size");
const {byteArrayToChunks, fileToChunks} = require("./utils");

/**
 * Utility class that mask the interaction with the job api
 */
class JobClient{

    /**
     * Create a JobClient 
     * @param {string} baseURL - base url of modzy api (i.e.: https://modzy.url/api)
     * @param {string} apiKey  - api key to access modzy
     */
    constructor(baseURL, apiKey){        
        this.baseURL = baseURL + ( baseURL.endsWith('/') ? "" : "/" ) + "jobs";
        this.apiKey  = apiKey;
    }

    /**
	 * 
	 * Call the Modzy API Service and query on the history of jobs
	 * 
     * @param {string} user - Name of the job submitter
     * @param {string} access_key - Identifier of the access key to be assigned to the user
     * @param {(Date|string)} start_date - initial date to filter recods
     * @param {(Date|string)} end_date - final date to filter recods
     * @param {string} model - model name or version
     * @param {string} status - Status of the jobs (all, pending, terminated)
     * @param {string} sortBy - attribute name to sort results
     * @param {string} direction - Direction of the sorting algorithm (asc, desc)
     * @param {number} page - The page number for which results are being returned
     * @param {number} perPage - The number of job identifiers returned by page
	 * @return {Job[]} List of Jobs according to the search params
	 * @throws {ApiError} Error if there is something wrong with the service or the call
	 */
	getJobHistory(user, accessKey, startDate, endDate,
                  model, status,
                  page, perPage=1000, direction, sortBy
        ){
        if( user !== null && typeof user !== "string" ){
            throw("the user param should be a string");
        }
        if( accessKey !== null && typeof accessKey !== "string" ){
            throw("the accessKey param should be a string");
        }  
        if( startDate !== null && startDate !== undefined ){
            if( startDate instanceof Date ){
                startDate = startDate.toISOString();
            }
            else if( typeof startDate !== "string" ){
                throw("the startDate param should be a datetime or string");
            }
        }
        if( endDate !== null && endDate !== undefined ){
            if( typeof endDate === "Date" ){
                endDate = endDate.toISOString();
            }
            else if( typeof endDate !== "string" ){
                throw("the endDate param should be a datetime or string");
            }
        }
        if( status !== null && typeof status !== "string" ){
            throw("the status param should be a string");
        } 
        if( model !== null && typeof model !== "string" ){
            throw("the model param should be a string");
        } 
        if( sortBy !== null && typeof sortBy !== "string" ){
            throw("the sortBy param should be a string");
        }
        if( direction !== null && typeof direction !== "string" ){
            throw("the direction param should be a string");
        }        
        if( page !== null && typeof page !== "number"){
            throw("the page param should be a number");
        }
        if( perPage !== null && typeof perPage !== "number"){
            throw("the perPage param should be a number");
        }
        const searchParams = {
            "user": user,
            "accessKey": accessKey,
            "startDate": startDate,
            "endDate": endDate,
            "model": model,
            "status": status,
            "sort-by": sortBy,
            "direction": direction,
            "page": page,
            "per-page": perPage
        };
        Object.keys(searchParams).forEach( key => (searchParams[key] === null) && delete searchParams[key] );
        const requestURL = this.baseURL + "/history?"+Object.keys(searchParams).map(key => key+'='+ searchParams[key] ).join('&');
        logger.debug(`getJobHistory(${searchParams}) GET ${requestURL}`);
        return axios.get(
                requestURL,
                {headers: {'Authorization':`ApiKey ${this.apiKey}`}}
            )
            .then(
                ( response )=>{
                    logger.info(`getJobHistory(${searchParams}) :: ${response.status} ${response.statusText}`);
                    return response.data;
                }
            )
            .catch(
                ( error )=>{
                    throw( new ApiError( error ) );                 
                }
            );
    }


    /**
     *
     * Create a new job for a specific model and version with the text inputs provided.
     *
     * @param {string} modelId - the model id string
     * @param {versionId} versionId - version id string
     * @param {Object[]} textSources - The source(s) of the model
     * @return {Object} the updated instance of the Job returned by Modzy API
     * @throws {ApiError} If there is something wrong with the service or the call
     */
    submitJobText(modelId, versionId, textSources) {
        return this.submitJob(
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
     * Create a new job for a specific model and version with the embedded inputs provided.
     *
     * @param {string} modelId - the model id string
     * @param {string} versionId - version id string
     * @param {Object[]} fileSources the source(s) of the model
     * @return {Object} the updated instance of the Job returned by Modzy API
     * @throws {ApiError} if there is something wrong with the service or the call
     */
    submitJobFiles(modelId, versionId, fileSources) {
        let job = {};
        let chunkSize = 1024*1024;
        return this.submitJob(
            {
                "model": {
                    "identifier": modelId,
                    "version": versionId
                }
            }
        ).then(
            (openJob)=>{
                job = openJob;
                return this.getFeatures();
            }
        ).then(
            (features)=>{
                try{
                    return humanReadToBytes(features["inputChunkMaximumSize"]);
                } catch (error){
                    logger.warn(`unexpected error extracting inputChunkMaximumSize from ${features}, error: ${error}`);
                    return 1024*1024;//default 1Mi
                }
            }
        ).then(
            (maxChunkSize)=>{
                let inputPomise = Promise.resolve(job);
                Object.keys(fileSources).forEach(
                    inputItemKey => {
                        Object.keys(fileSources[inputItemKey]).forEach(
                            dataItemKey => {
                                inputPomise = inputPomise.then( () => this.appendInput(job, inputItemKey, dataItemKey, fileSources[inputItemKey][dataItemKey], maxChunkSize) );
                            }
                        );
                    }
                );
                return inputPomise;
            }
        ).then(
            (submitResults)=>{
                return this.closeJob(job);
            }
        ).catch(
            (apiError) => {                
                //Try to cancel the job
                return this.cancelJob(job.jobIdentifier)
                    .then((_)=>{throw(apiError);})
                    .catch((_)=>{throw(apiError);});
            }
        );
    }

    /**
     *
     * Create a new job for a specific model and version with the embedded inputs provided.
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
        return this.submitJob(
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
     * Create a new job for a specific model and version with the aws-s3 inputs provided.
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
        return this.submitJob(
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
     * Create a new job for a specific model and version with the jdbc query provided,
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
        return this.submitJob(
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
     * Utility method that waits until the job finishes.
     *
     * This method first checks the status of the job and waits until the job reaches
     * the completed/error status by passing through the submitted and in_progress states.
     *
     * @param {Object} job The job to block
     * @return {Object} an updated instance of the job in a final state
     * @throws {ApiError} if there is something wrong with the service or the call
     */
    blockUntilComplete(job) {
        logger.debug(`blockUntilComplete(${job.jobIdentifier}) :: ${job.status}`);
        return new Promise(
            (resolve, reject) => {
                setTimeout(
                    () => {
                        this.getJob(job.jobIdentifier)
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
     * @param {*} job 
     */
    submitJob(job){        
        logger.debug(`submitJob(${job.model.identifier}, ${job.model.version}) POST ${this.baseURL}`);
        return axios.post(
                this.baseURL,
                job,
                {headers: {'Authorization':`ApiKey ${this.apiKey}`}}
            )
            .then(
                ( response )=>{
                    logger.info(`submitJob(${job.model.identifier}, ${job.model.version}) :: ${response.status} ${response.statusText}`);
                    response.data.status = "SUBMITTED"; 
                    return response.data;
                }
            )
            .catch(
                ( error )=>{
                    throw( new ApiError( error ) );                  
                }
            );
    }

    appendInput(job, inputItemKey, dataItemKey, inputValue, chunkSize){
        const requestURL = `${this.baseURL}/${job.jobIdentifier}/${inputItemKey}/${dataItemKey}`;

        let iterator;
        if( inputValue.byteLength !== undefined ){
            iterator = byteArrayToChunks(inputValue, chunkSize);
        } else {
            iterator = fileToChunks(inputValue, chunkSize);
        }
        return this.appendInputChunk(requestURL, iterator, chunkSize, dataItemKey, 0);
    }

    appendInputChunk(requestURL, asyncGenerator, chunkSize, dataItemKey, chunkCount){
        return asyncGenerator
            .next()
            .then(
                (entry)=>{
                    if( entry && entry.value ){
                        return new Promise(
                            (resolve, reject)=>{
                                logger.debug(`appendInputChunk(${requestURL}) [${chunkCount}] POST ${entry.value.length} bytes`);
                                const requestObj = parseUrl(requestURL);
                                requestObj.headers = { 'Authorization': `ApiKey ${this.apiKey}`};
                                const data   = new FormData({maxDataSize: chunkSize} );
                                data.append("input", entry.value, dataItemKey );
                                data.submit(requestObj, function(error, response){
                                    logger.info(`appendInputChunk(${requestURL}) [${chunkCount}] :: ${response.statusCode} ${response.statusMessage}`);
                                    if( error || response.statusCode >= 400){
                                        reject( new ApiError( error, requestURL, response.statusCode, response.statusMessage ) );
                                    }
                                    resolve(response.resume());
                                });
                            }
                        ).then(
                            (_)=>{
                                return this.appendInputChunk(requestURL, asyncGenerator, chunkSize, dataItemKey,chunkCount+1);
                            }
                        );
                    }
                    return null;
                }
            );
    }

    closeJob(job){
        const requestURL = `${this.baseURL}/${job.jobIdentifier}/close`;
        logger.debug(`closeJob(${job.jobIdentifier}) POST ${requestURL}`);
        return axios.post(
            requestURL,
            {},
            {headers: {'Authorization':`ApiKey ${this.apiKey}`}}
        )
            .then(
                ( response )=>{
                    logger.info(`closeJob(${job.jobIdentifier}) :: ${response.status} ${response.statusText}`);
                    response.data.status = "SUBMITTED";
                    return response.data;
                }
            )
            .catch(
                ( error )=>{
                    throw( new ApiError( error ) );
                }
            );
    }

    /**
     * Call the Modzy API Service that return a job instance by it's identifier
     * @param {string} jobId - the job identifier
     * @return {Object} a updated job instance
     * @throws {ApiError} If there is something wrong with the sevice or the call
     */
    getJob(jobId){
        const requestURL = `${this.baseURL}/${jobId}`;
        logger.debug(`getJob(${jobId}) GET ${requestURL}`);
        return axios.get(
                requestURL,
                {headers: {'Authorization':`ApiKey ${this.apiKey}`}}
            )
            .then(
                ( response )=>{
                    logger.info(`getJob(${jobId}) :: ${response.status} ${response.statusText}`);
                    return response.data;
                }
            )
            .catch(
                ( error )=>{
                    throw( new ApiError( error ) ); 
                }
            );
    }

    /**
     * Call Modzy's API Service to return job features
     * @return {Object} An updated job instance
     * @throws {ApiError} If there is something wrong with the sevice or the call
     */
    getFeatures(){
        const requestURL = `${this.baseURL}/features`;
        logger.debug(`getFeatures() GET ${requestURL}`);
        return axios.get(
            requestURL,
            {headers: {'Authorization':`ApiKey ${this.apiKey}`}}
        )
            .then(
                ( response )=>{
                    logger.info(`getFeatures() :: ${response.status} ${response.statusText}`);
                    return response.data;
                }
            )
            .catch(
                ( error )=>{
                    throw( new ApiError( error ) );
                }
            );
    }

    /**
     * Call the Modzy API Service that cancel the Job by it's identifier 
     * @param {string} jobId - Identifier of the job
     * @return {Object} a updated job instance
     * @throws {ApiError} If there is something wrong with the sevice or the call
     */
    cancelJob(jobId){
        const requestURL = `${this.baseURL}/${jobId}`;
        logger.debug(`cancelJob(${jobId}) DELETE ${requestURL}`);
        return axios.delete(
                requestURL,
                {headers: {'Authorization':`ApiKey ${this.apiKey}`}}
            )
            .then(
                ( response )=>{
                    logger.info(`cancelJob(${jobId}) :: ${response.status} ${response.statusText}`);
                    return response.data;
                }
            )
            .catch(
                ( error )=>{
                    throw( new ApiError( error ) ); 
                }
            );
    }    

}

module.exports = JobClient;