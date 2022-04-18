# JavaScript SDK

Modzy's JavaScript SDK provides a convenient wrapper around many of Modzy's most popular API routes. SDK functions include querying models, submitting inference jobs, and returning job results.

## About this documentation

This documentation expects that you have at least a basic knowledge of JavaScript and npm packages. If you are unfamiliar with installing and using npm packages, you can start learning here: https://nodesource.com/blog/an-absolute-beginners-guide-to-using-npm/

## Environments where you can use this SDK

This SDK supports both Node.js and JavaScript in the browser by providing different variations of methods based on the output target of your build system. The SDK gives Node.js methods by default if not using a build system. If you are attemption to use the SDK for a browser application and see errors relating to not being able to find `fs` or `path`, make sure you are using a build system such as webpack and the target is set to `web`.

## Installation

From the command line inside your project directory, use npm or yarn to install the SDK:

```bash
yarn add @modzy/modzy-sdk
# or
npm install @modzy/modzy-sdk
```

Then import the ModzyClient class into your code:

```javascript
import { ModzyClient } from "@modzy/modzy-sdk"; // ES modules
// or
const { ModzyClient } = require("@modzy/modzy-sdk"); // CommonJS
```

## Initialize the client

To initialize `ModzyClient`, you need an [api key](https://docs.modzy.com/docs/getting-started#key-download-your-api-key). If using an installation of Modzy other than app.modzy.com, you'll also need to provide the url for your instance of Modzy. For debugging purposes, you can also turn on logging.

⚠️ _Warning: Keep your API key secret. Do not include it in a git repo or store it on GitHub_

```javascript
// app.modzy.com
const modzyClient = new ModzyClient({
  apiKey: "xxxxxxxxxxxxx.xxxxxxxxxxxxx",
});

// or for private Modzy instances with logging on
const modzyClient = new ModzyClient({
  apiKey: "xxxxxxxxxxxxx.xxxxxxxxxxxxx",
  url: "https://modzy.yourdomain.com",
  logging: "on", // "off" | "on" | "verbose"
});
```

## Submit a job

The ModzyClient has several methods for creating jobs based on the input type:

- `submitJobText()`: For text inputs
- `submitJobFile()`: For binaries
- `submitJobEmbedded()`: For Base64 strings
- `submitJobAwsS3()`: For inputs stored in S3
- `submitJobJDBC()`: For inputs stored in databases

The return of each of these methods is a promise that resolves to an object describing the submitted job, _not the job result!_
The most important item in the job object is the `jobIdentifier` - you'll use this to check the status of the job and get the job results.

```javascript
const { jobIdentifier } = await modzyClient.submitJobText({
  modelId: "ed542963de",
  version: "1.0.1",
  sources: {
    yourInputKey: {
      "input.txt": "Sometimes I really hate ribs",
    },
  },
});
```

In the sources object above, the key `"yourInputKey"` is named by you and can be anything, but "input.txt" is the required input name set by this particular model. You can find the input name(s) by going to model details > API for the model you want to use ([example](https://app.modzy.com/models/ed542963de/1.0.1?tab=api)).

Your can submit multiple input sets in a single job rather than submitting multiple jobs with a single input set. An example using the same model as above:

```javascript
const { jobIdentifier } = await modzyClient.submitJobText({
  modelId: "ed542963de",
  version: "1.0.1",
  sources: {
    myFirstInput: {
      "input.txt": "Rain is the worst weather",
    },
    mySecondInput: {
      "input.txt": "Partly cloudy is the best weather",
    },
  },
});
```

Some models require two or more inputs to run. In that case, the sources object would look something like this:

```javascript
souces: {
  yourInputKey: {
    "inputA": // ...contents of inputA,
    "inputB": // ...contents of inputB,
  },
};
```

[Learn more about creating jobs.](https://docs.modzy.com/reference/create-a-job-1)

---

## Wait for the job to complete

Before you can get your job's result, you first have to wait for the job to finish. How long will that take? Well ... it's complicated. A job might finish in a few milliseconds, or it may take several minutes to finish running. How long depends on a numbers of factors such as model type, job queue length, how many processing engines are running, and the hardware being used.

The JavaScript SDK has the method `blockUntilJobComplete()` to simplify waiting:

```javascript
await modzyClient.blockUntilJobComplete(jobIdentifier);
```

As the name implies, this will block any subsequent code from running until the job is complete. It does this by creating a loop that checks the job status every two seconds until the job status comes back as finish. You can change the interval by passing in a new timeout value in milliseconds:

```javascript
await modzyClient.blockUntilJobComplete(jobIdentifier, { timeout: 500 });
```

If you'd rather check the status of the job yourself, you can use `getJob()`

```javascript
const { status } = await modzyClient.getJob(jobIdentifier);

// status of "SUBMITTED" or "IN_PROGRESS" means the job hasn't finished
// "COMPLETED", "COMPLETED_WITH_ERROR" or "TIMEDOUT" indicates the job has finished
```

---

## Get job results

Once the job is done, you can fetch the result using `getResult()`. This returns a large object containing information about the job as well as the results. If the model returns multiple outputs, they will all be included in this single object.

```javascript
const result = await modzyClient.getResult(jobIdentifier);
```

---

## Getting a specific result output

You can use `getOutputContents()` to fetch only the contents of a specific model output. This is especially useful if the output is a binary file. You need to know the model's output name(s), which you can get from the model details.

Let's use the Text to Speech model on app.modzy.com as an example:

```javascript
// This code sample is for the browser, not Node.js

// Submit the job
const { jobIdentifier } = await modzyClient.submitJobText({
  modelId: "uvdncymn6q",
  version: "0.0.3",
  sources: {
    myInput: {
      "input.txt": "I love the sound of robot voices!",
    },
  },
});

// Wait for the job to finish
await modzyClient.blockUntilJobComplete(jobIdentifier);

// Get the contents of the output named "results.wav" that the user submitted
// with the key "myInput".
// Note that the responseType is "blob" because this model output is a binary file.
// The default responseType is "json".
const speechContents = await modzyClient.getOutputContents({
  jobId: jobIdentifier,
  inputKey: "myInput",
  outputName: "results.wav", // The output name must match the model's api!
  responseType: "blob",
});

// create a link to download the file from the browser
const url = window.URL.createObjectURL(
  new Blob([speechContents], { type: "audio/wav" })
);
const link = document.createElement("a");
link.href = url;
link.setAttribute("download", "results.wav");
document.body.appendChild(link);
link.click();
link.remove();
```

If you're writing a Node.js app, set the `responseType` to `"arraybuffer"`.

```javascript
// Node.js

// Get the contents of the output named "results.wav" that the user submitted
// with the key `myInput`.
const speechContents = await modzyClient.getOutputContents({
  jobId: speechJob.jobIdentifier,
  inputKey: "myInput",
  outputName: "results.wav",
  responseType: "arraybuffer",
});

// write the file to disk
fs.writeFileSync("./results.wav", speechContents);
```

---

## Samples

Check out our [samples](https://github.com/modzy/sdk-javascript/tree/main/samples) for details on specific use cases.
Samples are intended to be run using Node.js, but most can also run in the browser. The `react examples` directory contains a couple of react components to show how you can use the browser to send files to, or retrieve files from Modzy. To run the samples using app.modzy.com, make sure to update the line `const API_KEY = process.env.MODZY_API_KEY;` to contain a real api key from your account.

## List of methods with descriptions

.getModels
Get a list of models with very basic info such as modelId, versions, and latestVersion based on specified params. Returns the first 500 models if no params are sent.

.getActiveModels
Get a list of all active models with information such as names, ids, descriptions, active versions, and image URLs

.getModelById
Get details relevant to all versions of the model with the given modelId

.getModelByName
Search for a model that matches a provided name. If the search finds multiple models, it will return the closest match. The output includes all model details (modelId, latestVersion, author, name, versions, and tags).

.getModelVersionsById
Returns a list of all the versions of the model with the specified id. No other information is returned. Using `getModelById()` and pulling the `versions`, `latestVersion`, or `latestActiveVersion` from the response may suit your needs better

.getModelDetails
Returns version details. It includes timeout, requirement, containerImage, loadStatus, runStatus, inputs, outputs, statistics, technicalDetails, sampleInput, sampleOutput, performanceSummary, processing, and others.

.getModelVersionInputSample
Get a job request sample for this model in JSON format (if it exists).

.getModelVersionOutputSample
Get the output sample associated with the model and version provided (if it exists)

.getJob
Return the job details, including the status, total, completed, and failed number of items.

.cancelJob
Send a request to the server in order to cancel a job.

.getResult
Get the current results of a job execution, including completed, failed, total number of items processed.

.getOutputContents
Get the contents of a specific job output. Consult the model's api for the output name and file type

.blockUntilJobComplete
Block subsequent code execution until the job changes its status to COMPLETED, TIMEDOUT or CANCELED.

.getJobHistory
Get a paginated list of jobs meeting the search parameter criteria. Returns the latest 100 jobs if no params are sent.

.getProcessingEngineStatus
Return a list of all active processing engines and their status

.submitJobText
Submit a job with plain text inputs

.submitJobEmbedded
Submit a job with the input(s) contents encoded in a Base64 data url

.submitJobAwsS3
Submit a job with the input(s) stored in a AWS S3 bucket

.submitJobJDBC
Submit a job based on a sql query on a database accessed through JDBC.

.submitJobFile
Submit a job with the input(s) specified as a Blob (browser) or file path (Node.js)

.pathToDataUrl
Convert a file path (string) to a data url for embedded job types (Node.js only)

.fileToDataUrl
Convert a JS File Object to a data url for embedded job types (browser only)
