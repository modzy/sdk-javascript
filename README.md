<div align="center">

![javascript-sdk-github-banner.png](javascript-sdk-github-banner.png)

![GitHub contributors](https://img.shields.io/github/contributors/modzy/sdk-javascript?logo=GitHub&style=flat)
![GitHub last commit](https://img.shields.io/github/last-commit/modzy/sdk-javascript?logo=GitHub&style=flat)
![GitHub issues](https://img.shields.io/github/issues-raw/modzy/sdk-javascript?logo=github&style=flat)
![GitHub](https://img.shields.io/github/license/modzy/sdk-javascript?logo=apache&style=flat)

![npm (scoped)](https://img.shields.io/npm/v/@modzy/modzy-sdk?logo=npm)
![npm](https://img.shields.io/npm/dm/@modzy/modzy-sdk?logo=npm)

**[JavaScript SDK Documentation Page](https://docs.modzy.com/docs/javascript)**

</div>

# Installation

Intall Modzy's JavaScript SDK with NPM

```bash
npm install @modzy/modzy-sdk
```
or YARN

```bash
yarn add @modzy/modzy-sdk
```

# Usage/Examples

## Initializing the SDK
Initialize your client by authenticating with an API key. You can [download an API Key](https://docs.modzy.com/docs/view-and-manage-api-keys#download-team-api-key) from your instance of Modzy.

```javascript
import { ModzyClient } from "@modzy/modzy-sdk";

const modzyClient = new ModzyClient({
  apiKey: "Valid Modzy API Key", //e.g., "JbFkWZMx4Ea3epIrxSgA.a2fR36fZi3sdFPoztAXT"
  url: "Valid Modzy URL", //e.g., "https://trial.app.modzy.com"
});
```

## Running Inferences
### Raw Text Inputs
Submit an inference job to a text-based model by providing the model ID, version, and raw input text.

```javascript
//Submit text to v1.0.1 of a Sentiment Analysis model, and to make the job explainable, change explain=True
const { jobIdentifier } = await modzyClient.submitJobText({
  modelId: "ed542963de",
  version: "1.0.1",
  sources: {
    firstPhoneCall: {
      "input.txt": "Mr Watson, come here. I want to see you.",
    },
  },
});
```

### File Inputs
Pass a file from your local directory to a model by providing the model ID, version, and the filepath of your sample data:

```javascript
// Submit a job to the Image-Based Geolocation model
const { jobIdentifier } = await modzyClient.submitJobFile({
  modelId: "aevbu1h3yw",
  version: "1.0.1",
  sources: {
    nyc-skyline: {
      image: "./images/nyc-skyline.jpg",
    },
  },
});
```

### Embedded Inputs
Convert images and other large inputs to base64 embedded data and submit to a model by providing a model ID, version number, and dictionary with one or more base64 encoded inputs:

```javascript
const fs = require('fs');

//Embed input as a string in base64
const imageBytes = fs.readFileSync('images/tower-bridge.jpg');
//Prepare the source dictionary
let sources = { "tower-bridge": { "image": imageBytes } };

//Submit the image to v1.0.1 of an Imaged-based Geolocation model
const { jobIdentifier } = await modzyClient.submitJobEmbedded("aevbu1h3yw", "1.0.1", "application/octet-stream", sources);
```

### Inputs from Databases
Submit data from a SQL database to a model by providing a model ID, version, a SQL query, and database connection credentials:

```javascript
//Add database connection and query information
const dbUrl = "jdbc:postgresql://db.bit.io:5432/bitdotio"
const dbUserName = DB_USER_NAME;
const dbPassword = DB_PASSWORD;
const dbDriver = "org.postgresql.Driver";
//Select as "input.txt" becase that is the required input name for this model
const dbQuery = "SELECT \"mailaddr\" as \"input.txt\" FROM \"user/demo_repo\".\"atl_parcel_attr\" LIMIT 10;";

//Submit the database query to v0.0.12 of a Named Entity Recognition model
const { jobIdentifier } = await modzyClient.submitJobJDBC("a92fc413b5", "0.0.12", dbUrl, dbUserName, dbPassword, dbDriver, dbQuery)}
```

### Inputs from Cloud Storage
Submit data directly from your cloud storage bucket (Amazon S3 supported) by providing a model ID, version, and storage-blob-specific parameters.

#### AWS S3
```javascript
//Define sources dictionary with bucket and key that points to the correct file in your s3 bucket
const bucketName = "s3-bucket-name";
const fileKey = "key-to-file.txt";
let sources = { "sampleText": { "input.txt": { 'bucket': bucketName, 'key': fileKey } } };

const accessKey = ACCESS_KEY_ID;
const secretAccessKey = SECRET_KEY;
const region = "us-east-1";

//Submit s3 input to v1.0.1 of a Sentiment Analysis model
const { jobIdentifier } = await modzyClient.submitJobAWSS3("ed542963de", "1.0.1", accessKey, secretAccessKey, region, sources)
```

## Getting Results
Hold until the inference is complete:

```javascript
await modzyClient.blockUntilJobComplete(jobIdentifier);
```

Get the output results:

```javascript
const result = await modzyClient.getResult(jobIdentifier);
```

## SDK Code Examples

* [`samples`](https://github.com/modzy/sdk-javascript/tree/main/samples) provides details for specific use cases and are intended to be run using Node.js, but most can also run in the browser
* [`react examples`](https://github.com/modzy/sdk-javascript/tree/main/samples/react%20examples) contains react components that can be used to the browser to send files to, or retrieve files from Modzy.
 
To run these examples, make sure to update `API_KEY` and `MODZY_URL` to valid values.

## Running Tests

The Jest tests expect that there is a .env file at the root of the repo that contains a valid Modzy api key like this:

```
API_KEY=xxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxx
```

# Documentation

Modzy's SDK is built on top of the [Modzy HTTP/REST API](https://docs.modzy.com/reference/introduction). For a full list of features and supported routes visit [JavaScript SDK on docs.modzy.com](https://docs.modzy.com/docs/javascript)

# Support

For support, email opensource@modzy.com or join our [Slack](https://www.modzy.com/slack).

# Contributing

Contributions are always welcome!

See [`contributing.md`](https://github.com/modzy/sdk-javascript/tree/main/contributing.adoc) for ways to get started.

Please adhere to this project's `code of conduct`.

We are happy to receive contributions from all of our users. Check out our contributing file to learn more.

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](https://github.com/modzy/sdk-javascript/tree/main/CODE_OF_CONDUCT.md)
