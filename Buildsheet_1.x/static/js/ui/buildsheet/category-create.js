
$(function() {

	selectL2Schema();
	selectDefaultL1Schema();
	createNext();
	getSQL();
	getReport();
	deleteBuildsheet();
	$('[data-toggle="tooltip"]').tooltip();




});



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
	// if ($('#workflow_id').val()==''){
	// 	setError($('#workflow_id'),'Please enter Workflow ID.');
	// 	return false;
	// }
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
	// if ($('#vendor_name').val()==''){
	// 	setError($('#vendor_name'),'Please enter Vendor Name.');
	// 	return false;
	// }
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
				'async': false,
				'data'	:	{schema:$("#l2_schema option:selected").val() , action: 'getSchemaTables','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {


					var l2_select ='<option value="">Select table</option>'
					$.each(res.tables, function( index, value){
						l2_select +='<option value="'+value+'">'+value+'</option>'
					});
					$('#l2_table').html(l2_select);
					selectL2Table();

			});
		}});

}

 /*Select L2 Schema*/
function selectDefaultL1Schema() {
	$('#dflt_l1_schema').off('change');
	$('#dflt_l1_schema').on('change', function(e) {
		current =this
		$.ajax({
				'type'	:	'post',
				'url'	:	'/create/',
				'async': false,
				'data'	:	{schema:$(current).val() , action: 'getSchemaTables','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				if (res.status=='2'){
					window.defaultL1SchemaAll = res.tables
					toSetDefaultOption();
				}
				else{
					error(res.msg);
				}
			});
	});	
}

function sourceColumn(l2_column){
	// console.log($(l2_column).val());
	meta_select = '<option value="Meta Column" selected>Meta Column</option>'
	alias_select = '<option value="" selected>Meta Alias</option>'

	if ($(l2_column).val()=='source_id'){
		meta_column = '<option value="source_id" selected>source_id</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#source_id').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.alias_select').html(alias_select).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		// $(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='source_name'){
		meta_column = '<option value="source_name" selected>source_name</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#source_name').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.alias_select').html(alias_select).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		// $(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='source_type'){
		meta_column = '<option value="source_type" selected>source_type</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#source_type').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.alias_select').html(alias_select).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		// $(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='workflow_id'){
		// console.log("im in workflow_id");
		meta_column = '<option value="workflow_id" selected>workflow_id</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#workflow_id').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.alias_select').html(alias_select).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		// $(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='author'){
		meta_column = '<option value="author" selected>author</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#author').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.alias_select').html(alias_select).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		// $(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='ingestion_datetime'){
		meta_column = '<option value="ingestion_datetime" selected>ingestion_datetime</option>'
		$(l2_column).parent().parent().find('.transform').val('').attr('readonly','true');
		$(l2_column).parent().parent().find('.alias_select').html(alias_select).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		// $(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("GETDATE()").attr('disabled',true);
	}
	if ($(l2_column).val()=='vendor_version'){
		meta_column = '<option value="vendor_version" selected>vendor_version</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#vendor_version').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.alias_select').html(alias_select).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		// $(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='vendor_name'){
		meta_column = '<option value="vendor_name" selected>vendor_name</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#vendor_name').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.alias_select').html(alias_select).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		// $(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='aco_id'){
		meta_column = '<option value="aco_id" selected>aco_id</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#aco_id').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.alias_select').html(alias_select).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		// $(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='aco_name'){
		meta_column = '<option value="aco_name" selected>aco_name</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#aco_nm').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.alias_select').html(alias_select).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		// $(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='source_file_name'){
		meta_column = '<option value="source_file_name" selected>source_file_name</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#source_file_name').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.alias_select').html(alias_select).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		// $(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='workspace_id'){
		meta_column = '<option value="workspace_id" selected>workspace_id</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#workspace_id').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.alias_select').html(alias_select).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		// $(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='indata_created_on'){
		meta_column = '<option value="indata_created_on" selected>indata_created_on</option>'
		$(l2_column).parent().parent().find('.transform').val('null').attr('readonly','true');
		$(l2_column).parent().parent().find('.alias_select').html(alias_select).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		// $(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	if ($(l2_column).val()=='pipeline_id'){
		meta_column = '<option value="pipeline_id" selected>pipeline_id</option>'
		$(l2_column).parent().parent().find('.transform').val("'"+$('#pipeline_id').val()+"'").attr('readonly','true');
		$(l2_column).parent().parent().find('.alias_select').html(alias_select).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		$(l2_column).parent().parent().find('.l1_column').html(meta_column).attr('disabled',true).css("-webkit-appearance", "none").css('background','#e9e7e7');
		// $(l2_column).parent().parent().find('.l1_schema').html(schema_select).attr('disabled',true);
		$(l2_column).parent().parent().find('.rule').val("hardcode").attr('disabled',true);
	}
	
}

