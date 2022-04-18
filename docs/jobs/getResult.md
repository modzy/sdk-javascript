# modzyClient.getResult

Get the current results of a job execution, including completed, failed, and total number of items processed.

```javascript
const {
  jobIdentifier,
  accountIdentifier,
  team,
  total,
  completed,
  failed,
  finished,
  submittedByKey,
  explained,
  submittedAt,
  initialQueueTime,
  totalQueueTime,
  averageModelLatency,
  totalModelLatency,
  elapsedTime,
  startingResultSummarizing,
  resultSummarizing,
  inputSize,
  results,
} = await modzyClient.getResult(jobId);
```

## Options

- `jobId: string`
  - The job identifier, e.g. "14856eb1-0ad8-49e7-9da3-887acb80fea5"

## Returns

A promise that resolves to a GetResultResponse object

```typescript
interface GetResultResponse {
  jobIdentifier: string;
  accountIdentifier: string;
  team: {
    identifier: string;
  };
  total: number;
  completed: number;
  failed: number;
  finished: boolean;
  submittedByKey: string;
  explained: boolean;
  submittedAt: string;
  initialQueueTime: number;
  totalQueueTime: number;
  averageModelLatency: number;
  totalModelLatency: number;
  elapsedTime: number;
  startingResultSummarizing: string;
  resultSummarizing: number;
  inputSize: number;
  results: {
    job: {
      status: string;
      engine: string;
      inputFetching: number;
      outputUploading?: any;
      modelLatency: number;
      queueTime: number;
      startTime: string;
      updateTime: string;
      endTime: string;
      [key: string]: any;
      voting: {
        up: 0;
        down: 0;
      };
    };
  };
}
```
