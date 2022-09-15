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

---

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

## Getting Results
Hold until the inference is complete:

```javascript
await modzyClient.blockUntilJobComplete(jobIdentifier);
```

Get the output results:

```javascript
const result = await modzyClient.getResult(jobIdentifier);
```

---

## Samples

Check out our [samples](https://github.com/modzy/sdk-javascript/tree/main/samples) for details on specific use cases.
Samples are intended to be run using Node.js, but most can also run in the browser. The `react examples` directory contains a couple of react components to show how you can use the browser to send files to, or retrieve files from Modzy. To run the samples using app.modzy.com, make sure to update the line `const API_KEY = process.env.MODZY_API_KEY;` to contain a real api key from your account.

---

## Running tests

The Jest tests expect that there is a .env file at the root of the repo that contains a
valid app.modzy.com api key like this:

```
API_KEY=xxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxx
```

---

# Support

For support, email opensource@modzy.com or join our [Slack](https://www.modzy.com/slack).
# Contributing

Contributions are always welcome!

See [`contributing.md`](https://github.com/modzy/sdk-javascript/tree/main/contributing.adoc) for ways to get started.

Please adhere to this project's `code of conduct`.

We are happy to receive contributions from all of our users. Check out our contributing file to learn more.

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](https://github.com/modzy/sdk-javascript/tree/main/CODE_OF_CONDUCT.md)