function selectL2Table() {
	$('#l2_table').off('change');
	$('#l2_table').on('change', function(e) {
		e.preventDefault();
		// $('#loadrows').html('<span>No Mapping Available</span>');
		$('.joins').html('<span>No Joins Available</span>');
		$('.from_table').val('');
		$('.aliasing').html('');
		$('#pd_category').html('');
		$('#pd_category').parent().attr('hidden','')
		
		if ($("#l2_table option:selected").val()!='' /* && $("#l2_table option:selected").val()!='pd_activity'*/){
			var req = {}; 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/create/',
				'async': false,
				'data'	:	{schema:$("#l2_schema option:selected").val(),table:$("#l2_table option:selected").val() ,olap_version:$("#olap_version").val() , action: 'getL2Columns','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				window.schemas = res.schemas
				var schema_select = '<option value="">Select Schema</option>'
				$.each(res.schemas, function(index, value){
					schema_select +='<option value="'+value+'">'+value+'</option>'
				})
				$('.jschema_1,.jschema_2,.wschema,.fschema').html(schema_select);
				loadMapping();
			});
			
		}

	
	});

}
function loadMapping() {
	$('.load-build').off('click');
	$('.load-build').on('click', function(e) {
		e.preventDefault();
		if(validateBeforeSubmit()){
			buildAliasDetails();
			$("#progressbar li").eq($("fieldset").index($('#build'))).addClass("active");
			$('#from-joins').attr("hidden",'');
			$('#build').removeAttr("hidden");
			if ($("#l2_table option:selected").val()!='' && $('#loadrows').html()=='' && validateBeforeSubmit()){
				var req = {}; 
				$.ajax({
					'type'	:	'post',
					'url'	:	'/create/',
					'async': false,
					'data'	:	{schema:$("#l2_schema option:selected").val(),table:$("#l2_table option:selected").val() , olap_version:$("#olap_version").val(),action: 'getL2Columns','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
				}).done(function(res) {
					$('#loadrows').html('');

					var alias_select = '<option value="">Select Alias</option>'
					$.each($('.alias-badge'), function(index, value){
						alias_select +='<option value="'+$(value).text().match(/\S+$/g)+'">'+$(value).text().match(/\S+$/g)+'('+$(value).parent().parent().find('.jschema_2,.fschema').val()+'.'+$(value).parent().parent().find('.jtable_2,.from_table').val()+')'+'</option>'
					})


					var rule_select ='<option value="">Select Rule</option>'

					$.each(res.rules, function(index, value){
						rule_select +='<option value="'+value+'">'+value.toUpperCase()+'</option>'
					})
					mand_column=[]
					$.each(res.mandatorycolumn, function( index, value ){
						mand_column.push(value[0]);	
					});

					$('.build-head,.wheres,#submit').removeAttr('hidden');
					meta_columns = ['source_id','source_name','source_type','workflow_id','author','ingestion_datetime','vendor_version','vendor_name','aco_id','aco_name','source_file_name','workspace_id','indata_created_on','pipeline_id'];
					$.each(res.columns, function( index, value ) {
						if(meta_columns.indexOf(value['column']) == -1){
							if(mand_column.indexOf(value['column']) == -1){
								$('#loadrows').append('<div class="row"><div class="col-sm"><select class="form-control-sm alias_select" > '+alias_select+'</select> </div><div class="col-sm"><select class="form-control-sm l1_column" > <option value="">Select Column</option></select> </div><div><a class="form-inline btn load-l1-data " data-toggle="popover"  data-trigger="focus" data-placement="right" href="#" style="padding: 0px;margin-top: 4px;"><i class="fas fa-eye"></i></a></div><div class="col-sm"><select class="form-control-sm rule">'+rule_select+' </select> </div><div class="col-sm"><textarea class="form-control-sm transform" id="transform-'+index+'" Placeholder="Add Transformation" data-trigger="click" data-toggle="modal" data-target="#transform-modal"></textarea></div><div class="" style="width: 25px;"><input type="checkbox" class="" id="unique-key" style="vertical-align: sub;"></div><div class="col-sm"><input type="text" class="form-control form-control-sm form-control-custom l2_column" disabled="true" id='+value['column']+'l2  value="'+value['column']+'" > </div><div><a class="form-inline btn load-l2-data" href="#" data-toggle="popover"  data-trigger="click" data-placement="right" style="padding: 0px;margin-top: 4px;"><i class="fas fa-eye"></i></a></div><div class="col-sm"><input type="text" disabled="true" class="form-control form-control-sm form-control-custom l2_columntype" value="'+value['type']+'" > </div></div>');
							}
							else{
								$('#loadrows').append('<div class="row"><div class="col-sm"><select class="form-control-sm alias_select" > '+alias_select+'</select> </div><div class="col-sm"><select class="form-control-sm l1_column" > <option value="">Select Column</option></select> </div><div><a class="form-inline btn load-l1-data " data-toggle="popover"  data-trigger="focus" data-placement="right" href="#" style="padding: 0px;margin-top: 4px;"><i class="fas fa-eye"></i></a></div><div class="col-sm"><select class="form-control-sm rule">'+rule_select+' </select> </div><div class="col-sm"><textarea class="form-control-sm transform" id="transform-'+index+'" Placeholder="Add Transformation" data-trigger="click" data-toggle="modal" data-target="#transform-modal"></textarea></div><div class="" style="width: 25px;"><input type="checkbox" class="" id="unique-key" style="vertical-align: sub;"></div><div class="col-sm"><input type="text" class="form-control form-control-sm form-control-custom l2_column l2_mend_column" style="background: #bbc1c0 !important;" disabled="true" id='+value['column']+'l2  value="'+value['column']+'" > </div><div><a class="form-inline btn load-l2-data" href="#" data-toggle="popover"  data-trigger="click" data-placement="right" style="padding: 0px;margin-top: 4px;"><i class="fas fa-eye"></i></a></div><div class="col-sm"><input type="text" disabled="true" class="form-control form-control-sm form-control-custom l2_columntype" value="'+value['type']+'" > </div></div>');
							}
						}
						else{
							$('#loadrows').prepend('<div class="row" hidden><div class="col-sm"><select class="form-control-sm alias_select" > '+alias_select+'</select> </div><div class="col-sm"><select class="form-control-sm l1_column" > <option value="">Select Column</option></select> </div><div><a class="form-inline btn" href="#" style="padding: 0px;margin-top: 4px;"><span class="glyphicon glyphicon glyphicon-eye-close"></span></a></div><div class="col-sm"><select class="form-control-sm rule">'+rule_select+' </select> </div><div class="col-sm"><input type="text" class="form-control-sm transform" Placeholder="Add Transformation" ></div><div class="col-sm"><input type="text" class="form-control form-control-sm form-control-custom l2_table" value ='+$("#l2_table option:selected").val()+' readonly="true"></div><div class="col-sm"><input type="text" class="form-control form-control-sm form-control-custom l2_column" value="'+value['column']+'" readonly="true"> </div><div><a class="form-inline btn " href="#" style="padding: 0px;margin-top: 4px;"><span class="glyphicon glyphicon glyphicon-eye-close"></span></a></div><div class="col-sm"><input type="text" class="form-control form-control-sm form-control-custom l2_columntype" value="'+value['type']+'" readonly="true"> </div></div>');
						}
						// $('#loadrows').append('<div class="row"><div class="col-sm"><select class="form-control-sm alias_select" > '+alias_select+'</select> </div><div class="col-sm"><select class="form-control-sm alias_select" > '+alias_select+'</select> </div><div class="col-sm"><div class="col-sm"><select class="form-control-sm l1_column" > <option value="">Select Column</option></select> </div><div class="col-sm"><select class="form-control-sm rule">'+rule_select+' </select> </div><div class="col-sm"><input type="text" class="form-control-sm transform" Placeholder="Add Transformation" ></div><div class="col-sm"><input type="text" class="form-control-sm l2_table" value ='+$("#l2_table option:selected").val()+' readonly="true"></div><div class="col-sm"><input type="text" class="form-control-sm l2_column" value="'+value['column']+'" readonly="true"> </div><div class="col-sm"><input type="text" class="form-control-sm l2_columntype" value="'+value['type']+'" readonly="true"> </div></div>');

					});
					selectAlias();
					$('.l2_column').each(function(index,item){
						sourceColumn(item);
					});
					loadl1Data();
					loadl2Data();
				});
			}
			else if ($('#loadrows').html()!='' && validateBeforeSubmit()){
				alias =[]
				alias_schematable=[]
				$.each($('#loadrows').find('.row:nth-last-child(1)').find('.alias_select option'),function(i,v){
					alias.push($(v).val());
					alias_schematable.push($(v).text())
				});
				
				$.each($('.alias-badge'),function(index,value){
					if(alias.indexOf($(value).text().match(/\S+$/g)[0])==-1){
						$('.alias_select').append('<option value="'+$(value).text().match(/\S+$/g)+'">'+$(value).text().match(/\S+$/g)+'('+$(value).parent().parent().find('.jschema_2,.fschema').val()+'.'+$(value).parent().parent().find('.jtable_2,.from_table').val()+')'+'</option>');
					}
					else{
						if(alias_schematable[alias.indexOf($(value).text().match(/\S+$/g)[0])]== $(value).text().match(/\S+$/g)+'('+$(value).parent().parent().find('.jschema_2,.fschema').val()+'.'+$(value).parent().parent().find('.jtable_2,.from_table').val()+')'){
							// console.log(alias_schematable[alias.indexOf($(value).text().match(/\S+$/g)[0])])
						}
						else{
							$.each($('#loadrows').find('.alias_select option:selected[value="'+$(value).text().match(/\S+$/g)[0]+'"]'),function(i,v) {
								$(v).prop('selected', false);
								$(v).parent().parent().parent().find('.l1_column').val('');
								$(v).parent().parent().parent().find('.rule').val('');
								$(v).parent().parent().parent().find('.transform').val('');
							});
							$('#loadrows').find('.alias_select option[value="'+$(value).text().match(/\S+$/g)[0]+'"]').text($(value).text().match(/\S+$/g)+'('+$(value).parent().parent().find('.jschema_2,.fschema').val()+'.'+$(value).parent().parent().find('.jtable_2,.from_table').val()+')');
						}
					}
				});
			}
			$('[data-toggle="popover"]').popover();
			$('.load-l1-data').popover({container: 'body'});
		}
		tranformToModal();
		
	});
}

function tranformToModal() {
	$('.transform').off('focus');
	$('.transform').on('focus', function(e) {
		e.preventDefault();
		$('#transform-textarea').val($(this).val());
		$('#transform-textarea').focus();
		$('#transform-modal').attr('transform-id',$(this).attr('id'));
	});
	$('#submit-transform').off('click');
	$('#submit-transform').on('click', function(e) {
		e.preventDefault();
		// transform_id= '#'+$('#transform-modal').attr('transform-id');
		// transform_id = "'"+transform_id+"'";
		console.log($('#loadrows').find('#'+$('#transform-modal').attr('transform-id')));

		$('#loadrows').find('#'+$('#transform-modal').attr('transform-id')).val($('#transform-textarea').val());
		$('.transform-close').trigger('click');
	});
}




function loadl1Data() {
	$('.load-l1-data').off('click');
	$('.load-l1-data').on('click', function(e) {
		e.preventDefault();
		current = this
		// $(this).tooltip({ items: $(this), content: "Displaying on click"});

		$(current).popover('dispose');
		
		if($(this).parent().parent().find('.alias_select').val()!='' && $(this).parent().parent().find('.l1_column').val()!=''){
			schema = $(this).parent().parent().find('.alias_select').find('option:selected').text().match(/[^\(]+(?=\.)/g);
			table = $(this).parent().parent().find('.alias_select').find('option:selected').text().match(/(?<=\.)[^\)]+/g);
			column = $(this).parent().parent().find('.l1_column').val();
			$.ajax({
				'type'	:	'post',
				'url'	:	'/loadData/',
				'async': false,
				'data'	:	{'schema':schema[0],'table':table[0] , 'column' :column, action: 'getL1Data','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {

				if(res.status == '2'){
					
					row = ''
					$.each(res.result, function(i,v){
						row += '<span>'+v+'</span><hr class="popover-hr">';
					});
					row = row.replace(/<[^<]+$/g,'')
					$(current).popover({trigger: 'focus',content: row, html: true, title:'<span class="text-info"><strong>Distinct Values</strong></span> <a href="#" class="close-popover" data-dismiss="alert">x</a>' });
					$(current).popover('show')
					$(".popover").css("max-height", "350px");
					$(".popover").css("overflow-y", "auto");
					$('.close-popover').off('click');
					$('.close-popover').on('click', function(e) {
						e.preventDefault();
        				$(this).parents(".popover").popover('hide');
    				});
					
				}
				else{
					$(current).popover({trigger: 'focus',content: res.msg, html: true, title:'<span class="text-info"><strong>Error:</strong></span> <a href="#" class="close-popover" data-dismiss="alert">x</a>' });
					$(current).popover('show')
					$(".popover").css("max-height", "350px");
					$(".popover").css("overflow-y", "auto");
					$('.close-popover').off('click');
					$('.close-popover').on('click', function(e) {
						e.preventDefault();
        				$(this).parents(".popover").popover('hide');
    				});
				}
				
			});
		}
	});
}

function loadl2Data() {
	$('.load-l2-data').off('click');
	$('.load-l2-data').on('click', function(e) {
		e.preventDefault();
		current = this
		// $(this).tooltip({ items: $(this), content: "Displaying on click"});

		$(current).popover('dispose');
		
		if(($(this).parent().parent().find('.alias_select').val()!='' && $(this).parent().parent().find('.l1_column').val()!='') || $(this).parent().parent().find('.rule').val()!='' ){
			schema= '';
			table= '';
			column= '';
			rule= $(this).parent().parent().find('.rule').val();
			transform= $(this).parent().parent().find('.transform').val();
			alias= $(this).parent().parent().find('.alias_select').val();

			if($(this).parent().parent().find('.alias_select').val()!=''){
				schema = $(this).parent().parent().find('.alias_select').find('option:selected').text().match(/(?<=\()[^\.]+/g)[0];
				table = $(this).parent().parent().find('.alias_select').find('option:selected').text().match(/(?<=\.)[^\)]+/g)[0];
				if(schema=='subquery'){
					table=''
				}
				column = $(this).parent().parent().find('.l1_column').val();
			}
			$.ajax({
				'type'	:	'post',
				'url'	:	'/loadData/',
				'async': false,
				'data'	:	{'meta_id':$('.load-build').attr('meta_id'), 'schema':schema,'table':table, 'column' :column,'rule': rule ,'transform': transform,'alias': alias, action: 'getL2Data','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {

				if(res.status == '2'){
					
					row = ''
					$.each(res.result, function(i,v){
						row += '<span>'+v+'</span><hr class="popover-hr">';
					});
					row = row.replace(/<[^<]+$/g,'');
					$(current).popover({trigger: 'focus',content: row, html: true, title:'<span class="text-info"><strong>Distinct Values</strong></span> <a href="#" class="close-popover" data-dismiss="alert">x</a>' });
					$(current).popover('show')
					$(".popover").css("max-height", "350px");
					$(".popover").css("overflow-y", "auto");
					$('.close-popover').off('click');
					$('.close-popover').on('click', function(e) {
						e.preventDefault();
        				$(this).parents(".popover").popover('hide');
    				});

				}
				else{
					$(current).popover({trigger: 'focus',content: res.msg, html: true, title:'<span class="text-info"><strong>Error:</strong></span> <a href="#" class="close-popover" data-dismiss="alert">x</a>' });
					$(current).popover('show')
					$(".popover").css("max-height", "350px");
					$(".popover").css("overflow-y", "auto");
					$('.close-popover').off('click');
					$('.close-popover').on('click', function(e) {
						e.preventDefault();
        				$(this).parents(".popover").popover('hide');
    				});
				}
				
			});
		}
	});
}

function toSetDefaultOption(){
	defaultL1SchemaAll = window.defaultL1SchemaAll
	// console.log(defaultL1SchemaAll);
	$('.fschema').val($('#dflt_l1_schema').val()); // Set l1 schema to default schema

	table_select = '<option value="">Select Table</option>';
	$.each(defaultL1SchemaAll, function(i,v){
		table_select += '<option value="'+v+'">'+v+'</option>'
	});								
	$('.from_table').html(table_select); // Set l1 tables


}

function selectAlias() {
	$('.alias_select').off('change');
	$('.alias_select').on('change', function(e) {
		current= this
		parent = $(current).parent().parent().find('.l1_column').parent();
		$(parent).html('<select class="form-control-sm l1_column" ><option value="">Select Column</option></select>');
		column_select = '<option value="">Select Column</option>';
		$(current).parent().parent().find('.l1_column').html(column_select);
		console.log($(this).val());
		if($(this).val()!=''){
			console.log($(this).find('option:selected').text().match(/[^\(]+(?=\.)/g));
			console.log($(this).find('option:selected').text().match(/(?<=\.)[^\(]+/g));
			schema = $(this).find('option:selected').text().match(/(?<=\()[^\.]+/g)
			table = $(this).find('option:selected').text().match(/(?<=\.)[^\)]+/g)
			if(schema != 'subquery'){
				$.ajax({
					'type'	:	'post',
					'url'	:	'/create/',
					'async': false,
					'data'	:	{'schema': schema[0],'table':table[0] , 'action': 'getTableColumn','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
				}).done(function(res) {
					if (res.status == '2'){
						column_select = '<option value="">Select Column</option>';
						$.each(res.columns, function(i,v){
							column_select += '<option value="'+v['column']+'">'+v['column']+'</option>'
						});
						$(current).parent().parent().find('.l1_column').html(column_select);
					}
					else{
						error(res.msg);
					}
				});
				
			}
			else{
				parent = $(current).parent().parent().find('.l1_column').parent();
				$(current).parent().parent().find('.l1_column').remove();
				$(parent).html('<input type="text" class="form-control-sm l1_column" placeholder="Column Name">');
			}
		}
		
	});
}



function removeRow(){
	$('.deleterow').off('click');
	$('.deleterow').on('click', function(e) {
		
		if ($('#loadrows').html()!='') {
			$.each($('.alias_select option:selected[value="'+$(this).parent().parent().find('.alias-badge').text().match(/\S+$/g)[0]+'"]'),function(i,v) {
				$(v).parent().parent().parent().find('.l1_column').val('');
				$(v).parent().parent().parent().find('.rule').val('');
				$(v).parent().parent().parent().find('.transform').val('');


			});
			$('.alias_select option[value="'+$(this).parent().parent().find('.alias-badge').text().match(/\S+$/g)[0]+'"]').remove();

		}
		$.each($(this).parent().parent().nextAll().find('.alias-badge'),function(index, value){
			$.each($('.alias_select option:selected[value="'+$(value).text().match(/\S+$/g)[0]+'"]'),function(i,v) {
				$(v).parent().parent().parent().find('.l1_column').val('');
				$(v).parent().parent().parent().find('.rule').val('');
				$(v).parent().parent().parent().find('.transform').val('');


			});
			$('.alias_select option[value="'+$(value).text().match(/\S+$/g)[0]+'"]').remove();
			alias = parseInt($(value).text().match(/\d+$/g)[0])-1;
			$(value).text('Alias : T'+alias);
		});
		$(this).parent().parent().remove();
		if($('.joins').html()==''){
			$('.joins').html('<span>No Joins Available</span>');
		}
	});
}

function createNext() {
	$('#next').off('click');
	$('#next').on('click', function(e) {
		e.preventDefault();
		if (validate()){

			buildMetaDetails();
			if($('.fschema').val() ==''){
				toSetDefaultOption();
				
			}
			// animatedCreateForm();

			buttons();
			// addClause();
			$('#add_join').off('click');
			$('#add_join').on('click', function(e) {
				addJoin();
				removeRow();
			});
			$('.fschema').off('change');
			$('.fschema').on('change', function(e) {
				loadTables(this,'.from_table','');
				
			});
			$('.l2_column').each(function(index,item){
				sourceColumn(item);
			});
			
			
		}
		
	});
}

function buttons(){
	$('#submit').off('click');
	$('#submit').on('click', function(e) {
		e.preventDefault();
		if(validateBeforeSubmit() && validateMandatory()){
			buildData();
			
		}
	});
	
	$('#first-previous').off('click');
	$('#first-previous').on('click', function(e) {
		$("#progressbar li").eq($("fieldset").index($('#from-joins'))).removeClass("active");
		$('#hard').removeAttr("hidden");
		$('#from-joins').attr("hidden",'');
	});
	$('#second-previous').off('click');
	$('#second-previous').on('click', function(e) {
		$("#progressbar li").eq($("fieldset").index($('#build'))).removeClass("active");
		$('#from-joins').removeAttr("hidden");
		$('#build').attr("hidden",'');
	});
	$('#second-next').off('click');
	$('#second-next').on('click', function(e) {
		$("#progressbar li").eq($("fieldset").index($('#build'))).addClass("active");
		$('#from-joins').attr("hidden",'');
		$('#build').removeAttr("hidden");
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
function validateMandatory() {
	result = true
	$.each($('.l2_mend_column'),function(index, value){
		unsetError($(value));
		if($(value).parent().parent().find('.rule').val()=='' && $(value).parent().parent().find('.transform').val()==''){
			
			setError($(value),'Please fill for Mandatory Column '+$(value).val()+'.');
			result = false;
		}
	});
	return result;
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
	else{
		return true;	
		
	}

}

function buildData(){
	buildsheet_rows =[]
	meta_columns={}
	meta_rows=[]

	if($('#where_condition').val()!=''){
			row={}
			row.alias = ''
			row.default_l1schema = '';
			row.source_schema = '';
			row.source_table = '';
			row.source_column = '';
			row.rule = 'where'
			row.transform = $('#where_condition').val();
			row.dest_schema = ''
			row.dest_table = ''
			row.dest_column = ''
			row.dest_datatype = ''
			row.unique_key = '0'
			buildsheet_rows.push(row)
			
		}
	$.each($('#loadrows').find('.row'),function(index, value){
		row={}
		row.alias = $(value).find('.alias_select').val();
		row.default_l1schema = $('#dflt_l1_schema').val();
		if ($(value).find('.alias_select').val()!=''){
			row.source_schema = $(this).find('option:selected').text().match(/[^\(]+(?=\.)/g)[0];
			row.source_table = $(this).find('option:selected').text().match(/(?<=\.)[^\)]+/g)[0];
			
		}
		else {
			row.source_schema='';
			row.source_table='';
		}
		row.source_column = $(value).find('.l1_column').val();
		row.rule = $(value).find('.rule').val();
		row.transform = $(value).find('.transform').val();
		row.dest_schema = $('#l2_schema').val();
		row.dest_table = $('#l2_table').val();
		row.dest_column = $(value).find('.l2_column').val();
		row.dest_datatype = $(value).find('.l2_columntype').val();
		if($(value).find('#unique-key').prop('checked')){
			row.unique_key = '1';
		}
		else{
			row.unique_key = '0';
		}
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
	submitBuildsheet(meta_rows,buildsheet_rows,$('#l2_table').val());




}

function buildAliasDetails(){
	buildsheet_rows =[]
	meta_columns={}
	meta_rows=[]
	buildsheet_rows.push({unique_key:'0',alias:$('#main_table').parent().parent().find('.alias-badge').text().match(/\S+$/g)[0],dest_datatype:'',default_l1schema: $('#dflt_l1_schema').val(),dest_schema:'',source_schema:$('.fschema').val(),source_table:$('.from_table').val(),source_column:'',rule:'from',transform:'',dest_table:'',dest_column:''})
	$.each($('.joins').find('.row'),function(index, value){
		if($(value).find('#jtable_1').val()!=''){
			row={}
			row.alias = $(value).find('.alias-badge').text().match(/\S+$/g)[0];
			row.default_l1schema = $('#dflt_l1_schema').val();
			row.source_schema = ''
			row.source_table = ''
			row.source_column = ''
			row.rule = $(value).find('#join_type').val();
			row.transform = $(value).find('#join_condition').val();
			row.dest_schema = $(value).find('.jschema_2').val();
			row.dest_table = $(value).find('#jtable_2').val();
			row.dest_column = ''
			row.dest_datatype = ''
			row.unique_key = '0'
			buildsheet_rows.push(row)
			
		}
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
	meta_columns.l2_schema= $('#l2_schema').val();
	meta_columns.l2_table = $('#l2_table').val();
	meta_rows.push(meta_columns);	
	submitAliasDetails(meta_rows,buildsheet_rows,$('#l2_table').val());

}

function buildMetaDetails(){
	meta_columns={}
	meta_rows=[]
	
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
	meta_columns.l2_schema= $('#l2_schema').val();
	meta_columns.l2_table = $('#l2_table').val();
	meta_rows.push(meta_columns);
	
	submitMetaDetails(meta_rows,$('#l2_table').val());
}

function submitMetaDetails(meta_rows,l2_category){
	meta_id = $('.load-build').attr('meta_id');
	$.ajax({
			'type'	:	'post',
			'url'	:	'/buildsheetSubmit/',
			'async': false,
			'contentType': "application/x-www-form-urlencoded;charset=UTF-8",
			'data'	:	{'buildsheet_id':$('#hard').attr('buildsheet_id'),'meta_id':meta_id,'category':l2_category,'meta_data':JSON.stringify(meta_rows) , 'action': 'submitMetaBuild','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
	}).done(function(res) {
		if (res.status =='2'){
			info(res.msg);
			$('.load-build').attr('meta_id',res.meta_id);
			$("#progressbar li").eq($("fieldset").index($('#from-joins'))).addClass("active");
			$('#from-joins').removeAttr("hidden");
			$('#hard').attr("hidden",'');
		}
		else{
			error(res.msg);
		}
	});
}

function submitAliasDetails(meta_rows,buildsheet_rows,l2_category){
	meta_id = $('.load-build').attr('meta_id');
	$.ajax({
			'type'	:	'post',
			'url'	:	'/buildsheetSubmit/',
			'async': false,
			'contentType': "application/x-www-form-urlencoded;charset=UTF-8",
			'data'	:	{'buildsheet_id':$('#hard').attr('buildsheet_id'),'meta_id':meta_id,'category':l2_category, 'buildsheet_data':JSON.stringify(buildsheet_rows),'meta_data':JSON.stringify(meta_rows) , 'action': 'submitAliasBuild','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
	}).done(function(res) {
		if (res.status =='2'){
			$('.load-build').attr('meta_id',res.meta_id);
			info(res.msg);
		}
		else{
			
			error(res.msg);
		}

	});
}

function submitBuildsheet(meta_rows,buildsheet_rows,l2_category) {
		$('#submit').attr('disabled','');
		meta_id = $('.load-build').attr('meta_id');
		var req = {}; 
		$.ajax({
			'type'	:	'post',
			'url'	:	'/buildsheetSubmit/',
			'async': false,
			'contentType': "application/x-www-form-urlencoded;charset=UTF-8",
			'data'	:	{'buildsheet_id':$('#hard').attr('buildsheet_id'),'meta_id':meta_id,'category':l2_category,'meta_data':JSON.stringify(meta_rows),'buildsheet_data':JSON.stringify(buildsheet_rows) , 'action': 'submitMappingBuild','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
		}).done(function(res) {
			if (res.status =='2'){
					$('#sql-modal').modal('show');
					$('#sql').text(res.query);
					getSQLToModal(res.query);
			}
			else{
				error(res.msg);
			}
			// console.log(JSON.stringify(res.toString()))
			
		});

	}


function distinctArray(array){
	newArray =[]
	$.each(array,function(index,item){
		if($.inArray(item, newArray) == -1 ){
			newArray.push(item);
		} 
	});
	return newArray
}


function loadTables(schema_tag,table_tag,selected_table) {
	current = schema_tag
	if(table_tag=='.jtable_2'){
		parent = $(current).parent().parent().find(table_tag).parent();
		$(current).parent().parent().find(table_tag).remove();
		$(parent).html('<select class="form-control-sm jtable_2" id="jtable_2"><option value="">Select Table</option></select>');
	}
	
	var table_select ='<option value="">Select Table</option>'
	$(current).parent().parent().find(table_tag).html(table_select);
	if($(current).val()!='' && $(current).val()!='subquery'){
		$.ajax({
			'type'	:	'post',
			'url'	:	'/create/',
			'async': false,
			'data'	:	{'schema':$(current).val(), 'action': 'getSchemaTables','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
		}).done(function(res) {
				if(res.status=='2'){
					$.each(res.tables, function( index, value){
						table_select +='<option value="'+value+'">'+value+'</option>';
					});
					$(current).parent().parent().find(table_tag).html(table_select);
					if(selected_table!==''){
						$(current).parent().parent().find(table_tag).val(selected_table);
					}
				}
				else{
					error(res.msg);
				}
			
		});
	}
	else if($(current).val()=='subquery'){
		if(table_tag=='.jtable_2'){
			parent = $(current).parent().parent().find(table_tag).parent();
			$(current).parent().parent().find(table_tag).remove();
			$(parent).html('<textarea class="form-control-sm jtable_2" rows="3" cols="30" id="jtable_2"></textarea>')
			
		}
		if(table_tag =='.l1_column'){
			parent = $(current).parent().parent().find(table_tag).parent();
			$(current).parent().parent().find(table_tag).remove();
			$(parent).html('<input type="text" class="form-control-sm l1_column" placeholder="Add Column">')

		}
	}
}


function addJoin() {
	if($('.joins').html()=='<span>No Joins Available</span>'){
		$('.joins').html('');
	}
	var schema_select_2 = '<option value="">Select Schema</option><option value="subquery">SubQuery</option>'
	$.each(window.schemas, function(index, value){
		schema_select_2 +='<option value="'+value+'">'+value+'</option>'
	});

	var added_join = ''
	var alias_no = parseInt($('.alias-badge').length)+parseInt('1')
	$('.joins').append('<div class="row"><div class="col-sm form-group"><select class="form-control-sm " id="join_type"><option value="">Select Join</option><option value="inner join">Inner Join</option><option value="left join">Left Join</option><option value="right join">Right Join</option></select></div><div class="col-sm form-group"><select class="form-control-sm jschema_2">'+schema_select_2+'</select></div><div class="col-sm form-group"><select class="form-control-sm jtable_2" id="jtable_2"><option value="">Select Table</option></select></div><div class="col-md-1 form-group"><div class="badge alias-badge">Alias : T'+alias_no+'</div></div><div class="col-md-3  form-group"><textarea name="join_condition" placeholder="Join Conditions" id="join_condition" class="form-control-sm"></textarea></div><div class="col-sm"><button class="btn-sm deleterow" style="height: 30px;float: left;"><strong>X</strong></button></div></div>');

	$('.joins').find('.row:nth-last-child(1)').find('.jschema_2').off('change');
	$('.joins').find('.row:nth-last-child(1)').find('.jschema_2').on('change', function(e) {
		loadTables(this,'.jtable_2','');
		
	});
	added_join =  $('.joins').find('.row:nth-last-child(1)');
	$('.joins').find('.row:nth-last-child(1)').find('.jschema_2').val($('#dflt_l1_schema').val()).trigger('change');

	return added_join
}