const logger = require('log4js').getLogger("modzy");
logger.level = "all";

import JobClient from '../src/job-client.js';

const jobClient = new JobClient(process.env.MODZY_BASE_URL, process.env.MODZY_API_KEY);

test(
    'testSubmitJob',
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
    'testGetJob',
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
                    jobClient.getJob(jobIdentifier)
                        .then(
                            (updatedJob)=>{
                                expect(updatedJob).toBeDefined();
                                expect(updatedJob.jobIdentifier).toBeDefined();
                                expect(updatedJob.status).toBeDefined();                                
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
    'testCancelJob',
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
                    logger.debug(`testCancelJob :: created job :: ${job.jobIdentifier} :: ${job.status}`);
                    return job.jobIdentifier;
                }
            )
            .then(
                (jobIdentifier) => { 
                    return new Promise(
                        (resolve, reject) => {                            
                            setTimeout(
                                () => {                                    
                                    resolve(jobClient.getJob(jobIdentifier));
                                },
                                5000
                            );
                        }
                    );
                }
            )
            .then(
                (job)=>{
                    if( job.status != "COMPLETED" ){
                        logger.debug(`testCancelJob :: canceling job :: ${job.jobIdentifier}`);
                        return jobClient.cancelJob(job.jobIdentifier);
                    }                    
                    return job;
                }
            )
            .then(
                (updatedJob)=>{
                    expect(updatedJob).toBeDefined();
                    expect(updatedJob.jobIdentifier).toBeDefined();
                    expect(updatedJob.status).toBeDefined();   
                    logger.debug(`testCancelJob :: cancel job result :: ${updatedJob.jobIdentifier} :: ${updatedJob.status}`);                             
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
    'testGetJobHistoryByUser',
    async () => {
        await jobClient.getJobHistory("a", null, null, null, null, null, null, null, null, null)
            .then(
                (jobs) => {
                    expect(jobs).toBeDefined();
                    expect(jobs).not.toHaveLength(0);
                    logger.info( `testGetJobHistorybyUser() get ${jobs.length} jobs` );
                    jobs.forEach(
                        (job)=>{                                                      
                            expect(job.jobIdentifier).toBeDefined();
                            expect(job.status).toBeDefined();
                            expect(job.submittedAt).toBeDefined();
                            expect(job.submittedBy).toBeDefined(); 
                        }
                    );
                }
            );
    }
);

test(
    'testGetJobHistoryByModel',
    async () => {
        await jobClient.getJobHistory(null, null, null, null, "Sentiment Analysis", null, null, null, null, null)
            .then(
                (jobs) => {
                    expect(jobs).toBeDefined();
                    expect(jobs).not.toHaveLength(0);
                    logger.info( `testGetJobHistoryByModel() get ${jobs.length} jobs` );
                    jobs.forEach(
                        (job)=>{                                                      
                            expect(job.jobIdentifier).toBeDefined();
                            expect(job.status).toBeDefined();
                            expect(job.submittedAt).toBeDefined();
                            expect(job.submittedBy).toBeDefined(); 
                        }
                    );
                }
            );
    }
);

test(
    'testGetJobHistoryByAccessKey',
    async () => {
        await jobClient.getJobHistory(null, process.env.MODZY_API_KEY.substring(0,process.env.MODZY_API_KEY.lastIndexOf('.')), null, null, null, null, null, null, null, null)
            .then(
                (jobs) => {                    
                    expect(jobs).toBeDefined();
                    expect(jobs).not.toHaveLength(0);
                    logger.info( `testGetJobHistoryByAccessKey() get ${jobs.length} jobs` );
                    jobs.forEach(
                        (job)=>{                                                      
                            expect(job.jobIdentifier).toBeDefined();
                            expect(job.status).toBeDefined();
                            expect(job.submittedAt).toBeDefined();
                            expect(job.submittedBy).toBeDefined();                            
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
    'testGetJobHistoryByDate',
    async () => {
        let startDate = new Date();
        startDate.setDate(startDate.getDate()-7);  
        logger.info("StartDate type "+(startDate instanceof Date))      
        await jobClient.getJobHistory(null, null, startDate, null, null, null, null, null, null, null)
            .then(
                (jobs) => {                    
                    expect(jobs).toBeDefined();
                    expect(jobs).not.toHaveLength(0);
                    logger.info( `testGetJobHistoryByDate() get ${jobs.length} jobs` );
                    jobs.forEach(
                        (job)=>{                                                                              
                            expect(job.jobIdentifier).toBeDefined();
                            expect(job.status).toBeDefined();
                            expect(job.submittedAt).toBeDefined();
                            expect(job.submittedBy).toBeDefined();                            
                        }
                    );
                }
            );
    }
);

test(
    'testGetJobHistoryStatus',
    async () => {
        await jobClient.getJobHistory(null, null, null, null, null, 'terminated', null, null, null, null)
            .then(
                (jobs) => {
                    expect(jobs).toBeDefined();
                    expect(jobs).not.toHaveLength(0);
                    logger.info( `testGetJobHistoryStatus() get ${jobs.length} jobs` );
                    jobs.forEach(
                        (job)=>{                                                      
                            expect(job.jobIdentifier).toBeDefined();
                            expect(job.status).toBeDefined();
                            expect(job.submittedAt).toBeDefined();
                            expect(job.submittedBy).toBeDefined(); 
                        }
                    );
                }
            );
    }
);







