
$(function() {
	loadMeta();
	selectL2Schema();
	
	createNext();
	getSQL();
	getReport();
	deleteBuildsheet();
	// getBuildsheet();
	$('.getbuildsheet').off('click');
	$('.getbuildsheet').on('click', function(e) {
		
		// getbuildsheet = this
		getBuildsheet($(this).attr('aco_id'),$(this).attr('source_id'),$(this).attr('workflow_id'));


	});
	$('.edit').off('click');
	$('.edit').on('click', function(e) {
		window.location.href= window.location.origin+'/buildsheets/'+$(this).attr('meta_id')+'/update/'
		// editBuildsheet( $(this).attr('meta_id'))
	});
	
	$('#closeReport').off('click');
	$('#closeReport').on('click', function(e) {
		$('#report-modal').attr('hidden','');
		$(".container").css("overflow", "");
		$('.box').jmspinner(false);
		$('.box').attr("hidden",'');
	});
	$('.deleteOption').off('click');
	$('.deleteOption').on('click', function(e) {
		$('.delete').attr('meta_id',$(this).attr('meta_id'));
		$('#delete-modal').removeAttr('hidden').modal('show');

	});
	
	$('.cancelDelete,.closeDelete').off('click');
	$('.cancelDelete,.closeDelete').on('click', function(e) {
		$('#delete-modal').attr('hidden','');

	});

});

function buildsheetPage() {
	window.location.href= window.location.origin+'/buildsheets/'

}
function createPage() {
	window.location.href= window.location.origin+'/create/'
}
function setError(where, what) {
	var parent = $(where).parents('.form-group:eq(0)');
	parent.addClass('has-error').append('<span class="help-block">' + what + '</span>');
	toastr.error(what);
}

function unsetError(where) {
	var parent = $(where).parents('.form-group:eq(0)');
	parent.removeClass('has-error').find('.help-block').remove();
}





function validate(){
	unsetError($('#source_id'));
	unsetError($('#source_name'));
	unsetError($('#source_type'));
	unsetError($('#workflow_id'));
	unsetError($('#author'));
	unsetError($('#vendor_version'));
	unsetError($('#vendor_name'));
	unsetError($('#l2_table'));
	unsetError($('#workspace_id'));
	unsetError($('#aco_id'));
	unsetError($('#aco_nm'));
	unsetError($('#pipeline_id'));

	if ($('#source_id').val()==''){
		setError($('#source_id'),'Please enter Source ID.');
		return false;
	}
	if ($('#source_name').val()==''){
		setError($('#source_name'),'Please enter Source Name.');
		return false;
	}
	if ($('#source_type').val()==''){
		setError($('#source_type'),'Please enter Source Type.');
		return false;
	}
	if ($('#workflow_id').val()==''){
		setError($('#workflow_id'),'Please enter Workflow ID.');
		return false;
	}
	if ($('#author').val()==''){
		setError($('#author'),'Please enter Author.');
		return false;
	}
	if ($("#l2_table option:selected").val()==''){
		setError($('#l2_table'),'Please select L2 Table.');
		return false;
	}
	if ($('#l2_schema').val()==''){
		setError($('#l2_schema'),'Please L2 Schema.');
		return false;
	}
	if($("#l2_table option:selected").val()=='pd_activity'){
		if($('#pd_category').val()==''){
			setError($('#pd_category'),'Please select PD Category.');
			return false;	
		}
	}
	if ($('#vendor_name').val()==''){
		setError($('#vendor_name'),'Please enter Vendor Name.');
		return false;
	}
	if ($('#aco_id').val()==''){
		setError($('#aco_id'),'Please enter ACO ID.');
		return false;
	}
	if ($('#aco_nm').val()==''){
		setError($('#aco_nm'),'Please enter ACO Name.');
		return false;
	}
	return true;
}


