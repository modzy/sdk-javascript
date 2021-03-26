const logger = require('log4js').getLogger("modzy");
const modzy = require('modzy-sdk');

// Always configure the logger level (ie: all, trace, debug, info, warn, error, fatal)
logger.level = "info";

// The system admin can provide the right base API URL, the API key can be downloaded from your profile page on Modzy.
// You can config those params as is described in the readme file (as environment variables, or by using the .env file), or you
// or you can just update the BASE_URL and API_KEY vars and use this sample code (not recommended for production environments).
// The MODZY_BASE_URL should point to the API services route which may be different from the Modzy page URL.
// (ie: https://modzy.example.com/api).
const BASE_URL = process.env.MODZY_BASE_URL;
// The MODZY_API_KEY is your own personal API key. It is composed by a public part, a dot character and a private part
// (ie: AzQBJ3h4B1z60xNmhAJF.uQyQh8putLIRDi1nOldh).
const API_KEY  = process.env.MODZY_API_KEY;

// Client initialization
//   Initialize the ApiClient instance with the BASE_URL and the API_KEY to store those arguments
//  for the following API calls.
const modzyClient = new modzy.ModzyClient(BASE_URL, API_KEY);

async function modelsSample(){
    // Get all models
    // You can get the full list of models from Modzy by using get_all method, this call will return just the identifier
    // and the latest version of each model
    let models = await modzyClient.getAllModels();
    logger.info( `All models ${models.length}` );
    // Also, you can do more interesting search by the get_models method:
    // Search by author
    models = await modzyClient.getModels(
            /*modelId*/null, /*author*/'Open Source', /*createdByEmail*/null, /*name*/null, /*description*/null, 
            /*isActive*/null, /*isExpired*/null, /*isRecommended*/null, /*lastActiveDateTime*/null, /*expirationDateTime*/null,
            /*page*/null, /*perPage*/100, /*direction*/null, /*sortBy*/null);
    logger.info( `Open Source models ${models.length}` );
    // Active models
    models = await modzyClient.getModels(
        /*modelId*/null, /*author*/null, /*createdByEmail*/null, /*name*/null, /*description*/null, 
        /*isActive*/true, /*isExpired*/null, /*isRecommended*/null, /*lastActiveDateTime*/null, /*expirationDateTime*/null,
        /*page*/null, /*perPage*/100, /*direction*/null, /*sortBy*/null);
    logger.info( `Active models ${models.length}` );
    // Search by name (and limiting the results)
    models = await modzyClient.getModels(
        /*modelId*/null, /*author*/null, /*createdByEmail*/null, /*name*/'Image', /*description*/null, 
        /*isActive*/true, /*isExpired*/null, /*isRecommended*/null, /*lastActiveDateTime*/null, /*expirationDateTime*/null,
        /*page*/null, /*perPage*/5, /*direction*/null, /*sortBy*/null);
    logger.info( `Models with name start with 'Image' ${models.length}` );
    // Combined search
    models = await modzyClient.getModels(
        /*modelId*/null, /*author*/'Open Source', /*createdByEmail*/null, /*name*/'Image', /*description*/null, 
        /*isActive*/true, /*isExpired*/null, /*isRecommended*/null, /*lastActiveDateTime*/null, /*expirationDateTime*/null,
        /*page*/null, /*perPage*/1, /*direction*/null, /*sortBy*/null);
    logger.info( `Active open source models which name starts with 'Image' ${models.length}` );
    // Get model details
    // the models route didn't return much info about the models, just modelId, latestVersion and versions:
    for( mKey in models){
        let model = models[mKey];
        //logger.info(Object.keys(model).toString().replace('\n', ' '));
        logger.info(model);
        // In order to get more info about the models you need to get the details by identifier
        model = await modzyClient.getModel(model.modelId);
        // then you'll get all the details about the model
        logger.info("Model detail keys: "+Object.keys(model).toString().replace('\n', ' '));
        // In order to get information about the input/output keys and types you need to get the model version details as
        // follows:
        let modelVersion = await modzyClient.getModelVersion(model.modelId, model.latestVersion);
        // then you'll get all the details about the specific model version        
        logger.info("Model version detail keys: "+Object.keys(modelVersion).toString().replace('\n', ' '));
        // Probably the more interesting are the ones related with the inputs and outputs of the model
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
    }
    // Get model by name
    // If you aren't familiar with the models ids, you can find the model by name as follows
    let model = await modzyClient.getModelByName("Dataset Joining");
    logger.info(`Dataset Joining: id: ${model.modelId}, author: ${model.author}, is_active: ${model.is_active}, description: ${model.description}`);
    //Finally, you can find the models related with this search
    models = await modzyClient.getRelatedModels(model.modelId);
    models.forEach(
        (model)=>{                 
            logger.info(`    ${model.identifier} :: ${model.name} (${model.author})`);
        }
    );
}



modelsSample();