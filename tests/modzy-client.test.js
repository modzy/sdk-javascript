const logger = require('log4js').getLogger("modzy");
logger.level = "all";

import ModzyClient from '../src/modzy-client.js';

const modzyClient = new ModzyClient(process.env.MODZY_BASE_URL, process.env.MODZY_API_KEY);

test(
    'testSentimentAnalysis',
    async () => {
        try{
            let job = await modzyClient.submitJobText(
                    "ed542963de", 
                    "0.0.27",
                    {
                        'input-1':{'input.txt':'Modzy is great'},
                        'input-2':{'input.txt':'Modzy is great'},
                    }
                );
            expect(job).toBeDefined();
            expect(job.jobIdentifier).toBeDefined();
            expect(job.status).toBeDefined();
            expect(job.status).toBe("SUBMITTED");   
            job = await modzyClient.blockUntilComplete(job);        
            expect(job).toBeDefined();
            expect(job.jobIdentifier).toBeDefined();
            expect(job.status).toBeDefined();
            expect(job.status).toBe("COMPLETED");   
            let results = await modzyClient.getResult(job.jobIdentifier);
            expect(results).not.toBeNull();
            expect(results.finished).toBeTruthy();
            expect(results.results["input-1"]["input-1"]["results.json"]).not.toBeNull();
            expect(results.results["input-2"]["input-2"]["results.json"]).not.toBeNull();
            logger.info(`testSentimentAnalysis() :: ${results.results["input-1"]["input-1"]["results.json"]}`);
        }
        catch(error){
            logger.error("Error: "+error);
        }
    }
);

test(
    'testSentimentAnalysisWithJDBC',
    async () => {
        try{
            let job = await modzyClient.submitJobJDBC(
                    "ed542963de", 
                    "0.0.27",
                    "jdbc:postgresql://testdb-postgres:5432/test",
                    "test",
                    "test",
                    "org.postgresql.Driver",
                    "select text_sample as 'input.txt' from text_samples",
                );
            expect(job).toBeDefined();
            expect(job.jobIdentifier).toBeDefined();
            expect(job.status).toBeDefined();
            expect(job.status).toBe("SUBMITTED");   
            job = await modzyClient.blockUntilComplete(job);        
            expect(job).toBeDefined();
            expect(job.jobIdentifier).toBeDefined();
            expect(job.status).toBeDefined();
            expect(job.status).toBe("COMPLETED");   
            let results = await modzyClient.getResult(job.jobIdentifier);
            expect(results).not.toBeNull();
            expect(results.finished).toBeTruthy();
            console.table(results.results);
            logger.info(`testSentimentAnalysisWithJDBC() :: ${results.results}`);
        }
        catch(error){
            logger.error("Error: "+error);
        }
    }
);


test(
    'testRussianToEnglishTranslation',
    async () => {
        try{
            let job = await modzyClient.submitJobText(
                    "cbf9e8d6da", 
                    "0.0.1",
                    {
                        'input-1':{'input.txt':'Машинное обучение - это здорово!'},
                    }
                );
            expect(job).toBeDefined();
            expect(job.jobIdentifier).toBeDefined();
            expect(job.status).toBeDefined();
            expect(job.status).toBe("SUBMITTED");   
            job = await modzyClient.blockUntilComplete(job);        
            expect(job).toBeDefined();
            expect(job.jobIdentifier).toBeDefined();
            expect(job.status).toBeDefined();
            expect(job.status).toBe("COMPLETED");   
            let results = await modzyClient.getResult(job.jobIdentifier);
            expect(results).not.toBeNull();
            expect(results.finished).toBeTruthy();
            expect(results.results["input-1"]["input-1"]["results.json"]).not.toBeNull();
            logger.info(`testRussianToEnglishTranslation() :: ${results.results["input-1"]["input-1"]["results.json"]}`);
        }
        catch(error){
            logger.error("Error: "+error);
        }
    }
);