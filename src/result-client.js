const axios  = require('axios').default;
const logger = require('log4js').getLogger("modzy.result-client");

const ApiError = require('./api-error.js');
 
/**
 * Utility class that mask the interaction with the result api
 * @constructor
 */
class ResultClient{

     /**
     * Create a ResultClient 
     * @param {string} baseURL - base url of modzy api (i.e.: https://modzy.url/api)
     * @param {string} apiKey  - api key to access modzy
     */
    constructor(baseURL, apiKey){        
        this.baseURL = baseURL + ( baseURL.endsWith('/') ? "" : "/" ) + "results";
        this.apiKey  = apiKey;
    }

    getResult(jobId){
        const requestURL = `${this.baseURL}/${jobId}`;
        logger.debug(`getResult(${jobId}) GET ${requestURL}`);
        return axios.get(
                requestURL,
                {headers: {'Authorization':`ApiKey ${this.apiKey}`}}
            )
            .then(
                ( response )=>{
                    logger.info(`getResult(${jobId}) :: ${response.status} ${response.statusText}`);
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

module.exports = ResultClient;