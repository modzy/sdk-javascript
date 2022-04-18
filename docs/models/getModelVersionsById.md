# modezyClient.getModelVersionsById

Returns a list of all the versions of the model with the specified id. No other information is returned. Using `getModelById()` and pulling the `versions`, `latestVersion`, or `latestActiveVersion` from the response may suit your needs better.

```javascript
const arrayOfModels = await modzyClient.getModelVersionsById(modelId);
```

## Options

- `modelId: string`
  - A model identifier assigned by Modzy, i.e. "ed542963de"

## Return

A promise that resolves to an array of Version objects

```typescript
type Version = {
  version: string;
};
```
