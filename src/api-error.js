const logger = require('log4js').getLogger("modzy");

/**
 * Represent a error on the SDK
 */
class ApiError{

    /**
     * Create a ApiError
     * @param {Error} error    - the base error throwed by axios
     * @param {string} url     - the url of the Modzy Api 
     * @param {number} code    - http error code
     * @param {string} message - error message
     */
    constructor(error=null, url="", code=500, message="Unexpected"){
        this.error   = error !== null ? error.toJSON() : message;
        this.url     = error !== null ? this.error.config.url : url;
        this.code    = error !== null ? ( error.response?.data ? error.response.data.statusCode : code ) : code;
        this.message = error !== null ? ( error.response?.data ? error.response.data.message : this.error.message ) : message;
    }

    /**
     * Convert this error to string
     * @return {string} The string representation of this object
     */
    toString(){
        return `${this.code} :: ${this.message} :: ${this.url}`;
    }
}

module.exports = ApiError;