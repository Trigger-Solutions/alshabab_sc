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
		doc = frappe.get_doc("Requests",self.requests)
		if doc.concerned_departments is not None:
			status = 1
			for item in doc.concerned_departments:
				if item.action =="Draft" :
					status = 0
					break
			if status == 1:
				frappe.db.set_value('Requests',self.requests,{
				'workflow_state':"Approved",
				'docstatus': 1
				})
				

	