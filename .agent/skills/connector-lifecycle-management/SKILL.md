---
name: connector-lifecycle-management
description: Best practices for creating, maintaining, and manually deleting connectors.
triggers:
  - delete connector
  - remove connector
  - manage connector
  - connector lifecycle
  - update connector
  - fix connector
invocation: auto
---

# Connector Lifecycle Management

# Connector Lifecycle Management

This skill documents the patterns for managing the lifecycle of connectors within the system.

## Creation
- Always check `list_connectors` first to avoid duplicates.
- Use `opencode_build` to generate the connector code and its `requirements.txt`.
- Follow the directory structure: `connectors/{service}/{action}.py`.

## Maintenance
- Use `analyze_connector` to identify potential issues or improvements.
- Use `improve_connector` to automatically apply fixes or enhancements.
- Use `validate_connector` to ensure the connector meets quality standards.

## Deletion
- **Current Limitation**: There is no direct tool for the assistant to delete connector files from the filesystem.
- **Manual Process**: To remove a connector, the user must manually delete the files from the `connectors/` directory in the host environment.
- **Cleanup**: After manual deletion, the assistant will no longer see the connector in `list_connectors`.

## Disconnecting Services
- To stop using a service without deleting the code, focus on managing credentials.
- While there is no `delete_credential` tool, credentials can be managed or cleared in the underlying storage.
