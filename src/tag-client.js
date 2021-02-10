const axios  = require('axios').default;
const logger = require('log4js').getLogger("modzy.tag-client");

const ApiError = require('./api-error.js');

/**
 * Utility class that mask the interaction with the model tags api
 *  
 */
class TagClient{

    /**
     * Create a TagClient 
     * @param {string} baseURL - base url of modzy api (i.e.: https://modzy.url/api)
     * @param {string} apiKey  - api key to access modzy
     */
    constructor(baseURL, apiKey){
        this.baseURL = baseURL + ( baseURL.endsWith('/') ? "" : "/" ) + "models/tags";        
        this.apiKey  = apiKey;
    }

    /**
	 * 
	 * Call the Modzy service that returns all the tags
	 * 
	 * @return {Object[] A list of all the Modzy tags
	 * @throws {ApiError} If there is something wrong with the service or the call
	 */
    getAllTags(){
        logger.debug(`getAllTags() GET ${this.baseURL}`);
        return axios.get(
                this.baseURL, 
                //{headers: {'Authorization':`ApiKey ${this.apiKey}`}}
            )
            .then(
                ( response )=>{
                    logger.info(`getAllTags() :: ${response.status} ${response.statusText}`);
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
	 * Call the Modzy API Service that return a tag Wrapper with the list of Tag and Model instances
	 * 
	 * @param {...string} tagsId - Identifier(s) of the tag(s)
	 * @return {Object} A object instance that wraps tags and models if the tagsId is valid
	 * @throws {ApiError} if there is something wrong with the service or the call
	 */
    getTagsAndModels(...tagsId){
        const requestURL = this.baseURL+"/"+tagsId.join(",");
        logger.debug(`getTagsAndModels(${tagsId}) GET ${requestURL}`);
        return axios.get(
            requestURL, 
                //{headers: {'Authorization':`ApiKey ${this.apiKey}`}}
            )
            .then(
                ( response )=>{
                    logger.info(`getTagsAndModels(${tagsId}) :: ${response.status} ${response.statusText}`);
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

module.exports = TagClient;