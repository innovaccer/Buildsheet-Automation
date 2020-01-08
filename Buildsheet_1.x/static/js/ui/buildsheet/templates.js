$(function() {
	dataSourceChange();
	$(".custom-file-input").on("change", function() {
	  var fileName = $(this).val().split("\\").pop();
	  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
	});
	verifyBuildsheet();



});

function dataSourceChange(){
	$('#data-source').off('change');
	$('#data-source').on('change', function(e) {
		e.preventDefault();
		// $('#l2_table').html('<option value="">Select table</option>');
		// $('#source-version').attr('hidden','true');
		$('#source-version').html('');
		$('#template-button').html('');
		if ($("#data-source option:selected").val()!='' && $("#data-source option:selected").val()!='Upload Buildsheet'){
			$.ajax({
				'type'	:	'post',
				'url'	:	'/templates/',
				'async': false,
				'data'	:	{ data_id: $("#data-source option:selected").attr('data-id'), action: 'getSourceVersion','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {

					if(res.status=='2' && res.versions.length!=0){
						var select ='<label for="">Data Source Version <span class="text-danger">*</span></label><br><select class="form-control form-control-sm form-control-custom" id="data-source-version"><option value="">Select Version</option>'
						$.each(res.versions, function( index, value){
							select +='<option value="'+value[1]+'">'+value[1]+'</option>'
						});
						select += '</select>';
						$('#source-version').html(select);
						// $('#source-version').removeAttr('hidden');
						$('#template-button').html('<label for=""><span class="text-danger"></span></label><br><button type="button"  id="template-map" style="FLOAT: LEFT;margin-top: 8px;" align="right"  class="btn-sm btn-outline-primary" data-toggle="modal" data-target="#template-modal">Map</button>');
						changeAliasMapping();
						$('#template-body').html('');
					}
					

			});
		}
		if($("#data-source option:selected").val()!='' && $("#data-source option:selected").val()=='Upload Buildsheet'){

			$('.buildsheet-browse').html('<label for=""><span class="text-danger"></span></label><br><button type="button"  id="buildsheet-browse-btn" style="FLOAT: LEFT;margin-top: 8px;" align="right"  class="btn-sm btn-outline-primary" data-toggle="modal" data-target="#browse-modal">Browse</button>');
		}
	});

}

function changeAliasMapping(){
	$('#template-map').off('click');
	$('#template-map').on('click', function(e) {
		e.preventDefault();
		if ($("#data-source option:selected").val()!='' && $("#data-source-version").val()!=''){
			$.ajax({
				'type'	:	'post',
				'url'	:	'/templates/',
				'async': false,
				'data'	:	{ source: $("#data-source option:selected").val(),source_version: $("#data-source-version option:selected").val(), action: 'getAliasMapping','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {

					if(res.status=='2'){
						schema_select = '<option value="">Select Schema</option>';
						$.each(res.schemas, function(i,v){
							schema_select += '<option value="'+v+'">'+v+'</option>'
						});
						rows = ''
						$.each(res.mapping, function(i,v){
							rows +='<div class="row" id="'+v[1]+'"> <div class="col-sm"> <input type="text" name="" placeholder="" id="template-column" value="'+v[2]+'" class="form-control form-control-sm " disabled> </div> <div class="col-sm form-group"> <select class="form-control-sm  schema-map" id="schema-map"> '+schema_select+' </select> </div> <div class="col-sm form-group"> <select class="form-control-sm " id="table-map"> <option value="">Select Table</option> </select> </div> </div>'
						});
						if($('#template-body').html()==''){
							$('#template-body').html(rows);
							
						}
						$('.schema-map').off('change');
						$('.schema-map').on('change', function(e) {
							loadTables(this,'#table-map','');
							
						});	
						console.log(res);
						
					}
					

			});
		}
	});
}

function getTemplateMapping() {

			$.ajax({
				'type'	:	'post',
				'url'	:	'/templates/',
				'async': false,
				'data'	:	{ source: $("#data-source option:selected").val(),source_version: $("#data-source-version option:selected").val(), action: 'getTemplateMapping','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {

					if(res.status=='2'){
						console.log(res);
						fillfrom(res.from[0]);
						$.each(res.joins,function(index,value){
							fillJoins(value);
						});
						$('.load-build').trigger('click');
						$.each(res.buildsheet,function(index,value){
							if(res.buildsheet[0][3]== $('#l2_table').val()){
								fillBuildsheet(value);
							  	
							}
							
						});
					}
					

			});
	

}

function fillJoins(joins_row){
	if(joins_row[5].toLowerCase().search("join")!=-1){
		currentJoin = addJoin();
		$(currentJoin).find('#join_type').val(joins_row[5]);
		$(currentJoin).find('#join_condition').val(joins_row[6]);
		$(currentJoin).find('.jschema_2').val($('#'+joins_row[7]).find('.schema-map').val());
		$(currentJoin).find('.alias-badge').text("Alias : "+joins_row[7]);
		loadTables($(currentJoin).find('.jschema_2'),'.jtable_2',$('#'+joins_row[7]).find('#table-map').val());
		removeRow();
	}
}
function fillfrom(from_row){
	if(from_row[5].toLowerCase()=='from'){

		$('.fschema').val($('#'+from_row[7]).find('.schema-map').val());
		$('.fschema').parent().parent().find('.alias-badge').text("Alias : "+from_row[7])
		loadTables('.fschema','.from_table',$('#'+from_row[7]).find('#table-map').val());
	}
}

function fillBuildsheet(buildsheet_row) {
		not_allowed = ['where','from']

		var row = $('#loadrows').find('#'+buildsheet_row[4]+"l2").parent().parent();
		if($(row).find('.alias_select option:selected').text()!='Meta Alias'){
			$(row).attr('buildsheet_id',buildsheet_row[0])
			if(buildsheet_row[3]!=''){
				$(row).find('.alias_select').val(buildsheet_row[7]).trigger("change");
				$(row).find('.l1_column').val(buildsheet_row[2]);

			}
			$(row).find('.rule').val(buildsheet_row[5]);
			$(row).find('.transform').val(buildsheet_row[6]);

		}
		else{
			(row).attr('buildsheet_id',buildsheet_row[0])
		}  

}

function verifyBuildsheet() {
	$('#verify-buildsheet').off('click');
	$('#verify-buildsheet').on('click', function(e) {
		e.preventDefault();
		$('#buildsheet-mapping').html('');
		if($('#customFile').val()!=''){
			// var fd = new FormData();
			// The Javascript
			var fileInput = document.getElementById('customFile');
			var file = fileInput.files[0];
			var formData = new FormData();
			formData.append('file', file);
            formData.append("action", "verifyBuildsheet");
            formData.append("csrfmiddlewaretoken", $( "input[name='csrfmiddlewaretoken']" ).val());
            // file =''
            console.log(file);
			$.ajax({
				'type'	:	'post',
				'url'	:	'/templates/',
				'async': false,
				'data':formData,
				'contentType': false,
  				'processData': false,
				// 'data'	:	{ buildsheet_file: file, action: 'verifyBuildsheet','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {

					if(res.status=='2'){
						window.joins = res.joins
						window.from = res.from
						window.mapping = res.rows
						window.where = res.where
						console.log(res);
						schema_select = '<option value="">Select Schema</option>';
						$.each(res.schemas, function(i,v){
							schema_select += '<option value="'+v+'">'+v+'</option>'
						});
						rows = ''
						$.each(res.tables, function(i,v){
							rows +='<div class="row"> <div class="col-sm"> <input type="text" name="" placeholder="" id="template-column" value="'+v+'" class="form-control form-control-sm " disabled> </div> <div class="col-sm form-group"> <select class="form-control-sm  schema-map" id="schema-map"> '+schema_select+' </select> </div> <div class="col-sm form-group"> <select class="form-control-sm table-map" id="table-map"> <option value="">Select Table</option> </select> </div> </div>'
						});

						if($('#buildsheet-mapping').html()==''){
							$('#buildsheet-mapping').html(rows);
							
						}
						$('.schema-map').off('change');
						$('.schema-map').on('change', function(e) {
							loadTables(this,'#table-map','');
							
						});
						if($('#dflt_l1_schema').val()!=''){
							$.each($('.schema-map'),function(i,v){
								$(v).val($('#dflt_l1_schema').val()).trigger('change');
							});
							
						}
						
					}
					

			});
		}
		else{
			error('Please Upload Buildsheet');
		}
	});
}

function fillExistingBuildsheet() {
	
	//fill from
	from = window.from
	$('.fschema').val($("#template-column[value='"+from[0][3]+"']").parent().parent().find('#schema-map').val());
	$('.fschema').parent().parent().find('.alias-badge').text("Alias : "+from[0][1]);
	loadTables('.fschema','.from_table',$("#template-column[value='"+from[0][3]+"']").parent().parent().find('#table-map').val());

	//fill joins
	joins = window.joins
	$.each(joins,function(index,value){
		currentJoin = addJoin();
		$(currentJoin).find('#join_type').val(value[6]);
		$(currentJoin).find('#join_condition').val(value[7]);
		$(currentJoin).find('.jschema_2').val($("#template-column[value='"+value[9]+"']").parent().parent().find('#schema-map').val());
		$(currentJoin).find('.alias-badge').text("Alias : "+value[1]);
		loadTables($(currentJoin).find('.jschema_2'),'.jtable_2',$("#template-column[value='"+value[9]+"']").parent().parent().find('#table-map').val());
		removeRow();
	});
	//fill buildsheets
	buildsheet = window.mapping
	$('.load-build').trigger('click');
	$.each(buildsheet,function(index,value){
		if(value[0]== $('#l2_table').val()){

			var row = $('#loadrows').find('#'+value[10]+"l2").parent().parent();
			if($(row).find('.alias_select option:selected').text()!='Meta Alias'){
				// $(row).attr('buildsheet_id',value[0])
				if(value[4]!=''){
					$(row).find('.alias_select').val(value[1]).trigger("change");
					$(row).find('.l1_column').val(value[4]);

				}
				$(row).find('.rule').val(value[6]);
				$(row).find('.transform').val(value[7]);
				if(value[5]=='1'){
					$(row).find('#unique-key').prop("checked",true);
				}
				else{
					$(row).find('#unique-key').prop("checked",false);
				}

				

			}
		  	
		}
		
	});
	//fill where
	$('#where_condition').val(window.where[0][7]);
	
}

function validateUploadBuildsheet() {

	result = true
	if($('#data-source option:selected').attr('data-id')=='438'){
		if($('#customFile').val()==''){
				
				error('Please upload Buildsheet file');
				result = false;

		}
		if($('#buildsheet-mapping').html()==''){
			error('Please Verify Buildsheet');
				result = false;
		}
		$.each($('#buildsheet-mapping').find('.table-map'),function(index, value){
			
			if($(value).val()==''){
				
				error('Please map buildsheet table');
				result = false;	
			}
			

		});
		
	}
	
	return result
	

}