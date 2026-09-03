/** @odoo-module */
import { Component, useState } from '@odoo/owl';
import { Dropdown } from '@web/core/dropdown/dropdown';
import { DropdownItem } from '@web/core/dropdown/dropdown_item';

export class PharmacyOrderLines extends Component {
    setup() {
        super.setup(...arguments);
        this.lineState = useState({
            product: this.props.line.product || false,
            qty: this.props.line.qty || 1,
            uom: this.props.line.uom || (this.props.units && this.props.units[0] ? this.props.units[0].id : 0),
            price: this.props.line.price || 0,
            sub_total: this.props.line.sub_total || 0,
        });
    }

    onProductSelect(medId) {
        this.lineState.product = medId;
        const medicine = (this.props.medicines || []).find((med) => med.id === medId);
        if (medicine) {
            this.lineState.price = medicine.lst_price || medicine.list_price || 0;
            this.lineState.sub_total = this.lineState.qty * this.lineState.price;
        }
        this.props.updateOrderLine(this.lineState, this.props.id);
    }

    onQtyChange(ev) {
        const val = parseInt(ev.target.value, 10);
        this.lineState.qty = isNaN(val) || val < 1 ? 1 : val;
        this.lineState.sub_total = this.lineState.qty * this.lineState.price;
        this.props.updateOrderLine(this.lineState, this.props.id);
    }

    onUomChange(ev) {
        this.lineState.uom = parseInt(ev.target.value, 10);
        this.props.updateOrderLine(this.lineState, this.props.id);
    }

    removeLine() {
        this.props.removeLine(this.props.id);
    }

    get selectedMedicineName() {
        if (!this.lineState.product) {
            return 'Select Medicine...';
        }
        const med = (this.props.medicines || []).find((m) => m.id === this.lineState.product);
        return med ? med.name : 'Select Medicine...';
    }
}

PharmacyOrderLines.template = 'PharmacyOrderLines';
PharmacyOrderLines.components = { Dropdown, DropdownItem };
