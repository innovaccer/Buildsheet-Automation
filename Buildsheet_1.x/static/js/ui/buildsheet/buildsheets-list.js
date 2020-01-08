$(function(){
	loadQuality();
	createBuildsheet();
	loadTestcase();
	$('.buildsheet-link').off('click');
	$('.buildsheet-link').on('click', function(e) {
		e.preventDefault();
		window.location.href= window.location.origin+'/buildsheets/'+$(this).attr('buildsheet_id');
	});
	$('.deleteOption').off('click');
	$('.deleteOption').on('click', function(e) {
		$('.delete').attr('buildsheet_id',$(this).attr('buildsheet_id'));
	
	});
	deleteWorkspace();
});

function createBuildsheet(){
	$('#create-buildsheet').off('click');
	$('#create-buildsheet').on('click', function(e) {
		e.preventDefault();
	
		if ($("#aconm").val()!='' && $("#acoid").val()!='' && $("#source_name").val()!='' && $("#source_id").val()!='' && $("#vendor_name").val()!='' && $("#olap_version").val()!=''){
			$.ajax({
				'type'	:	'post',
				'url'	:	'/buildsheets/',
				'async'	:    false,
				'data'	:	{aconm: $("#aconm").val(), acoid: $("#acoid").val(), source_name: $("#source_name").val(), source_id: $("#source_id").val(), vendor_name: $("#vendor_name").val(), vendor_version: $("#vendor_version").val(), olap_version: $("#olap_version").val(), action: 'createBuildsheet','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				if(res.status=='2'){
					toastr.success(res.msg);
					$('#NewBuildsheetModal').modal('hide');
					window.location.href= window.location.origin+'/buildsheets/';
				}
				else{
					toastr.error(res.msg);
				}

			});
		}
		else{
			error('please All Fill Mandatory Fields');
		}
	});

}

function deleteWorkspace() {
	$('.delete').off('click');
	$('.delete').on('click', function(e) {
		var req = {}; 
		$.ajax({
			'type'	:	'post',
			'url'	:	'/buildsheetDelete/',
			'data'	:	{'buildsheet_id':$(this).attr('buildsheet_id') , 'action': 'deleteWorkspace','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
		}).done(function(res) {
			if (res.status =='2'){
				window.location.href= window.location.href
			}
			else{
				toastr.error(res.msg);
			}
			
			
		});
	});
}

function loadQuality(){
	$.each($('.semantic-badge'), function( i, v){
		$(v).removeClass('badge-success badge-warning badge-danger badge-secondary');
		$(v).removeAttr('title');
		aco_id = $(v).attr('aco-id');
		source_id = $(v).attr('source-id');
		$.ajax({
			'type'	:	'post',
			'url'	:	'/loadQuality/',
			'data'	:	{'aco_id': aco_id, 'source_id': source_id , 'action': 'buildsheetQuality','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
		}).done(function(res) {
			if (res.status =='2'){
				if(res.quality.replace(/\%/g,'')>80){
					$(v).addClass('badge-success');
				}
				else if(res.quality.replace(/\%/g,'')>60 && res.quality.replace(/\%/g,'')<80){
					$(v).addClass('badge-warning');
				}
				else if(res.quality.replace(/\%/g,'')<60 && res.quality.replace(/\%/g,'')>0){
					$(v).addClass('badge-danger');
				}
				else if (res.quality.replace(/\%/g,'')==0){
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
			}
			
			
		});

	});
}

function loadTestcase(){
	$.each($('.testcase-badge'), function( i, v){
		$(v).removeClass('badge-success badge-warning badge-danger badge-secondary');
		$(v).removeAttr('title');
		aco_id = $(v).attr('aco-id');
		source_id = $(v).attr('source-id');
		$.ajax({
			'type'	:	'post',
			'url'	:	'/testcase/'+0+'/',
			'data'	:	{'aco_id': aco_id, 'source_id': source_id , 'action': 'getAllTestcaseScore','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
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