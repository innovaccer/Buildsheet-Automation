$(function(){
	createBuildsheet();
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
	
		if ($("#aconm").val()!='' && $("#acoid").val()!='' && $("#source_name").val()!='' && $("#source_id").val()!='' && $("#vendor_name").val()!='' && $("#vendor_version").val()!=''){
			$.ajax({
				'type'	:	'post',
				'url'	:	'/buildsheets/',
				'data'	:	{aconm: $("#aconm").val(), acoid: $("#acoid").val(), source_name: $("#source_name").val(), source_id: $("#source_id").val(), vendor_name: $("#vendor_name").val(), vendor_version: $("#vendor_version").val(), olap_version: $("#olap_version").val(), action: 'createBuildsheet','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				if(res.status=='2'){
					toastr.success(res.msg);
					$('#NewBuildsheetModal').modal('hide');
					window.location.href= window.location.origin+'/buildsheets/'
				}
				else{
					toastr.error(res.msg);
				}

			});
		}});

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