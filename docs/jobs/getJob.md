# modzyClient.getJob

Return the job details, including the status, total, completed, and failed number of items.

```javascript
const {
  accountIdentifier,
  completed,
  createdAt,
  elapsedTime,
  explain,
  failed,
  jobIdentifier,
  jobInputs,
  model,
  pending,
  queueTime,
  status,
  submittedAt,
  submittedBy,
  team,
  total,
  updatedAt,
  user,
} = await modzyClient.getJob(jobId);
```

## Options

- `jobId: string`
  - The job identifier, e.g. "14856eb1-0ad8-49e7-9da3-887acb80fea5"

## Returns

A promise that resolves to a GetJobResponse object

```typescript
interface GetJobResponse {
  jobIdentifier: string;
  submittedBy: string;
  accountIdentifier: string;
  model: {
    identifier: string;
    version: string;
    name: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
  total: number;
  pending: number;
  completed: number;
  failed: number;
  elapsedTime: number;
  queueTime: number;
  user: {
    identifier: string;
    externalIdentifier: string;
    firstName: string;
    lastName: string;
    email: string;
    accessKeys: AccessKeys[];
    status: string;
    title: string;
  };
  jobInputs: JobInput[];
  explain: boolean;
  team: {
    identifier: string;
  };
}

type AccessKeys = {
  prefix: string;
  isDefault: boolean;
};

export type JobInput = {
  identifier: string;
};
```
