const logger = require('log4js').getLogger("modzy");
logger.level = "all";

import ResultClient from '../src/result-client.js';
import JobClient from '../src/job-client.js';

const resultClient = new ResultClient(process.env.MODZY_BASE_URL, process.env.MODZY_API_KEY);
const jobClient = new JobClient(process.env.MODZY_BASE_URL, process.env.MODZY_API_KEY);

test(
    'testGetResults',
    async () => {
        await jobClient.submitJob(
                {
                    "model":{
                        "identifier":"ed542963de",
                        "version":"0.0.27"
                    },
                    "input":{
                        "type":"text",
                        "sources":{
                            'input-1':{'input.txt':'Modzy is great'},
                            'input-2':{'input.txt':'Modzy is great'},
                        }
                    }
                }
            )
            .then(
                (job) => {                    
                    expect(job).toBeDefined();
                    expect(job.jobIdentifier).toBeDefined();
                    expect(job.status).toBeDefined();
                    expect(job.status).toBe("SUBMITTED");                                    
                    return job.jobIdentifier;                    
                }
            )
            .then(
                (jobIdentifier)=>{ 
                    var startDate = new Date();
                    var curDate   = new Date();
                    logger.debug(`waiting :: ${curDate - startDate} = ${curDate} - ${startDate}`);
                    return new Promise(
                        (resolve, reject)=> {
                            setTimeout(
                                function(){
                                    curDate = new Date();
                                    logger.debug(`waiting :: ${curDate - startDate} = ${curDate} - ${startDate}`);
                                    resolve(jobIdentifier);   
                                },
                                120000
                            );
                        }
                    );                    
                }
            )
            .then(
                (jobIdentifier)=>{                    
                    return resultClient.getResult(jobIdentifier);
                }
            )
            .then(
                (results)=>{                    
                    logger.info(results);
                }
            )
            .catch(
                (error)=>{
                    logger.error("Error: "+error);
                }
            );
    }
);