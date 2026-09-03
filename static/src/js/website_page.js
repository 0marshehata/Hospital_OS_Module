/** @odoo-module **/
import publicWidget from "@web/legacy/js/public/public_widget";
import { jsonrpc } from "@web/core/network/rpc_service";

publicWidget.registry.doctorWidget = publicWidget.Widget.extend({
    selector: '#booking_form',
    events: {
        'change #booking_date': 'changeBookingDate',
        'change #doctor-department': 'updateDoctorOptions',
    },
    start() {
        this.changeBookingDate();
        return this._super(...arguments);
    },
    async changeBookingDate() {
        const self = this;
        const selectedDate = this.$('#booking_date').val();
        if (!selectedDate) {
            return;
        }
        try {
            const data = await jsonrpc('/patient_booking/get_doctors', {
                selected_date: selectedDate,
                department: false,
            });
            const $doctorSelect = self.$('#doctor-name');
            $doctorSelect.empty();
            $doctorSelect.append($('<option>', { value: '', text: 'Select Doctor...' }));
            if (data && data.doctors) {
                data.doctors.forEach((doctor) => {
                    $doctorSelect.append($('<option>', {
                        value: doctor.id,
                        text: doctor.name,
                    }));
                });
            }

            const $deptSelect = self.$('#doctor-department');
            $deptSelect.empty();
            $deptSelect.append($('<option>', { value: '', text: 'All Departments' }));
            if (data && data.departments) {
                data.departments.forEach((dep) => {
                    $deptSelect.append($('<option>', {
                        value: dep.id,
                        text: dep.name,
                    }));
                });
            }
        } catch (err) {
            console.error('Error fetching doctors:', err);
        }
    },
    async updateDoctorOptions() {
        const self = this;
        const selectedDate = this.$('#booking_date').val();
        const department = this.$('#doctor-department').val();
        try {
            const data = await jsonrpc('/patient_booking/get_doctors', {
                selected_date: selectedDate,
                department: department || false,
            });
            const $doctorSelect = self.$('#doctor-name');
            $doctorSelect.empty();
            $doctorSelect.append($('<option>', { value: '', text: 'Select Doctor...' }));
            if (data && data.doctors) {
                data.doctors.forEach((doctor) => {
                    $doctorSelect.append($('<option>', {
                        value: doctor.id,
                        text: doctor.name,
                    }));
                });
            }
        } catch (err) {
            console.error('Error updating doctor options:', err);
        }
    },
});

export default publicWidget.registry.doctorWidget;
