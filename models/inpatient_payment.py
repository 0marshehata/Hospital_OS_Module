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
from odoo import fields, models


class InpatientPayment(models.Model):
    """Class holding Payment details of Inpatient"""
    _name = 'inpatient.payment'
    _description = "Inpatient Payments"

    name = fields.Char(string='Name', help='Name of payment')
    inpatient_id = fields.Many2one('hospital.inpatient',
                                   string='Inpatient',
                                   help='Inpatient related to the payment')
    currency_id = fields.Many2one('res.currency',
                                  related='inpatient_id.currency_id',
                                  string='Currency',
                                  help='Currency of payment')
    subtotal = fields.Monetary(string='Subtotal',
                               currency_field='currency_id',
                               help='Total payment')
    date = fields.Datetime(string='Date', help="Date of payment")
    tax_ids = fields.Many2many('account.tax', string='Tax',
                               help='Tax for the test')
