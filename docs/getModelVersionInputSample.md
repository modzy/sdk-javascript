# modzyClient.getModelVersionInputSample

Gets a job request sample for this model in JSON format (if it exists).

```javascript
const inputSample = await modzyClient.getModelVersionInputSample({
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
