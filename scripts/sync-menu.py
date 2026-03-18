#!/usr/bin/env python3
import os
import json
import re
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
TOKEN_PATH = "/Users/sheng.chishih/Desktop/github/antigravity/.agent/skills/gsheet-editor/token.json"
SPREADSHEET_ID = "15T5NTeStrQnqgU7fUtsHkL5GazY1KdfpqWAP3K_6Dz8"
RANGE = "Active Menu!A1:Z100"
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "../src/config/menu.json")

def get_sheets_service():
    creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
    return build("sheets", "v4", credentials=creds)

def parse_price(val):
    if not val:
        return 0.0
    val = str(val).replace(',', '.').replace('€', '').strip()
    try:
        return float(val)
    except ValueError:
        return 0.0

def generate_id(name):
    clean = re.sub(r'[^a-zA-Z0-9]+', '-', name).strip('-').lower()
    return f"{clean}-{os.urandom(4).hex()}"

def main():
    service = get_sheets_service()
    
    print(f"Fetching menu data from spreadsheet {SPREADSHEET_ID}...")
    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID, 
        range=RANGE
    ).execute()
    
    rows = result.get('values', [])
    if not rows:
        print('No data found in the "Active Menu" tab.')
        return

    menu_items = []
    current_category = "Tageskarte"

    # From the test-read, row 0 is headers like ['weekly_menu', 'pos_name', 'beilage', '', 'zutaten', ...]
    # row 1 is ['KW 12']
    # row 2 is ['Monday (2026-03-16)']  -> This sets the day/category!
    # row 3 is ['Kürbiscremesuppe (Soup) – L, M, O', 'Suppe', '', '2,5 kg...']
    
    for row in rows:
        if not row or not row[0]:
            continue
            
        col_0 = str(row[0]).strip()
        
        # Skip headers or KW markers
        if col_0.lower() == 'weekly_menu' or col_0.startswith('KW'):
            continue
            
        # Detect Category/Day (e.g. 'Monday (2026-03-16)', 'Tuesday (...)')
        if any(day in col_0 for day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']):
            # Extract just the day name ideally or keep the whole thing as category
            current_category = col_0
            continue
            
        # At this point, it's an actual menu item row.
        # example: ['Bœuf Bourguignon – Topf – Meat – Hausmannskost – G,L,M,U', 'Bœuf', 'mit Spätzle', 'zutaten...']
        
        name = col_0.split('–')[0].split('-')[0].strip() # 'Bœuf Bourguignon'
        
        # We don't have explicit prices in this operational sheet.
        # Let's derive a logical default based on the tag or item name, just so the shop works.
        # Suppe/Desserts usually cheaper. Main dishes ~11.90
        # In the real shop, they usually have standard prices, we will use default mappings if price is missing.
        desc = ""
        if len(row) > 2:
            desc = str(row[2]).strip()
            
        category_tags = [t.strip().lower() for t in col_0.split('–')[1:] if t.strip()]
        if not category_tags:
            category_tags = [t.strip().lower() for t in col_0.split('-')[1:] if t.strip()]
            
        tags = []
        if any('veggie' in t or 'veg' in t for t in category_tags):
            tags.append('veggie')

        prices = {'S': 8.50} 
        if 'soup' in col_0.lower() or 'suppe' in col_0.lower():
            prices = {'S': 4.90, 'L': 6.90}
        elif 'dessert' in col_0.lower():
             prices = {'S': 4.50}
        else:
             prices = {'S': 7.50, 'L': 11.90} # Standard main dish

        menu_items.append({
            'id': generate_id(name),
            'category': current_category,
            'name': name,
            'description': desc,
            'tags': tags,
            'prices': prices,
            'weights': {},
            'savings': None
        })

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(menu_items, f, indent=2, ensure_ascii=False)
        
    print(f"✅ Menu synced! Extracted {len(menu_items)} items for {current_category.split(' ')[0]} etc.")

if __name__ == '__main__':
    main()
