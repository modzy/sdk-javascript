const logger = require('log4js').getLogger("modzy");
logger.level = "all";

import ModelClient from '../src/model-client.js';
logger.info(process.env.MODZY_BASE_URL);
const modelClient = new ModelClient(process.env.MODZY_BASE_URL, process.env.MODZY_API_KEY);

test(
    'testGetAllModels',
    async () => {
        await modelClient.getAllModels()
            .then(
                (models) => {
                    expect(models).toBeDefined();
                    expect(models).not.toHaveLength(0);
                    logger.info( `testGetAllModels() get ${models.length} models` );
                    models.forEach(
                        (model)=>{
                            expect(model.modelId).toBeDefined();
                            expect(model.latestVersion).toBeDefined();
                            expect(model.versions).toBeDefined();
                        }
                    );
                }
            )
            .catch(
                (error)=>{
                    logger.error("Error: "+error);
                }
            );
    }
);


test(
    'testGetModel',
    async () => {
        await modelClient.getModel('ed542963de')
            .then(
                (model) => {
                    expect(model).toBeDefined();
                    expect(model.modelId).toBeDefined();
                    expect(model.name).toBeDefined();
                    expect(model.description).toBeDefined();
                    expect(model.author).toBeDefined();
                    expect(model.latestVersion).toBeDefined();
                    expect(model.permalink).toBeDefined();
                    expect(model.versions).toBeDefined();
                }
            )
            .catch(
                (error)=>{
                    logger.error("Error: "+error);
                }
            );
    }
);

test(
    'testGetModelByName',
    async () => {
        await modelClient.getModelByName('Sentiment Analysis')
            .then(
                (model) => {
                    expect(model).toBeDefined();
                    expect(model.modelId).toBeDefined();
                    expect(model.name).toBeDefined();
                    expect(model.description).toBeDefined();
                    expect(model.author).toBeDefined();
                    expect(model.latestVersion).toBeDefined();
                    expect(model.permalink).toBeDefined();
                    expect(model.versions).toBeDefined();
                }
            )
            .catch(
                (error)=>{
                    logger.error("Error: "+error);
                }
            );
    }
);

test(
    'testGetRussianToEnglishTranslationModel',
    async () => {
        await modelClient.getModel('cbf9e8d6da')
            .then(
                (model) => {
                    expect(model).toBeDefined();
                    expect(model.modelId).toBeDefined();
                    expect(model.name).toBeDefined();
                    expect(model.description).toBeDefined();
                    expect(model.author).toBeDefined();
                    expect(model.latestVersion).toBeDefined();
                    expect(model.permalink).toBeDefined();
                    expect(model.versions).toBeDefined();
                }
            )
            .catch(
                (error)=>{
                    logger.error("Error: "+error);
                }
            );
    }
);

test(
    'testGetRelatedModels',
    async () => {
        await modelClient.getRelatedModels('ed542963de')
            .then(
                (models) => {
                    expect(models).toBeDefined();
                    expect(models).not.toHaveLength(0);
                    logger.info( `testGetRelatedModels() get ${models.length} models` );
                    models.forEach(
                        (model)=>{
                            expect(model.identifier).toBeDefined();
                            expect(model.name).toBeDefined();
                            expect(model.author).toBeDefined();
                        }
                    );
                }
            )
            .catch(
                (error)=>{
                    logger.error("Error: "+error);
                }
            );
    }
);

test(
    'testGetModelVersions',
    async () => {
        await modelClient.getModelVersions('ed542963de')
            .then(
                (versions) => {
                    expect(versions).toBeDefined();
                    expect(versions).not.toHaveLength(0);
                    logger.info( `testGetModelVersions() get ${versions.length} models` );
                    versions.forEach(
                        (version)=>{
                            expect(version.version).toBeDefined();
                        }
                    );
                }
            )
            .catch(
                (error)=>{
                    logger.error("Error: "+error);
                }
            );
    }
);

test(
    'testGetModelVersion',
    async () => {        
        await modelClient.getModelVersion('c60c8dbd79', '0.0.1')
            .then(
                (version) => {
                    expect(version).toBeDefined();                    
                    logger.info( `testGetModelVersion() get ${version.version} models` );                    
                }
            )
            .catch(
                (error)=>{
                    logger.error("Error: "+error);
                }
            );
    }
);

test(
    'testGetModelVersionInputSample',
    async () => {        
        await modelClient.getModelVersionInputSample('c60c8dbd79', '0.0.1')
            .then(
                (inputSample) => {
                    expect(inputSample).toBeDefined();                    
                }
            )
            .catch(
                (error)=>{
                    logger.error("Error: "+error);
                }
            );
    }
);

test(
    'testGetModelVersionOutputSample',
    async () => {        
        await modelClient.getModelVersionOutputSample('c60c8dbd79', '0.0.1')
            .then(
                (outputSample) => {
                    expect(outputSample).toBeDefined();                    
                }
            )
            .catch(
                (error)=>{
                    logger.error("Error: "+error);
                }
            );
    }
);
