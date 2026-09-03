# 🏥 Hospital Management OS

<p align="center">
  <img src="static/description/banner.jpg" alt="Hospital Management OS Banner" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);"/>
</p>

<p align="center">
  <strong>An Enterprise-Grade, Modern Clinical & Healthcare Operations Platform built natively for Odoo 17.0</strong>
</p>

<p align="center">
  <a href="#-rule-number-1-grant-user-access-rights-critical-setup"><img src="https://img.shields.io/badge/RULE%20%231-Grant%20Access%20Rights-critical?style=for-the-badge&logo=shield" alt="Rule #1"/></a>
  <a href="https://www.odoo.com"><img src="https://img.shields.io/badge/Odoo-17.0%20Ready-714B67?style=for-the-badge&logo=odoo&logoColor=white" alt="Odoo 17.0"/></a>
  <img src="https://img.shields.io/badge/Status-Production%20Hardened-0d9488?style=for-the-badge&logo=checkmarx&logoColor=white" alt="Production Ready"/>
  <img src="https://img.shields.io/badge/License-AGPL--3-blue.svg?style=for-the-badge" alt="License: AGPL-3"/>
  <img src="https://img.shields.io/badge/Currency-Native%20EGP-059669?style=for-the-badge" alt="Currency: EGP"/>
  <img src="https://img.shields.io/badge/Architecture-OWL%202.0%20%2B%20SCSS-6366f1?style=for-the-badge" alt="OWL 2.0"/>
</p>

---

## 📌 Executive Summary

**Hospital Management OS** (`hospital_managment_os`) is a next-generation hospital information and healthcare operations system (HIS / EHR) designed to manage patient lifecycles, outpatient clinics, inpatient admissions, surgery scheduling, pharmacy dispensaries, and clinical laboratories.

Engineered with **OWL 2.0 components**, **dynamic real-time dashboards**, **responsive SCSS**, and native **Egyptian Pound (EGP)** monetary precision, this module transforms Odoo 17 into an intuitive healthcare SaaS suite.

---

> [!CAUTION]
> ## 🚨 RULE NUMBER 1: GRANT USER ACCESS RIGHTS (CRITICAL SETUP)
>
> **If you install this module and cannot see the "Hospital Management OS" root menu or dashboards, DO NOT PANIC! This is intentional Odoo security behavior.**
>
> By design, Odoo uses strict **Role-Based Access Control (RBAC)**. When the module is installed, **no user (not even Administrator) is automatically granted access** until you configure their role.
>
> ### 🛠️ How to Enable Access in 30 Seconds:
>
> 1. **Open Odoo Settings**:
>    - Go to **Settings** ➔ **Users & Companies** ➔ **Users**.
> 2. **Select Your User**:
>    - Click on your administrator user (or any staff member e.g., `Mitchell Admin`).
> 3. **Edit Access Rights**:
>    - Click **Edit** (top-left).
>    - Scroll down to the **Hospital Management OS** security section.
> 4. **Assign the Desired Role**:
>    - Select one of the available security groups:
>      - 👑 **Hospital Manager**: Full system access, all 4 dashboards, infrastructure, rooms, wards, insurance, and system configuration.
>      - 🩺 **Doctor**: Clinical practice dashboard, patient directory, outpatient consultations, surgery schedule.
>      - 🛎️ **Receptionist**: Reception desk dashboard, patient intake, appointment scheduling, room occupancy.
>      - 💊 **Pharmacist**: Pharmacy POS dispensary dashboard, medication catalogs, prescription dispensation.
>      - 🔬 **Laboratory Assistant**: Laboratory diagnostics dashboard, test queues, pathology result entry.
>      - 🩺 **Nurse**: Inpatient nursing care plans, vital signs, round checks.
> 5. **Save & Hard Refresh**:
>    - Click **Save**.
>    - Press **`Ctrl + F5`** (Windows/Linux) or **`Cmd + Shift + R`** (Mac) to reload Odoo assets.
>    - The **Hospital Management OS** menu and relevant role dashboards will immediately appear in your top navigation!

---

## 🌟 Core Highlights & Feature Capabilities

```text
                  ┌──────────────────────────────────────────────┐
                  │          Hospital Management OS              │
                  │             (Odoo 17 Engine)                 │
                  └──────┬──────────────┬──────────────┬─────────┘
                         │              │              │
        ┌────────────────▼───┐   ┌──────▼──────┐   ┌───▼────────────────┐
        │  Clinical Practice │   │  Inpatient  │   │     Dispensary     │
        │  & Physician Dash  │   │  Ward & ICU │   │    & Laboratory    │
        └────────────────────┘   └─────────────┘   └────────────────────┘
```

