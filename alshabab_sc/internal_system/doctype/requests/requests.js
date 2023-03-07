// Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Requests', {
	before_workflow_action: (frm) => {
		// console.log(frm.doc.workflow_state)
		// console.log(frm.selected_workflow_action)
		// if (
        //     frm.doc.workflow_state == "موجه" &&
        //     frm.selected_workflow_action == "اعتمد"
        // ){
		// 	let status = 0
		// 	if(cur_frm.doc.concerned_departments){
		// 		for(let i=0;i<cur_frm.doc.concerned_departments.length;i++){
		// 			if(cur_frm.doc.concerned_departments[i].action == "Submitted"){
		// 				status = 1
		// 			}
		// 			else{
		// 				status = 0
		// 				break;  
		// 			}
		// 		}
		// 	}
		// 	if(status==0){
		// 		frappe.throw({
		// 			title: __('Mendatory'),
		// 			indicator: 'red',
		// 			message: __("Please Wait All Departments To response Before Approve !!")
		// 		});
		// 		frappe.validated = false;
		// 	}

		// }
	},
	order_type:function(frm){
		//debugger;
		check(frm);
	},
// 	issue_to2:function(frm){
// 	    if(cur_frm.doc.issue_to2){
// 	        frappe.db.get_value('Employee', frm.doc.issue_to2, 'department').then(r=>{
// 	            frm.set_value("department",r.message.department)
// 	            console.log(r)
// 	        })
// 	    }
// 	},
	/*before_save(frm){
		if(frm.doc.__islocal || frappe.new_doc())
	{}
	else
	{
		var attachments = cur_frm.attachments.get_attachments();
		for(var attachment of attachments){
			frappe.call({
				"method": "frappe.client.set_value",
				"args": {
				"doctype": "File",
				"name": attachment.name,
				"fieldname": "is_private",
				"value":'0',
				},
				async: false
			});
			
		}
	}
	},*/
	send_email: function(frm){
		debugger;
		var attachments = cur_frm.attachments.get_attachments();
		for(var attachment of attachments){
			frappe.call({
				"method": "frappe.client.set_value",
				"args": {
				"doctype": "File",
				"name": attachment.name,
				"fieldname": "is_private",
				"value":'0',
				},
				async: false
			});
			
		}
	},
	validate(frm){
	
	   
	
	if (frm.doc.sport == 'اختر اللعبة')  {
		frappe.msgprint('اختر اللعبة');
		validated =false;
		return false;
	}
	if (frm.doc.grade == 'اختر الدرجة')  {
		frappe.msgprint('اختر الدرجة');
		validated =false;
		return false;
	}	  
	if (frm.doc.order_type == 'اختر نوع الطلب')  {
		frappe.msgprint('اختر نوع الطلب');
		validated =false;
		return false;
	}	  	  
	},
	onload(frm)
	{
		// if(!frm.is_new()){
		// 	if(cur_frm.doc.concerned_departments){
		// 		for(let i=0;i<cur_frm.doc.concerned_departments.length;i++){
		// 			if(cur_frm.doc.concerned_departments[i].action == "Submitted"){
		// 				cur_frm.doc.is_approved = 1
		// 			}
		// 			else{
		// 				cur_frm.doc.is_approved = 0
		// 				break;  
		// 			}
		// 		}
		// 		frm.refresh_fields()
		// 		frm.save()
		// 	 }
		// }
		cur_frm.page.add_action_item(__("Approve by AR Lead"), function() {
			frappe.msgprint("Approved");
			cur_frm.trigger('approve');
		});
	},
	refresh(frm) {
		
		//cur_frm.toggle_display("water_section");
		//cur_frm.toggle_display("bus_section");
		//cur_frm.toggle_display("tickets_section");  
		//cur_frm.toggle_display("reward_section"); 
		check(frm);
		debugger;
		if(frappe.user_roles.includes("CEO"))
		{
		cur_frm.page.add_menu_item(__("توجيه"), function() { 
			
					var d = new frappe.ui.Dialog({
					'fields': [
						{'fieldname': 'ht', 'fieldtype': 'HTML'},
						// {'fieldname': 'department',fieldtype: 'Link','options': "Department", 'label' : 'Department'},
						{'fieldname': 'department',fieldtype: 'MultiSelectList',
							get_data: function(txt) {
								return frappe.db.get_link_options('Department', txt, {});}, 'label' : 'Department'},
						{'fieldname': 'comment', 'fieldtype':'Small Text','label':'Add Comment'}
					],
					primary_action: function(values){
						console.log(values)
						if(values.department){
							frm.call('generate_request_task',{
								'department':values.department,
								'comment':values.comment,
								'attachments':cur_frm.attachments.get_attachments()
							}).then(r=>{
								frm.refresh_fields();
								frappe.msgprint(__('تم التوجيه بنجاح'));
								
							});
						} 
		
						// debugger;
						d.hide();
						// cur_frm.set_value("department",values.department.toString());
						//cur_frm.timeline.insert_comment(values.comment.toString());

						refresh_field("department");
						
						// frm.save();
						//show_alert(values.account.toString());
						// show_alert('تم التوجيه بنجاح'); 
						frappe.call({
								"method": "frappe.desk.form.utils.add_comment",
								"args": {
								reference_doctype: cur_frm.doctype,
								reference_name: cur_frm.docname,
								content: values.comment.toString(),
								comment_email: frappe.session.user,
								comment_by: frappe.session.user_fullname,
												}
						});
					}
				});
				d.fields_dict.ht.$wrapper.html('اختر الادارة التي تود توجيه الطلب لها');
				d.show();  
				//cur_frm.trigger('approve');
				cur_frm.reload_doc();

		});

		}
	}
});
function unrequired(frm){
			frm.set_df_property("city", "reqd", 0);
			frm.set_df_property("move_date", "reqd", 0);
			frm.set_df_property("back_date", "reqd", 0);
			frm.set_df_property("purpose", "reqd", 0);
			frm.set_df_property("requester_type", "reqd", 0);
			frm.set_df_property("departure_airport", "reqd", 0);
			frm.set_df_property("passenger_name", "reqd", 0);
			frm.set_df_property("arrival_airport", "reqd", 0);
			frm.set_df_property("card_number", "reqd", 0);
			frm.set_df_property("return_airport", "reqd", 0);
			frm.set_df_property("departure_airport", "reqd", 0);
			frm.set_df_property("return_date", "reqd", 0);		
			frm.set_df_property("reason", "reqd", 0);
			frm.set_df_property("player_name", "reqd", 0);
			frm.set_df_property("reward_amount", "reqd", 0);
			frm.set_df_property("issue_to", "reqd", 0);
			cur_frm.toggle_display("hotel_section",0);
			frm.set_df_property("hotel_name", "reqd", 0);
			frm.set_df_property("reservation_date", "reqd", 0);
			frm.set_df_property("no_of_rooms", "reqd", 0);		    
			cur_frm.toggle_display("issue_section",0);
			cur_frm.toggle_display("wears_section",0);
			cur_frm.toggle_display("custody_section",0);
			cur_frm.toggle_display("contract_section",0);
			cur_frm.toggle_display("meals_section",0);
			cur_frm.toggle_display("visa_section",0);
			cur_frm.toggle_display("follower_section",0);
			frm.set_df_property("quantity", "reqd", 0);
			frm.set_df_property("order_date", "reqd", 0);
			frm.set_df_property("issue_to2", "reqd", 0);
			frm.set_df_property("qty_", "reqd", 0);
			frm.set_df_property("issue_to1", "reqd", 0);	
			frm.set_df_property("employee", "reqd", 0);
			frm.set_df_property("start_date", "reqd", 0);
			frm.set_df_property("end_date", "reqd", 0);
			frm.set_df_property("qty_meals", "reqd", 0);
			frm.set_df_property("responsible", "reqd", 0);
			frm.set_df_property("place", "reqd", 0);		    
			frm.set_df_property("visa_for", "reqd", 0);
			frm.set_df_property("date_of_joining", "reqd", 0);
			frm.set_df_property("visa_charge", "reqd", 0);
			frm.set_df_property("type_of_followers", "reqd", 0);
			frm.set_df_property("required_date", "reqd", 0);
			frm.set_df_property("for", "reqd", 0);            
			frm.set_df_property("end_use_date", "reqd", 0);
			frm.set_df_property("qty", "reqd", 0);
			frm.set_df_property("responsible", "reqd", 0);
			frm.set_df_property("place", "reqd", 0);
			frm.set_df_property("qty_meals", "reqd", 0);
			frm.set_df_property("responsible", "reqd", 0);
			frm.set_df_property("type_of_materials", "reqd", 0);
			frm.set_df_property("issued_to", "reqd", 0);
			frm.set_df_property("issued_date", "reqd", 0);
			
			cur_frm.toggle_display("training_materials_section",0);
			cur_frm.toggle_display("water_section",0);
			cur_frm.toggle_display("bus_section",0);
			cur_frm.toggle_display("reward_section",0); 
			cur_frm.toggle_display("issue_section",0);
			cur_frm.toggle_display("end_contract_section",0);
			cur_frm.toggle_display("follower_section",0);
			cur_frm.toggle_display("maintenance_section",0);
			cur_frm.toggle_display("medical_section",0);
			cur_frm.toggle_display("hotel_section",0);
			cur_frm.toggle_display("tickets_section",0); 
			frm.set_df_property("type_of_materials", "reqd", 0);
			frm.set_df_property("issued_to", "reqd", 0);
			frm.set_df_property("issued_date", "reqd", 0);	        
			frm.set_df_property("medical_for", "reqd", 0);
			frm.set_df_property("medical_date", "reqd", 0);
			frm.set_df_property("medical_type", "reqd", 0);    
			frm.set_df_property("maintenance_type", "reqd", 0);
			frm.set_df_property("maintenance_to", "reqd", 0);
			frm.set_df_property("maintenance_date", "reqd", 0);
			frm.set_df_property("employee_id", "reqd", 0);
			frm.set_df_property("end_contract_date", "reqd", 0);		    
	
}
function check(frm){
		unrequired(frm);
		frm.set_df_property("sport", "reqd", 1);
		frm.set_df_property("grade", "reqd", 1);
		frm.set_df_property("request_date", "reqd", 1);
		cur_frm.toggle_display("issue_section",0);
		if(frm.doc.order_type == 'طلب ماء'){
			cur_frm.toggle_display("water_section",1);
			cur_frm.toggle_display("bus_section",0);
			cur_frm.toggle_display("tickets_section",0);
			cur_frm.toggle_display("reward_section",0); 
			frm.set_df_property("quantity", "reqd", 1);
			frm.set_df_property("order_date", "reqd", 1);		    
		}
		if(frm.doc.order_type == 'طلب مركبة'){
			cur_frm.toggle_display("bus_section",1);
			cur_frm.toggle_display("water_section",0);
			cur_frm.toggle_display("tickets_section",0);
			cur_frm.toggle_display("reward_section",0); 
			cur_frm.toggle_display("issue_section",0);
			frm.set_df_property("city", "reqd", 1);
			frm.set_df_property("move_date", "reqd", 1);
			frm.set_df_property("back_date", "reqd", 1);
			frm.set_df_property("purpose", "reqd", 1);

		}
		if(frm.doc.order_type == 'طلب حجز مرافق'){
			unrequired(frm);
			cur_frm.toggle_display("bus_section",0);
			cur_frm.toggle_display("water_section",0);
			cur_frm.toggle_display("tickets_section",0);
			cur_frm.toggle_display("reward_section",0); 
			cur_frm.toggle_display("issue_section",0);
			cur_frm.toggle_display("follower_section",1);
			frm.set_df_property("type_of_followers", "reqd", 1);
			frm.set_df_property("required_date", "reqd", 1);
			frm.set_df_property("for", "reqd", 1);            
			frm.set_df_property("end_use_date", "reqd", 1);
			frm.set_df_property("no_of_followes", "reqd", 1);
		}	    
		if(frm.doc.order_type == 'طلب حجوزات طيران'){
			cur_frm.toggle_display("tickets_section",1); 
			cur_frm.toggle_display("water_section",0);
			cur_frm.toggle_display("bus_section",0);
			cur_frm.toggle_display("reward_section",0); 
			cur_frm.toggle_display("issue_section",0);
			frm.set_df_property("requester_type", "reqd", 1);
			frm.set_df_property("departure_airport", "reqd", 1);
			frm.set_df_property("passenger_name", "reqd", 1);
			frm.set_df_property("arrival_airport", "reqd", 1);
			frm.set_df_property("card_number", "reqd", 1);
			frm.set_df_property("return_airport", "reqd", 1);
			frm.set_df_property("departure_airport", "reqd", 1);
			frm.set_df_property("return_date", "reqd", 1);		    
		}
		if(frm.doc.order_type == 'طلب مكافأة'){
			cur_frm.toggle_display("reward_section",1); 
			cur_frm.toggle_display("water_section",0);
			cur_frm.toggle_display("bus_section",0);
			cur_frm.toggle_display("tickets_section",0); 
			cur_frm.toggle_display("issue_section",0);
			frm.set_df_property("reason", "reqd", 1);
			frm.set_df_property("player_name", "reqd", 1);
			frm.set_df_property("reward_amount", "reqd", 1);
		}
		if(frm.doc.order_type == 'اختر نوع الطلب'){
			cur_frm.toggle_display("reward_section",0); 
			cur_frm.toggle_display("water_section",0);
			cur_frm.toggle_display("bus_section",0);
			cur_frm.toggle_display("tickets_section",0); 
			cur_frm.toggle_display("issue_section",0);
			frm.set_df_property("reason", "reqd", 0);
			frm.set_df_property("player_name", "reqd", 0);
			frm.set_df_property("reward_amount", "reqd", 0);
		}
		if(frm.doc.order_type == 'طلب أمر صرف'){
			cur_frm.toggle_display("reward_section",0); 
			cur_frm.toggle_display("water_section",0);
			cur_frm.toggle_display("bus_section",0);
			cur_frm.toggle_display("tickets_section",0); 
			frm.set_df_property("reason", "reqd", 0);
			frm.set_df_property("player_name", "reqd", 0);
			frm.set_df_property("reward_amount", "reqd", 0);
			frm.set_df_property("issue_to", "reqd", 1);
			cur_frm.toggle_display("issue_section",1);
		}
		if(frm.doc.order_type == 'طلب ملابس'){
			cur_frm.toggle_display("reward_section",0); 
			cur_frm.toggle_display("water_section",0);
			cur_frm.toggle_display("bus_section",0);
			cur_frm.toggle_display("tickets_section",0); 
			frm.set_df_property("reason", "reqd", 0);
			frm.set_df_property("player_name", "reqd", 0);
			frm.set_df_property("qty_", "reqd", 1);
			frm.set_df_property("issue_to1", "reqd", 1);
			cur_frm.toggle_display("issue_section",0);
			cur_frm.toggle_display("wears_section",1);
			
		}
		if(frm.doc.order_type == 'طلب عهدة'){
			cur_frm.toggle_display("reward_section",0); 
			cur_frm.toggle_display("water_section",0);
			cur_frm.toggle_display("bus_section",0);
			cur_frm.toggle_display("tickets_section",0); 
			frm.set_df_property("reason", "reqd", 0);
			frm.set_df_property("player_name", "reqd", 0);
			frm.set_df_property("reward_amount", "reqd", 0);
			frm.set_df_property("issue_to2", "reqd", 1);
			cur_frm.toggle_display("issue_section",0);
			cur_frm.toggle_display("custody_section",1);
		}
		if(frm.doc.order_type == 'طلب انهاء تعاقد'){
			cur_frm.toggle_display("reward_section",0); 
			cur_frm.toggle_display("water_section",0);
			cur_frm.toggle_display("bus_section",0);
			cur_frm.toggle_display("tickets_section",0); 
			frm.set_df_property("reason", "reqd", 0);
			frm.set_df_property("player_name", "reqd", 0);
			frm.set_df_property("reward_amount", "reqd", 0);
			frm.set_df_property("employee_id", "reqd", 1);
			frm.set_df_property("end_contract_date", "reqd", 1);
			//frm.set_df_property("end_date", "reqd", 1);
			cur_frm.toggle_display("issue_section",0);
			cur_frm.toggle_display("end_contract_section",1);
		}

		if(frm.doc.order_type == 'طلب تعاقد'){
			cur_frm.toggle_display("reward_section",0); 
			cur_frm.toggle_display("water_section",0);
			cur_frm.toggle_display("bus_section",0);
			cur_frm.toggle_display("tickets_section",0); 
			frm.set_df_property("reason", "reqd", 0);
			frm.set_df_property("player_name", "reqd", 0);
			frm.set_df_property("reward_amount", "reqd", 0);
			frm.set_df_property("employee", "reqd", 1);
			frm.set_df_property("start_date", "reqd", 1);
			frm.set_df_property("end_date", "reqd", 1);
			cur_frm.toggle_display("issue_section",0);
			cur_frm.toggle_display("contract_section",1);
		}
		if(frm.doc.order_type == 'طلب وجبات'){
			cur_frm.toggle_display("reward_section",0); 
			cur_frm.toggle_display("water_section",0);
			cur_frm.toggle_display("bus_section",0);
			cur_frm.toggle_display("tickets_section",0); 
			frm.set_df_property("reason", "reqd", 0);
			frm.set_df_property("qty_meals", "reqd", 1);
			frm.set_df_property("responsible", "reqd", 1);
			frm.set_df_property("place", "reqd", 1);
			cur_frm.toggle_display("meals_section",1);
		}
		if(frm.doc.order_type == 'طلب أدوات تدريب'){
			cur_frm.toggle_display("reward_section",0); 
			cur_frm.toggle_display("water_section",0);
			cur_frm.toggle_display("bus_section",0);
			cur_frm.toggle_display("tickets_section",0); 
			frm.set_df_property("reason", "reqd", 0);
			frm.set_df_property("type_of_materials", "reqd", 1);
			frm.set_df_property("issued_to", "reqd", 1);
			frm.set_df_property("issued_date", "reqd", 1);
			cur_frm.toggle_display("training_materials_section",1);
		}	   
		if(frm.doc.order_type == 'طلب صيانة'){
			cur_frm.toggle_display("reward_section",0); 
			cur_frm.toggle_display("water_section",0);
			cur_frm.toggle_display("bus_section",0);
			cur_frm.toggle_display("tickets_section",0); 
			frm.set_df_property("reason", "reqd", 0);
			frm.set_df_property("maintenance_type", "reqd", 1);
			frm.set_df_property("maintenance_to", "reqd", 1);
			frm.set_df_property("maintenance_date", "reqd", 1);
			cur_frm.toggle_display("maintenance_section",1);
		}		 
		if(frm.doc.order_type == 'طلب خدمات طبية'){
			cur_frm.toggle_display("reward_section",0); 
			cur_frm.toggle_display("water_section",0);
			cur_frm.toggle_display("bus_section",0);
			cur_frm.toggle_display("tickets_section",0); 
			frm.set_df_property("reason", "reqd", 0);
			frm.set_df_property("medical_for", "reqd", 1);
			frm.set_df_property("medical_date", "reqd", 1);
			frm.set_df_property("medical_type", "reqd", 1);
			cur_frm.toggle_display("medical_section",1);
		}		    
	if(frm.doc.order_type == 'طلب تأشيرة'){
			cur_frm.toggle_display("visa_section",1);
			frm.set_df_property("visa_for", "reqd", 1);
			frm.set_df_property("date_of_joining", "reqd", 1);
			frm.set_df_property("visa_charge", "reqd", 1);	       	
	}
	if(frm.doc.order_type == 'طلب حجز فندق'){
			cur_frm.toggle_display("hotel_section",1);
			frm.set_df_property("hotel_name", "reqd", 1);
			frm.set_df_property("reservation_date", "reqd", 1);
			frm.set_df_property("no_of_rooms", "reqd", 1);	       	
	}
	if(frm.doc.order_type == 'طلب دعم فنى'){
			return;
	}	   
}