function selectL2Schema(){
	$('#l2_schema').off('change');
	$('#l2_schema').on('change', function(e) {
		e.preventDefault();
		$('#l2_table').html('<option value="">Select table</option>');
		if ($("#l2_schema option:selected").val()!=''){
			$.ajax({
				'type'	:	'post',
				'url'	:	'/create/',
				'data'	:	{schema:$("#l2_schema option:selected").val() , action: 'getL2Tables','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {


				var l2_select ='<option value="">Select table</option>'
				$.each(res.l2_tables, function( index, value){
					l2_select +='<option value="'+value+'">'+value+'</option>'
				});
				$('#l2_table').html(l2_select);
				selectL2Table();
				if(window.selectedL2_table!=''){
					$('#l2_table').val(window.selectedL2_table).trigger("change").prop('disabled', 'disabled');
					window.selectedL2_table=''
				}

			});
		}});

}

 /*Select L1 Schema*/
function selectDefaultL1Schema() {
	$('#dflt_l1_schema').off('change');
	$('#dflt_l1_schema').on('change', function(e) {
		current =this
		if($('#dflt_l1_schema').val()!=''){
			$.ajax({
				'type'	:	'post',
				'url'	:	'/create/',
				'data'	:	{schema:$(current).val() , action: 'getSchemaAll','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				if (res.status=='2'){
					window.defaultL1SchemaAll = res.schema_all
					toSetDefaultOption();
					loadBuild();
				}
			});
			
		}
	});	
}

function sourceColumn(l2_column){
	// console.log($(l2_column).val());
	meta_select = '<option value="Meta Column" selected>Meta Column</option>'
	schema_select = '<option value="Meta Schema" selected>Meta Schema</option>'

	if ($(l2_column).val()=='source_id'){
		meta_column = '<option value="source_id" selected>source_id</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#source_id').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.l1_table').html(meta_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='source_name'){
		meta_column = '<option value="source_name" selected>source_name</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#source_name').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.l1_table').html(meta_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='source_type'){
		meta_column = '<option value="source_type" selected>source_type</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#source_type').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.l1_table').html(meta_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='workflow_id'){
		// console.log("im in workflow_id");
		meta_column = '<option value="workflow_id" selected>workflow_id</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#workflow_id').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.l1_table').html(meta_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='author'){
		meta_column = '<option value="author" selected>author</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#author').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.l1_table').html(meta_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='ingestion_datetime'){
		meta_column = '<option value="ingestion_datetime" selected>ingestion_datetime</option>'
		$(l2_column).parent().parent().find('.transform').val('').attr('readonly','true');
		$(l2_column).parent().parent().find('.l1_table').html(meta_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("GETDATE()").attr('disabled',true);
	}
	if ($(l2_column).val()=='vendor_version'){
		meta_column = '<option value="vendor_version" selected>vendor_version</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#vendor_version').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.l1_table').html(meta_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='vendor_name'){
		meta_column = '<option value="vendor_name" selected>vendor_name</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#vendor_name').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.l1_table').html(meta_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='aco_id'){
		meta_column = '<option value="aco_id" selected>aco_id</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#aco_id').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.l1_table').html(meta_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='aco_name'){
		meta_column = '<option value="aco_name" selected>aco_name</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#aco_nm').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.l1_table').html(meta_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='source_file_name'){
		meta_column = '<option value="source_file_name" selected>source_file_name</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+'BLANK').attr('readonly','true');
		$(l2_column).parent().parent().find('.l1_table').html(meta_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='workspace_id'){
		meta_column = '<option value="workspace_id" selected>workspace_id</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#workspace_id').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.l1_table').html(meta_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='indata_created_on'){
		meta_column = '<option value="indata_created_on" selected>indata_created_on</option>'
		$(l2_column).parent().parent().find('.transform').val('null').attr('readonly','true');
		$(l2_column).parent().parent().find('.l1_table').html(meta_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='pipeline_id'){
		meta_column = '<option value="pipeline_id" selected>pipeline_id</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#pipeline_id').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.l1_table').html(meta_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='source_file_name'){
		meta_column = '<option value="source_file_name" selected>source_file_name</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#pipeline_id').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.l1_table').html(meta_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true);
		$(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
}


function selectL2Table() {
	$('#l2_table').off('change');
	$('#l2_table').on('change', function(e) {
		e.preventDefault();
		$('#loadrows').html('');
		$('#pd_category').html('');
		$('#pd_category').parent().attr('hidden','')
		
		if ($("#l2_table option:selected").val()!='' /* && $("#l2_table option:selected").val()!='pd_activity'*/){
			var req = {}; 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/create/',
				'data'	:	{schema:$("#l2_schema option:selected").val(),table:$("#l2_table option:selected").val() , action: 'getColumns','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				window.schemas = res.schemas
				var schema_select = '<option value="">Select Schema</option>'
				$.each(res.schemas, function(index, value){
					schema_select +='<option value="'+value+'">'+value+'</option>'
				})
				$('.jschema_1,.jschema_2,.wschema,.fschema').html(schema_select);

				var l1_select ='<option value="">Select table</option>'

				var rule_select ='<option value="">Select Rule</option>'

				$.each(res.rules, function(index, value){
					rule_select +='<option value="'+value+'">'+value.toUpperCase()+'</option>'
				})

				$.each(res.columns, function( index, value ) {
					$('#loadrows').append('<div class="row"><div class="col-sm"><select class="form-control-sm l1_schema" > '+schema_select+'</select> </div><div class="col-sm"><select class="form-control-sm l1_table" > '+l1_select+'</select> </div><div class="col-sm"><select class="form-control-sm l1_column" > <option value="">Select Column</option></select> </div><div class="col-sm"><select class="form-control-sm rule">'+rule_select+' </select> </div><div class="col-sm"><input type="text" class="form-control-sm transform" Placeholder="Add Transformation" ></div><div class="col-sm"><input type="text" class="form-control-sm l2_table" value ='+$("#l2_table option:selected").val()+' readonly="true"></div><div class="col-sm"><input type="text" class="form-control-sm l2_column" value="'+value['column']+'" id='+value['column']+'l2 readonly="true"> </div><div class="col-sm"><input type="text" class="form-control-sm l2_columntype" value="'+value['type']+'" readonly="true"> </div></div>');
				});

			});
			
		}
		

	
	});

}

function toSetDefaultOption(){
	defaultL1SchemaAll = window.defaultL1SchemaAll
	$('.l1_schema,.fschema').val($('#dflt_l1_schema').val()); // Set l1 schema to default schema

	table_select = '<option value="">Select Table</option>';
	$.each(Object.keys(defaultL1SchemaAll[Object.keys(defaultL1SchemaAll)[0]]), function(i,v){
		table_select += '<option value="'+v+'">'+v+'</option>'
	});								
	$('.l1_table,.from_table').html(table_select); // Set l1 tables


	$('.l1_table').off('change');                  // Set l1 column
	$('.l1_table').on('change', function(e) {
		column_select = '<option value="">Select Column</option>';
		$(this).parent().parent().find('.l1_column').html(column_select);
		if($(this).parent().parent().find('.l1_schema').val()== $('#dflt_l1_schema').val()){
			if($(this).val()!=''){
				
				$.each(defaultL1SchemaAll[Object.keys(defaultL1SchemaAll)[0]][$(this).val()], function(i,v){
					column_select += '<option value="'+v['column']+'">'+v['column']+'</option>'
				});								
				$(this).parent().parent().find('.l1_column').html(column_select);
			}	
		}
	});
	
	$('.l2_column').each(function(index,item){
		sourceColumn(item);
	});												 // Apply Meta changes

	setSchemaTableColumn('.l1_schema', '.l1_table','.l1_column'); // Set for Build
	setSchemaTableColumn('.fschema', '.from_table',''); // Set for From
	setSchemaTableColumn('.jschema_1', '.jtable_1',''); // Set for join1
	setSchemaTableColumn('.jschema_2', '.jtable_2',''); // Set for join2
	setSchemaTableColumn('.wschema', '.where_table','.where_column'); // Set for where	
	addClause();


}



