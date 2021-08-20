const axios  = require('axios').default;
const logger = require('log4js').getLogger("modzy.model-client");

const ApiError = require('./api-error.js');
const stringSimilarity = require("string-similarity");

/**
 * Utility class that mask the interaction with the model api
 */
class ModelClient{

    /**
     * Create a ModelClient 
     * @param {string} baseURL - base url of modzy api (i.e.: https://modzy.url/api)
     * @param {string} apiKey  - api key to access modzy
     */
    constructor(baseURL, apiKey){        
        this.baseURL = baseURL + ( baseURL.endsWith('/') ? "" : "/" ) + "models";
        this.apiKey  = apiKey;
    }

    /**
     *
     * Call the Modzy service that retrieve models basic info (modelId, versions, and latestVersion)
     *
     * @param {string} modelId - Identifier(s) of the model(s). Separate multiple values with ;
     * @param {string} author - Authoring company.
     * @param {string} createdByEmail - Creator email
     * @param {string} name - name of the model
     * @param {string} description - description of the model
     * @param {(boolean|string)} isActive - availability of the model in the marketplace
     * @param {(boolean|string)} isExpired - expiration status
     * @param {(boolean|string)} isRecommended - recomended models
     * @param {(Date|string)} lastActiveDateTime - expiration date
     * @param {(Date|string)} expirationDateTime - latest use date
     * @param {string} sortBy - attribute name to sort results
     * @param {string} direction - Direction of the sorting algorithm (asc, desc)
     * @param {number} page - The page number for which results are being returned
     * @param {number} perPage - The number of job identifiers returned by page
     * @return {Object[]} List of Models according to the search params
     * @throws {ApiError} Error if there is something wrong with the service or the call
     */
    getModels(modelId= null, author= null, createdByEmail= null, name= null,
              description= null, isActive= null, isExpired= null, isRecommended= null,
              lastActiveDateTime= null, expirationDateTime= null,
              page= null, perPage=1000, direction= null, sortBy= null
        ){
        if( modelId !== null && typeof modelId !== "string" ){
            throw("the modelId param should be a string");
        }
        if( author !== null && typeof author !== "string" ){
            throw("the author param should be a string");
        }
        if( createdByEmail !== null && typeof createdByEmail !== "string" ){
            throw("the createdByEmail param should be a string");
        }
        if( name !== null && typeof name !== "string" ){
            throw("the createdByEmail param should be a string");
        }
        if( description !== null && typeof description !== "string" ){
            throw("the description param should be a string");
        }
        if( isActive !== null && isActive !== undefined ){
            if( typeof isActive == "boolean" ){
                isActive = isActive.toString();
            }
            else if( typeof isActive !== "string"){
                throw("the isActive param should be a boolean or string");
            }
        }
        if( isExpired !== null && isExpired !== undefined ){
            if( typeof isExpired == "boolean" ){
                isExpired = isExpired.toString();
            }
            else if( typeof isExpired !== "string"){
                throw("the isExpired param should be a boolean or string");
            }
        }
        if( isRecommended !== null && isRecommended !== undefined ){
            if( typeof isRecommended == "boolean" ){
                isRecommended = isRecommended.toString();
            }
            else if( typeof isRecommended !== "string"){
                throw("the isRecommended param should be a boolean or string");
            }
        }

        if( lastActiveDateTime !== null && lastActiveDateTime !== undefined ){
            if( typeof lastActiveDateTime === "Date" ){
                lastActiveDateTime = lastActiveDateTime.toISOString();
            }
            else if( typeof lastActiveDateTime !== "string" ){
                throw("the lastActiveDateTime param should be a datetime or string");
            }
        }
        if( expirationDateTime !== null && expirationDateTime !== undefined ){
            if( typeof expirationDateTime === "Date" ){
                expirationDateTime = expirationDateTime.toISOString();
            }
            else if( typeof expirationDateTime !== "string" ){
                throw("the expirationDateTime param should be a datetime or string");
            }
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
            "modelId": modelId,
            "author": author,
            "createdByEmail": createdByEmail,
            "name": name,
            "description": description,
            "isActive": isActive,
            "isExpired" : isExpired,
            "isRecommended": isRecommended,
            "lastActiveDateTime": lastActiveDateTime,
            "expirationDateTime": expirationDateTime,
            "sort-by": sortBy,
            "direction": direction,
            "page": page,
            "per-page": perPage
        };
        Object.keys(searchParams).forEach( key => (searchParams[key] === null) && delete searchParams[key] );
        const requestURL = this.baseURL + "?"+Object.keys(searchParams).map(key => key+'='+ encodeURIComponent(searchParams[key]) ).join('&');
        logger.debug(`getModels(${searchParams}) GET ${requestURL}`);
        return axios.get(
            requestURL,
            {headers: {'Authorization':`ApiKey ${this.apiKey}`}}
        )
            .then(
                ( response )=>{
                    logger.info(`getModels(${searchParams}) :: ${response.status} ${response.statusText}`);
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
     * Call the Modzy service that returns all the models, this
     * method is a wrapper of [ModelClient#getModels()]{@link ModelClient#getModels} method.
     * @see {@link ModelClient#getModels}
     * @returns {Model[]} - A list of all Modzy Models 
     * @throws {ApiError} Error if there is something wrong with the service or the call
     */
    getAllModels(){
        return this.getModels();
    }

    /**
     * 
     * Call the Modzy API Service that return a model instance by it's identifier
     * 
     * @param {string} modelId - Identifier of the model
     * @returns {Object} A Modzy model
     * @throws {ApiError} Error if there is something wrong with the service or the call
     */
    getModel(modelId){
        const requestURL = `${this.baseURL}/${modelId}`;
        logger.debug(`getModel(${modelId}) GET ${requestURL}`);
        return axios.get(
                requestURL,
                {headers: {'Authorization':`ApiKey ${this.apiKey}`}}
            )
            .then(
                ( response )=>{
                    logger.info(`getModel(${modelId}) :: ${response.status} ${response.statusText}`);
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
     * Call the Modzy API Service that return a model instance by it's name
     * This method do a model search using the name param and return the first result.
     * @param {string} name - The name of the model
     * @returns {Object} A Modzy model
     * @throws {ApiError} Error if there is something wrong with the service or the call
     */
    getModelByName(name){
        return this.getModels(
          null, null, null, name,
            null, true, null, null, null, null,
            null, 20, null, "name"
        )
            .then(
                    (models) => {
                        logger.debug(`getModelByName(${name}) models ${models.length}`);
                        if( models !== null && models.length > 0 ){
                            if( models.length > 1 ){
                                return Promise.all(
                                    models.map( model => this.getModel(model.modelId))
                                ).then(
                                    models2 => {
                                        models2 = models2.map(
                                            model => {
                                                model.distance = stringSimilarity.compareTwoStrings(name, model.name);
                                                return model;
                                            }
                                        ).sort(
                                            (a,b) => a.distance - b.distance
                                        );
                                        models2.forEach(model=>logger.debug(`${model.modelId} ${model.name} ${model.distance}`));
                                        logger.debug(`getModelByName(${name}) model ${models2[models2.length-1].modelId} :: ${models2[models2.length-1].name}`);
                                        return models2[models2.length-1];
                                    }
                                );
                            }
                            logger.debug(`getModelByName(${name}) model ${models[0].modelId} `);
                            return this.getModel(models[0].modelId);
                        }
                        else{
                            throw( new ApiError( null, this.baseURL, 400, "Model "+name+" not found" ) );
                        }
                    }
                )
            .catch(
                    ( error )=>{
                        throw error;
                    }
                );
    }

    /**
	 * 
	 * Call the Modzy API Service that return a model list related to a model identifier
	 * 
	 * @param {string} modelId - Identifier of the model
	 * @return {Object[]} A list of Modzy Models related to the modelId param
	 * @throws {ApiError} Error if there is something wrong with the service or the call
	 */
    getRelatedModels(modelId){
        const requestURL = `${this.baseURL}/${modelId}/related-models`;
        logger.debug(`getRelatedModels(${modelId}) GET ${requestURL}`);
        return axios.get(
            requestURL,
            {headers: {'Authorization':`ApiKey ${this.apiKey}`}}
        )
        .then(
            ( response )=>{
                logger.info(`getRelatedModels(${modelId}) :: ${response.status} ${response.statusText}`);
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
	 * Call the Modzy API Service that return a version list related to a model identifier
	 * 
	 * @param {string} modelId - Identifier of the model
	 * @return {Object[]} A list of Modzy Versions related to the modelId param
	 * @throws {ApiError} Error if there is something wrong with the service or the call
	 */
    getModelVersions(modelId){
        const requestURL = `${this.baseURL}/${modelId}/versions`;
        logger.debug(`getModelVersions(${modelId}) GET ${requestURL}`);
        return axios.get(
            requestURL,
            {headers: {'Authorization':`ApiKey ${this.apiKey}`}}
        )
        .then(
            ( response )=>{
                logger.info(`getModelVersions(${modelId}) :: ${response.status} ${response.statusText}`);
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
	 * Call the Modzy API Service that return a model version
	 * 
	 * @param {string} modelId - Identifier of the model
     * @param {string} versionId - Identifier of the version
	 * @return {Object} A Modelversion instance
	 * @throws {ApiError} Error if there is something wrong with the service or the call
	 */
    getModelVersion(modelId, versionId){
        const requestURL = `${this.baseURL}/${modelId}/versions/${versionId}`;
        logger.debug(`getModelVersion(${modelId}, ${versionId}) GET ${requestURL}`);
        return axios.get(
            requestURL,
            {headers: {'Authorization':`ApiKey ${this.apiKey}`}}
        )
        .then(
            ( response )=>{
                logger.info(`getModelVersion(${modelId}, ${versionId}) :: ${response.status} ${response.statusText}`);
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
	 * Call the Modzy API Service that return the model version input sample
	 * 
	 * @param {string} modelId - Identifier of the model
     * @param {string} versionId - Identifier of the version
	 * @return {String} A json string with the input sample
	 * @throws {ApiError} Error if there is something wrong with the service or the call
	 */
    getModelVersionInputSample(modelId, versionId){
        const requestURL = `${this.baseURL}/${modelId}/versions/${versionId}/sample-input`;
        logger.debug(`getModelVersionInputSample(${modelId}, ${versionId}) GET ${requestURL}`);
        return axios.get(
            requestURL,
            {headers: {'Authorization':`ApiKey ${this.apiKey}`}}
        )
        .then(
            ( response )=>{
                logger.info(`getModelVersionInputSample(${modelId}, ${versionId}) :: ${response.status} ${response.statusText}`);
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
	 * Call the Modzy API Service that return the model version output sample
	 * 
	 * @param {string} modelId - Identifier of the model
     * @param {string} versionId - Identifier of the version
	 * @return {String} A json string with the output sample
	 * @throws {ApiError} Error if there is something wrong with the service or the call
	 */
    getModelVersionOutputSample(modelId, versionId){
        const requestURL = `${this.baseURL}/${modelId}/versions/${versionId}/sample-output`;
        logger.debug(`getModelVersionOutputSample(${modelId}, ${versionId}) GET ${requestURL}`);
        return axios.get(
            requestURL,
            {headers: {'Authorization':`ApiKey ${this.apiKey}`}}
        )
        .then(
            ( response )=>{
                logger.info(`getModelVersionOutputSample(${modelId}, ${versionId}) :: ${response.status} ${response.statusText}`);
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

module.exports = ModelClient;