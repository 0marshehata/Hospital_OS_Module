/** @odoo-module */
import { registry } from '@web/core/registry';
import { useService } from '@web/core/utils/hooks';
import { Component, onMounted, useState, useRef } from '@odoo/owl';
import { _t } from '@web/core/l10n/translation';
import { PharmacyOrderLines } from './pharmacy_orderlines';

export class PharmacistDashBoard extends Component {
    setup() {
        super.setup(...arguments);
        this.ref = useRef('root');
        this.action = useService('action');
        this.orm = useService('orm');
        this.notification = useService('notification');

        this.state = useState({
            activeTab: 'pos', // 'pos', 'medicines', 'vaccines', 'orders'
            searchQuery: '',
            kpi: {
                totalMedicines: 0,
                totalVaccines: 0,
                ordersToday: 0,
                lowStockAlerts: 0,
            },
            medicines: [],
            vaccines: [],
            recentOrders: [],
            // Point of Sale State
            pos: {
                patientSearch: '',
                selectedPatient: null,
                patientList: [],
                lines: [{ id: Date.now(), product: false, uom: false, qty: 1, price: 0, sub_total: 0 }],
            },
            // Master Props for Child Component
            allProducts: [],
            allUoms: [],
            currencySymbol: 'EGP',
            loading: true,
        });

        onMounted(async () => {
            await this.loadInitialData();
        });
    }

    async loadInitialData() {
        this.state.loading = true;
        const todayStr = new Date().toISOString().split('T')[0];

        try {
            const [
                medicineCount,
                vaccineCount,
                ordersToday,
                medicinesData,
                vaccinesData,
                ordersData,
                patients,
                companyData,
            ] = await Promise.all([
                this.orm.searchCount('product.template', [['hospital_product_type', '=', 'medicine']]),
                this.orm.searchCount('product.template', [['hospital_product_type', '=', 'vaccine']]),
                this.orm.searchCount('sale.order', [['date_order', '>=', todayStr]]),
                this.orm.searchRead(
                    'product.template',
                    [['hospital_product_type', '=', 'medicine']],
                    ['id', 'name', 'list_price', 'qty_available', 'uom_id']
                ),
                this.orm.searchRead(
                    'product.template',
                    [['hospital_product_type', '=', 'vaccine']],
                    ['id', 'name', 'list_price', 'qty_available', 'uom_id']
                ),
                this.orm.searchRead(
                    'sale.order',
                    [],
                    ['id', 'name', 'partner_id', 'date_order', 'amount_total', 'state'],
                    { limit: 12, order: 'id desc' }
                ),
                this.orm.searchRead('res.partner', [['patient_seq', 'not in', ['New', 'Employee', 'User']]], [
                    'id',
                    'name',
                    'patient_seq',
                    'phone',
                    'image_1920',
                ]),
                this.orm.searchRead('res.company', [], ['currency_id'], { limit: 1 }),
            ]);

            const lowStock = (medicinesData || []).filter((m) => m.qty_available <= 5).length;

            this.state.kpi.totalMedicines = medicineCount;
            this.state.kpi.totalVaccines = vaccineCount;
            this.state.kpi.ordersToday = ordersToday;
            this.state.kpi.lowStockAlerts = lowStock;

            this.state.medicines = medicinesData || [];
            this.state.vaccines = vaccinesData || [];
            this.state.recentOrders = ordersData || [];
            this.state.pos.patientList = patients || [];

            // Fetch product variants for order line selection
            this.state.allProducts = await this.orm.searchRead(
                'product.product',
                [['hospital_product_type', 'in', ['medicine', 'vaccine']]],
                ['id', 'name', 'lst_price', 'uom_id']
            );
            this.state.allUoms = await this.orm.searchRead('uom.uom', [], ['id', 'name']);

            if (companyData && companyData.length && companyData[0].currency_id) {
                const cur = await this.orm.read('res.currency', [companyData[0].currency_id[0]], ['symbol']);
                if (cur && cur.length) {
                    this.state.currencySymbol = cur[0].symbol || 'EGP';
                }
            }
        } catch (err) {
            console.error('Error initializing pharmacy dashboard:', err);
        } finally {
            this.state.loading = false;
        }
    }

    get filteredMedicines() {
        if (!this.state.searchQuery.trim()) {
            return this.state.medicines;
        }
        const q = this.state.searchQuery.toLowerCase();
        return this.state.medicines.filter((m) => m.name.toLowerCase().includes(q));
    }

    get filteredVaccines() {
        if (!this.state.searchQuery.trim()) {
            return this.state.vaccines;
        }
        const q = this.state.searchQuery.toLowerCase();
        return this.state.vaccines.filter((v) => v.name.toLowerCase().includes(q));
    }

