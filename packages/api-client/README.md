# @costwise/api-client

Typed API client for CostWise `/v1` routes, generated from the OpenAPI spec using `openapi-fetch` and `openapi-typescript`.

## Usage

```ts
import { createApiClient } from "@costwise/api-client";

const client = createApiClient({ baseUrl: "http://localhost:3001" });
const { data, error } = await client.GET("/v1/recipes");
```

## Regenerating Schema

To update the OpenAPI schema and regenerate types:

```bash
pnpm --filter api emit-openapi && pnpm --filter @costwise/api-client gen
```
