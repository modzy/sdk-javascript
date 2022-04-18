# modzyClient.submitJobJDBC

Submit a job using JDCB parameters as inputs

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
} = await modzyClient.submitJobJDBC({
  modelId,
  version,
  url,
  username,
  password,
  driver,
  query,
  explain,
});
```

## Options

- `modelId: string`
  - The model identifier, e.g. "ed542963de"
- `version: string`
  - The model’s version number. It follows the semantic versioning format, e.g. "1.0.1"
- `explain?: boolean`
  - If the model supports explainability, setting this to `true` will return an explanation of the predictions along with the results.
- `url: string`
  - JDBC url to connect to the database, e.g. "jdbc:postgresql://database-host:5432/mydatabase"
- `username: string`
  - The username to access the database
- `password: string`
  - The password to access the database
- `driver: string`
  - Full driver class name, e.g. "org.posgresql.Driver"
- `query: string`
  - The query to execute, notice that we will try to match the column names to the model input keys, so you'll need to use alias for that, e.g. "select description as \'input.txt\' from my-table"

````

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
````
