# modzyClient.getOutputContents

Get the contents of a specific job output. The format can be changed for text or binary file output types.

```javascript
const outputContents = await modzyClient.getOutputContents({
  jobId,
  inputKey,
  outputName,
  responseType,
});
```

## Options

- `jobId: string`
  - The job identifier, e.g. "14856eb1-0ad8-49e7-9da3-887acb80fea5"
- `inputKey: string`
  - The user-defined key used to identify the job input, e.g. "my-input"
- `outputName: string`
  - The model-defined name of the output, e.g. "results.wav". Consult the API section of the model details page to get the model output name.
- `responseType: "json" | "blob" | "arraybuffer"`
  - How the response should be formatted. Use "json" for text outputs. Use "blob" for binary files in a browser environment. Use "arraybuffer" for binary files in a Node.js environment. Defaults to "json".

## Returns

A promise that resolves to an unknown type (The actual result depends on the model's output and the response type specified).
