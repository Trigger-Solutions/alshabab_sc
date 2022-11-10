# Copyright (c) 2022, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document

class Sequence(Document):
	def make_sequence(self):
		self.db_set('serial',self.serial+1)
		return self.serial
