
$(function() {
	loadMeta();
	selectL2Schema();
	// selectDefaultL1Schema();
	createNext();
	getSQL();
	getReport();
	deleteBuildsheet();

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
				'data'	:	{schema:$("#l2_schema option:selected").val() , action: 'getSchemaTables','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {


				var l2_select ='<option value="">Select table</option>'
				$.each(res.tables, function( index, value){
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
		$('#loadrows').html('');
		$('#pd_category').html('');
		$('#pd_category').parent().attr('hidden','')
		
		if ($("#l2_table option:selected").val()!='' /* && $("#l2_table option:selected").val()!='pd_activity'*/){
			var req = {}; 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/create/',
				'data'	:	{schema:$("#l2_schema option:selected").val(),table:$("#l2_table option:selected").val() , action: 'getL2Columns','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				window.schemas = res.schemas
				var schema_select = '<option value="">Select Schema</option>'
				$.each(res.schemas, function(index, value){
					schema_select +='<option value="'+value+'">'+value+'</option>'
				})
				$('.jschema_1,.jschema_2,.wschema,.fschema').html(schema_select);
				loadBuild();
				loadMapping();
			});
			
		}

	
	});

}


function loadMapping() {
	$('#load-build').off('click');
	$('#load-build').on('click', function(e) {
		e.preventDefault();
		buildMetaDetails();
		 if ($("#l2_table option:selected").val()!='' && $('#loadrows').html()=='' && validateBeforeSubmit()){
			var req = {}; 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/create/',
				'async': false,
				'data'	:	{schema:$("#l2_schema option:selected").val(),table:$("#l2_table option:selected").val() , action: 'getL2Columns','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {


				var alias_select = '<option value="">Select Alias</option>'
				$.each($('.alias-badge'), function(index, value){
					alias_select +='<option value="'+$(value).text().match(/\S+$/g)+'">'+$(value).text().match(/\S+$/g)+'('+$(value).parent().parent().find('.jschema_2,.fschema').val()+'.'+$(value).parent().parent().find('.jtable_2,.from_table').val()+')'+'</option>'
				})


				var rule_select ='<option value="">Select Rule</option>'

				$.each(res.rules, function(index, value){
					rule_select +='<option value="'+value+'">'+value.toUpperCase()+'</option>'
				})
				$('.build-head,.wheres,#update').removeAttr('hidden');
				meta_columns = ['source_id','source_name','source_type','workflow_id','author','ingestion_datetime','vendor_version','vendor_name','aco_id','aco_name','source_file_name','workspace_id','indata_created_on','pipeline_id'];
				$.each(res.columns, function( index, value ) {
					if(meta_columns.indexOf(value['column']) == -1){
						$('#loadrows').append('<div class="row"><div class="col-sm"><select class="form-control-sm alias_select" > '+alias_select+'</select> </div><div class="col-sm"><select class="form-control-sm l1_column" > <option value="">Select Column</option></select> </div><div><a class="form-inline btn load-l1-data " data-toggle="popover"  data-trigger="click" data-placement="right" href="#" style="padding: 0px;margin-top: 4px;"><span class="glyphicon glyphicon glyphicon-eye-open"></span></a></div><div class="col-sm"><select class="form-control-sm rule">'+rule_select+' </select> </div><div class="col-sm"><input type="text" class="form-control-sm transform" Placeholder="Add Transformation" ></div><div class="col-sm"><input type="text" class="form-control-sm l2_table" value ='+$("#l2_table option:selected").val()+' readonly="true"></div><div class="col-sm"><input type="text" class="form-control-sm l2_column" id='+value['column']+'l2 value="'+value['column']+'" readonly="true"> </div><div><a class="form-inline btn load-l2-data " data-toggle="popover"  data-trigger="click" data-placement="right" href="#" style="padding: 0px;margin-top: 4px;"><span class="glyphicon glyphicon glyphicon-eye-open"></span></a></div><div class="col-sm"><input type="text" class="form-control-sm l2_columntype" value="'+value['type']+'" readonly="true"> </div></div>');
					}
					else{
						$('#loadrows').prepend('<div class="row"><div class="col-sm"><select class="form-control-sm alias_select" > '+alias_select+'</select> </div><div class="col-sm"><select class="form-control-sm l1_column" > <option value="">Select Column</option></select> </div><div><a class="form-inline btn" href="#" style="padding: 0px;margin-top: 4px;"><span class="glyphicon glyphicon glyphicon-eye-close"></span></a></div><div class="col-sm"><select class="form-control-sm rule">'+rule_select+' </select> </div><div class="col-sm"><input type="text" class="form-control-sm transform" Placeholder="Add Transformation" ></div><div class="col-sm"><input type="text" class="form-control-sm l2_table" value ='+$("#l2_table option:selected").val()+' readonly="true"></div><div class="col-sm"><input type="text" class="form-control-sm l2_column" id='+value['column']+'l2 value="'+value['column']+'" readonly="true"> </div><div><a class="form-inline btn" href="#" style="padding: 0px;margin-top: 4px;"><span class="glyphicon glyphicon glyphicon-eye-close"></span></a></div><div class="col-sm"><input type="text" class="form-control-sm l2_columntype" value="'+value['type']+'" readonly="true"> </div></div>');
					}
				});
				$('.l2_column').each(function(index,item){
					sourceColumn(item);
				});
				selectAlias();
				loadl1Data();
				loadl2Data();
			});
				
		}
		else if ($('#loadrows').html()!=''  && validateBeforeSubmit()){
			alias =[]
			alias_schematable=[]
			$.each($('#loadrows').find('.row:nth-last-child(1)').find('.alias_select option'),function(i,v){
				alias.push($(v).val());
				alias_schematable.push($(v).text());
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
				'data'	:	{'schema':schema[0],'table':table[0] , 'column' :column, action: 'getL1Data','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {

				if(res.status == '2'){
					
					row = ''
					$.each(res.result, function(i,v){
						row += '<span>'+v+'</span><hr class="popover-hr">';
					});
					row = row.replace(/<[^<]+$/g,'')
					$(current).popover({trigger: 'click',content: row, html: true, title:'<span class="text-info"><strong>Distinct Values</strong></span> <a href="#" class="close-popover" data-dismiss="alert">x</a>' });
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
					$(current).popover({trigger: 'click',content: res.msg, html: true, title:'<span class="text-info"><strong>Error:</strong></span> <a href="#" class="close-popover" data-dismiss="alert">x</a>' });
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
				schema = $(this).parent().parent().find('.alias_select').find('option:selected').text().match(/[^\(]+(?=\.)/g)[0];
				table = $(this).parent().parent().find('.alias_select').find('option:selected').text().match(/(?<=\.)[^\)]+/g)[0];
				column = $(this).parent().parent().find('.l1_column').val();
			}
			$.ajax({
				'type'	:	'post',
				'url'	:	'/loadData/',
				'data'	:	{'meta_id':$('#load-build').attr('meta_id'), 'schema':schema,'table':table, 'column' :column,'rule': rule ,'transform': transform,'alias': alias, action: 'getL2Data','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {

				if(res.status == '2'){
					
					row = ''
					$.each(res.result, function(i,v){
						row += '<span>'+v+'</span><hr class="popover-hr">';
					});
					row = row.replace(/<[^<]+$/g,'');
					$(current).popover({trigger: 'click',content: row, html: true, title:'<span class="text-info"><strong>Distinct Values</strong></span> <a href="#" class="close-popover" data-dismiss="alert">x</a>' });
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
					$(current).popover({trigger: 'click',content: res.msg, html: true, title:'<span class="text-info"><strong>Error:</strong></span> <a href="#" class="close-popover" data-dismiss="alert">x</a>' });
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

function buildMetaDetails(){
	buildsheet_rows =[]
	meta_columns={}
	meta_rows=[]
	buildsheet_rows.push({alias:$('#main_table').parent().parent().find('.alias-badge').text().match(/\S+$/g)[0],dest_datatype:'',default_l1schema: $('#dflt_l1_schema').val(),dest_schema:'',source_schema:$('.fschema').val(),source_table:$('.from_table').val(),source_column:'',rule:'from',transform:'',dest_table:'',dest_column:''})
	$.each($('.joins').find('.row'),function(index, value){
		if($(value).find('#jtable_1').val()!=''){
			row={}
			row.alias = $(value).find('.alias-badge').text().match(/\S+$/g)[0];
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
	meta_columns.source_id= $('#source_id').val();
	meta_columns.l2_schema= $('#l2_schema').val();
	meta_columns.l2_table= $('#l2_table').val();
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
	
	submitMetaDetails(meta_rows,buildsheet_rows,$('#l2_table').val());
}

function submitMetaDetails(meta_rows,buildsheet_rows,l2_category){
	
	meta_id = $('#load-build').attr('meta_id');

	$.ajax({
			'type'	:	'post',
			'url'	:	'/buildsheetSubmit/',
			'data'	:	{'meta_id':meta_id,'category':l2_category,'meta_data':JSON.stringify(meta_rows),'buildsheet_data':JSON.stringify(buildsheet_rows) , 'action': 'submitMetaBuild','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
		}).done(function(res) {
			if (res.status =='2'){
				$('#load-build').attr('meta_id',res.meta_id);
					
			}

			
		});
}
function selectAlias() {
	$('.alias_select').off('change');
	$('.alias_select').on('change', function(e) {
		current= this
		column_select = '<option value="">Select Column</option>';
		$(current).parent().parent().find('.l1_column').html(column_select);
		if($(this).val()!=''){
			schema = $(this).find('option:selected').text().match(/[^\(]+(?=\.)/g)
			table = $(this).find('option:selected').text().match(/(?<=\.)[^\)]+/g)
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
			});
		}
	});
}



function addJoin() {
	
	var schema_select = '<option value="">Select Schema</option>'
	$.each(window.schemas, function(index, value){
		schema_select +='<option value="'+value+'">'+value+'</option>'
	});

	var added_join = ''
	var alias_no = parseInt($('.alias-badge').length)+parseInt('1')
	$('.joins').append('<div class="row"><div class="col-sm  form-group"><select class="form-control-sm jschema_1">'+schema_select+'</select></div><div class="col-sm  form-group"><select class="form-control-sm jtable_1" id="jtable_1"><option value="">Select Table</option></select></div><div class="col-sm form-group"><select class="form-control-sm " id="join_type"><option value="">Select Join</option><option value="inner join">Inner Join</option><option value="left join">Left Join</option><option value="right join">Right Join</option></select></div><div class="col-sm form-group"><select class="form-control-sm jschema_2">'+schema_select+'</select></div><div class="col-sm form-group"><select class="form-control-sm jtable_2" id="jtable_2"><option value="">Select Table</option></select></div><div class="col-sm form-group"><div class="badge alias-badge">Alias : T'+alias_no+'</div></div><div class="col-sm  form-group"><input type="text" name="join_condition" placeholder="Join Condition" id="join_condition" class="form-control-sm"></div><div class="col-sm"><button class="btn-sm deleterow" style="height: 30px;"><strong>X</strong></button></div></div>');
	$('.joins').find('.row:nth-last-child(1)').find('.jschema_1')
	$('.joins').find('.row:nth-last-child(1)').find('.jschema_1').off('change');
	$('.joins').find('.row:nth-last-child(1)').find('.jschema_1').on('change', function(e) {
		loadTables(this,'.jtable_1','');
		
	});
	$('.joins').find('.row:nth-last-child(1)').find('.jschema_2').off('change');
	$('.joins').find('.row:nth-last-child(1)').find('.jschema_2').on('change', function(e) {
		loadTables(this,'.jtable_2','');
		
	});
	added_join =  $('.joins').find('.row:nth-last-child(1)');
	$('.joins').find('.row:nth-last-child(1)').find('.jschema_1').val($('#dflt_l1_schema').val()).trigger('change');
	$('.joins').find('.row:nth-last-child(1)').find('.jschema_2').val($('#dflt_l1_schema').val()).trigger('change');

	return added_join
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
	});

}


function createNext() {
	$('#next').off('click');
	$('#next').on('click', function(e) {
		e.preventDefault();
		if (validate()){

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

			
			buttons();
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

	// buildsheet_rows.push({alias:$('#main_table').parent().parent().find('.alias-badge').text().match(/\S+$/g)[0],dest_datatype:'',default_l1schema: $('#dflt_l1_schema').val(),dest_schema:'',source_schema:$('.fschema').val(),source_table:$('.from_table').val(),source_column:'',rule:'from',transform:'',dest_table:'',dest_column:''})
	// $.each($('.joins').find('.row'),function(index, value){
	// 	if($(value).find('#jtable_1').val()!=''){
	// 		row={}
	// 		row.alias = $(value).find('.alias-badge').text().match(/\S+$/g)[0];
	// 		row.default_l1schema = $('#dflt_l1_schema').val();
	// 		row.source_schema = $(value).find('.jschema_1').val();
	// 		row.source_table = $(value).find('#jtable_1').val();
	// 		row.source_column = ''
	// 		row.rule = $(value).find('#join_type').val();
	// 		row.transform = $(value).find('#join_condition').val();
	// 		row.dest_schema = $(value).find('.jschema_2').val();
	// 		row.dest_table = $(value).find('#jtable_2').val();
	// 		row.dest_column = ''
	// 		row.dest_datatype = ''
	// 		buildsheet_rows.push(row)
			
	// 	}
	// });

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
		row.dest_table = $(value).find('.l2_table').val();
		row.dest_column = $(value).find('.l2_column').val();
		row.dest_datatype = $(value).find('.l2_columntype').val();
		buildsheet_rows.push(row)
	});
	// $.each($('.aliasing').find('.row'),function(index, value){
	// 	row={}
	// 	row.alias=''
	// 	row.default_l1schema = $('#dflt_l1_schema').val();
	// 	row.source_schema = $(value).find('.alias-schema').val();
	// 	row.source_table = $(value).find('.alias-table').val();
	// 	row.source_column = ''
	// 	row.rule = 'alias'
	// 	row.transform = $(value).find('.alias').val();
	// 	row.dest_schema = ''
	// 	row.dest_table = ''
	// 	row.dest_column = ''
	// 	row.dest_datatype = ''
	// 	buildsheet_rows.push(row)
	// });
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
	submitBuildsheet(meta_rows,buildsheet_rows,$('#l2_table').val());




}
function submitBuildsheet(meta_rows,buildsheet_rows,l2_category) {
		$('#submit').attr('disabled','');
		meta_id = $('#load-build').attr('meta_id');
		var req = {}; 
		$.ajax({
			'type'	:	'post',
			'url'	:	'/buildsheetSubmit/',
			'data'	:	{'meta_id':meta_id,'category':l2_category,'meta_data':JSON.stringify(meta_rows),'buildsheet_data':JSON.stringify(buildsheet_rows) , 'action': 'submitBuild','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
		}).done(function(res) {
			if (res.status =='2'){
					// toastr.success(res.message);
					// setTimeout(function() {window.location = 'buildsheet/';}, 1100);
					$('#sql-modal').modal('show');
					getSQLToModal(res.query);
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
	fillSchema(response.l2_schema,'#l2_schema',response.category);
	fillSchema(meta_rows[0][19],'#dflt_l1_schema','');
	$('#pipeline_id').val(meta_rows[0][15]);
	$('#author').val(meta_rows[0][6]);
	$('#source_file_name').val(meta_rows[0][12]);
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
			$.each(res.from,function(index,value){
				fillfrom(value);	
				
			});
			$.each(res.joins,function(index,value){
				fillJoins(value);
			});
			$('#load-build').attr('meta_id',meta_id);
			$('#load-build').trigger('click');
			$.each(res.buildsheet,function(index,value){
				if(res.buildsheet[0][1]== $('#l2_table').val()){
					fillBuildsheet(value);
				  	$("#loader").hide();
				}
				
			});
			
			
			
		}
		
		
	});
}
function fillJoins(joins_row){
	if(joins_row[6].toLowerCase().search("join")!=-1){
		currentJoin = addJoin();
		$(currentJoin).find('#join_type').val(joins_row[6]);
		$(currentJoin).find('#join_condition').val(joins_row[7]);
		$(currentJoin).find('.jschema_1').val(joins_row[13]);
		$(currentJoin).find('.jschema_2').val(joins_row[12]);
		$(currentJoin).find('.alias-badge').text("Alias : "+joins_row[15]);
		loadTables($(currentJoin).find('.jschema_1'),'.jtable_1',joins_row[2]);
		loadTables($(currentJoin).find('.jschema_2'),'.jtable_2',joins_row[4]);
		removeRow();
	}
}
function fillfrom(from_row){
	if(from_row[6].toLowerCase()=='from'){
		$('.fschema').val(from_row[13]);
		$('.fschema').parent().parent().find('.alias-badge').text("Alias : "+from_row[15])
		loadTables('.fschema','.from_table',from_row[2]);
	}
}

function fillBuildsheet(buildsheet_row) {
	// console.log('fillBuildsheet '+(buildsheet_row[6]));
	not_allowed = ['where','from']

	if(not_allowed.indexOf(buildsheet_row[6].toLowerCase()) == -1){

		var row = $('#loadrows').find('#'+buildsheet_row[5]+"l2").parent().parent();
		// console.log(row);
		if($(row).find('.alias_select option:selected').text()!='Meta Alias'){
			$(row).attr('buildsheet_id',buildsheet_row[0])
			// $('.wheres').find('.row').attr('buildsheet_id',buildsheet_row[0])
			if(buildsheet_row[3]!=''){
				$(row).find('.alias_select').val(buildsheet_row[15]).trigger("change");
				$(row).find('.l1_column').val(buildsheet_row[3]);

			}
			$(row).find('.rule').val(buildsheet_row[6]);
			$(row).find('.transform').val(buildsheet_row[7]);
		}
		else{
			(row).attr('buildsheet_id',buildsheet_row[0])
		}

	}
	else if(buildsheet_row[6].toLowerCase()=='where'){
		$('#where_condition').val(buildsheet_row[7]);
	}

}

// function updateBuildsheet(meta_rows,buildsheet_rows,l2_category) {
// 	var meta_id =$(location).attr('href').replace(/.+:\d+\//g, '').match(/\d+/g);
// 	$('#update').attr('disabled','');
// 			$.ajax({
// 				'type'	:	'post',
// 				'url'	:	'/buildsheets/'+meta_id[0]+'/update/',
// 				'data'	:	{'category':l2_category,'meta_data':JSON.stringify(meta_rows),'buildsheet_data':JSON.stringify(buildsheet_rows) , 'action': 'updateBuild','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
// 			}).done(function(res) {
// 					$('#sql-modal').modal('show');
// 					getSQLToModal(res.query);
// 				}
				
// 			);
			
//}

function loadTables(schema_tag,table_tag,selected_table) {
	current = schema_tag
	var table_select ='<option value="">Select Table</option>'
	$(current).parent().parent().find(table_tag).html(table_select);
	if($(current).val()!=''){
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
			
			
		});
	}

	
}