### 1. 🩺 Clinical Practice & Physician Dashboard
- **Live Outpatient Flow**: Real-time KPI cards tracking today's appointments, pending consultations, completed visits, and active inpatients.
- **Instant Search & Triage**: Search consultations by patient name, reference number, or attending doctor.
- **Integrated Prescription Engine**: Rapid medication directives authoring with dosage, frequency, and intake instructions.
- **One-Click Invoice & Admission**: Directly convert consultations to invoices or transfer patients to inpatient wards.

### 2. 🛏️ Inpatient Care (IPD) & Surgical Theater
- **Bed & Ward Management**: Real-time room and bed allocation with occupancy status tracking (`Available`, `Occupied`, `Reserved`).
- **Admission Categorization**: Supports `Normal`, `Emergency`, and `ICU` admissions.
- **Surgical Procedures**: Operation scheduling, operating room assignment, duration tracking, and surgical team allocation.
- **Nursing Care Plans**: Daily nursing schedules, medication timings, and patient vitals tracking.

### 3. 🏢 Front Desk & Patient Reception Dashboard
- **Rapid Patient Intake**: Register new patients directly from the dashboard with blood group, RH factor, and photo capture.
- **Appointment Scheduling**: Book appointments across specialized clinical departments in seconds.
- **Room Occupancy Visualization**: Visual occupancy rates and live ward capacity indicators.

### 4. 🔬 Clinical Pathology & Diagnostic Laboratory
- **Diagnostic Test Queues**: Dual-queue dashboard for tests awaiting sample collection and tests currently in laboratory processing.
- **Standardized Results**: Pre-configured test templates with normal reference ranges and automated out-of-range flagging.
- **Automated Barcoded PDF Reports**: Print high-resolution pathology reports with native Code128 barcodes.

### 5. 💊 Pharmacy Dispensary & Interactive POS
- **OWL 2.0 Dispensary UI**: Fast, keyboard-friendly dispensary order line interface with dynamic subtotal calculations.
- **Inventory & Batch Tracking**: Live stock visibility, low-stock threshold warnings (`≤ 5 units`), and expiration tracking.
- **Automatic Sales Orders**: Instantly generates confirmed sales orders and customer invoices upon dispensation.

### 6. 🌐 Online Patient Portal & Public Booking
- **Self-Service Booking**: Patients can schedule consultations online, selecting preferred dates, departments, and physicians.
- **Patient Portal**: Secure access for patients to view medical history, download clinical prescriptions, and track lab test reports.

### 7. 💱 Native Egyptian Pound (EGP) Localization
- **Native Odoo Currency**: Integrated with `res.currency` (`base.EGP`).
- **Standard Formatting**: Enforces professional Egyptian Pound formatting (`<amount> EGP` e.g., `10 EGP`, `250 EGP`, `1,500 EGP`, `25,000 EGP`).
- **Monetary Precision**: All clinical prices, tests, room charges, and dispensary totals use proper `fields.Monetary` fields linked to company currency.

### 8. 📱 Ultra-Responsive Viewport Architecture
- **Engineered for Any Device**: Tested and optimized for viewports from **320px** to **1920px+** (`320px`, `375px`, `414px`, `480px`, `768px`, `1024px`, `1280px`, `1440px`, `1920px`).
- **No Layout Breakages**: Zero horizontal page overflows, single natural vertical scrolling (no double scrollbars), and custom slim webkit table scrollbars.
- **Reduced Motion Support**: Full `@media (prefers-reduced-motion: reduce)` compliance for accessibility.

---

## 👥 Role-Based Access Control (RBAC) Matrix

| Feature / Department | Receptionist | Doctor | Nurse | Pharmacist | Lab Tech | Hospital Manager |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Reception Dashboard** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Patient Registration** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Doctor Dashboard** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Outpatient Consultations** | ✅ (Book) | ✅ (Treat) | ❌ | ❌ | ❌ | ✅ |
| **Surgery Scheduling** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Nursing Plans** | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Pharmacy Dashboard & POS**| ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Laboratory Diagnostics** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Inpatient Admissions** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Hospital Infrastructure** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **System Configuration** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🚀 Installation & Setup Guide

### 1. Prerequisites

Ensure your Odoo 17 environment is installed with Python 3.10+ and the required Python barcode library:

```bash
pip install python-barcode
```

For printing PDF reports with barcodes and patient ID cards, ensure `wkhtmltopdf` (v0.12.5 or v0.12.6) is installed on your server.

