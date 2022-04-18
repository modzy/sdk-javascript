# modzyClient.getActiveModels

Get a list of all active models with information such as names, ids, descriptions, active versions, and image URLs

```javascript
const {
  activeVersions,
  author,
  creationDateTime,
  description,
  features,
  identifier,
  images,
  isActive,
  isAvailable,
  isCommercial,
  isExperimental,
  isRecommended,
  latestVersion,
  longDescription,
  name,
  permalink,
  sourceType,
  tags,
  updateDateTime,
} = await modzyClient.getActiveModels();
```

## Options

None

## Returns

A promise that resolves to a LatestModel object

```typescript
interface LatestModel {
  activeVersions: string[];
  author: string;
  creationDateTime: string;
  description: string;
  features: Feature[];
  identifier: string;
  images: Image[];
  isActive: boolean;
  isAvailable: boolean;
  isCommercial: boolean;
  isExperimental: boolean;
  isRecommended: boolean;
  latestVersion: string;
  longDescription: string;
  name: string;
  permalink: string;
  sourceType: string;
  tags: Tag[];
  updateDateTime: string;
}

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
