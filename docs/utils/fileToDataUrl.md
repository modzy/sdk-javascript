# modzyClient.fileToDataUrl

Convert a JS [File object](https://developer.mozilla.org/en-US/docs/Web/API/File) to a data url for embedded job types (browser only)

```javascript
const encodedFile = await modzyClient.fileToDataUrl(file);
```

## Options

- `file: File`
  - A File object

## Returns

A promise that resolves to a base 64 encoded data url