### 2. Clone or Copy Module

Place the `hospital_managment_os` directory inside your Odoo `custom_addons` path:

```bash
cd /path/to/odoo-17.0/custom_addons/
git clone https://github.com/your-username/hospital_managment_os.git
```

Verify your `odoo.conf` file includes the addons path:

```ini
addons_path = /path/to/odoo-17.0/addons,/path/to/odoo-17.0/custom_addons
```

### 3. Install the Module

1. Restart your Odoo server.
2. Log in as an administrator and activate **Developer Mode** (**Settings** ➔ **Activate Developer Mode**).
3. Navigate to **Apps** ➔ click **Update Apps List**.
4. Search for `Hospital Management OS` (or technical name `hospital_managment_os`).
5. Click **Activate / Install**.

### 4. CLI Upgrade Command (Optional / Developers)

To upgrade or install directly from the command line:

```powershell
# Windows PowerShell
& "python.exe" odoo-bin -c odoo.conf -d YourDatabase -u hospital_managment_os --stop-after-init
```

```bash
# Linux / macOS
python3 odoo-bin -c odoo.conf -d YourDatabase -u hospital_managment_os --stop-after-init
```

### 5. Apply Rule #1
Remember: **Assign access rights under Settings ➔ Users!**

---

## 🏗️ Technical Architecture & Directory Structure

```text
hospital_managment_os/
├── __init__.py
├── __manifest__.py                 # Manifest, dependencies, asset registration
├── README.md                       # Comprehensive GitHub repository guide
├── data/
│   ├── ir_cron_data.xml           # Scheduled hospital jobs
│   ├── ir_sequence_data.xml       # OP, IP, and Patient barcode sequences
│   ├── res_currency_data.xml      # EGP native currency configuration
│   └── website_data.xml           # Website portal navigation menus
├── demo/
│   └── hr_job_demo.xml            # Clinical job position definitions
├── models/
│   ├── hospital_outpatient.py     # Outpatient consultations logic
│   ├── hospital_inpatient.py      # Admissions, wards, and rooms
│   ├── hospital_pharmacy.py       # Pharmacy orders and medicines
│   ├── hospital_laboratory.py     # Diagnostic tests & result lines
│   ├── doctor_allocation.py       # Physician schedule allocations
│   ├── res_partner.py             # Patient EHR profile extensions
│   └── ...                        # Specialized healthcare models
├── report/
│   ├── lab_test_line_reports.xml  # Diagnostic laboratory pathology reports
│   └── res_partner_reports.xml    # Official prescriptions & Patient ID cards
├── security/
│   ├── hospital_groups.xml        # RBAC security groups definitions
│   ├── ir.model.access.csv        # Comprehensive model ACL rules
│   └── ..._security.xml           # Record rules for doctors & lab techs
├── static/
│   ├── description/
│   │   ├── icon.png               # Module icon
│   │   ├── banner.jpg             # High-res presentation banner
│   │   └── index.html             # Odoo App Store presentation page
│   └── src/
│       ├── css/                   # Component-scoped CSS stylesheets
│       ├── js/                    # OWL 2.0 components and client actions
│       ├── scss/                  # hospital_common.scss design system
│       └── xml/                   # OWL QWeb dashboard templates
└── views/
    ├── menu_views.xml             # Root menu & dashboard client action links
    ├── hospital_outpatient_views.xml
    ├── hospital_inpatient_views.xml
    ├── patient_portal_templates.xml
    └── ...
```

---

## 🎨 Design System & Color Palette

| Color | Hex | Usage |
|:---|:---:|:---|
| **Teal Primary** | `#0d9488` | Core brand identity, primary buttons, active tabs |
| **Cyan Secondary** | `#0891b2` | Header gradients, metrics highlights, clinical info |
| **Mint Accent** | `#ccfbf1` | Light badge backgrounds, selected states |
| **Slate Navy** | `#0f172a` | High-contrast readable typography |
| **Success Emerald** | `#10b981` | Completed consultations, discharged patients, in-stock items |
| **Warning Amber** | `#f59e0b` | Pending outpatient visits, draft tests, reserved beds |
| **Danger Rose** | `#ef4444` | Emergency admissions, expired statuses, critical alerts |

---

## 📄 License & Attribution

- **Owner & Maintainer**: [Omar Shehata](https://omarshehata.onrender.com)
- **Technical Module Name**: `hospital_managment_os`


---

<p align="center">
  <strong>Built with ❤️ By Omar Shehata</strong>
</p>
