$(function(){
	loadQuality();
	loadTestcase();
	updateBuildsheet();
	$('.category-addlink').off('click');
	$('.category-addlink').on('click', function(e) {
		e.preventDefault();
		buildsheet_id= window.location.href.match(/buildsheets\/\d+/g)[0].match(/\d+/g)[0];
		window.location.href= window.location.origin +'/buildsheets/'+buildsheet_id+'/create/';
	});
	$('.getsementic').off('click');
	$('.getsementic').on('click', function(e) {
		 
		window.open(window.location.origin+'/viewsemantic/'+$(this).attr('meta_id')+'/view/', '_blank');
		// editBuildsheet( $(this).attr('meta_id'))
	});

	$('.run_insert').off('click');
	$('.run_insert').on('click', function(e) {
		e.preventDefault();
		var meta_id=$('#query-textarea').attr('meta_id'); 
		if(confirm("Do you really want to Insert Data in Production?")){
			insert_l1tol2(meta_id);
		}
		
		// editBuildsheet( $(this).attr('meta_id'))
	});

	$('.patient-validation').off('click');
	$('.patient-validation').on('click', function(e) {
		e.preventDefault();
		// console.log($(this).parent().parent().parent().find('td:first'));
		patientValidation($(this).attr('meta_id'),$(this).parent().parent().parent().find('td:first').text());
	});

	$('.testcase-download').off('click');
	$('.testcase-download').on('click', function(e) {
		e.preventDefault();
		testcaseDownload($(this).attr('meta_id'),$(this).parent().parent().find('td:first').text());

	});
	$('.semantic-download').off('click');
	$('.semantic-download').on('click', function(e) {
		e.preventDefault();
		semanticDownload($(this).attr('meta_id'),$(this).parent().parent().find('td:first').text())
	});
	
});

function updateBuildsheet(){
	$('#update-buildsheet').off('click');
	$('#update-buildsheet').on('click', function(e) {
		e.preventDefault();
	
		if ($("#aconm").val()!='' && $("#acoid").val()!='' && $("#source_name").val()!='' && $("#source_id").val()!='' && $("#vendor_name").val()!='' && $("#olap_version").val()!=''){
			$.ajax({
				'type'	:	'post',
				'url'	:	'/buildsheets/',
				'data'	:	{buildsheet_id: $(this).attr('buildsheet_id'), aconm: $("#aconm").val(), acoid: $("#acoid").val(), source_name: $("#source_name").val(), source_id: $("#source_id").val(), vendor_name: $("#vendor_name").val(), vendor_version: $("#vendor_version").val(),olap_version: $("#olap_version").val(), action: 'updateBuildsheet','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				if(res.status=='2'){
					toastr.success(res.msg);
					$('#NewBuildsheetModal').modal('hide');
					
				}
				else{
					toastr.error(res.msg);
				}

			});
		}});

}


function insert_l1tol2(id){

	$.ajax({
				'type'	:	'post',
				'url'	:	'/buildsheets/',
				beforeSend: function(){
				    // Show image container
				    $('.box').removeAttr("hidden");
					$('.box').jmspinner('large');
					$('.run_insert').find('span').attr('hidden',true);
				   },
				'data'	:	{meta_id:id, action: 'insertL1toL2','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				if(res.status=='2'){
					success(res.msg);
				}
				else{
					error(res.msg);
				}
				$('.box').jmspinner(false);
				$('.box').attr("hidden",'');
				$('.run_insert').find('span').removeAttr("hidden");
			}
			);
}


function patientValidation(meta_id,category){

	$.ajax({
				'type'	:	'post',
				'url'	:	'/patientValidation/',
				'data'	:	{'meta_id':meta_id, 'action': 'runValidation','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				if(res.status=='1'){
					error(res.msg);
					
				}
				else{
		       	 	ct='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64';
		       	 	var ab=base64toBlob(res,ct);
		   			var blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    				var link = document.createElement('a');
    				link.href = window.URL.createObjectURL(blob);
    		    	link.download = category+'_patient_validation.xlsx';

    				document.body.appendChild(link);

    				link.click();

    				document.body.removeChild(link);
				}

			}
			);
}

