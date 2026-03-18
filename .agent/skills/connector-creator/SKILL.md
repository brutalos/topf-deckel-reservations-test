---
name: connector-creator
description: Best practices for creating Brutalos connectors. Use when building new service integrations, creating API connectors, or setting up new data sources.
triggers:
  - create connector
  - build connector
  - new connector
  - make connector
  - connector for
  - integrate with
  - connect to
  - api integration
invocation: auto
---

# Connector Creator

This skill provides guidance for creating effective, reliable connectors in Brutalos.

## Connector Structure

Every connector lives in `backend/connectors/{service}/` (**NEVER** inside application directories like `backend/app/` or `frontend/`):

**CRITICAL SECURITY RULES:**
1. You are strictly restricted to the `backend/connectors/{service}/` directory.
2. You MUST NOT read, modify, or create files outside this connector directory.
3. You MUST NOT attempt to run UI modifications or Fullstack application building commands. Use simple `bash` commands to create directories and rewrite python files.


```
backend/connectors/
└── {service}/
    ├── connector.json     # Metadata: name, service, actions
    ├── requirements.txt   # Python dependencies
    ├── .venv/             # Auto-created virtual environment
    ├── client.py          # Shared API client class
    ├── main.py            # Dispatcher (reads CONNECTOR_ACTION, routes to action file)
    ├── list_contacts.py   # Action: list_contacts
    ├── create_contact.py  # Action: create_contact
    └── ...                # One .py file per action
```

**CRITICAL: ONE FILE PER ACTION.** `client.py` holds the shared API client. `main.py` dispatches. Each action gets its own file.

## Best Practices

### 1. Always Include requirements.txt

Every connector MUST have a `requirements.txt` file listing dependencies:

```
requests>=2.28.0
python-dateutil>=2.8.0
```

The system will automatically:
1. Create a `.venv/` virtual environment
2. Install dependencies from `requirements.txt`
3. Run the script using the venv's Python

### 2. Handle Credentials — DYNAMIC AUTH FLOW

**NEVER hardcode credentials. NEVER tell users to set env vars. ALL auth is dynamic.**

The full credential flow:

1. **Research** — Call `research_service_auth(service)` to discover what auth methods the API supports (OAuth2, API key, bearer token, etc.)
2. **Present options** — Use `display_data` to show the user the available auth methods as a table
3. **Ask user** — Let user choose their preferred auth method
4. **Request credentials** — Call `request_credentials(service, fields)` with the specific fields needed. This shows a secure form in the UI.
5. **Store** — When user submits, call `store_credential(service, value, key)` for each field
6. **Build connector** — The connector code reads credentials from env vars (auto-injected by `run_connector`)

#### Tool sequence:
```
1. research_service_auth("hubspot")     → discovers: API key, OAuth2, private app token
2. display_data("table", "Auth Options", [...])  → shows options to user
3. (user picks "API Key")
4. request_credentials("hubspot", [     → shows credential form
     {"name": "api_key", "label": "HubSpot API Key", "type": "password"}
   ])
5. store_credential("hubspot", "<user-value>", "api_key")  → saved to DB
6. opencode_build(service="hubspot", ...)  → build the connector
7. run_connector("hubspot", "get_contacts")  → credentials auto-injected as env vars
```

#### In connector code, just read from env:
```python
import os
import sys

# Credentials are auto-injected by run_connector from stored credentials
API_KEY = os.environ.get("API_KEY")
if not API_KEY:
    print(json.dumps({"success": False, "error": "API_KEY not configured. Please provide your API key."}))
    sys.exit(1)
```

#### Available credential tools:
| Tool | Purpose |
|------|---------|
| `get_credential` | Check if credential exists (ALWAYS call first) |
| `store_credential` | Store a credential value |
| `list_credentials` | List all stored credentials (masked) |
| `delete_credential` | Remove credentials |
| `request_credentials` | Show credential form to user (AG-UI event) |

### 3. Accept JSON Input via Environment

```python
import json
import os

# Parse input parameters
params = json.loads(os.environ.get("ACTION_INPUT", "{}"))
ticker = params.get("ticker", "AAPL")
```

### 4. Always Output JSON

```python
import json

# Success output
result = {
    "success": True,
    "data": [...],
    "count": len(data)
}
print(json.dumps(result))

# Error output
error_result = {
    "success": False,
    "error": "API returned 401 Unauthorized"
}
print(json.dumps(error_result))
```

### 5. Handle Errors Gracefully

```python
import requests

try:
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    data = response.json()
except requests.Timeout:
    print(json.dumps({"success": False, "error": "Request timed out"}))
    sys.exit(1)
except requests.HTTPError as e:
    print(json.dumps({"success": False, "error": f"HTTP error: {e}"}))
    sys.exit(1)
except Exception as e:
    print(json.dumps({"success": False, "error": str(e)}))
    sys.exit(1)
```

### 6. Use --json-input Flag

Scripts should check for the `--json-input` flag to know parameters are in `ACTION_INPUT`:

```python
import sys

if "--json-input" in sys.argv:
    params = json.loads(os.environ.get("ACTION_INPUT", "{}"))
else:
    # Default/test mode
    params = {"ticker": "AAPL"}
```

## Complete Example (Multi-File)

### `client.py` — Shared API client
```python
import os
import requests

class HubSpotClient:
    def __init__(self):
        self.access_token = os.environ.get("HUBSPOT_ACCESS_TOKEN")
        self.base_url = "https://api.hubapi.com"
        self.headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }

    def request(self, method, endpoint, params=None, data=None):
        url = f"{self.base_url}{endpoint}"
        response = requests.request(method, url, headers=self.headers, params=params, json=data)
        response.raise_for_status()
        return response.json()
```

### `list_contacts.py` — One action per file
```python
import json, os, sys
from client import HubSpotClient

def run(params):
    client = HubSpotClient()
    limit = params.get("limit", 10)
    return client.request("GET", "/crm/v3/objects/contacts", params={"limit": limit})

if __name__ == "__main__":
    params = json.loads(os.environ.get("CONNECTOR_PARAMS", "{}"))
    print(json.dumps(run(params)))
```

### `main.py` — Dispatcher
```python
import os, json, sys
import importlib

def main():
    action = os.environ.get("CONNECTOR_ACTION")
    params = json.loads(os.environ.get("CONNECTOR_PARAMS", "{}"))

    try:
        module = importlib.import_module(action)
        result = module.run(params)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
```

## Common Patterns

### REST API with Bearer Token

```python
headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}
response = requests.get(url, headers=headers, timeout=30)
```

### Pagination

```python
all_results = []
offset = 0
limit = 100

while True:
    response = requests.get(f"{url}?offset={offset}&limit={limit}")
    data = response.json()
    results = data.get("results", [])
    
    if not results:
        break
    
    all_results.extend(results)
    offset += limit
    
    if len(results) < limit:
        break
```

### Rate Limiting

```python
import time

for item in items:
    process(item)
    time.sleep(0.1)  # 10 requests per second max
```
