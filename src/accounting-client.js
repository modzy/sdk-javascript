const axios  = require('axios').default;
const logger = require('log4js').getLogger("modzy.accounting-client");

const ApiError = require('./api-error.js');

/**
 * Utility class that mask the interaction with the model api
 */
class AccountingClient{

    /**
     * Create a ModelClient
     * @param {string} baseURL - base url of modzy api (i.e.: https://modzy.url/api)
     * @param {string} apiKey  - api key to access modzy
     */
    constructor(baseURL, apiKey){
        this.baseURL = baseURL + ( baseURL.endsWith('/') ? "" : "/" ) + "accounting";
        this.apiKey  = apiKey;
    }

    getAPIKeys(email){
        if( email !== null && typeof email !== "string" ){
            throw("the email param should be a not empty string");
        }
        const requestURL = `${this.baseURL}/access-keys/user/${email}`;
        logger.debug(`getAPIKeys(${email}) GET ${requestURL}`);
        return axios.get(
            requestURL,
            {headers: {'Authorization':`ApiKey ${this.apiKey}`}}
        )
            .then(
                ( response )=>{
                    logger.info(`getAPIKeys(${email}) :: ${response.status} ${response.statusText}`);
                    return response.data;
                }
            )
            .catch(
                ( error )=>{
                    throw( new ApiError( error ) );
                }
            );
    }

    getKeyBody(key){
        if( key !== null && typeof key !== "string" ){
            throw("the key param should be a not empty string");
        }
        const requestURL = `${this.baseURL}/access-keys/${key}/hash`;
        logger.debug(`getAPIKeys(${key}) GET ${requestURL}`);
        return axios.post(
            requestURL,
            {},
            {headers: {'Authorization':`ApiKey ${this.apiKey}`}}
        )
            .then(
                ( response )=>{
                    logger.info(`getKeyBody(${key}) :: ${response.status} ${response.statusText}`);
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

module.exports = AccountingClient;