    get stockHealthRate() {
        if (this.state.medicines.length === 0) {
            return 100;
        }
        const healthy = this.state.medicines.length - this.state.kpi.lowStockAlerts;
        return Math.round((healthy / this.state.medicines.length) * 100);
    }

    setTab(tab) {
        this.state.activeTab = tab;
    }

    onPatientSearchInput(ev) {
        const query = ev.target.value.toLowerCase().trim();
        this.state.pos.patientSearch = query;
        if (!query) {
            this.state.pos.selectedPatient = null;
            return;
        }
        const found = this.state.pos.patientList.find(
            (p) =>
                (p.name && p.name.toLowerCase().includes(query)) ||
                (p.patient_seq && p.patient_seq.toLowerCase().includes(query)) ||
                (p.phone && p.phone.includes(query))
        );
        this.state.pos.selectedPatient = found || null;
    }

    selectPatientDirectly(patient) {
        this.state.pos.selectedPatient = patient;
        this.state.pos.patientSearch = `${patient.patient_seq} - ${patient.name}`;
    }

    addLine() {
        this.state.pos.lines.push({
            id: Date.now() + Math.random(),
            product: false,
            uom: this.state.allUoms && this.state.allUoms[0] ? this.state.allUoms[0].id : false,
            qty: 1,
            price: 0,
            sub_total: 0,
        });
    }

    removeLine(lineId) {
        if (this.state.pos.lines.length > 1) {
            this.state.pos.lines = this.state.pos.lines.filter((l) => l.id !== lineId);
        } else {
            this.state.pos.lines = [
                {
                    id: Date.now(),
                    product: false,
                    uom: this.state.allUoms && this.state.allUoms[0] ? this.state.allUoms[0].id : false,
                    qty: 1,
                    price: 0,
                    sub_total: 0,
                },
            ];
        }
    }

    updateOrderLine(lineState, lineId) {
        const line = this.state.pos.lines.find((l) => l.id === lineId);
        if (line) {
            line.product = lineState.product;
            line.qty = lineState.qty;
            line.uom = lineState.uom;
            line.price = lineState.price;
            line.sub_total = lineState.sub_total;
        }
    }

    get grandTotal() {
        return this.state.pos.lines.reduce((acc, line) => acc + (parseFloat(line.sub_total) || 0), 0).toFixed(2);
    }

    async submitPharmacyOrder() {
        if (!this.state.pos.selectedPatient) {
            this.notification.add(_t('Please search and select a Patient before processing the pharmacy order.'), {
                type: 'danger',
            });
            return;
        }

        const validLines = this.state.pos.lines.filter((l) => l.product && l.qty > 0);
        if (validLines.length === 0) {
            this.notification.add(_t('Please add at least one medication to the prescription order.'), {
                type: 'danger',
            });
            return;
        }

        try {
            const orderLinesData = validLines.map((l) => [
                0,
                0,
                {
                    product_id: parseInt(l.product, 10),
                    product_uom_qty: parseFloat(l.qty),
                    price_unit: parseFloat(l.price),
                },
            ]);

            const orderVals = {
                partner_id: this.state.pos.selectedPatient.id,
                order_line: orderLinesData,
            };

            const orderId = await this.orm.call('sale.order', 'create', [[orderVals]]);
            this.notification.add(_t('Pharmacy sales order successfully created and logged!'), {
                type: 'success',
            });

            // Reset POS form
            this.state.pos.selectedPatient = null;
            this.state.pos.patientSearch = '';
            this.state.pos.lines = [
                {
                    id: Date.now(),
                    product: false,
                    uom: this.state.allUoms && this.state.allUoms[0] ? this.state.allUoms[0].id : false,
                    qty: 1,
                    price: 0,
                    sub_total: 0,
                },
            ];

            await this.loadInitialData();

            // Open the created order
            this.action.doAction({
                type: 'ir.actions.act_window',
                res_model: 'sale.order',
                res_id: orderId[0] || orderId,
                views: [[false, 'form']],
            });
        } catch (err) {
            this.notification.add(_t('Failed to create sales order: ') + (err.message || err), {
                type: 'danger',
            });
        }
    }

    openSaleOrder(orderId) {
        this.action.doAction({
            type: 'ir.actions.act_window',
            res_model: 'sale.order',
            res_id: orderId,
            views: [[false, 'form']],
        });
    }
}

PharmacistDashBoard.template = 'PharmacyDashboard';
PharmacistDashBoard.components = { PharmacyOrderLines };
registry.category('actions').add('pharmacy_dashboard_tags', PharmacistDashBoard);
