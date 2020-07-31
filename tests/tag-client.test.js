const logger = require('log4js').getLogger("modzy");
logger.level = "all";

import TagClient from '../src/tag-client.js';

const tagClient = new TagClient(process.env.MODZY_BASE_URL, process.env.MODZY_API_KEY);

test(
    'testGetAllTags',
    async () => {
        await tagClient.getAllTags()
            .then(
                (tags) => {                    
                    expect(tags).toBeDefined();
                    expect(tags).not.toHaveLength(0);
                    logger.info( `testGetAllTags() get ${tags.length} tags` );
                    tags.forEach(
                        (tag)=>{                            
                            expect(tag.identifier).toBeDefined();
                            expect(tag.name).toBeDefined();
                            expect(tag.dataType).toBeDefined();                            
                        }
                    );
                }
            );
    }
);

test(
    'getTagsAndModels',
    async () => {
        await tagClient.getTagsAndModels("computer_vision")
            .then(
                (tagModelWrapper) => {                    
                    expect(tagModelWrapper).not.toBeNull();
                    expect(tagModelWrapper).toBeDefined();                    
                    expect(tagModelWrapper.tags).toBeDefined();
                    expect(tagModelWrapper.tags).not.toHaveLength(0);
                    logger.info( `getTagsAndModels(computer_vision) get ${tagModelWrapper.tags.length} tags` );
                    tagModelWrapper.tags.forEach(
                        (tag)=>{                            
                            expect(tag.identifier).toBeDefined();
                            expect(tag.name).toBeDefined();
                            expect(tag.dataType).toBeDefined();                            
                        }
                    );
                    expect(tagModelWrapper.models).toBeDefined();
                    expect(tagModelWrapper.models).not.toHaveLength(0);
                    logger.info( `getTagsAndModels(computer_vision) get ${tagModelWrapper.models.length} models` );
                    tagModelWrapper.models.forEach(
                        (model)=>{                                                        
                            expect(model.identifier).toBeDefined();
                            expect(model.name).toBeDefined();                            
                            expect(model.tags).toBeDefined();                            
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
    'getTagsAndModelsWithInvalidTag',
    async () => {
        await tagClient.getTagsAndModels("computer-vision")
            .then(
                (tagModelWrapper) => {                    
                    expect(tagModelWrapper).not.toBeNull();
                    expect(tagModelWrapper).toBeDefined();                    
                    expect(tagModelWrapper.tags).toBeDefined();
                    expect(tagModelWrapper.tags).toHaveLength(0);
                    expect(tagModelWrapper.models).toBeDefined();
                    expect(tagModelWrapper.models).toHaveLength(0);                                
                }
            )
            .catch(
                (error)=>{
                    logger.error("Error: "+error);
                }
            );
    }
);