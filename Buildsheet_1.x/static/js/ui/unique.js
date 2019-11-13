$(function() {


	$("#SchemabaseColumns").multiselect({
    columns  : 3,
    search   : true,
    selectAll: true
	});

	$("#SchemaColumns2").multiselect({
    columns  : 3,
    search   : true,
    selectAll: true
	});
	selecttable();
	selectbasecolumn();
	selecttable2();
	selectcolumn2();
	sourceid();
	getingdt();
	getuniqueEntity();

});



function selecttable() {
	$('#Schemau').off('change');
	$('#Schemau').on('change', function(e) {
		console.log("asasasa");
		var select = this;
		e.preventDefault();
		if ($(this). children("option:selected"). val()!=''){
			 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/uniqueEntity/',
				'data'	:	{schema:$(this). children("option:selected"). val() ,action: 'getbasetable','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				console.log(res);

				var tables ='<option value="">Select table</option>'
				$.each(res.tables, function( index, value){
					console.log("ok");
					tables +='<option value="'+value+'">'+value+'</option>';

				});
				// console.log($(select).parent('.row').find('.l1_column'));
				console.log("here")
				$('#SchemaTableu').empty();
				$('#SchemaTableu').append(tables);


				//$(select).parent().parent().find('#payer').html(payer);

				
					
			});
			
		}
		else{}
		
	});
}

function selecttable2() {
	$('#Schema2').off('change');
	$('#Schema2').on('change', function(e) {
		console.log("asasasa");
		var select = this;
		e.preventDefault();
		if ($(this). children("option:selected"). val()!=''){
			 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/uniqueEntity/',
				'data'	:	{schema:$(this). children("option:selected"). val() ,action: 'getbasetable','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				console.log(res);

				var tables ='<option value="">Select table</option>'
				$.each(res.tables, function( index, value){
					console.log("ok");
					tables +='<option value="'+value+'">'+value+'</option>';

				});
				// console.log($(select).parent('.row').find('.l1_column'));
				console.log("here")
				$('#SchemaTable2').empty();
				$('#SchemaTable2').append(tables);


				//$(select).parent().parent().find('#payer').html(payer);

				
					
			});
			
		}
		else{}
		
	});
}

function selectbasecolumn() {
	$('#SchemaTableu').off('change');
	$('#SchemaTableu').on('change', function(e) {
		console.log("asasasa");
		var select = this;
		e.preventDefault();
		if ($(this). children("option:selected"). val()!=''){
			 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/uniqueEntity/',
				'data'	:	{schema:$("#Schemau option:selected").val(),table:$(this). children("option:selected"). val() ,action: 'getbasecolumn','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				console.log(res);
				if (res.status == '2'){
					$('#SchemabaseColumns').multiselect( 'reset' );
					
					$.each(res.columns, function(i,v){
						if(i==0){
						//column_select += '<option value="'+v['column']+'">'+v['column']+'</option>'
						$("#SchemabaseColumns").multiselect('loadOptions', [{
                			name   : v['column'],
                			value  : v['column'],
                			checked: false
            			}],

            			true,true
        					);}
						else {
							$("#SchemabaseColumns").multiselect('loadOptions', [{
                			name   : v['column'],
                			value  : v['column'],
                			checked: false
            			}],

            			false,true
        					);
						}
					});

		
				// console.log($(select).parent('.row').find('.l1_column'));
					console.log("here")
					//$('#SchemabaseColumns').empty();
					//$('#SchemabaseColumns').append(column_select);
					//$('#SchemabaseColumns').multiselect('refresh'); 
				//$(select).parent().parent().find('#payer').html(payer);
				

			}
				
					
			});
			
		}
		else{}
		
	});
}
function selectcolumn2() {
	$('#SchemaTable2').off('change');
	$('#SchemaTable2').on('change', function(e) {
		console.log("asasasa");
		var select = this;
		e.preventDefault();
		if ($(this). children("option:selected"). val()!=''){
			 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/uniqueEntity/',
				'data'	:	{schema:$("#Schema2 option:selected").val(),table:$(this). children("option:selected"). val() ,action: 'getbasecolumn2','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				console.log(res);
				if (res.status == '2'){
					$('#SchemaColumns2').multiselect( 'reset' );
					$.each(res.columns, function(i,v){
						if(i==0){
						//column_select += '<option value="'+v['column']+'">'+v['column']+'</option>'
						$("#SchemaColumns2").multiselect('loadOptions', [{
                			name   : v['column'],
                			value  : v['column'],
                			checked: false
            			}],

            			true,true
        					);}
						else {
							$("#SchemaColumns2").multiselect('loadOptions', [{
                			name   : v['column'],
                			value  : v['column'],
                			checked: false
            			}],

            			false,true
        					);
						}
					});

				var acoid ='<option value="">Select acoid</option>'
				$.each(res.acoid, function( index, value){
					console.log("ok");
					acoid +='<option value="'+value+'">'+value+'</option>';

				});
				// console.log($(select).parent('.row').find('.l1_column'));
				console.log("here")
				$('#aco_id_u').empty();
				$('#aco_id_u').append(acoid);	
				// console.log($(select).parent('.row').find('.l1_column'));
					
					//$('#SchemabaseColumns').empty();
					//$('#SchemabaseColumns').append(column_select);
					//$('#SchemabaseColumns').multiselect('refresh'); 
				//$(select).parent().parent().find('#payer').html(payer);
			}
				
					
			});
			
		}
		else{}
		
	});
}
function sourceid() {
	$('#aco_id_u').off('change');
	$('#aco_id_u').on('change', function(e) {
		console.log("asasasa");
		var select = this;
		e.preventDefault();
		if ($(this). children("option:selected"). val()!=''){
			 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/uniqueEntity/',
				'data'	:	{schema:$("#Schema2 option:selected").val(),table:$("#SchemaTable2 option:selected"). val(),acoid:$(this). children("option:selected"). val() ,action: 'getsourceid','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				console.log(res);

				var sourceid ='<option value="">Select table</option>'
				$.each(res.sourceid, function( index, value){
					console.log("ok");
					sourceid +='<option value="'+value+'">'+value+'</option>';

				});

				var sourcetype ='<option value="">Select SType</option>'
				$.each(res.sourcetype, function( index, value){
					console.log("ok");
					sourcetype +='<option value="'+value+'">'+value+'</option>';

				});
				// console.log($(select).parent('.row').find('.l1_column'));
				console.log("here")
				$('#Source_id_u').empty();
				$('#Source_id_u').append(sourceid);

				$('#Source_type_u').empty();
				$('#Source_type_u').append(sourcetype);


				//$(select).parent().parent().find('#payer').html(payer);

				
					
			});
			
		}
		else{}
		
	});
}

