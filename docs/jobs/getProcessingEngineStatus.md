# modzyClient.getProcessingEngineStatus

Return a list of all active processing engines and their status.

```javascript
const engineStatuses = await modzyClient.getProcessingEngineStatus();
```

## Options

- None

## Returns

A promise that resolves to an array of Engine objects

```typescript
interface Engine {
  identifier: string;
  version: string;
  failed: number;
  queued: number;
  spinningUp: number;
  spinningDown: number;
  running: number;
  ready: number;
}
```
