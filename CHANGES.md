# Changes from v1

Version 1 of the SDK client only supported Node application because the final bundle included references to the `fs` module. Version 2 uses a hybrid approach that includes code for both Node and the browser. It does this using the package.json file’s `browser` field that specifies browser-specific overrides. As such, any use of this SDK for the browser requires the use of a bundler or build tool. Note that the split only applies to the part of the sdk for submitting job files - most of the SDK code is pure JavaScript.

The previous documentation often incorrectly showed the results of the methods having direct returns. In reality, all methods return a promise that resolves to the data shown.

- modzyClient initialization parameter change to single object. The `url` key is optional as it defaults to app.modzy.com
- Removed `.getAllModels`. use getActiveModels() or call getModels() with no params.
- Added `.getActiveModels`. Returns only the active models with more useful details
- `.getModels` parameter change to single object.
- `.getModel` renamed to `.getModelById`
- `.getModelByName` unchanged
- `.getRelatedModels` removed because not useful
- `.getModelVersions` renamed `.getModelVersionsById`
- `.getModelVersion` renamed to `.getModelDetails`; parameter change to single object
- `.getModelVersionInputSample` parameter change to single object
- `.getModelVersionOutputSample` parameter change to single object
- `.getJobHistory` parameter change to single object
- `.submitJobText` parameter change to single object
- `.submitJobEmbedded` parameter change to single object. No longer handles any parsing of the embedded file, assumes that the sources object has the file as a proper data URL. Use the utility `pathToDataUrl(path, mimeType)` for Node and `fileToDataUrl(file)` for browser.
- `.submitJobFile` parameter change to single object. For the browser, the file needs to be base64 encoded. The modzyClient includes a built-in utility `.fileToDataUrl` to convert a File blob to base64. For Node JS, you specify the relative path as a string.
- `.submitJobAWSS3` renamed to `.submitJobAwsS3`; parameter change to single object
- `.submitJobJDBC` parameter change to single object
- `.getJob` unchanged
- `.cancelJob` unchanged
- `.getResult` unchanged
- Added `.getOutputContents` which gets the contents of a specific job output
- `.blockUntilComplete` renamed to `.blockUntilJobComplete`; takes just the jobId as a parameter; adds an optional second parameter that is a config object. Currently the only config key is `timeout` where you specify the number of milliseconds between checks for job completion.
- Adds `.getProcessingEngineStatus` which returns an array of actively running processing engines and their statuses
- Adds `.fileToDataUrl`, (browser only) a utility to convert a File blob to a base64 data URL
- Adds `.pathToDataUrl`, (Node only) a utility to convert a file to a base64 data URL
