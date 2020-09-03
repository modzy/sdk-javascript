const axios  = require('axios').default;
const logger = require('log4js').getLogger("modzy.job-client");

import ApiError from './api-error.js';

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
     * Call the Modzy API Service that cancel the Job by it's identifier 
     * @param {string} jobId - Identifier of the job
     * @return {Object} a updated job instance
     * @throws {ApiError} If there is something wrong with the sevice or the call
     */
    cancelJob(jobId){
        const requestURL = `${this.baseURL}/${jobId}`;
        logger.debug(`cancelJob(${jobId}) GET ${requestURL}`);
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