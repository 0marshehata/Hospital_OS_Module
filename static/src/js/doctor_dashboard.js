/** @odoo-module */
import { registry } from '@web/core/registry';
import { useService } from '@web/core/utils/hooks';
import { Component, onMounted, useState, useRef } from '@odoo/owl';
import { _t } from '@web/core/l10n/translation';

export class DoctorDashboard extends Component {
    setup() {
        super.setup(...arguments);
        this.ref = useRef('root');
        this.orm = useService('orm');
        this.user = useService('user');
        this.actionService = useService('action');

        this.state = useState({
            kpi: {
                todayAppointments: 0,
                pendingConsultations: 0,
                completedConsultations: 0,
                activeInpatients: 0,
                upcomingSurgeries: 0,
            },
            todayConsultations: [],
            upcomingSurgeries: [],
            searchQuery: '',
            loading: true,
        });

        onMounted(async () => {
            await this.loadDashboardData();
        });
    }

    async loadDashboardData() {
        this.state.loading = true;
        const todayStr = new Date().toISOString().split('T')[0];

        try {
            const [
                todayAppts,
                pendingCons,
                completedCons,
                activeInp,
                surgeriesCount,
                consultations,
                surgeriesList,
            ] = await Promise.all([
                this.orm.searchCount('hospital.outpatient', [['op_date', '=', todayStr]]),
                this.orm.searchCount('hospital.outpatient', [
                    ['op_date', '=', todayStr],
                    ['state', 'in', ['draft', 'op']],
                ]),
                this.orm.searchCount('hospital.outpatient', [
                    ['op_date', '=', todayStr],
                    ['state', '=', 'invoice'],
                ]),
                this.orm.searchCount('hospital.inpatient', [['state', 'in', ['reserve', 'admit']]]),
                this.orm.searchCount('inpatient.surgery', [['state', 'in', ['draft', 'confirmed']]]),
                this.orm.searchRead(
                    'hospital.outpatient',
                    [['op_date', '=', todayStr]],
                    ['id', 'op_reference', 'patient_id', 'doctor_id', 'slot', 'state', 'op_date'],
                    { limit: 15, order: 'id desc' }
                ),
                this.orm.searchRead(
                    'inpatient.surgery',
                    [['state', 'in', ['draft', 'confirmed']]],
                    ['id', 'name', 'doctor_id', 'inpatient_id', 'planned_date', 'hours_to_take', 'state'],
                    { limit: 6, order: 'planned_date asc' }
                ),
            ]);

            this.state.kpi.todayAppointments = todayAppts;
            this.state.kpi.pendingConsultations = pendingCons;
            this.state.kpi.completedConsultations = completedCons;
            this.state.kpi.activeInpatients = activeInp;
            this.state.kpi.upcomingSurgeries = surgeriesCount;
            this.state.todayConsultations = consultations;
            this.state.upcomingSurgeries = surgeriesList;
        } catch (error) {
            console.error('Error loading doctor dashboard metrics:', error);
        } finally {
            this.state.loading = false;
        }
    }

    get filteredConsultations() {
        if (!this.state.searchQuery.trim()) {
            return this.state.todayConsultations;
        }
        const q = this.state.searchQuery.toLowerCase();
        return this.state.todayConsultations.filter((c) => {
            const ref = (c.op_reference || '').toLowerCase();
            const pat = (c.patient_id ? c.patient_id[1] : '').toLowerCase();
            const doc = (c.doctor_id ? c.doctor_id[1] : '').toLowerCase();
            return ref.includes(q) || pat.includes(q) || doc.includes(q);
        });
    }

    get completionPercentage() {
        if (this.state.kpi.todayAppointments === 0) {
            return 100;
        }
        return Math.round((this.state.kpi.completedConsultations / this.state.kpi.todayAppointments) * 100);
    }

    // Action handlers for quick navigation
    openOutpatient(resId = false) {
        if (resId) {
            this.actionService.doAction({
                name: _t('Outpatient Consultation'),
                type: 'ir.actions.act_window',
                res_model: 'hospital.outpatient',
                res_id: resId,
                views: [[false, 'form']],
            });
        } else {
            this.fetch_consultation();
        }
    }

    openSurgery(resId = false) {
        if (resId) {
            this.actionService.doAction({
                name: _t('Surgery Procedure'),
                type: 'ir.actions.act_window',
                res_model: 'inpatient.surgery',
                res_id: resId,
                views: [[false, 'form']],
            });
        } else {
            this.fetch_doctors_schedule();
        }
    }

    fetch_consultation() {
        this.actionService.doAction({
            name: _t('Outpatient Consultations'),
            type: 'ir.actions.act_window',
            res_model: 'hospital.outpatient',
            view_mode: 'tree,kanban,form',
            views: [[false, 'list'], [false, 'kanban'], [false, 'form']],
        });
    }

    list_patient_data() {
        this.actionService.doAction({
            name: _t('Patient Directory'),
            type: 'ir.actions.act_window',
            res_model: 'res.partner',
            view_mode: 'kanban,tree,form',
            views: [[false, 'kanban'], [false, 'list'], [false, 'form']],
            domain: [['patient_seq', 'not in', ['New', 'Employee', 'User']]],
        });
    }

    action_list_inpatient() {
        this.actionService.doAction({
            name: _t('Inpatient Admissions'),
            type: 'ir.actions.act_window',
            res_model: 'hospital.inpatient',
            view_mode: 'tree,kanban,form',
            views: [[false, 'list'], [false, 'kanban'], [false, 'form']],
        });
    }

    fetch_doctors_schedule() {
        this.actionService.doAction({
            name: _t('Surgery Schedule'),
            type: 'ir.actions.act_window',
            res_model: 'inpatient.surgery',
            view_mode: 'tree,form',
            views: [[false, 'list'], [false, 'form']],
        });
    }

    fetch_allocation_lines() {
        this.actionService.doAction({
            name: _t('Doctor Allocation & Shifts'),
            type: 'ir.actions.act_window',
            res_model: 'doctor.allocation',
            view_mode: 'tree,form',
            views: [[false, 'list'], [false, 'form']],
        });
    }
}

DoctorDashboard.template = 'DoctorDashboard';
registry.category('actions').add('doctor_dashboard_tags', DoctorDashboard);
