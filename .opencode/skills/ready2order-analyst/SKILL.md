---
name: ready2order-analyst
description: Expert in analyzing ready2order POS data, sales trends, and inventory management via API.
---

# Ready2order Analyst

# Ready2Order Data Analyst Skill

Expert in analyzing ready2order POS data, sales trends, and inventory management via API. This skill provides patterns for extracting actionable insights from the ready2order ecosystem.

## 🔑 Authentication Strategy

Ready2order uses a unique 3-step token process. Always follow this sequence:
1. **Developer Token**: Your static identifier (from developer portal).
2. **Grant Access Token**: Temporary token (10-min) used to request account access.
3. **Account Token**: The permanent Bearer token for data operations.

**Pattern for Auth:**
```python
headers = {
    "Authorization": f"Bearer {account_token}",
    "Content-Type": "application/json"
}
```

## 📊 Data Extraction Patterns

### 1. Sales Analysis (Invoices)
To analyze revenue, fetch invoices. Note that ready2order uses `invoices` as the primary record for completed sales.
- **Endpoint**: `GET /invoices`
- **Key Fields**: `amount`, `vat_amount`, `created_at`, `items`.
- **Insight**: Group by `created_at` to find peak hours; group by `items.product_id` to find bestsellers.

### 2. Product Performance
- **Endpoint**: `GET /products`
- **Analysis**: Compare `price` vs. `quantity_sold` (from invoices) to calculate product-specific revenue contribution.

### 3. Customer Loyalty
- **Endpoint**: `GET /customers`
- **Analysis**: Link `customer_id` from invoices to customer profiles to identify "Whales" (high-frequency, high-spend customers).

## 🛠️ Implementation Best Practices

### 🧪 Development & Testing
- **Training Mode**: ALWAYS use `includeTrainingMode=true` during development. This prevents polluting the merchant's fiscal records with test data.
- **Fiscal Safety**: Never delete or modify invoices in production unless explicitly requested and legally compliant (RKSV/GoBD).

### ⚡ Performance & Limits
- **Rate Limiting**: 60 requests/minute. Implement a backoff strategy or local caching for product catalogs.
- **Webhooks**: Use `invoice.created` to trigger real-time dashboards or loyalty notifications.

## 📈 Growth Levers for ready2order Merchants

1. **Commission Recovery**: Identify customers ordering via expensive platforms (if noted in POS) and target them for direct ordering.
2. **Dynamic Pricing**: Analyze peak hours to suggest "Happy Hour" or "Early Bird" strategies.
3. **Inventory Sync**: Use `product.updated` webhooks to keep external webshops in sync with POS stock levels.

## 🔗 Resources
- [API Documentation](https://api.ready2order.com/docs/v1/)
- [Developer Portal](https://api.ready2order.com)

