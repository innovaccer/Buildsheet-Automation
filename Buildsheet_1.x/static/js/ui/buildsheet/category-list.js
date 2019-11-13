$(function(){
	updateBuildsheet();
	$('.category-addlink').off('click');
	$('.category-addlink').on('click', function(e) {
		e.preventDefault();
		buildsheet_id= window.location.href.match(/buildsheets\/\d+/g)[0].match(/\d+/g)[0];
		window.location.href= window.location.origin +'/buildsheets/'+buildsheet_id+'/create/';
	});
	
});

function updateBuildsheet(){
	$('#update-buildsheet').off('click');
	$('#update-buildsheet').on('click', function(e) {
		e.preventDefault();
	
		if ($("#aconm").val()!='' && $("#acoid").val()!='' && $("#source_name").val()!='' && $("#source_id").val()!=''){
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
