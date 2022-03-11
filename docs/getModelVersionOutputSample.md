# modzyClient.getModelVersionOutputSample

Gets the output sample associated with the model and version provided (if it exists).

```javascript
const outputSample = await modzyClient.getModelVersionInputSample({
  modelId,
  version,
});
```

## Options

- `modelId: string`
  - The model identifier assigned by Modzy, i.e. "ed542963de"
- `version: string`
  - The specific version of the model, in sematic versioning format, i.e. "1.0.1"

## Return

Returns a promise that resolves to an JSON object
