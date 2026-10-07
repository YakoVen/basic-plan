# 📘 BASIC PLAN — Features Report
> **Project:** `basic-plan` (d:\web\basic-plan)  
> **Tier:** 2 of 5  
> **Target Users:** Small businesses, Instagram sellers moving to a real store  
> **Status:** 🟡 Scaffolded — needs development

---

## 📌 INHERITED FROM BEGINNER (Must carry over)
Everything from the Beginner plan is the foundation. These features must be migrated and refined:

| # | Feature | Source |
|---|---------|--------|
| 1 | Landing page (Hero, categories, suggestions, testimonials) | Migrate from Beginner |
| 2 | Product catalog with search, filters, sorting | Migrate from Beginner |
| 3 | Product detail page with image carousel | Migrate from Beginner |
| 4 | COD checkout form (Wilaya/Commune) | Migrate & upgrade |
| 5 | WhatsApp order button + social sharing | Migrate from Beginner |
| 6 | Admin login (Firebase Auth) | Migrate from Beginner |
| 7 | Article CRUD (create, edit, delete, hide) | Migrate & upgrade |
| 8 | Order management (view, filter, status change) | Migrate & upgrade |
| 9 | Responsive design + mobile nav | Migrate from Beginner |
| 10 | Server-side price validation | Migrate from Beginner |
| 11 | Constants-based store config | Migrate & extend |

---

## 🆕 NEW FEATURES TO BUILD

### 🛒 A. Shopping Cart System — `Priority: 🔴 CRITICAL`
> The #1 differentiator from the Beginner tier.

| # | Feature | Details | Priority |
|---|---------|---------|----------|
| 1 | **Cart Context Provider** | React Context + `localStorage` persistence. Holds cart items, quantities, selected variants | 🔴 Critical |
| 2 | **Add to Cart button** | Replaces direct "Commander" on product pages. Shows variant selector first | 🔴 Critical |
| 3 | **Cart icon in header** | Badge showing item count, click to open cart drawer/page | 🔴 Critical |
| 4 | **Cart page/drawer** | List all items, update quantities, remove items, show subtotal | 🔴 Critical |
| 5 | **Multi-item checkout** | Single COD form that submits all cart items as one order | 🔴 Critical |

### 🎨 B. Product Variants — `Priority: 🔴 CRITICAL`

| # | Feature | Details | Priority |
|---|---------|---------|----------|
| 6 | **Variant data model** | Extend `Article` interface with `variants: { name, type, stock }[]` | 🔴 Critical |
| 7 | **Variant selector UI** | Buttons/dropdowns for size, color, etc. on product detail page | 🔴 Critical |
| 8 | **Variant-aware cart** | Cart stores which variant was selected for each item | 🔴 Critical |
| 9 | **Admin: variant editor** | Add/remove/edit variants when creating/editing a product | 🔴 Critical |

### 📦 C. Stock & Inventory — `Priority: 🟠 HIGH`

| # | Feature | Details | Priority |
|---|---------|---------|----------|
| 10 | **Boolean inStock toggle** | Global and per-variant boolean switch (`inStock: true/false`) | 🟠 High |
| 11 | **"Rupture de Stock" badge** | Shown on product cards and detail page when `inStock` is false | 🟠 High |
| 12 | **Prevent ordering OOS items** | Disable "Add to Cart" and "Buy Now" when item is out of stock | 🟠 High |


### 🚚 D. Dynamic Delivery Pricing — `Priority: 🟠 HIGH`

| # | Feature | Details | Priority |
|---|---------|---------|----------|
| 20 | **Delivery zones data** | JSON/Firestore map: `{ wilayaId → { desk: 400, home: 600 } }` | 🟠 High |
| 21 | **Delivery method selector** | Radio buttons: "Livraison à domicile" vs. "Point relais / Bureau" | 🟠 High |
| 22 | **Auto-calculate delivery fee** | Updates total dynamically when wilaya or delivery method changes | 🟠 High |
| 23 | **Admin: delivery zone editor** | Set prices per wilaya from the dashboard | 🟡 Medium |

---

## 📊 IMPLEMENTATION ORDER (Recommended)

```
Phase 1 (Core) — Cart + Variants
  ├── Cart Context Provider
  ├── Cart UI (icon, drawer/page)
  ├── Variant data model + selector UI
  ├── Multi-item checkout
  └── Migrate all Beginner features

Phase 2 (Business Logic) — Stock + Delivery
  ├── Stock tracking per variant
  ├── Out-of-stock handling
  └── Dynamic delivery pricing

Phase 3 (Polish) — UX
  ├── Performance optimization
  └── Final UI polish
```

---

## 🚫 FEATURES EXPLICITLY NOT IN THIS TIER
> These belong to higher tiers only:

* ❌ Coupon / Promo Codes & Discounts (→ Intermediate)
* ❌ Customer Reviews & Star Ratings (→ Intermediate)
* ❌ SMS Notifications (→ Intermediate)
* ❌ Admin Theme Customization (→ Intermediate)
* ❌ Customer Accounts / Login (→ Intermediate)
* ❌ Order Tracking Portal (→ Intermediate)
* ❌ Wishlist saved to account (→ Intermediate)
* ❌ Blog / Content Pages (→ Intermediate)
* ❌ Multi-language i18n (→ Intermediate)
* ❌ Bulk CSV product import (→ Intermediate)
* ❌ Email notifications (→ Intermediate)
* ❌ Online Payment Gateway (→ Professional)
* ❌ Analytics Dashboard (→ Professional)
* ❌ Abandoned Cart Recovery (→ Professional)
* ❌ Multi-store / API Access (→ Enterprise)
