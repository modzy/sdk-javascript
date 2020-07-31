const logger = require('log4js').getLogger("modzy");
const modzy = require('modzy-sdk');
const fs = require('fs');
logger.level = "all";

// Client initialization
// TODO: set the base url of modzy api and you api key
const modzyClient = new modzy.ModzyClient(process.env.MODZY_BASE_URL, process.env.MODZY_API_KEY);

// Create a Job with a embedded input

async function createJobWithEmbeddedInput(){
	try {
		const imageBytes = fs.readFileSync('samples/image.png');
		let model = await modzyClient.getModelByName("NSFW Image Detection");
		logger.info("Model: " + JSON.stringify(model));
		let modelVersion = await modzyClient.getModelVersion(model.modelId, model.latestVersion);
		logger.info("ModelVersion: " + JSON.stringify(modelVersion));
		let job = await modzyClient.submitJobEmbedded(
			model.modelId,
			modelVersion.version,
			"image/png",
			{
				'input-1': {
					'image': imageBytes
				}
			}
		); //NSFW Image Detection
		logger.info("job: " + job.jobIdentifier + " " + job.status);
		job = await modzyClient.blockUntilComplete(job);
		logger.info("job: " + job.jobIdentifier + " " + job.status);
		let results = await modzyClient.getResult(job.jobIdentifier);
		logger.info("results: " + job.jobIdentifier + " " + JSON.stringify(results.results));
	}
	catch(error){
		logger.warn("Unexpected error "+error);
	}
}


createJobWithEmbeddedInput();