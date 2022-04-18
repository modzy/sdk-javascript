# modzyClient.submitJobAwsS3

Submit a job using AWS S3 files as inputs.

```javascript
const {
  model,
  status,
  totalInputs,
  jobIdentifier,
  accessKey,
  explain,
  jobType,
  accountIdentifier,
  team,
  user,
  jobInputs,
  submittedAt,
  hoursDeleteInput,
  imageClassificationModel,
} = await modzyClient.submitJobAwsS3({
    accessKeyID,
    secretAccessKey,
    region,
    modelId,
    version,
    explain = false,
    sources,
  });
```

## Options

- `accessKeyID: string`
  - Your AWS access key
- `secretAccessKey: string`
  - Your AWS secret access key
- `region: string`
  - The AWS Region, e.g. "us-east-1"
- `modelId: string`
  - The model identifier, e.g. "ed542963de"
- `version: string`
  - The model’s version number. It follows the semantic versioning format, e.g. "1.0.1"
- `explain?: boolean`
  - If the model supports explainability, setting this to `true` will return an explanation of the predictions along with the results.
- `sources: {[userInputKey: string]: { [modelInputName: string]: { bucket: string, key: string } }}`
  - `sources` is an object, and each key in that object represents a set of inputs. For each input, you specify the bucket name and file key. To know how to structure your sources object, you need to know what inputs the model requires and the name of those inputs. Some models only have have one input, while others require multiple inputs. Consult the API section of the model details page to get the correct input name(s). For example, the Image Classification model takes a single input named "image", so the sources object would look like this:
    ```javascript
    const sources = {
      myInput: {
        "image": {
          bucket: "THE_BUCKET_NAME",
          key: "THE_FILE_KEY,
        },
      },
    };
    ```
    If you wanted to submit multiple inputs in a single job, the sources object might look like this:
    ```javascript
    const sources = {
      "input-1": {
        "image": {
          bucket: "THE_BUCKET_NAME",
          key: "THE_FILE_KEY,
        },
      },
      "input-2": {
        "image": {
          bucket: "THE_BUCKET_NAME",
          key: "ANOTHER_FILE_KEY,
        },
      },
    };
    ```

## Returns

A promise that resolves to a SubmitJobResponse object

```typescript
interface SubmitJobResponse {
  model: {
    identifier: string;
    version: string;
    name: string;
  };
  status: string;
  totalInputs: number;
  jobIdentifier: string;
  accessKey: string;
  explain: boolean;
  jobType: string;
  accountIdentifier: string;
  team: {
    identifier: string;
  };
  user: {
    identifier: string;
    externalIdentifier: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
  };
  jobInputs: {
    identifier: string[];
  };
  submittedAt: string;
  hoursDeleteInput: number;
  imageClassificationModel: boolean;
}
```
