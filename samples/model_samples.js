const logger = require('log4js').getLogger("modzy");
const modzy = require('modzy-sdk');
logger.level = "all";


// Client initialization
// TODO: set the base url of modzy api and you api key
const modzyClient = new modzy.ModzyClient(process.env.MODZY_BASE_URL, process.env.MODZY_API_KEY);

// Get all models

async function getAllModelsSample(){
    const models = await modzyClient.getAllModels();

    logger.info( `testGetAllModels() get ${models.length} models` );

    models.forEach(
        (model)=>{                 
            logger.info(JSON.stringify(model));
        }
    );

}

// Get a model by identifier

async function getModelByIdSample(){
    const saModel = await modzyClient.getModel("ed542963de"); // sentiment-analysis    
    logger.info(saModel);
}

// Get related models

async function getRelatedModelsSample(){
    const models = await modzyClient.getRelatedModels("ed542963de");

    logger.info( `getRelatedModelsSample() get ${models.length} models` );

    models.forEach(
        (model)=>{                 
            logger.info(JSON.stringify(model));
        }
    );
}

// Get versions of a model

async function getModelVersionsSample(){
    const versions = await modzyClient.getModelVersions("ed542963de");
    
    logger.info( `getModelVersionsSample() get ${versions.length} versions` );

    versions.forEach(
        (version)=>{                 
            logger.info(JSON.stringify(version));
        }
    );
}


getAllModelsSample()
    .then(  
        ()=>{
            return getModelByIdSample();
        }
    )
    .then(  
        ()=>{
            return getRelatedModelsSample();
        }
    )
    .then(  
        ()=>{
            return getModelVersionsSample();
        }
    )
    .catch(
        (error)=>{
            logger.error(error);
        }
    );
;
