# -*- coding: utf-8 -*-
################################################################################
#
#    Cybrosys Technologies Pvt. Ltd.
#
#    Copyright (C) 2024-TODAY Cybrosys Technologies(<https://www.cybrosys.com>).
#    Author: Subina P (odoo@cybrosys.com)
#
#    You can modify it under the terms of the GNU AFFERO
#    GENERAL PUBLIC LICENSE (AGPL v3), Version 3.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU AFFERO GENERAL PUBLIC LICENSE (AGPL v3) for more details.
#
#    You should have received a copy of the GNU AFFERO GENERAL PUBLIC LICENSE
#    (AGPL v3) along with this program.
#    If not, see <http://www.gnu.org/licenses/>.
#
################################################################################
{
    "name": "Hospital Management OS",
    "version": "17.0.1.0.0",
    "category": "Services",
    "summary": """Comprehensive Enterprise Healthcare & Clinical Management SaaS System for Odoo 17.""",
    "description": """Hospital Management OS - Advanced Healthcare Platform.
Comprehensive clinical management system covering Outpatient Consultations, Inpatient
Ward & Room Allocations, Physician Practice Dashboards, Reception & Patient Intake Desk,
Clinical Laboratory Pathology, and Pharmacy Dispensary Operations.

Owner & Maintainer: Omar Shehata
Licensed under AGPL-3.""",
    "author": "Omar Shehata",
    "company": "Omar Shehata",
    "maintainer": "Omar Shehata",
    "website": "https://omarshehata.onrender.com",
    "depends": ["website", "hr", "stock", "sale_management"],
    "data": [
        "security/hospital_groups.xml",
        "security/doctor_allocation_security.xml",
        "security/doctor_slot_security.xml",
        "security/patient_lab_test_security.xml",
        "security/ir.model.access.csv",
        "data/ir_sequence_data.xml",
        "data/res_currency_data.xml",
        "data/ir_cron_data.xml",
        "data/website_data.xml",
        "views/menu_views.xml",
        "views/inpatient_surgery_views.xml",
        "views/hospital_bed_views.xml",
        "views/blood_bank_views.xml",
        "views/contra_indication_views.xml",
        "views/booking_success_templates.xml",
        "views/hospital_building_views.xml",
        "views/hospital_degree_views.xml",
        "views/doctor_allocation_views.xml",
        "views/doctor_slot_views.xml",
        "views/hr_employee_views.xml",
        "views/hospital_inpatient_views.xml",
        "views/hospital_insurance_views.xml",
        "views/hospital_laboratory_views.xml",
        "views/patient_lab_test_views.xml",
        "views/lab_test_views.xml",
        "views/lab_test_result_views.xml",
        "views/medicine_brand_views.xml",
        "views/hospital_outpatient_views.xml",
        "views/res_partner_views.xml",
        "views/patient_portal_templates.xml",
        "views/hospital_vaccination_views.xml",
        "views/product_template_views.xml",
        "views/room_facility_views.xml",
        "views/patient_card_templates.xml",
        "views/doctor_specialization_views.xml",
        "views/hospital_pharmacy_views.xml",
        "views/hospital_ward_views.xml",
        "views/patient_booking_templates.xml",
        "views/patient_room_views.xml",
        "views/lab_test_line_views.xml",
        "report/res_partner_reports.xml",
        "report/lab_test_line_reports.xml",
    ],
    "demo": ["demo/hr_job_demo.xml"],
    "assets": {
        "web.assets_frontend": [
            "hospital_managment_os/static/src/js/prescription.js",
            "hospital_managment_os/static/src/js/website_page.js",
        ],
        "web.assets_backend": [
            "hospital_managment_os/static/src/scss/hospital_common.scss",
            "hospital_managment_os/static/src/css/doctor_dashboard.css",
            "hospital_managment_os/static/src/css/reception_dashboard.css",
            "hospital_managment_os/static/src/css/lab_dashboard.css",
            "hospital_managment_os/static/src/css/pharmacy_dashboard.css",
            "hospital_managment_os/static/src/xml/lab_dashboard_templates.xml",
            "hospital_managment_os/static/src/xml/doctor_dashboard_templates.xml",
            "hospital_managment_os/static/src/js/lab_dashboard.js",
            "hospital_managment_os/static/src/js/doctor_dashboard.js",
            "hospital_managment_os/static/src/xml/pharmacy_orderlines.xml",
            "hospital_managment_os/static/src/js/pharmacy_orderlines.js",
            "hospital_managment_os/static/src/xml/pharmacy_dashboard_templates.xml",
            "hospital_managment_os/static/src/js/pharmacy_dashboard.js",
            "hospital_managment_os/static/src/xml/reception_dashboard_templates.xml",
            "hospital_managment_os/static/src/js/reception_dashboard.js",
        ],
    },
    "external_dependencies": {"python": ["python-barcode"]},
    "images": ["static/description/banner.jpg"],
    "license": "AGPL-3",
    "installable": True,
    "auto_install": False,
    "application": True,
}
