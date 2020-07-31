require('dotenv').config();
//
import ModelClient  from './model-client.js';
import TagClient    from './tag-client.js';
import JobClient    from './job-client.js';
import ResultClient from './result-client.js';
import ModzyClient  from './modzy-client.js';
import ApiError     from './api-error.js';

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