function loadQuality(){
	$.each($('.semantic-badge'), function( i, v){
		$(v).removeClass('badge-success badge-warning badge-danger badge-secondary');
		$(v).removeAttr('title');
		meta_id = $(v).attr('meta_id');
		$.ajax({
			'type'	:	'post',
			'url'	:	'/loadQuality/',
			'data'	:	{'meta_id':meta_id , 'action': 'categoryQuality','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
		}).done(function(res) {
			if (res.status =='2'){
				if(res.quality.replace(/\%/g,'')>80){
					$(v).addClass('badge-success');
				}
				else if(res.quality.replace(/\%/g,'')>60 && res.quality.replace(/\%/g,'')<80){
					$(v).addClass('badge-warning');
				}
				else if(res.quality.replace(/\%/g,'')<60 ){
					$(v).addClass('badge-secondary');
				}
				else{

				}
				$(v).text('Pass : '+ res.quality)
			}
			else{
				$(v).text('Error : '+ res.msg.substring(0,10))
				$(v).addClass('badge-dark');
				$(v).attr('title',res.msg);
				// toastr.error(res.msg);
			}
			
			
		});

	});
}


function loadTestcase(){
	$.each($('.testcase-badge'), function( i, v){
		$(v).removeClass('badge-success badge-warning badge-danger badge-secondary');
		$(v).removeAttr('title');
		meta_id = $(v).attr('meta_id');
		$.ajax({
			'type'	:	'post',
			'url'	:	'/testcase/'+meta_id+'/',
			'data'	:	{'meta_id':meta_id , 'action': 'getTestcaseScore','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
		}).done(function(res) {
			if (res.status =='2'){
				if(res.score.replace(/\%/g,'')>80){
					$(v).addClass('badge-success');
				}
				else if(res.score.replace(/\%/g,'')>60 && res.score.replace(/\%/g,'')<80){
					$(v).addClass('badge-warning');
				}
				else if(res.score.replace(/\%/g,'')<60 && res.score.replace(/\%/g,'')>0){
					$(v).addClass('badge-danger');
				}
				else if (res.score.replace(/\%/g,'')==0){
					$(v).addClass('badge-secondary');
				}
				else{

				}
				$(v).text('Pass : '+ res.score)
			}
			else{
				$(v).text('Error : '+ res.msg.substring(0,10))
				$(v).addClass('badge-dark');
				$(v).attr('title',res.msg);
				// toastr.error(res.msg);
			}
			
			
		});

	});
}

	
function testcaseDownload(meta_id,category){

		current = this
		$(current).popover('dispose');
		// var meta_id =$(location).attr('href').match(/viewsemantic\/\d+/g)[0].match(/\d+$/g);
		// if ($("#aconm").val()!='' && $("#acoid").val()!='' && $("#source_name").val()!='' && $("#source_id").val()!=''){
			$.ajax({
				'type'	:	'post',
				'url'	:	'/testcase/'+meta_id+'/',
				'data'	:	{ table: category, action: 'getTestcaseDownload','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
							if(res.status=='1'){
								error(res.msg);
								
							}
							else{
					       	 	ct='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64';
					       	 	var ab=base64toBlob(res,ct);
					   			var blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

			    				var link = document.createElement('a');
			    				link.href = window.URL.createObjectURL(blob);
			    		    	link.download =category +'_testcases.xlsx';

			    				document.body.appendChild(link);

			    				link.click();

			    				document.body.removeChild(link);
							}
						});

}


function semanticDownload(meta_id,category){

		current = this
		$(current).popover('dispose');
		// var meta_id =$(location).attr('href').match(/viewsemantic\/\d+/g)[0].match(/\d+$/g);
		// if ($("#aconm").val()!='' && $("#acoid").val()!='' && $("#source_name").val()!='' && $("#source_id").val()!=''){
			$.ajax({
				'type'	:	'post',
				'url'	:	'/viewsemantic/'+meta_id+'/view/',
				'data'	:	{ table: category, action: 'getSemanticDownload','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
							if(res.status=='1'){
								error(res.msg);
								
							}
							else{
					       	 	ct='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64';
					       	 	var ab=base64toBlob(res,ct);
					   			var blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

			    				var link = document.createElement('a');
			    				link.href = window.URL.createObjectURL(blob);
			    		    	link.download =category +'_semantics.xlsx';

			    				document.body.appendChild(link);

			    				link.click();

			    				document.body.removeChild(link);
							}
						});

}