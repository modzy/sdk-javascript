# modzyClient.pathToDataUrl

Convert a file path (string) to a data url for embedded job types (Node.js only)

```javascript
const encodedFile = await modzyClient.pathToDataUrl(path, mimeType);
```

## Options

- `path: string`
  - The path to the file, e.g. "./images/tree.jpg"
- `mimeType: string`
  - The file's [mime type](https://docs.w3cub.com/http/basics_of_http/mime_types/complete_list_of_mime_types.html), e.g. "image/jpeg" or "application/json"

## Returns

A promise that resolves to a base 64 encoded data url
