/** @odoo-module */
import { registry } from '@web/core/registry';
import { useService } from '@web/core/utils/hooks';
import { Component, onMounted, useState, useRef } from '@odoo/owl';
import { _t } from '@web/core/l10n/translation';

export class ReceptionDashBoard extends Component {
    setup() {
        super.setup(...arguments);
        this.ref = useRef('root');
        this.action = useService('action');
        this.orm = useService('orm');
        this.notification = useService('notification');

        const todayStr = new Date().toISOString().split('T')[0];

        this.state = useState({
            activeTab: 'patient', // 'patient', 'appointment', 'inpatient', 'room_ward'
            roomWardTab: 'room',  // 'room', 'ward'
            kpi: {
                todayBookings: 0,
                waitingConsultations: 0,
                admittedInpatients: 0,
                availableDoctors: 0,
            },
            // Form data: New Patient
            patientForm: {
                name: '',
                phone: '',
                email: '',
                date_of_birth: '',
                blood_group: 'a',
                rh_type: '+',
                gender: 'male',
                marital_status: 'married',
                image_1920: false,
            },
            // Form data: Outpatient
            opForm: {
                hasCard: 'dont_have_card',
                patient_id: '',
                name: '',
                phone: '',
                dob: '',
                blood_group: 'a',
                rh_type: '+',
                gender: 'male',
                date: todayStr,
                reason: '',
                slot: '0.00',
                doctor_id: '',
            },
            // Form data: Inpatient
            inpatientForm: {
                patient_id: '',
                reason_of_admission: '',
                admission_type: 'routine',
                attending_doctor_id: '',
            },
            // Master lists
            patient_lst: [],
            dr_lst: [],
            attending_dr_lst: [],
            ward_data: [],
            room_data: [],
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
                todayBookings,
                waitingConsultations,
                admittedInpatients,
                availableDoctors,
                patients,
                allocations,
                doctors,
                wards,
                rooms,
            ] = await Promise.all([
                this.orm.searchCount('hospital.outpatient', [['op_date', '=', todayStr]]),
                this.orm.searchCount('hospital.outpatient', [
                    ['op_date', '=', todayStr],
                    ['state', 'in', ['draft', 'op']],
                ]),
                this.orm.searchCount('hospital.inpatient', [['state', '=', 'admit']]),
                this.orm.searchCount('doctor.allocation', [
                    ['date', '=', todayStr],
                    ['slot_remaining', '>', 0],
                ]),
                this.orm.call('res.partner', 'fetch_patient_data', []),
                this.orm.call('doctor.allocation', 'search_read', [[]]),
                this.orm.call('hr.employee', 'search_read', [[['job_id.name', '=', 'Doctor']]]),
                this.orm.call('hospital.ward', 'search_read', [[]]),
                this.orm.call('patient.room', 'search_read', [[]]),
            ]);

            this.state.kpi.todayBookings = todayBookings;
            this.state.kpi.waitingConsultations = waitingConsultations;
            this.state.kpi.admittedInpatients = admittedInpatients;
            this.state.kpi.availableDoctors = availableDoctors;

            this.state.patient_lst = patients || [];
            this.state.dr_lst = allocations || [];
            this.state.attending_dr_lst = doctors || [];
            this.state.ward_data = wards || [];
            this.state.room_data = rooms || [];

            const companyData = await this.orm.searchRead('res.company', [], ['currency_id'], { limit: 1 });
            if (companyData && companyData.length && companyData[0].currency_id) {
                const cur = await this.orm.read('res.currency', [companyData[0].currency_id[0]], ['symbol']);
                if (cur && cur.length) {
                    this.state.currencySymbol = cur[0].symbol || 'EGP';
                }
            }
        } catch (err) {
            console.error('Error initializing reception dashboard:', err);
        } finally {
            this.state.loading = false;
        }
    }

    get roomOccupancyRate() {
        if (this.state.room_data.length === 0) {
            return 0;
        }
        const occupied = this.state.room_data.filter((r) => r.state === 'occupied').length;
        return Math.round((occupied / this.state.room_data.length) * 100);
    }

    get availableRoomsCount() {
        return this.state.room_data.filter((r) => r.state === 'available').length;
    }

    setTab(tabName) {
        this.state.activeTab = tabName;
    }

    setRoomWardTab(tabName) {
        this.state.roomWardTab = tabName;
    }

