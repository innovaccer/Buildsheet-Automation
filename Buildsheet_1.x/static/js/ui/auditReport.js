$(function() {
	
	$('.audit-report').off('click');
	$('.audit-report').on('click', function(e) {
		downloadReport($(this).attr('meta_id'));
	});
	$('.audit-view').off('click');
	$('.audit-view').on('click', function(e) {
		 
		window.open(window.location.origin+'/auditListing/'+$(this).attr('meta_id')+'/view/', '_blank');
		// editBuildsheet( $(this).attr('meta_id'))
	});
	$('.view-report').off('click');
	$('.view-report').on('click', function(e) {
		 
		window.open(window.location.origin+'/auditListing/'+$(this).attr('aco_id')+'/'+$(this).attr('source_id')+'/view/', '_blank');
		// editBuildsheet( $(this).attr('meta_id'))
	});
	$('.view-onse').off('click');
	$('.view-onse').on('click', function(e) {
		 
		window.open(window.location.origin+'/auditListing/'+$(this).attr('aco_id')+'/'+$(this).attr('source_id')+'/viewos/', '_blank');
		// editBuildsheet( $(this).attr('meta_id'))
	});
	
	//$('.ontology').off('click');
	//$('.ontology').on('click', function(e) {
		 
	//	window.open(window.location.origin+'/auditListing/'+$(this).attr('meta_id')+'/viewo/', '_blank');
		// editBuildsheet( $(this).attr('meta_id'))
	//});
	$('.semantic').off('click');
	$('.semantic').on('click', function(e) {
		
		window.open(window.location.origin+'/auditListing/'+$(this).attr('meta_id')+'/views/', '_blank');
		// editBuildsheet( $(this).attr('meta_id'))
	});

	$('.download-report').off('click');
	$('.download-report').on('click', function(e) {
		e.preventDefault();
		var acoid=$(this).attr('aco_id');
		var sourceid=$(this).attr('source_id');
		downloadAllReport(acoid,sourceid);
		// editBuildsheet( $(this).attr('meta_id'))
	});
});

function downloadReport(meta_id) {
	// if ($("#where_table option:selected").val()!=''){

		
	var req = {}; 
	$.ajax({
		'type'	:	'post',
		'url'	:	'/auditListing/',
		'data'	:	{'meta_id':meta_id,'action':'getAuditReportDownload','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
	}).done(function(res) {
		if (res.status =='1'){
			toastr.error(res.msg);
				// setTimeout(function() {window.location = 'buildsheet/';}, 1100);
				
				
				
			}
			else{
					
				console.log(res);
		        ct='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64';
		        var ab=base64toBlob(res,ct);
		   		var blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    			var link = document.createElement('a');
    			link.href = window.URL.createObjectURL(blob);
    		    link.download = 'AuditReport.xlsx';

    			document.body.appendChild(link);

    			link.click();

    			document.body.removeChild(link);
			  }
			// console.log(JSON.stringify(res.toString()))
			
		});
	

}

function downloadAllReport(acoid,sourceid) {
	// if ($("#where_table option:selected").val()!=''){

		
	var req = {}; 
	$.ajax({
		'type'	:	'post',
		'url'	:	'/auditListing/',
		'data'	:	{'aco_id':acoid,'source_id':sourceid,'action':'allBuildsheetReport','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
	}).done(function(res) {
		if (res.status =='1'){
			toastr.error(res.msg);
				// setTimeout(function() {window.location = 'buildsheet/';}, 1100);
				
				
				
			}
			else{
					
				console.log(res);
		        ct='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64';
		        var ab=base64toBlob(res,ct);
		   		var blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    			var link = document.createElement('a');
    			link.href = window.URL.createObjectURL(blob);
    		    link.download = 'AuditReport.xlsx';

    			document.body.appendChild(link);

    			link.click();

    			document.body.removeChild(link);
			  }
			// console.log(JSON.stringify(res.toString()))
			
		});
	

}