const logger = require('log4js').getLogger("modzy");
const modzy = require('modzy-sdk');
logger.level = "all";

// Client initialization
// TODO: set the base url of modzy api and you api key
const modzyClient = new modzy.ModzyClient(process.env.MODZY_BASE_URL, process.env.MODZY_API_KEY);

// Create a Job with a text input

async function createJobWithTextInput(){
    try{
        let model = await modzyClient.getModelByName("Sentiment Analysis");
        logger.info("Model: "+JSON.stringify(model));
        let modelVersion = await modzyClient.getModelVersion(model.modelId, model.latestVersion);
        logger.info("ModelVersion: "+JSON.stringify(modelVersion));
        let job = await modzyClient.submitJobText(
            model.modelId,
            modelVersion.version,
            {
                'input-1':{'input.txt':'Modzy is great'}
            }
        );
        logger.info("job: "+job.jobIdentifier+" "+job.status);
        job = await modzyClient.blockUntilComplete(job);
        logger.info("job: "+job.jobIdentifier+" "+job.status);
        let results = await modzyClient.getResult(job.jobIdentifier);
        logger.info("results: "+job.jobIdentifier+" "+JSON.stringify(results.results));
    }
    catch(error){
        logger.warn("Unexpected error "+error);
    }
}

createJobWithTextInput();
