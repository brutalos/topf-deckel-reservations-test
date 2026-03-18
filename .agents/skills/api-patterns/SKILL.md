---
name: api-patterns
description: Common API integration patterns including OAuth, API keys, pagination, rate limiting, and error handling. Use when working with external APIs or authentication.
triggers:
  - oauth
  - api key
  - authentication
  - rate limit
  - pagination
  - rest api
  - http request
invocation: auto
---

# API Patterns

This skill covers common patterns for integrating with external APIs.

## Authentication Methods

### 1. API Key (Header)

```python
headers = {
    "X-API-Key": os.environ.get("SERVICE_API_KEY"),
    "Content-Type": "application/json"
}
response = requests.get(url, headers=headers)
```

### 2. Bearer Token

```python
headers = {
    "Authorization": f"Bearer {os.environ.get('ACCESS_TOKEN')}",
    "Content-Type": "application/json"
}
response = requests.get(url, headers=headers)
```

### 3. Basic Auth

```python
from requests.auth import HTTPBasicAuth

auth = HTTPBasicAuth(
    os.environ.get("API_USER"),
    os.environ.get("API_PASSWORD")
)
response = requests.get(url, auth=auth)
```

### 4. OAuth 2.0 Flow

For OAuth services, Brutalos handles the flow automatically. The connector receives tokens via environment:

```python
# After OAuth flow completes, tokens are available:
access_token = os.environ.get("OAUTH_ACCESS_TOKEN")
refresh_token = os.environ.get("OAUTH_REFRESH_TOKEN")
```

## Pagination Patterns

### Offset-Based

```python
def fetch_all_paginated(base_url, limit=100):
    all_results = []
    offset = 0
    
    while True:
        url = f"{base_url}?offset={offset}&limit={limit}"
        response = requests.get(url, headers=headers)
        data = response.json()
        
        results = data.get("results", [])
        all_results.extend(results)
        
        if len(results) < limit:
            break
        offset += limit
    
    return all_results
```

### Cursor-Based

```python
def fetch_all_cursor(base_url):
    all_results = []
    cursor = None
    
    while True:
        url = f"{base_url}?cursor={cursor}" if cursor else base_url
        response = requests.get(url, headers=headers)
        data = response.json()
        
        all_results.extend(data.get("items", []))
        
        cursor = data.get("next_cursor")
        if not cursor:
            break
    
    return all_results
```

### Link Header (GitHub style)

```python
def fetch_all_link_header(url):
    all_results = []
    
    while url:
        response = requests.get(url, headers=headers)
        all_results.extend(response.json())
        
        # Parse Link header for next page
        links = response.headers.get("Link", "")
        url = None
        for link in links.split(","):
            if 'rel="next"' in link:
                url = link.split(";")[0].strip("<> ")
                break
    
    return all_results
```

## Rate Limiting

### Simple Delay

```python
import time

for item in items:
    process(item)
    time.sleep(0.1)  # Max 10 requests/second
```

### Exponential Backoff

```python
import time
import random

def request_with_backoff(url, max_retries=5):
    for attempt in range(max_retries):
        response = requests.get(url, headers=headers)
        
        if response.status_code == 429:  # Rate limited
            wait = (2 ** attempt) + random.uniform(0, 1)
            time.sleep(wait)
            continue
        
        return response
    
    raise Exception("Max retries exceeded")
```

### Respect Retry-After Header

```python
def request_with_retry_after(url):
    response = requests.get(url, headers=headers)
    
    if response.status_code == 429:
        retry_after = int(response.headers.get("Retry-After", 60))
        time.sleep(retry_after)
        return requests.get(url, headers=headers)
    
    return response
```

## Error Handling

### Comprehensive Error Handler

```python
import requests
import json
import sys

def safe_request(url, method="GET", **kwargs):
    try:
        kwargs.setdefault("timeout", 30)
        response = requests.request(method, url, **kwargs)
        response.raise_for_status()
        return {"success": True, "data": response.json()}
        
    except requests.Timeout:
        return {"success": False, "error": "Request timed out after 30s"}
        
    except requests.ConnectionError:
        return {"success": False, "error": "Failed to connect to server"}
        
    except requests.HTTPError as e:
        status = e.response.status_code
        if status == 401:
            return {"success": False, "error": "Authentication failed - check credentials"}
        elif status == 403:
            return {"success": False, "error": "Access forbidden - check permissions"}
        elif status == 404:
            return {"success": False, "error": "Resource not found"}
        elif status == 429:
            return {"success": False, "error": "Rate limited - try again later"}
        else:
            return {"success": False, "error": f"HTTP {status}: {e}"}
            
    except json.JSONDecodeError:
        return {"success": False, "error": "Invalid JSON response from server"}
        
    except Exception as e:
        return {"success": False, "error": f"Unexpected error: {str(e)}"}
```

## Common API Patterns

### HubSpot API

```python
BASE_URL = "https://api.hubapi.com"
headers = {
    "Authorization": f"Bearer {os.environ.get('HUBSPOT_ACCESS_TOKEN')}",
    "Content-Type": "application/json"
}

# Get contacts
response = requests.get(
    f"{BASE_URL}/crm/v3/objects/contacts",
    headers=headers,
    params={"limit": 100}
)
```

### Google Sheets API

```python
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

creds = Credentials(
    token=os.environ.get("GOOGLE_ACCESS_TOKEN"),
    refresh_token=os.environ.get("GOOGLE_REFRESH_TOKEN"),
    token_uri="https://oauth2.googleapis.com/token",
    client_id=os.environ.get("GOOGLE_CLIENT_ID"),
    client_secret=os.environ.get("GOOGLE_CLIENT_SECRET"),
)

service = build("sheets", "v4", credentials=creds)
result = service.spreadsheets().values().get(
    spreadsheetId=spreadsheet_id,
    range="Sheet1!A1:Z100"
).execute()
```

### Slack API

```python
BASE_URL = "https://slack.com/api"
headers = {
    "Authorization": f"Bearer {os.environ.get('SLACK_BOT_TOKEN')}",
    "Content-Type": "application/json"
}

# Send message
response = requests.post(
    f"{BASE_URL}/chat.postMessage",
    headers=headers,
    json={"channel": "#general", "text": "Hello!"}
)
```

## Webhook Patterns

### Receiving Webhooks

```python
from flask import Flask, request

app = Flask(__name__)

@app.route("/webhook", methods=["POST"])
def handle_webhook():
    # Verify signature if provided
    signature = request.headers.get("X-Signature")
    if not verify_signature(request.data, signature):
        return {"error": "Invalid signature"}, 401
    
    payload = request.json
    # Process webhook...
    
    return {"status": "ok"}, 200
```

### Sending Webhooks

```python
def send_webhook(url, event_type, data):
    payload = {
        "event": event_type,
        "timestamp": datetime.utcnow().isoformat(),
        "data": data
    }
    
    response = requests.post(
        url,
        json=payload,
        headers={"Content-Type": "application/json"},
        timeout=10
    )
    
    return response.status_code == 200
```