function setSchemaTableColumn(schema_class, table,column){
	$(schema_class).off('change');
	$(schema_class).on('change',function(e){
		defaultL1SchemaAll = window.defaultL1SchemaAll
		current = this
		// console.log($(current).parent().parent().find('.jtable_1').parent().html())
		var table_select = '<option value="">Select Table</option>';
		var column_select = '<option value="">Select Column</option>';
		$(current).parent().parent().find(table).html(table_select);
		$(current).parent().parent().find(column).html(column_select);
		if ($(current).val()!=''){
			if($(current).val()!=Object.keys(defaultL1SchemaAll)[0]){
				$.ajax({
					'type'	:	'post',
					'url'	:	'/create/',
					'async': false,
					'data'	:	{'schema':$(this).val() , 'action': 'getSchemaAll','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
				}).done(function(res) {
						if(res.status == '2'){
							$.each(Object.keys(res.schema_all[Object.keys(res.schema_all)[0]]), function(i,v){
								table_select += '<option value="'+v+'">'+v+'</option>'
							});
							$(current).parent().parent().find(table).html(table_select);
							if(window.jtable_1!='' && table=='.jtable_1'){						
								$(current).parent().parent().find(table).val(window.jtable_1);		
								window.jtable_1='';
								
							}
							if(window.jtable_2!='' && table=='.jtable_2'){							
								$(current).parent().parent().find(table).val(window.jtable_2);	
								window.jtable_2='';
								
							}
							if(window.l1_table!='' && table== '.from_table'){
								$(current).parent().parent().find(table).val(window.l1_table).trigger("change");		
								window.l1_table='';
								
							}
							if(column!=''){
								$(current).parent().parent().find(table).off('change');                  
								$(current).parent().parent().find(table).on('change', function(e) {
									var table_select = '<option value="">Select Table</option>';
									var column_select = '<option value="">Select Column</option>';
									$(this).parent().parent().find(column).html(column_select);
									if($(this).val()!=''){
										$.each(res.schema_all[Object.keys(res.schema_all)[0]][$(this).val()], function(i,v){
											column_select += '<option value="'+v['column']+'">'+v['column']+'</option>'
										});							
										$(this).parent().parent().find(column).html(column_select);
									}	
								});
								if(window.l1_table!=''){
									
									$(current).parent().parent().find(table).val(window.l1_table).trigger("change");		
									window.l1_table='';
									
								}
								if(window.where_table!=''){
									
									$(current).parent().parent().find(table).val(window.where_table).trigger("change");		
									window.where_table='';
									
								}
								if(window.l1_column!=''){
									$(current).parent().parent().find(column).val(window.l1_column);	
									window.l1_column='';
								}
								if(window.where_column!=''){
									$(current).parent().parent().find(column).val(window.where_column);	
									window.where_column='';
								}
							}

						}
						
				});

			}
			else{
				table_select = '<option value="">Select Table</option>';
				$.each(Object.keys(defaultL1SchemaAll[Object.keys(defaultL1SchemaAll)[0]]), function(i,v){
					table_select += '<option value="'+v+'">'+v+'</option>'
				});								
				$(current).parent().parent().find(table).html(table_select); // Set l1 tables
				
				if(window.jtable_1!='' && table=='.jtable_1'){
					$(current).parent().parent().find(table).val(window.jtable_1);		
					window.jtable_1='';
					
				}
				if(window.jtable_2!='' && table=='.jtable_2'){
					$(current).parent().parent().find(table).val(window.jtable_2);	
					window.jtable_2='';
					
				}
				if(window.l1_table!='' && table== '.from_table'){
					$(current).parent().parent().find(table).val(window.l1_table).trigger("change");		
					window.l1_table='';
					
				}

				if(column!=''){
					if(window.l1_table!=''){
						console.log(window.l1_table);
						$(current).parent().parent().find(table).val(window.l1_table).trigger("change");		
						window.l1_table='';
						
					}
					$(current).parent().parent().find(table).off('change');                  
					$(current).parent().parent().find(table).on('change', function(e) {
						var table_select = '<option value="">Select Table</option>';
						var column_select = '<option value="">Select Column</option>';
						$(this).parent().parent().find(column).html(column_select);
						
						if($(this).val()!=''){
						
							$.each(defaultL1SchemaAll[Object.keys(defaultL1SchemaAll)[0]][$(this).val()], function(i,v){
								column_select += '<option value="'+v['column']+'">'+v['column']+'</option>'
							});							
							$(this).parent().parent().find(column).html(column_select);
						}	
					});
					
					if(window.where_table!=''){
						
						$(current).parent().parent().find(table).val(window.where_table).trigger("change");		
						window.where_table='';
						
					}
					if(window.l1_column!=''){
						$(current).parent().parent().find(column).val(window.l1_column);	
						window.l1_column='';
					}
					if(window.where_column!=''){
						$(current).parent().parent().find(column).val(window.where_column);	
						window.where_column='';
					}
					
				}
			}
		}

	});
}
// function setSchemaTableColumn(schema, table,column){
// 	$(schema).off('change');
// 	$(schema).on('change',function(e){
// 		defaultL1SchemaAll = window.defaultL1SchemaAll
// 		schema = this
// 		table_select = '<option value="">Select Table</option>';
// 		column_select = '<option value="">Select Column</option>';
// 		$(schema).parent().parent().find(table).html(table_select);
// 		$(schema).parent().parent().find(column).html(column_select);
// 		if ($(schema).val()!=''){
// 			if($(schema).val()!=Object.keys(defaultL1SchemaAll)[0]){
// 				$.ajax({
// 					'type'	:	'post',
// 					'url'	:	'/create/',
// 					'async': false,
// 					'data'	:	{schema:$(schema).val() , action: 'getSchemaAll','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
// 				}).done(function(res) {
// 						if(res.status == '2'){
// 							$.each(Object.keys(res.schema_all[Object.keys(res.schema_all)[0]]), function(i,v){
// 								table_select += '<option value="'+v+'">'+v+'</option>'
// 							});								

// 							$(schema).parent().parent().find(table).html(table_select);
							
// 							if(column!=''){
// 								$(schema).parent().parent().find(table).off('change');                  
// 								$(schema).parent().parent().find(table).on('change', function(e) {
// 									$(schema).parent().parent().find(column).html(column_select);
// 									if($(this).val()!=''){
// 										$.each(res.schema_all[Object.keys(res.schema_all)[0]][$(this).val()], function(i,v){
// 											column_select += '<option value="'+v['column']+'">'+v['column']+'</option>'
// 										});							
// 										$(schema).parent().parent().find(column).html(column_select);
// 									}	
// 								});
								
// 							}
// 							if(window.l1_table!=''){
												
// 								$(schema).parent().parent().find(table).val(window.l1_table).trigger("change");		
// 								window.l1_table='';
								
// 							}
// 							if(window.l1_column!=''){
												
// 								$(schema).parent().parent().find(column).val(window.l1_column);		
// 								window.l1_column='';
								
// 							}

// 						}
						
// 				});

// 			}
// 			else{
// 				table_select = '<option value="">Select Table</option>';
// 				$.each(Object.keys(defaultL1SchemaAll[Object.keys(defaultL1SchemaAll)[0]]), function(i,v){
// 					table_select += '<option value="'+v+'">'+v+'</option>'
// 				});								
// 				$(schema).parent().parent().find(table).html(table_select); // Set l1 tables
// 				if(window.l1_table!=''){
									
// 					$(schema).parent().parent().find(table).val(window.l1_table).trigger("change");		
// 					window.l1_table='';
					
// 				}
// 				if(column!=''){
// 					$(schema).parent().parent().find(table).off('change');                  
// 					$(schema).parent().parent().find(table).on('change', function(e) {
// 						$(schema).parent().parent().find(column).html(column_select);
// 						if($(this).val()!=''){
// 							$.each(defaultL1SchemaAll[Object.keys(defaultL1SchemaAll)[0]][$(this).val()], function(i,v){
// 								column_select += '<option value="'+v['column']+'">'+v['column']+'</option>'
// 							});							
// 							$(schema).parent().parent().find(column).html(column_select);
// 						}
// 					});
// 						if(window.l1_column!=''){
											
// 							$(schema).parent().parent().find(column).val(window.l1_column);		
// 							window.l1_column='';
							
// 						}	
					
// 				}
// 			}
// 		}

// 	});
// }

function addClause() {
	console.log('addClause');
	var schema_select = '<option value="">Select Schema</option>'
	$.each(window.schemas, function(index, value){
		schema_select +='<option value="'+value+'">'+value+'</option>'
	});

	$('#add_join').off('click');
	$('#add_join').on('click', function(e) {
		$('.joins').append('<div class="row"><div class="col-sm  form-group"><select class="form-control-sm jschema_1">'+schema_select+'</select></div><div class="col-sm  form-group"><select class="form-control-sm jtable_1" id="jtable_1"><option value="">Select Table</option></select></div><div class="col-sm form-group"><select class="form-control-sm " id="join_type"><option value="">Select Join</option><option value="inner join">Inner Join</option><option value="left join">Left Join</option><option value="right join">Right Join</option></select></div><div class="col-sm form-group"><select class="form-control-sm jschema_2">'+schema_select+'</select></div><div class="col-sm form-group"><select class="form-control-sm jtable_2" id="jtable_2"><option value="">Select Table</option></select></div><div class="col-sm  form-group"><input type="text" name="join_condition" placeholder="Join Condition" id="join_condition" class="form-control-sm"></div><div class="col-sm"><button class="btn-sm deleterow" style="height: 30px;">X</button></div></div>');
		setSchemaTableColumn('.jschema_1', '.jtable_1',''); // Set for join1
		setSchemaTableColumn('.jschema_2', '.jtable_2',''); // Set for join2
		if(window.jschema_1!=''){
			$('.joins div.row:last-child').find('.jschema_1').val(window.jschema_1).trigger('change');
			window.jschema_1='';
		}
		if(window.jschema_2!=''){

			$('.joins div.row:last-child').find('.jschema_2').val(window.jschema_2).trigger('change');
			window.jschema_2='';
		}
		if(window.join_type!=''){
			$('.joins div.row:last-child').find('#join_type').val(window.join_type);
			window.join_type='';
		}
		if(window.join_condition!=''){
			$('.joins div.row:last-child').find('#join_condition').val(window.join_condition);
			window.join_condition='';
		}

		removeRow();

	});
	$('#add_where').off('click');
	$('#add_where').on('click', function(e) {
		$('.wheres').append('<div class="row"><div class="col-sm  form-group"><select class="form-control-sm wschema">'+schema_select+'</select></div><div class="col-sm form-group"><select class="form-control-sm where_table" id="where_table"><option value="">Select Table</option></select></div><div class="col-sm form-group"><select class="form-control-sm where_column" id="where_column"><option value="">Select Column</option></select></div><div class="col-sm form-group"><input type="text" name="where_condition" placeholder="Where Condition" id="where_condition" class="form-control-sm"></div><div class="col-sm"><button class="btn-sm deleterow" style="height: 30px;">X</button></div></div>');
		setSchemaTableColumn('.wschema', '.where_table','.where_column'); // Set for where

		if(window.wschema!=''){
			$('.wheres div.row:last-child').find('.wschema').val(window.wschema).trigger('change');
			window.wschema='';
		}
		if(window.where_condition!=''){
			$('.wheres div.row:last-child').find('#where_condition').val(window.where_condition);
			window.where_condition='';
		}
		removeRow();
	});
}

function removeRow(){
	$('.deleterow').off('click');
	$('.deleterow').on('click', function(e) {
		$(this).parent().parent().remove();
	});

}

function createNext() {
	$('#next').off('click');
	$('#next').on('click', function(e) {
		e.preventDefault();
		if (validate()){

			// $.ajax({
			// 	'type'	:	'post',
			// 	'url'	:	'/create/',
			// 	'data'	:	{source_id:$('#source_id').val(),aco_id:$('#aco_id').val(),workflow_id:$('#workflow_id').val() , action: 'checkSource','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			// }).done(function(res) {
			// 	if(res.status=='2'){
			// 		//console.log(res)
					$('#build').removeAttr("hidden");
					$('#hard').attr("hidden",'');
					$('#to_submit').removeAttr("hidden");
					$('.srcid_hrd').html($('#source_id').val());
					$('.srcnm_hrd').html($('#source_name').val());
					$('.srctp_hrd').html($('#source_type').val());
					$('.wfid_hrd').html($('#workflow_id').val());
					$('.auth_hrd').html($('#author').val());
					$('.vdvr_hrd').html($('#vendor_version').val());
					$('.vdnm_hrd').html($('#vendor_name').val());
					$('.acoid_hrd').html($('#aco_id').val());
					$('.aconm_hrd').html($('#aco_nm').val());
					$('.wsid_hrd').html($('#workspace_id').val());
					$('.pipid_hrd').html($('#pipeline_id').val());
					$('.sfn_hrd').html($('#source_file_name').val());
			// 	}
			// 	else{
			// 		//console.log('test')
			// 		toastr.error(res.message);
			// 	}
				

			// });
			buttons();
			
			
			
		}
		
	});
}

function buttons(){
	$('#back').off('click');
	$('#back').on('click', function(e) {
		$('#hard').removeAttr("hidden");
		$('#build').attr("hidden",'');
		$('#to_submit').attr("hidden",'');
	});
	$('#update').off('click');
	$('#update').on('click', function(e) {
		if(validateBeforeSubmit()){

			buildData();
			
		}
		

	});
	

}


function validateJoins(){
	result = true
	$.each($('.joins').find('.row'),function(index, value){
		unsetError($(value).find('#jtable_1'));
		unsetError($(value).find('#join_type'));
		unsetError($(value).find('#jtable_2'));
		unsetError($(value).find('#join_condition'));
		if($(value).find('#jtable_1').val()==''){
			
			setError($(value).find('#jtable_1'),'Please Select First Join Table.');
			result = false;	
		}
		else if($(value).find('#join_type').val()==''){
			
			setError($(value).find('#join_type'),'Please Select Join Type.');
			result = false;
		}
		else if($(value).find('#jtable_2').val()==''){
			
			setError($(value).find('#jtable_2'),'Please Select Second Join Table.');
			result = false;
		}
		else if($(value).find('#join_condition').val()==''){
			
			setError($(value).find('#join_condition'),'Please Fill Join Condition.');
			result = false;
		}
		else{
			result = true;	
		}

	});
	
	return result
	
}

function validateWhere(){
	result = true;
	$.each($('.wheres').find('.row'),function(index, value){
		unsetError($(value).find('#where_table'));
		unsetError($(value).find('#where_column'));
		unsetError($(value).find('#where_condition'));
		if($(value).find('#where_table').val()==''){
			
			setError($(value).find('#where_table'),'Please Select Where Table.');
			result = false;	
		}
		else if($(value).find('#where_column').val()==''){
			
			setError($(value).find('#where_column'),'Please Select Where Column.');
			result = false;
		}
		else if($(value).find('#where_condition').val()==''){
			
			setError($(value).find('#where_condition'),'Please Fill Where Condition.');
			result = false;
		}
		else{
			result = true;
		}
		
	});
	
	
	return result
}

function validateBeforeSubmit(){
	unsetError($('.from_table'));
	if ($('.from_table').val()==''){
		setError($('.from_table'),'Please Select Main Table.');
		return false;
	}
	else if(validateJoins()== false){
		return false;
	}
	else if(validateWhere()== false){
		return false;
	}
	else{
		return true;	
		
	}

}

function buildData(){
	buildsheet_rows =[]
	meta_columns={}
	meta_rows=[]

	buildsheet_rows.push({dest_datatype:'',default_l1schema: $('#dflt_l1_schema').val(),dest_schema:'',source_schema:$('.fschema').val(),source_table:$('.from_table').val(),source_column:'',rule:'from',transform:'',dest_table:'',dest_column:''})
	$.each($('.joins').find('.row'),function(index, value){
		if($(value).find('#jtable_1').val()!=''){
			row={}
			row.default_l1schema = $('#dflt_l1_schema').val();
			row.source_schema = $('.jschema_1').val();
			row.source_table = $(value).find('#jtable_1').val();
			row.source_column = ''
			row.rule = $(value).find('#join_type').val();
			row.transform = $(value).find('#join_condition').val();
			row.dest_schema = $('.jschema_2').val();
			row.dest_table = $(value).find('#jtable_2').val();
			row.dest_column = ''
			row.dest_datatype = ''
			buildsheet_rows.push(row)
			
		}
	});

	$.each($('.wheres').find('.row'),function(index, value){
		if($(value).find('#where_table').val()!=''){
			row={}
			row.default_l1schema = $('#dflt_l1_schema').val();
			row.source_schema = $('.wschema').val();
			row.source_table = $(value).find('#where_table').val();
			row.source_column = $(value).find('#where_column').val();
			row.rule = 'where'
			row.transform = $(value).find('#where_condition').val();
			row.dest_schema = ''
			row.dest_table = ''
			row.dest_column = ''
			row.dest_datatype = ''
			buildsheet_rows.push(row)
			
		}
	});
	$.each($('#loadrows').find('.row'),function(index, value){
		row={}
		row.default_l1schema = $('#dflt_l1_schema').val();
		row.source_schema = $(value).find('.l1_schema').val();
		row.source_table = $(value).find('.l1_table').val();
		row.source_column = $(value).find('.l1_column').val();
		row.rule = $(value).find('.rule').val();
		row.transform = $(value).find('.transform').val();
		row.dest_schema = $('#l2_schema').val();
		row.dest_table = $(value).find('.l2_table').val();
		row.dest_column = $(value).find('.l2_column').val().replace(/\/.*/g, '');
		row.dest_datatype = $(value).find('.l2_columntype').val();
		buildsheet_rows.push(row)
	});
	meta_columns.source_id= $('#source_id').val();
	meta_columns.source_name= $('#source_name').val();
	meta_columns.source_type= $('#source_type').val();
	meta_columns.workflow_id= $('#workflow_id').val();
	meta_columns.author= $('#author').val();
	meta_columns.vendor_version= $('#vendor_version').val();
	meta_columns.vendor_name= $('#vendor_name').val();
	meta_columns.aco_id= $('#aco_id').val();
	meta_columns.aco_nm= $('#aco_nm').val();
	meta_columns.sfn= $('#source_file_name').val();
	meta_columns.workspace_id= $('#workspace_id').val();
	meta_columns.pipeline_id= $('#pipeline_id').val();
	meta_columns.default_l1schema = $('#dflt_l1_schema').val();
	meta_rows.push(meta_columns);
	updateBuildsheet(meta_rows,buildsheet_rows,$('#l2_table').val());
	
}

function buildData(){
	buildsheet_rows =[]
	meta_columns={}
	meta_rows=[]

	buildsheet_rows.push({dest_datatype:'',default_l1schema: $('#dflt_l1_schema').val(),dest_schema:'',source_schema:$('.fschema').val(),source_table:$('.from_table').val(),source_column:'',rule:'from',transform:'',dest_table:'',dest_column:''})
	$.each($('.joins').find('.row'),function(index, value){
		if($(value).find('#jtable_1').val()!=''){
			row={}
			row.default_l1schema = $('#dflt_l1_schema').val();
			row.source_schema = $(value).find('.jschema_1').val();
			row.source_table = $(value).find('#jtable_1').val();
			row.source_column = ''
			row.rule = $(value).find('#join_type').val();
			row.transform = $(value).find('#join_condition').val();
			row.dest_schema = $(value).find('.jschema_2').val();
			row.dest_table = $(value).find('#jtable_2').val();
			row.dest_column = ''
			row.dest_datatype = ''
			buildsheet_rows.push(row)
			
		}
	});

	$.each($('.wheres').find('.row'),function(index, value){
		if($(value).find('#where_table').val()!=''){
			row={}
			row.default_l1schema = $('#dflt_l1_schema').val();
			row.source_schema = $(value).find('.wschema').val();
			row.source_table = $(value).find('#where_table').val();
			row.source_column = $(value).find('#where_column').val();
			row.rule = 'where'
			row.transform = $(value).find('#where_condition').val();
			row.dest_schema = ''
			row.dest_table = ''
			row.dest_column = ''
			row.dest_datatype = ''
			buildsheet_rows.push(row)
			
		}
	});
	$.each($('#loadrows').find('.row'),function(index, value){
		row={}
		row.default_l1schema = $('#dflt_l1_schema').val();
		row.source_schema = $(value).find('.l1_schema').val();
		row.source_table = $(value).find('.l1_table').val();
		row.source_column = $(value).find('.l1_column').val();
		row.rule = $(value).find('.rule').val();
		row.transform = $(value).find('.transform').val();
		row.dest_schema = $('#l2_schema').val();
		row.dest_table = $(value).find('.l2_table').val();
		row.dest_column = $(value).find('.l2_column').val().replace(/\/.*/g, '');
		row.dest_datatype = $(value).find('.l2_columntype').val();
		buildsheet_rows.push(row)
	});
	meta_columns.source_id= $('#source_id').val();
	meta_columns.source_name= $('#source_name').val();
	meta_columns.source_type= $('#source_type').val();
	meta_columns.workflow_id= $('#workflow_id').val();
	meta_columns.author= $('#author').val();
	meta_columns.vendor_version= $('#vendor_version').val();
	meta_columns.vendor_name= $('#vendor_name').val();
	meta_columns.aco_id= $('#aco_id').val();
	meta_columns.aco_nm= $('#aco_nm').val();
	meta_columns.sfn= $('#source_file_name').val();
	meta_columns.workspace_id= $('#workspace_id').val();
	meta_columns.pipeline_id= $('#pipeline_id').val();
	meta_columns.default_l1schema = $('#dflt_l1_schema').val();
	meta_rows.push(meta_columns);
	updateBuildsheet(meta_rows,buildsheet_rows,$('#l2_table').val());



}

function submitBuildsheet(meta_rows,buildsheet_rows,l2_category) {
		$('#update').attr('disabled','');
	
		var req = {}; 
		$.ajax({
			'type'	:	'post',
			'url'	:	'/buildsheetSubmit/',
			'data'	:	{'category':l2_category,'meta_data':JSON.stringify(meta_rows),'buildsheet_data':JSON.stringify(buildsheet_rows) , 'action': 'submitBuild','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
		}).done(function(res) {
			if (res.status =='2'){
					
					$('#sql-modal').modal('show');
					getSQLToModal(res.query);
				}
				
				
			});

		
	}

function getSQL(){
	$('.getsql').off('click');
	$('.getsql').on('click', function(e) {
		$('.sql').attr("hidden",'');
		getsql = this
	var req = {}; 
	$.ajax({
		'type'	:	'post',
		'url'	:	'/buildsheets/',
		'data'	:	{'meta_id':$(this).attr('buildsheet_id') ,'csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
	}).done(function(res) {
		if (res.status =='2'){
				$(this).parent().parent().parent().find('.row').find('.sql')

				$('#sql').text(res.query).removeAttr("hidden");
				$("html, body").animate({ scrollTop: 0 }, "slow");
				
			}
			
		}).fail(function(res){
			toastr.error(res);
		});
	});
}

function getSQLToModal(query){
	$('#getsql').off('click');
	$('#getsql').on('click', function(e) {
		$('#sql').text(query).removeAttr("hidden");
	});
	$('#closemodal').off('click');
	$('#closemodal').on('click', function(e) {
		document.location.href = window.location.origin+'/buildsheets/';
	});
	$('#getbuildsheet').off('click');
	$('#getbuildsheet').on('click', function(e) {
		getBuildsheet($('#aco_id').val(),$('#source_id').val(),$('#workflow_id').val());
	});



}


function getBuildsheet(aco_id,source_id,workflow_id) {
	var req = {}; 
	$.ajax({
		'type'	:	'post',
		'url'	:	'/downloadBuildsheet/',
		'data'	:	{'aco_id':aco_id,'source_id':source_id , 'workflow_id': workflow_id,'csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
	}).done(function(res) {
				var blob = new Blob([res], { type: 'data:application/vnd.csv' });
				var downloadUrl = URL.createObjectURL(blob);
				var a = document.createElement("a");
				a.href = downloadUrl;
				a.download = aco_id+"_"+source_id+"_"+ workflow_id+".csv";
				document.body.appendChild(a);
				a.click();
			
		});
	

}



function getReport() {
	$('.getReport').off('click');
	$('.getReport').on('click', function(e) {
		$('#thead').html("");
		$('#tbody').html("");
		$('.box').removeAttr("hidden");
		$('.box').jmspinner('large');
		$('#report-modal').modal('show');
		$('#report-modal').removeAttr('hidden');
		aco_id= $(this).attr('aco_id');
		source_id= $(this).attr('source_id');
		workflow_id= $(this).attr('workflow_id');
		var req = {}; 
		$.ajax({
			'type'	:	'post',
			'url'	:	'/getReport/',
			'data'	:	{'meta_id':$(this).attr('meta_id'),'source_id':$(this).attr('source_id'),'aco_id':$(this).attr('aco_id'),'workflow_id':$(this).attr('workflow_id'),'action':'getReport','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
		}).done(function(res) {
			if (res.status =='2'){
				//console.log(res.buildsheet);
				$('.box').jmspinner(false);
				$('.box').attr("hidden",'');
				$(".container").css("overflow", "scroll");
				$('.reportTable').removeAttr("hidden");

				thead= '<tr>'
				$.each(res.columns, function( index, value){
					thead +='<th>'+value+'</th>';
				});
				thead+='</tr>'
				$('#thead').html(thead);
				tbody =''
				$.each(res.buildsheet, function( index, value){
					tbody +='<tr>'
					$.each(value, function( inindex, invalue){
						if(inindex=='13'||inindex=='14'){
							if (invalue!='0'){
								tbody +='<td style=" color: red;">'+invalue+'</td>';
							}
							else{
								tbody +='<td style="color: #23e523;">'+invalue+'</td>';
							}

						}
						else{

							tbody +='<td>'+invalue+'</td>';
						}
					});
					tbody +='</tr>'
				});

				$('#tbody').html(tbody);

				$('#downloadReport').off('click');
				$('#downloadReport').on('click', function(e) {
					downloadReport(aco_id,source_id,workflow_id);
				});

			}
			else{
				
				$('.box').jmspinner(false);
				$('.box').html(res.msg);
			}


		});
	});
}




function downloadReport(aco_id,source_id,workflow_id) {
	
	var req = {}; 
	$.ajax({
		'type'	:	'post',
		'url'	:	'/getReport/',
		'data'	:	{'source_id':source_id,'aco_id':aco_id,'workflow_id':workflow_id,'action':'getReportDownload','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
	}).done(function(res) {
		if (res.status =='1'){
			toastr.error(res.msg);
		}
		else{
			//console.log(res);
			var blob = new Blob([res], { type: 'data:application/vnd.csv' });
			var downloadUrl = URL.createObjectURL(blob);
			var a = document.createElement("a");
			a.href = downloadUrl;
			a.download = aco_id+"_"+source_id+"_"+ workflow_id+"_Report.csv";
			document.body.appendChild(a);
			a.click();
		}
			
	});
	

}

function deleteBuildsheet() {
	$('.delete').off('click');
	$('.delete').on('click', function(e) {
		var req = {}; 
		$.ajax({
			'type'	:	'post',
			'url'	:	'/buildsheetDelete/',
			'data'	:	{'meta_id':$(this).attr('meta_id') , 'action': 'delete','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
		}).done(function(res) {
			if (res.status =='2'){
				window.location.href= window.location.origin+'/buildsheets/'
			}
			else{
				toastr.error(res.msg);
			}
			
			
		});
	});
}

//Update functions
function loadMeta() {
	var meta_id =$(location).attr('href').replace(/.+:\d+\//g, '').match(/\d+/g);

	var req = {}; 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/buildsheets/'+meta_id[0]+'/update/',
				beforeSend: function(){
				    // Show image container
				    $("#loader").show();
				   },
				
				'data'	:	{'action':'getMeta' , 'csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()},

			}).done(function(res) {
				if(res.status=='2'){
					// console.log(res.msg)
					selectDefaultL1Schema();
					fillMeta(res);

					
					
				}
				
				
			});

}

function fillMeta(response) {
	var meta_rows = response.meta
	$('#source_id').val(meta_rows[0][2]);
	$('#source_name').val(meta_rows[0][3]);
	$('#source_type').val(meta_rows[0][4]);
	$('#workflow_id').val(meta_rows[0][5]);
	fillSchema(response.l2_schema,'#l2_schema',response.category,'#l2_table');
	fillSchema(meta_rows[0][19],'#dflt_l1_schema','','');
	$('#pipeline_id').val(meta_rows[0][15]);
	$('#author').val(meta_rows[0][6]);
	$('#vendor_version').val(meta_rows[0][8]);
	$('#vendor_name').val(meta_rows[0][9]);
	$('#aco_id').val(meta_rows[0][10]);
	$('#aco_nm').val(meta_rows[0][11]);
	$('#workspace_id').val(meta_rows[0][13]);
	$('#pipeline_id').val(meta_rows[0][15]);
	
	
}

function fillSchema(schema,schema_attr,table){
	if(table!=''){
		window.selectedL2_table = table
	}
	$(schema_attr).val(schema).trigger("change").prop('disabled', 'disabled');

}


function loadBuild() {
	var meta_id =$(location).attr('href').replace(/.+:\d+\//g, '').match(/\d+/g);

	var req = {}; 
	$.ajax({
		'type'	:	'post',
		'url'	:	'/buildsheets/'+meta_id[0]+'/update/',
		
		'data'	:	{'action':'getMetaBuild' , 'csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
		
	}).done(function(res) {
		if(res.status=='2'){
			// console.log(res.msg)
			$.each(res.buildsheet,function(index,value){
				// console.log($('.l2_column')[0]);
				// console.log(res.buildsheet[0][1]== $('#l2_table').val())
				if(res.buildsheet[0][1]== $('#l2_table').val()){
					// console.log('match ho gya')
				 fillBuildsheet(value);
				  $("#loader").hide();

				}
				
			});
			
			
			
		}
		
		
	});
}

function fillBuildsheet(buildsheet_row) {
	console.log('fillBuildsheet '+(buildsheet_row[6]));
	not_allowed = ['where','from','inner join','left join','right join']

	if(not_allowed.indexOf(buildsheet_row[6].toLowerCase()) == -1){
		var row = $('#loadrows').find('#'+buildsheet_row[5]+"l2").parent().parent();
		// console.log(row);
		if($(row).find('.l1_table').val()!='Meta Column'){
			$(row).attr('buildsheet_id',buildsheet_row[0])
			// $('.wheres').find('.row').attr('buildsheet_id',buildsheet_row[0])
			if(buildsheet_row[2]!=''){
				window.l1_table= buildsheet_row[2]
				window.l1_column = buildsheet_row[3]

			}
			$(row).find('.l1_schema').val(buildsheet_row[13]).trigger("change");
			$(row).find('.rule').val(buildsheet_row[6])
			$(row).find('.transform').val(buildsheet_row[7])
		}
		else{
			(row).attr('buildsheet_id',buildsheet_row[0])
		}

	}
	else if(buildsheet_row[6].toLowerCase()=='from'){

		window.l1_table = buildsheet_row[2]
		$('.fschema').val(buildsheet_row[13]).trigger("change");
		// $('.wheres').find('.row').attr('buildsheet_id',buildsheet_row[0]);
		
	}
	else if(buildsheet_row[6].toLowerCase().search("join")!=-1){
		// console.log(buildsheet_row[6].toLowerCase().match(/join/g));
		window.jschema_1= buildsheet_row[13]
		window.jschema_2= buildsheet_row[12]
		window.jtable_1=  buildsheet_row[2]
		window.jtable_2=  buildsheet_row[4]
		window.join_condition= buildsheet_row[7]
		window.join_type=buildsheet_row[6]
		$('#add_join').trigger("click");
	}
	else if(buildsheet_row[6].toLowerCase()=='where'){
		window.wschema= buildsheet_row[13];
		window.where_table= buildsheet_row[2];
		window.where_column= buildsheet_row[3]
		window.where_condition= buildsheet_row[7]
		$('#add_where').trigger("click");
	}

}

function updateBuildsheet(meta_rows,buildsheet_rows,l2_category) {
	var meta_id =$(location).attr('href').replace(/.+:\d+\//g, '').match(/\d+/g);
			$.ajax({
				'type'	:	'post',
				'url'	:	'/buildsheets/'+meta_id[0]+'/update/',
				'data'	:	{'category':l2_category,'meta_data':JSON.stringify(meta_rows),'buildsheet_data':JSON.stringify(buildsheet_rows) , 'action': 'updateBuild','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
					$('#sql-modal').modal('show');
					getSQLToModal(res.query);
				}
				
			);
			
		// }
}