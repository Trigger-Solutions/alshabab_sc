# Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt
from frappe.model.naming import make_autoname
import frappe
from datetime import date
import time
from pyqrcode import create as qr_create
import io
import os
from frappe.model.document import Document
#from erpnext.internal_system.doctype.sequence.sequence import make_sequence

class Communicationsmanagement(Document):
	def autoname(self):    
		todays_date = date.today()
  
		if(self.type_code == '1'):
			#frappe.msgprint("TEST")
			sequence = frappe.db.get_single_value('Sequence','serial') + 1
			self.name = str(todays_date.year) + '/' + self.dept_code + '/' + str(sequence)
			frappe.client.set_value('Sequence','Sequence','serial',sequence)
			frappe.msgprint("TEST")
# creating qr code for the Sales Invoice
			qr_code = self.get("qr_code")
			if qr_code and frappe.db.exists({"doctype": "File", "file_url": qr_code}):
				return
			xml = """
				Sender:Al Shabab SC\n
				Date:{posting_date}\n
				Doc Code:{invoice_total}\n
			""".format(posting_date=self.date, invoice_total=self.name)
			qr_image = io.BytesIO()
			xml = qr_create(xml, error='L')
			xml.png(qr_image, scale=2, quiet_zone=1)
			# making file
			filename = f"DOC-QR-CODE-{self.name}.png".replace(os.path.sep, "__")
			_file = frappe.get_doc({
				"doctype": "File",
				"file_name": filename,
				"content": qr_image.getvalue(),
				"is_private": 1
			})

			_file.save()

			# assigning to document
			self.db_set('qr_code', _file.file_url)
			self.notify_update()

		else:
			self.name = str(todays_date.year) + str(todays_date.day) + time.strftime("%H%M%S")