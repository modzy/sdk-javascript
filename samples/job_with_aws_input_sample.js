const logger = require('log4js').getLogger("modzy");
const modzy = require('modzy-sdk');
logger.level = "all";

// Client initialization
// TODO: set the base url of modzy api and you api key
const modzyClient = new modzy.ModzyClient(MODZY_BASE_URL, MODZY_API_KEY);

// Create a Job with a text input

async function createJobWithAWSInput(){
    try{
        let model = await modzyClient.getModelByName("Facial Embedding");
        logger.info("Model: "+JSON.stringify(model));
        let modelVersion = await modzyClient.getModelVersion(model.modelId, model.latestVersion);
        logger.info("ModelVersion: "+JSON.stringify(modelVersion));
        let job = await modzyClient.submitJobAWSS3(
            model.modelId,
            modelVersion.version,
            "MyAccessKeyID", //TODO: Replace with your aws s3 access key id
            "MySecretAccessKey", //TODO: Replace with your aws s3 access key secret
            "TheRegion", //TODO: Replace with your aws s3 region
            {
                'input-1': {
                    'input.txt': {
                        'bucket': 'the-aws-bucket', //TODO: Replace with your aws s3 bucket
                        'key': '/path/to/the/file/image.jpeg' //TODO: Replace with your aws s3 file key
                    }
                }
            }
        ); // Facial Embedding
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

createJobWithAWSInput();