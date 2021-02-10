require('dotenv').config();
//
const ModelClient = require('./model-client.js');
const TagClient = require( './tag-client.js');
const JobClient = require('./job-client.js');
const ResultClient = require('./result-client.js');
const ModzyClient = require('./modzy-client.js');
const ApiError = require('./api-error.js');

/**
 * @type {{TagClient: TagClient, ResultClient: ResultClient, ModelClient: ModelClient, ModzyClient: ModzyClient, ApiError: ApiError, JobClient: JobClient}}
 */
module.exports = {
    ModelClient,
    TagClient,
    JobClient,
    ResultClient,
    ModzyClient,
    ApiError
};