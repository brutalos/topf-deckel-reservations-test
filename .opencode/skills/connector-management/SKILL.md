---
name: connector-management
description: Best practices for managing connector lifecycles, including creation and manual deletion.
triggers:
  - list connectors
  - show connectors
  - connector status
  - which connectors
invocation: auto
---

# Connector Management

# Connector Lifecycle Management

## Overview
This skill outlines the patterns for managing connectors within the system. While the assistant can create connectors using `opencode_build`, it does not currently have a tool for direct file deletion.

## Creating Connectors
- Always check `list_connectors` first.
- Use `opencode_build` with a clear prompt including the service name and action.
- Always include a `requirements.txt` in the prompt.

## Deleting Connectors
Currently, deleting a connector (removing the source code from the `connectors/` directory) is a **manual process**. 

### Steps for Manual Deletion:
1. Navigate to the `connectors/` directory in the file system.
2. Locate the subdirectory for the service (e.g., `connectors/stripe/`).
3. Delete the specific action file or the entire service directory.

## Disconnecting Services
To stop using a service without deleting the code:
1. Remove the credentials associated with the service.
2. Delete any active flows using `delete_flow`.
