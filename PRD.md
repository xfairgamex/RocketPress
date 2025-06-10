# RocketPress Product Requirements Document (PRD)

**Product Name:** AutoDTF
**Purpose:** To fully automate the order, print, press, and ship workflow for direct-to-film (DTF) print shops, particularly those using Shopify. AutoDTF integrates with Shopify and suppliers like S\&S Activewear to create an efficient, minimal-touch system that reduces human error and boosts throughput.

---

## 1. Overview

AutoDTF is a SaaS platform that automates the DTF production process from Shopify order to shipment. It pulls in Shopify orders, matches SKUs with artwork and garment blanks, auto-generates gang sheets, interfaces with DTF printers and cutters, manages blank garment inventory, places just-in-time orders through the S\&S Activewear API, guides the press process with visual mockups, and completes shipping label generation through barcode-driven workflows. This minimizes downtime, ensures the right garments are always on hand, and significantly reduces human error in production.

---

## 2. Core Features

### A. Shopify Integration

* Native app experience within Shopify admin.
* Auto-sync unfulfilled orders in real-time.
* Match ordered SKUs with high-res artwork and blank garment SKUs.

### B. Artwork & Gang Sheet Management

* Auto-match SKUs with correct artwork files.
* AI-driven gang sheet generator (auto-layout, spacing, optimization).
* Print-ready gang sheet export (PDF, PNG, TIFF).
* Integrates with major RIP software (AcroRIP, Cadlink, Kothari).

### C. Barcode-Based Workflow

* Auto-generate barcodes for each transfer.
* Barcodes linked to:

  * Order number
  * SKU
  * Blank garment (size, color)
  * Mockup preview
  * Shipping label

### D. Heat Press Guidance

* Scan barcode on transfer.
* System displays garment type and placement guide.
* Mockup preview for correct positioning.
* Confirmed press triggers shipping label print (thermal printer integration).

### E. Blank Garment Inventory Management & S\&S Integration

* Real-time inventory tracking of blank garments by SKU, size, and color.
* Auto-sync inventory levels with incoming Shopify orders.
* Alerts for low stock and predictive reordering based on order history and trends.
* API integration to auto-purchase blank garments from S\&S Activewear.
* As Shopify orders sync, matching S\&S SKUs are automatically added to a purchase queue.
* Inventory is cross-checked before ordering to avoid duplicates.
* Purchases are sent daily to S\&S with next-day delivery.

### F. Print Queue Management

* Dashboard showing queued, printed, and pressed items.
* Auto-send files to print queue upon approval.
* Optional manual override and print hold system.

### G. Shipping Automation

* Generate shipping labels upon press confirmation.
* Label printer support (Zebra, Rollo, etc).
* Shopify fulfillment status updated automatically.
* Supports label generation via **EasyPost API** for multi-carrier shipping.
* Where possible, integrate with **Shopify Shipping services** (e.g., triggering label creation via Shopify's backend) – if Shopify opens access or allows workarounds.
* System intelligently chooses between EasyPost and native Shopify methods based on availability and configuration.

### H. Packing Slip & Admin Dashboard

* Auto-generate packing slips per order with barcode for final fulfillment scan.

* Barcode scan at pack-out verifies correct items before shipment.

* Prevents packing errors and improves shipping accuracy.

* Inventory dashboard showing current blank garment stock, reorder suggestions, and consumption history.

* Job tracking by order status.

* Transfer-to-garment matching log.

* Failed jobs or reprint flagging.

* Inventory forecasting for blanks & DTF film usage.

* Inventory dashboard showing current blank garment stock, reorder suggestions, and consumption history.

* Job tracking by order status.

* Transfer-to-garment matching log.

* Failed jobs or reprint flagging.

* Inventory forecasting for blanks & DTF film usage.

---

## 3. Future Features (Post-MVP)

* Heat press timer integration & logging.
* Multi-location shop support.
* Multi-store (Shopify) management from single dashboard.

---

## 4. Tech Stack Recommendations

* **Backend:** Node.js or Laravel PHP (for strong Shopify + S\&S integrations)
* **Frontend:** React or Vue (Shopify Polaris-compatible UI)
* **Database:** PostgreSQL&#x20;
* **Queue System:** Redis or Laravel Horizon
* **Printing API:** Integration layer for RIP software + thermal label printers

---

## 5. MVP Development Milestones

1. **Shopify integration & SKU/artwork mapping**
2. **AI gang sheet builder w/ preview**
3. **Print queue & RIP export**
4. **Barcode generation & order tracking system**
5. **Thermal label printer support**
6. **S\&S Activewear inventory + ordering integration**
7. **Press workflow UI (mockup guidance + label print)**
8. **Admin dashboard & logs**

---

## 6. Target Users

* Small to mid-sized DTF print shops
* POD (print-on-demand) fulfillment centers
* Apparel decorators looking to scale with automation

---

## 7. Competitive Edge

* No current SaaS offers full-stack automation (Shopify to heat press + label print + inventory control for blank garments).
* Gang sheet generation is typically manual or customer-facing.
* No integrated barcode-to-garment-to-shipping solution on market.
