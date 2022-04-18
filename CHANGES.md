# Changes from v1

Version 1 of the SDK client only supported Node application because the final bundle included references to the `fs` module. Version 2 uses a hybrid approach that includes code for both Node and the browser. It does this using the package.json file’s `browser` field that specifies browser-specific overrides. As such, any use of this SDK for the browser requires the use of a bundler or build tool. Note that the split only applies to the part of the sdk for submitting job files - most of the SDK code is pure JavaScript.

The previous documentation often incorrectly showed the results of the methods having direct returns. In reality, all methods return a promise that resolves to the data shown.

### Client initialization

- `ModzyClient` constructor parameter changed to single object. The `url` key is optional as it defaults to app.modzy.com

### Model methods

- Added `getActiveModels`. It always returns _all_ active models with more useful details. This api call does not support pagination.
- Removed `getAllModels`. Use `getModels` with no params to get the first 500 models or `getActiveModels()`.
- Removed `getRelatedModels` as the results were most often not useful
- Renamed `getModel` to `getModelById`
- Rename `getModelVersions` to `getModelVersionsById`
- Renamed `getModelVersion` to `getModelDetails`; parameter change to single object
- `getModels` parameter change to single object.
- `getModelVersionInputSample` parameter change to single object
- `getModelVersionOutputSample` parameter change to single object

### Job status and result methods

- Added `getOutputContents` which gets the contents of a specific job output - especially useful if the output is a binary file
- Added `getProcessingEngineStatus` which returns an array of actively running processing engines and their statuses
- Renamed `blockUntilComplete` to `blockUntilJobComplete`. It takes just the jobId as a parameter; adds an optional second parameter that is a config object to specify the number of milliseconds between checks for job completion.
- `getJobHistory` parameter change to single object

### Job submission methods

- `submitJobText` parameter change to single object
- `submitJobEmbedded` parameter change to single object. This method no longer handles any parsing of the embedded file and assumes that the sources object has the file as a proper data URL. You can use the new utilities `pathToDataUrl(path, mimeType)` for Node or `fileToDataUrl(file)` for browser to construct the `sources` object.
- `submitJobFile` parameter change to single object. For the browser, the file needs to be base64 encoded. The modzyClient includes a built-in utility `fileToDataUrl` to convert a File blob to base64. For Node JS, you specify the relative path as a string.
- `submitJobAWSS3` renamed to `submitJobAwsS3`; parameter change to single object
- `submitJobJDBC` parameter change to single object

### New utilities

- Added `fileToDataUrl`, (browser only) a utility to convert a File blob to a base64 data URL
- Added `pathToDataUrl`, (Node only) a utility to convert a file to a base64 data URL

### Samples

- Added sample React components
