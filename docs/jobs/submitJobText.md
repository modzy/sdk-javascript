# modzyClient.submitJobText

Submit a job with plain text input(s).

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
} = await modzyClient.submitJobText({
    modelId,
    version,
    explain = false,
    sources,
  });
```

## Options

- `modelId: string`
  - The model identifier, e.g. "ed542963de"
- `version: string`
  - The model’s version number. It follows the semantic versioning format, e.g. "1.0.1"
- `explain?: boolean`
  - If the model supports explainability, setting this to `true` will return an explanation of the predictions along with the results.
- `sources: {[userInputKey: string]: { [modelInputName: string]: inputText: string }}`
  - `sources` is an object, and each key in that object represents a set of inputs. To know how to structure your sources object, you need to know what inputs the model requires and the name of those inputs. Some models only have have one input, while others require multiple inputs. Consult the API section of the model details page to get the correct input name(s). For example, the Sentiment Analysis model takes a single input named "input.txt", so the sources object would look like this:
    ```javascript
    const sources = {
      myInput: {
        "input.txt": "Sometimes I really hate ribs.",
      },
    };
    ```
    If you wanted to submit multiple inputs in a single job, the sources object might look like this:
    ```javascript
    const sources = {
      "input-1": {
        "input.txt": "Sometimes I really hate ribs.",
      },
      "input-2": {
        "input.txt": "Other times I find ribs to be the best ever",
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
