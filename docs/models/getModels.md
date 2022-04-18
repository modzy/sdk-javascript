# modezyClient.getModels

Get a list of models with very basic info such as modelId, versions, and latestVersion based on specified params. This API endpoint returns paginated results. If no params are sent, returns the first 500 models.

```javascript
const arrayOfModels = await modzyClient.getModels({
  modelId,
  author,
  createdByEmail,
  name,
  description,
  isActive,
  isExpired,
  isFeatured,
  lastActiveDateTime,
  expirationDateTime,
  page,
  perPage,
  direction?: "ASC" | "DESC";
  sortBy,
});
```

## Options

- `modelId?: string;`
  - Filters models by identifier. Separate multiple values with `;`.
- `author?: string;`
  - Filters models by the organization that created them. Separate multiple values with `;`.
- `createdByEmail?: string;`
  - Filters models by creator’s email. Separate multiple values with `;`.
- `name?: string;`
  - Filters models by name. Separate multiple values with `;`.
- `description?: string;`
  - Filters models by description.
- `isActive?: boolean;`
  - Filters models by status.
- `isExpired?: boolean;`
  - Filters models by expired status.
- `isFeatured?: boolean;`
  - Filters models by isFeatured flag.
- `lastActiveDateTime?: string | Date;`
  - Filters models by the latest use date. It requires ISO8601 formated string (YYYY-MM-DDThh:mm:ss.sTZD) or a date object.
- `expirationDateTime?: string | Date;`
  - Filters models by the expiration date. It requires ISO8601 formated string (YYYY-MM-DDThh:mm:ss.sTZD) or a date object.
- `page?: number;`
  - The page number to be returned.
- `perPage?: number;`
  - The number of records returned per page. Defaults to 500.
- `sortBy?: | "modelId" | "author" | "submittedByEmail" | "name" | "isExpired" | "isActive" | "latestVersion" | "isRecommended" | "lastActiveDateTime" | "expirationDateTime";`
  - Sort models by the specified field.
- `direction?: "ASC" | "DESC";`
  - Orders the records in ascending (ASC) or descending (DESC) order.

## Returns

Returns a promise that resolves to an array of Model objects

```typescript
interface Model {
  modelId: string;
  latestVersion: string;
  versions: string[];
}
```
