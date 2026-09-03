/** @odoo-module */
import { registry } from '@web/core/registry';
import { useService } from '@web/core/utils/hooks';
import { Component, onMounted, useState, useRef } from '@odoo/owl';
import { _t } from '@web/core/l10n/translation';

export class LabDashBoard extends Component {
    setup() {
        super.setup(...arguments);
        this.ref = useRef('root');
        this.action = useService('action');
        this.orm = useService('orm');
        this.notification = useService('notification');

        this.state = useState({
            activeTab: 'confirm', // 'confirm', 'test', 'result'
            searchQuery: '',
            kpi: {
                awaitingConfirm: 0,
                inProgress: 0,
                completed: 0,
                publishedReports: 0,
            },
            confirm_tests: [],
            testing_tests: [],
            results: [],
            selectedTest: null,
            currencySymbol: 'EGP',
            loading: true,
        });

        onMounted(async () => {
            await this.loadInitialData();
        });
    }

    async loadInitialData() {
        this.state.loading = true;
        try {
            const [
                awaitingConfirm,
                inProgress,
                completed,
                publishedReports,
                confirmTests,
                testingTests,
                resultData,
            ] = await Promise.all([
                this.orm.searchCount('patient.lab.test', [['state', '=', 'draft']]),
                this.orm.searchCount('patient.lab.test', [['state', '=', 'test']]),
                this.orm.searchCount('patient.lab.test', [['state', '=', 'completed']]),
                this.orm.searchCount('lab.test.result', []),
                this.orm.call('patient.lab.test', 'search_read', [[['state', '=', 'draft']]]),
                this.orm.call('patient.lab.test', 'search_read', [[['state', '=', 'test']]]),
                this.orm.call('lab.test.result', 'search_read', [[]]),
            ]);

            this.state.kpi.awaitingConfirm = awaitingConfirm;
            this.state.kpi.inProgress = inProgress;
            this.state.kpi.completed = completed;
            this.state.kpi.publishedReports = publishedReports;

            this.state.confirm_tests = confirmTests || [];
            this.state.testing_tests = testingTests || [];
            this.state.results = resultData || [];

            const companyData = await this.orm.searchRead('res.company', [], ['currency_id'], { limit: 1 });
            if (companyData && companyData.length && companyData[0].currency_id) {
                const cur = await this.orm.read('res.currency', [companyData[0].currency_id[0]], ['symbol']);
                if (cur && cur.length) {
                    this.state.currencySymbol = cur[0].symbol || 'EGP';
                }
            }
        } catch (err) {
            console.error('Error loading laboratory dashboard metrics:', err);
        } finally {
            this.state.loading = false;
        }
    }

    get filteredConfirmTests() {
        if (!this.state.searchQuery.trim()) {
            return this.state.confirm_tests;
        }
        const q = this.state.searchQuery.toLowerCase();
        return this.state.confirm_tests.filter((t) => {
            const pat = (t.patient_id ? t.patient_id[1] : '').toLowerCase();
            const lab = (t.lab_id ? t.lab_id[1] : '').toLowerCase();
            return pat.includes(q) || lab.includes(q);
        });
    }

    get totalWorkload() {
        return this.state.kpi.awaitingConfirm + this.state.kpi.inProgress + this.state.kpi.completed;
    }

    get labCompletionRate() {
        if (this.totalWorkload === 0) {
            return 100;
        }
        return Math.round((this.state.kpi.completed / this.totalWorkload) * 100);
    }

    setTab(tab) {
        this.state.activeTab = tab;
        this.state.selectedTest = null;
    }

    async viewPatientDetails(test) {
        this.state.selectedTest = test;
        if (test.patient_id) {
            try {
                const partner = await this.orm.read('res.partner', [test.patient_id[0]], [
                    'name',
                    'phone',
                    'email',
                    'gender',
                    'blood_group',
                    'rh_type',
                    'image_1920',
                ]);
                if (partner && partner.length) {
                    this.state.selectedTest.patient_info = partner[0];
                }
            } catch (e) {
                console.error('Error reading patient profile in lab:', e);
            }
        }
    }

    async confirmLabTest(testId) {
        try {
            await this.orm.call('patient.lab.test', 'write', [[testId], { state: 'test' }]);
            this.notification.add(_t('Lab test confirmed and transferred to laboratory processing queue.'), {
                type: 'success',
            });
            this.state.selectedTest = null;
            await this.loadInitialData();
        } catch (err) {
            this.notification.add(_t('Error confirming test: ') + (err.message || err), {
                type: 'danger',
            });
        }
    }

    openLabTest(testId) {
        this.action.doAction({
            name: _t('Patient Lab Test'),
            type: 'ir.actions.act_window',
            res_model: 'patient.lab.test',
            res_id: testId,
            views: [[false, 'form']],
        });
    }
}

LabDashBoard.template = 'LabDashboard';
registry.category('actions').add('lab_dashboard_tags', LabDashBoard);