    // Handle patient image upload
    onPatientImageChange(ev) {
        const file = ev.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Data = e.target.result.split(',')[1];
                this.state.patientForm.image_1920 = base64Data;
            };
            reader.readAsDataURL(file);
        }
    }

    // Save newly created patient
    async savePatient() {
        const form = this.state.patientForm;
        if (!form.name.trim() || !form.phone.trim()) {
            this.notification.add(_t('Please fill in required fields: Patient Name and Phone Number.'), {
                type: 'danger',
            });
            return;
        }

        const data = {
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim() || false,
            blood_group: form.blood_group,
            rh_type: form.rh_type,
            gender: form.gender,
            marital_status: form.marital_status,
            image_1920: form.image_1920 || false,
        };
        if (form.date_of_birth) {
            data.date_of_birth = form.date_of_birth;
        }

        try {
            await this.orm.call('res.partner', 'create', [[data]]);
            this.notification.add(_t('Patient successfully registered into the hospital system!'), {
                type: 'success',
            });
            // Reset form
            this.state.patientForm = {
                name: '',
                phone: '',
                email: '',
                date_of_birth: '',
                blood_group: 'a',
                rh_type: '+',
                gender: 'male',
                marital_status: 'married',
                image_1920: false,
            };
            // Refresh patient list
            const patients = await this.orm.call('res.partner', 'fetch_patient_data', []);
            this.state.patient_lst = patients || [];
        } catch (err) {
            this.notification.add(_t('Failed to register patient: ') + (err.message || err), {
                type: 'danger',
            });
        }
    }

    // Fetch patient data when selected in Outpatient booking
    async onPatientSelect(ev) {
        const patientId = ev.target.value;
        this.state.opForm.patient_id = patientId;
        if (!patientId) {
            return;
        }

        try {
            const res = await this.orm.call('res.partner', 'reception_op_barcode', [
                { patient_data: patientId, 'patient-phone': false },
            ]);
            if (res) {
                this.state.opForm.name = res.name || '';
                this.state.opForm.dob = res.date_of_birth || '';
                this.state.opForm.blood_group = res.blood_group || 'a';
                this.state.opForm.gender = res.gender || 'male';
                if (res.phone) {
                    this.state.opForm.phone = res.phone;
                }
            }
        } catch (err) {
            console.error('Error fetching patient details:', err);
        }
    }

    // Save Outpatient consultation
    async saveOutPatient() {
        const form = this.state.opForm;
        if (!form.name || !form.doctor_id || !form.date) {
            this.notification.add(_t('Please specify Patient Name, Attending Doctor, and Date.'), {
                type: 'danger',
            });
            return;
        }

        const data = {
            op_name: form.name,
            op_phone: form.phone,
            op_blood_group: form.blood_group,
            op_rh: form.rh_type,
            op_gender: form.gender,
            patient_id: form.patient_id ? parseInt(form.patient_id, 10) : false,
            date: form.date,
            reason: form.reason,
            slot: parseFloat(form.slot) || 0.0,
            doctor: parseInt(form.doctor_id, 10),
        };
        if (form.dob) {
            data.op_dob = form.dob;
        }

        try {
            await this.orm.call('res.partner', 'create_patient', [data]);
            this.notification.add(_t('Outpatient appointment successfully booked!'), {
                type: 'success',
            });
            // Reset form
            this.state.opForm = {
                hasCard: 'dont_have_card',
                patient_id: '',
                name: '',
                phone: '',
                dob: '',
                blood_group: 'a',
                rh_type: '+',
                gender: 'male',
                date: new Date().toISOString().split('T')[0],
                reason: '',
                slot: '0.00',
                doctor_id: '',
            };
            const todayStr = new Date().toISOString().split('T')[0];
            this.state.kpi.todayBookings = await this.orm.searchCount('hospital.outpatient', [
                ['op_date', '=', todayStr],
            ]);
        } catch (err) {
            this.notification.add(_t('Error creating outpatient booking: ') + (err.message || err), {
                type: 'danger',
            });
        }
    }

    // Save Inpatient admission
    async saveInPatient() {
        const form = this.state.inpatientForm;
        if (!form.patient_id || !form.attending_doctor_id || !form.admission_type) {
            this.notification.add(_t('Please select a Patient, Admission Type, and Attending Doctor.'), {
                type: 'danger',
            });
            return;
        }

        const data = {
            patient_id: parseInt(form.patient_id, 10),
            reason_of_admission: form.reason_of_admission,
            admission_type: form.admission_type,
            attending_doctor_id: parseInt(form.attending_doctor_id, 10),
        };

        try {
            await this.orm.call('hospital.inpatient', 'create_new_in_patient', [null, data]);
            this.notification.add(_t('Inpatient admission record successfully created!'), {
                type: 'success',
            });
            this.state.inpatientForm = {
                patient_id: '',
                reason_of_admission: '',
                admission_type: 'routine',
                attending_doctor_id: '',
            };
            this.state.kpi.admittedInpatients = await this.orm.searchCount('hospital.inpatient', [
                ['state', '=', 'admit'],
            ]);
        } catch (err) {
            this.notification.add(_t('Error creating inpatient admission: ') + (err.message || err), {
                type: 'danger',
            });
        }
    }
}

ReceptionDashBoard.template = 'ReceptionDashboard';
registry.category('actions').add('reception_dashboard_tags', ReceptionDashBoard);
