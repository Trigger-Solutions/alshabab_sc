# Copyright (c) 2022, Trigger-Solutions and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class RequestsTasks(Document):
	def on_submit(self):
		frappe.db.set_value('Concerned Departments',self.refrence_name,{
				'comment':self.replay,
				'action':"Submitted"
			})

	