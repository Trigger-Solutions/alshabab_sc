// Copyright (c) 2023, Trigger-Solutions and contributors
// For license information, please see license.txt

frappe.ui.form.on('Budget Details', {
	refresh: function(frm) {
		// make filter in account field in child table based on company field
		frm.set_query("account", "budget_items", function(doc, cdt, cdn) {
			var d = locals[cdt][cdn];
			return {
				filters: {
					"company": frm.doc.company
				}
			};
		});	
	},
	validate: function(frm) {
		if (frm.doc.budget_items) {
			var total = 0;
			frm.doc.budget_items.forEach(function(d) {
				d.total = d.jan + d.feb + d.mar + d.apr + d.may + d.jun + d.jul + d.aug + d.sep + d.oct + d.nov + d.dec;
				total += d.total; 
				frm.refresh_field("budget_items");
			});
			frm.set_value("total", total);
		}
	}
});
