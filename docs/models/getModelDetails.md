# modezyClient.getModelDetails

Returns version details. It includes timeout, requirement, containerImage, loadStatus, runStatus, inputs, outputs, statistics, technicalDetails, sampleInput, sampleOutput, performanceSummary, processing, and others.

```javascript
const {
  version,
  createdAt,
  updatedAt,
  inputValidationSchema,
  createdBy,
  timeout,
  requirement,
  containerImage,
  inputs,
  outputs,
  statistics,
  isActive,
  longDescription,
  technicalDetails,
  isAvailable,
  sourceType,
  versionHistory,
  status,
  performanceSummary,
  model,
  processing,
} = await modzyClient.getModelDetails({ modelId, version });
```

## Options

- `modelId: string`
  - The model identifier assigned by Modzy, i.e. "ed542963de"
- `version: string`
  - The specific version of the model, in sematic versioning format, i.e. "1.0.1"

## Return

Returns a promise that resolves to an object with model details

```typescript
export interface GetModelDetailsResponse {
  version: string;
  createdAt: string;
  updatedAt: string;
  inputValidationSchema: string;
  createdBy: string;
  timeout: {
    status: number;
    run: number;
  };
  requirement: {
    gpuUnits: number;
    cpuAmount: string;
    memoryAmount: string;
  };
  containerImage: {
    uploadStatus: string;
    loadStatus: string;
    uploadPercentage: number;
    loadPercentage: number;
    containerImageSize: number;
    registryHost: string;
    repositoryNamespace: string;
    repositoryName: string;
  };
  inputs: Input[];
  outputs: Output[];
  statistics: Statistic[];
  isActive: boolean;
  longDescription: string;
  technicalDetails: string;
  isAvailable: boolean;
  sourceType: string;
  versionHistory: string;
  status: string;
  performanceSummary: string;
  model: GetModelByIdResponse;
  processing: {
    minimumParallelCapacity: number;
    maximumParallelCapacity: number;
  };
}

type Input = {
  name: string;
  acceptedMediaTypes: string;
  maximumSize: number;
  description: string;
};

type Output = {
  name: string;
  mediaType: string;
  maximumSize: number;
  description: string;
};

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
```
