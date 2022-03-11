# modzyClient.getModelById

Get model instance by it's identifier

```javascript
const {
  modelId,
  latestVersion,
  latestActiveVersion,
  versions,
  author,
  name,
  description,
  permalink,
  features,
  isActive,
  isRecommended,
  isCommercial,
  tags,
  images,
  snapshotImages,
  lastActiveDateTime,
  visibility,
} = await modzyClient.getModelById(modelId);
```

## Options

- `modelId: string`
  - A model identifier assigned by Modzy, i.e. "ed542963de"

## Return

A promise that resolve to an object describing the model instance

```typescript
interface GetModelByIdResponse {
  modelId: string;
  latestVersion: string;
  latestActiveVersion: string;
  versions: string[];
  author: string;
  name: string;
  description: string;
  permalink: string;
  features: Feature[];
  isActive: boolean;
  isRecommended: boolean;
  isCommercial: boolean;
  tags: Tag[];
  images: Image[];
  snapshotImages: any[];
  lastActiveDateTime: string;
  visibility: {
    scope: string;
  };
}

type Image = {
  url: string;
  caption: string;
  relationType: string;
};

type Tag = {
  dataType: string;
  identifier: string;
  isCategorical: boolean;
  name: string;
};

type Feature = {
  description?: string;
  identifier: string;
  name: string;
};
```