function sourcetype() {
	$('#aco_id_u').off('change');
	$('#aco_id_u').on('change', function(e) {
		console.log("asasasa");
		var select = this;
		e.preventDefault();
		if ($(this). children("option:selected"). val()!=''){
			 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/uniqueEntity/',
				'data'	:	{schema:$("#Schema2 option:selected").val(),table:$("#SchemaTable2 option:selected"). val(),acoid:$(this). children("option:selected"). val() ,action: 'getsourcetype','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				console.log(res);

				var sourcetype ='<option value="">Select table</option>'
				$.each(res.sourcetype, function( index, value){
					console.log("ok");
					sourcetype +='<option value="'+value+'">'+value+'</option>';

				});
				// console.log($(select).parent('.row').find('.l1_column'));
				console.log("here")
				$('#Source_type_u').empty();
				$('#Source_type_u').append(sourcetype);


				//$(select).parent().parent().find('#payer').html(payer);

				
					
			});
			
		}
		else{}
		
	});
}

function getingdt() {
	$('#Source_type_u').off('change');
	$('#Source_type_u').on('change', function(e) {
		console.log("asasasa");
		var select = this;
		e.preventDefault();
		if ($(this). children("option:selected"). val()!=''){
			 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/uniqueEntity/',
				'data'	:	{action:'getingdt',schema2:$("#Schema2 option:selected").val(),schematable2:$("#SchemaTable2 option:selected").val(),aco_id:$("#aco_id_u option:selected").val(),source_id:$("#Source_id_u option:selected").val(),source_type:$("#Source_type_u option:selected").val(),'csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				console.log(res);

				var ingdt ='<option value="">Select table</option>'
				$.each(res.ingdt, function( index, value){
					console.log("ok");
					ingdt +='<option value="'+value+'">'+value+'</option>';

				});
				// console.log($(select).parent('.row').find('.l1_column'));
				console.log("here")
				$('#ingdt').empty();
				$('#ingdt').append(ingdt);


				//$(select).parent().parent().find('#payer').html(payer);

				
					
			});
			
		}
		else{}
		
	});
}

function getuniqueEntity() {
	$('#uniqueEntity').off('click');
	$('#uniqueEntity').on('click', function(e) {
		
		e.preventDefault();
		$.ajax({
			'type'	:	'POST',
			'url'	:	'/uniqueEntity/',
			'data'	:	{ action: 'getuniqueEntity',schemau:$("#Schemau option:selected").val(),SchemaTableu:$("#SchemaTableu option:selected").val(),schemabaseColumns:$("#SchemabaseColumns ").val(),schema2:$("#Schema2 option:selected").val(),schematable2:$("#SchemaTable2 option:selected").val(),schemaColumns2:$("#SchemaColumns2").val(),aco_id:$("#aco_id_u option:selected").val(),source_id:$("#Source_id_u option:selected").val(),source_type:$("#Source_type_u option:selected").val(),ingdt:$("#ingdt option:selected").val(),'csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			
		}).done(function(res) {
	

			if(res.status==1){
				toastr.error(res.message);
				
			}
			else{
				console.log("asasasa")	;
				$("#scount").val(res.l1);
				$("#dcount").val(res.l2);
				var m=res.l1-res.l2;
				$("#mismatch").val(m);
			  }
						

        		
			
				
		});
		

	});
}