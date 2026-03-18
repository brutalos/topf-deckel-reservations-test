import os
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
TOKEN_PATH = "/Users/sheng.chishih/Desktop/github/antigravity/.agent/skills/gsheet-editor/token.json"

def main():
    creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
    service = build("sheets", "v4", credentials=creds)
    spreadsheet_id = "15T5NTeStrQnqgU7fUtsHkL5GazY1KdfpqWAP3K_6Dz8"
    
    result = service.spreadsheets().values().get(
        spreadsheetId=spreadsheet_id, 
        range="Active Menu!A1:Z10"
    ).execute()
    
    rows = result.get('values', [])
    for row in rows:
        print(row)

if __name__ == "__main__":
    main()
