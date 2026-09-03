/** @odoo-module **/
import publicWidget from "@web/legacy/js/public/public_widget";
import { jsonrpc } from "@web/core/network/rpc_service";

publicWidget.registry.prescriptionWidget = publicWidget.Widget.extend({
    selector: '#my_prescriptions',
    events: {
        'click .pr_download': 'onDownloadClick',
    },
    async onDownloadClick(ev) {
        ev.preventDefault();
        const recId = parseInt($(ev.currentTarget).data('id'), 10);
        if (!recId) {
            return;
        }
        try {
            const result = await jsonrpc('/web/dataset/call_kw/hospital.outpatient/create_file', {
                model: 'hospital.outpatient',
                method: 'create_file',
                args: [recId],
                kwargs: {},
            });
            if (result && result.url) {
                window.open(result.url, '_blank');
            }
        } catch (error) {
            console.error('Error downloading prescription:', error);
        }
    },
});

export default publicWidget.registry.prescriptionWidget;
