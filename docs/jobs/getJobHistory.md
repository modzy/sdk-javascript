# modzyClient.getJobHistory

Get a paginated list of jobs meeting the search parameter criteria. Returns the latest 100 jobs if no params are sent.

```javascript
const jobs = await modzyClient.getJobHistory({
  user,
  accessKey,
  startDate,
  endDate,
  model,
  status,
  page,
  perPage,
  direction,
  sortBy,
});
```

## Options

- `user?: string`
  - Name of the job submitter, e.g. "Jane Smith"
- `accessKey?: string`
  - The prefix of the key used to submit the job, e.g. "jU7q896uSReJcXXDOS6P"
- `startDate?: string`
  - Filters jobs by the start date. It requires ISO8601 format (YYYY-MM-DDThh:mm:ss.sTZD), e.g. "2022-04-15T14:28:01.053Z"
- `endDate?: string`
  - Filters jobs by the end date. It requires ISO8601 format (YYYY-MM-DDThh:mm:ss.sTZD), e.g. "2022-04-15T14:28:01.053Z"
- `model?: string`
  - Filters by the model name, e.g. "Sentiment Analysis"
- `status?: "ALL" | "TERMINATED" | "TERMINATED_WITH_ERROR" | "PENDING"`
  - Filters by the job status
- `page?: number`
  - The page number of the paginated results. Defaults to 1.
- `perPage?: number`
  - The number of records returned per page. Defaults to 100.
- `direction?: "ASC" | "DESC"`
  - Orders the records in ascending (ASC) or descending (DESC) order. Defaults to "ASC".
- `sortBy?: string`
  - Results can be sorted by "identifier", "submittedBy", "submittedJobs", "status", "createdAt", "updatedAt", "submittedAt", "total", "completed", "fail" and "model".

## Returns

A promise that resolves to an array of JobHistoryResponseItem

```typescript
interface JobHistoryResponseItem {
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
    accessKeys: AccessKey[];
    status: string;
    title: string;
  };
  jobInputs: any[];
  explain: boolean;
}

type AccessKey = {
  prefix: string;
  isDefault: boolean;
};
```
