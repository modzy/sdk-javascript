# Modzy JavaScript SDK

Modzy's Javascript SDK simplifies tasks such as querying models, submitting jobs, and returning results. It supports both NodeJS and browser JavaScript applications using the output target of your build system to know which code to use.

## Visit [docs.modzy.com](https://docs.modzy.com/docs/javascript) for docs, guides, API and more.

These instructions are for Modzy JavaScript SDK v2, which is substantially different from v1.

---

## Installation

From the command line in your project directory, run `yarn add @modzy/modzy-sdk` or `npm install @modzy/modzy-sdk`.
Then import the ModzyClient class into your code:

```bash
yarn add @modzy/modzy-sdk
# or
npm install @modzy/modzy-sdk
```

```javascript
import { ModzyClient } from "@modzy/modzy-sdk";
```

---

## Initialize

To initialize the modzy client you need an [api key](https://docs.modzy.com/docs/getting-started#key-download-your-api-key). If using an installation of Modzy other than app.modzy.com, you'll also need the url for your instance of Modzy.

```javascript
// app.modzy.com
const modzyClient = new ModzyClient({
  apiKey: "xxxxxxxxxxxxx.xxxxxxxxxxxxx",
});

// or for private Modzy instances
const modzyClient = new ModzyClient({
  apiKey: "xxxxxxxxxxxxx.xxxxxxxxxxxxx",
  url: "https://modzy.yourdomain.com/api
});
```

⚠️ _Warning: Keep your API key secret. Do not include it in git repo or store it on GitHub_

---

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

In the sources object above, the key `"yourInputKey"` is named by you and can be anything, but "input.txt" is the required input name set by this particular model. You can find the input name(s) by going to model details > API for the model you want to use.

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

Some models require 2 or more inputs to run. In that case, the sources object would look something like this:

```javascript
{
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
// This code sample is for the browser, not Node

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

If you're writing a Node app, set the `responseType` to `"arraybuffer"`.

```javascript
// Node JS

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
Samples are intended to be run using Node, but most can also run in the browser. The `react examples` directory contains a couple of react components to show how you can use the browser to send files to, or retrieve files from Modzy. To run the samples using app.modzy.com, make sure to update the line `const API_KEY = process.env.MODZY_API_KEY;` to contain a real api key from your account.

---

## Contributing

We are happy to receive contributions from all of our users. Check out our [contributing file](https://github.com/modzy/sdk-javascript/tree/main/contributing.adoc) to learn more.

---

## Code of conduct

Please see our [code of conduct](https://github.com/modzy/sdk-javascript/tree/main//CODE_OF_CONDUCT.md) for any questions about the kind of community we are trying to build.
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](https://github.com/modzy/sdk-javascript/tree/main//CODE_OF_CONDUCT.md)
