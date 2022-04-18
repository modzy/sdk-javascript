# Modzy JavaScript SDK

Modzy's Javascript SDK simplifies tasks such as querying models, submitting jobs, and returning results. It supports both Node.js and browser JavaScript applications using the output target of your build system to know which code to use.

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

To initialize `ModzyClient`, you need an [api key](https://docs.modzy.com/docs/getting-started#key-download-your-api-key). If using an installation of Modzy other than app.modzy.com, you'll also need to provide the url for your instance of Modzy. For debugging purposes, you can also turn on logging.

⚠️ _Warning: Keep your API key secret. Do not include it in a git repo or store it on GitHub_

```javascript
// app.modzy.com
const modzyClient = new ModzyClient({
  apiKey: "xxxxxxxxxxxxx.xxxxxxxxxxxxx",
});

// or for private Modzy instances
const modzyClient = new ModzyClient({
  apiKey: "xxxxxxxxxxxxx.xxxxxxxxxxxxx",
  url: "https://modzy.yourdomain.com",
});
```

---

## Basic usage

Submit a job providing the model, version and input text:

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

## Contributing

We are happy to receive contributions from all of our users. Check out our [contributing file](https://github.com/modzy/sdk-javascript/tree/main/contributing.adoc) to learn more.

---

## Code of conduct

Please see our [code of conduct](https://github.com/modzy/sdk-javascript/tree/main//CODE_OF_CONDUCT.md) for any questions about the kind of community we are trying to build.
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](https://github.com/modzy/sdk-javascript/tree/main//CODE_OF_CONDUCT.md)
