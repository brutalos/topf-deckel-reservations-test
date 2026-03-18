
## Brutalos Ecosystem Integration

When building apps or websites within the Brutalos environment, follow these specific patterns:

1. **Brutalos App Development**: Always refer to the `brutalos-app-development` skill for best practices regarding internal dashboards and tools.
2. **Database Persistence**: Use the `/api/db/query` endpoint for all data storage needs. Never rely on static or mock data for features that require persistence.
3. **Schema Management**: Ensure that all required database tables are created using the `create_table` tool before attempting to query them.
4. **App vs Website**: Distinguish between public-facing websites (port 5174) and internal apps (port 5175), as they have different deployment and data strategies.
