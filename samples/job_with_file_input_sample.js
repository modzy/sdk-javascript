const logger = require('log4js').getLogger("modzy");
const modzy = require('modzy-sdk');
const fs = require('fs');

// Always configure the logger level (ie: all, trace, debug, info, warn, error, fatal)
logger.level = "info";

// The system admin can provide the right base API URL, the API key can be downloaded from your profile page on Modzy.
// You can config those params as is described in the readme file (as environment variables, or by using the .env file), or you
// or you can just update the BASE_URL and API_KEY vars and use this sample code (not recommended for production environments).
// The MODZY_BASE_URL should point to the API services route which may be different from the Modzy page URL.
// (ie: https://modzy.example.com/api).
const BASE_URL = process.env.MODZY_BASE_URL;
// The MODZY_API_KEY is your own personal API key. It is composed by a public part, a dot character, and a private part
// (ie: AzQBJ3h4B1z60xNmhAJF.uQyQh8putLIRDi1nOldh).
const API_KEY  = process.env.MODZY_API_KEY;

// Client initialization
//   Initialize the ApiClient instance with the BASE_URL and the API_KEY to store those arguments
//  for the following API calls.
const modzyClient = new modzy.ModzyClient(BASE_URL, API_KEY);

// Create a Job with an embedded input, wait, and retrieve results:

async function createJobWithFileInput(){
	try {
		// Get the model object:
        // If you already know the model identifier (i.e.: you got from the URL of the model details page or the input sample),
        // you can skip this step. If you don't, you can find the model identifier by using its name as follows:
        let model = await modzyClient.getModelByName("Multi-Language OCR");
        // Or if you already know the model id and want to know more about the model, you can use this instead:
		//let model = await modzyClient.getModel("c60c8dbd79");
		
		// The model identifier is under the modelId key. You can take a look at the other keys by uncommenting the following line
        logger.info(Object.keys(model).toString().replace('\n', ' '));
        // Or just log the model identifier and the latest version        
        logger.info(`The model identifier is ${model.modelId} and the latest version is ${model.latestVersion}`);
        // Get the model version object:
        // If you already know the model version and the input key(s) of the model version you can skip this step. Also, you can
        // use the following code block to know about the input keys and skip the call on future job submissions.
        let modelVersion = await modzyClient.getModelVersion(model.modelId, model.latestVersion);
        // The info stored in modelVersion provides insights about the amount of time that the model can spend processing, the inputs, and
        // output keys of the model.
        logger.info(`Ths model version is ${modelVersion.version}`);
        logger.info(`  timeouts: status ${modelVersion.timeout.status}ms, run ${modelVersion.timeout.run}ms `);
        logger.info("  inputs: ");
        for(key in modelVersion.inputs){
            let input = modelVersion.inputs[key];
            logger.info(`    key ${input.name}, type ${input.acceptedMediaTypes}, description: ${input.description}`);
        }
        logger.info("  outputs: ")
        for(key in modelVersion.outputs){            
            let output = modelVersion.outputs[key];
            logger.info(`    key ${output.name}, type ${output.mediaType}, description: ${output.description}`);
        }
		// Send the job:
        // A file input can be a byte array or any file path. This input type fits files of any size.
        const imagePath  = 'samples/image.png';
        const configPath = 'samples/config.json';
		// With the info about the model (identifier), the model version (version string, input/output keys), you are ready to
		// submit the job. Just prepare the source object:
		let sources = {"source-key": {"input": imagePath, "config.json": configPath}};
		// An inference job groups input data that you send to a model. You can send any amount of inputs to
		// process and you can identify and refer to a specific input by the key that you assign, for example we can add:
		sources["second-key"] = {"input": imagePath, "config.json": configPath}
		// You don’t need to load all the inputs from the files, just convert to bytes as follows:
		const configBytes = Buffer.from(JSON.stringify({"languages":["spa"]}));
		sources["another-key"] = {"input": imagePath, "config.json":configBytes}
		// If you send an incorrect input key, the model fails to process the input.
		sources["wrong-key"] = {"a.wrong.key": imagePath, "config.json":configPath}
		// If you send a correct input key, but some wrong values, the model fails to process the input.
		sources["wrong-value"] = {"input": configPath, "config.json":imagePath}
		// When you have all your inputs ready, you can use our helper method to submit the job as follows:        
        let job = await modzyClient.submitJobFiles(model.modelId,modelVersion.version, sources);
        // Modzy creates the job and queue for processing. The job object contains all the info that you need to keep track
        // of the process, the most important being the job identifier and the job status.
        logger.info("job: "+job.jobIdentifier+" "+job.status);
        // The job moves to SUBMITTED, meaning that Modzy acknowledged the job and sent it to the queue to be processed.
        // We provide a helper method to listen until the job finishes processing. It will listen until the job finishes 
        // and moves to COMPLETED, CANCELED, or TIMEOUT.        
        job = await modzyClient.blockUntilComplete(job);
        // Get the results:
        // Check the status of the job. Jobs may be canceled or may reach a timeout.
        if( job.status === "COMPLETED" ){
            // A completed job means that all the inputs were processed by the model. Check the results for each
            // input key provided in the source object to see the model output.
            let result = await modzyClient.getResult(job.jobIdentifier);
            // The result object has some useful info:
            logger.info(`Result: finished:  ${result.finished}, total: ${result.total}, completed: ${result.completed}, failed: ${result.failed}`);
            // Notice that we are iterating through the same input sources keys
            for( key in sources ){
                // The result object has the individual results of each job input. In this case, the output key is called
                // results.json, so we can get the results as follows:
                if( result.results[key] ){
                    let model_res = result.results[key]["results.json"];
                    // The output for this model comes in a JSON format, so we can directly log the model results:                    
                    logger.info(`    ${key}: ${JSON.stringify(model_res)}`);
                }
                else{					
                    logger.warn(`    ${key}: failure ${result.failures[key]['error']}`);
                }
            }
        }
        else{
            log.warn(`The job ends with status ${job.status}`);
        }        
	}
	catch(error){		
		logger.warn(error);
	}
}


createJobWithFileInput();