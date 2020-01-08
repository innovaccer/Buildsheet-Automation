$(function(){
	semanticView();
	semanticDownload();
	testcaseDownload();
	
});

function semanticView(){
	$('.semantic-view').off('click');
	$('.semantic-view').on('click', function(e) {
		e.preventDefault();
		current = this
		$(current).popover('dispose');
		var meta_id =$(location).attr('href').match(/viewsemantic\/\d+/g)[0].match(/\d+$/g);
		// if ($("#aconm").val()!='' && $("#acoid").val()!='' && $("#source_name").val()!='' && $("#source_id").val()!=''){
			$.ajax({
				'type'	:	'post',
				'url'	:	'/viewsemantic/'+meta_id+'/view/',
				'data'	:	{ table: $(current).attr('table'), column: $(current).attr('column'), action: 'getSemanticView','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {

				$.fn.popover.Constructor.Default.whiteList.table = [];
			    $.fn.popover.Constructor.Default.whiteList.tr = [];
			    $.fn.popover.Constructor.Default.whiteList.td = [];
			    $.fn.popover.Constructor.Default.whiteList.th = [];
			    $.fn.popover.Constructor.Default.whiteList.div = [];
			    $.fn.popover.Constructor.Default.whiteList.tbody = [];
			    $.fn.popover.Constructor.Default.whiteList.thead = [];

				if(res.status=='2'){

					row ='';
					row += '<table class="ct"><th><tr class="ctr bold" ><td class="ctd">Value</td><td class="ctd">Count</td><td class="ctd">Lookup</td></tr></th>';	
					// row = '<table class="table"><tbody>'
					$.each(res.rows, function(i,v){
						// console.log(v)
						// row += '<tr><td>'+v[0]+'</td><td>'+v[1]+'</td></tr>';
						if(v[2]=='Red'){
							row += '<tr class="ctr red"><td class="ctd">'+v[0]+'</td><td class="ctd">'+v[1]+'</td><td> UnMatched </td></tr>';

						}
						else{
							row += '<tr class="ctr green"><td class="ctd">'+v[0]+'</td><td class="ctd">'+v[1]+'</td><td> Matched </td></tr>';
							
						}
					});
					row+='</table>'; 
					console.log(row);
					$(current).popover({trigger: 'click',content: row, html: true, title:'<span class="text-info"><strong>Semantic match</strong></span> <a href="#" class="close-popover" data-dismiss="alert">x</a>' });
					$(current).popover('show');
					$(".popover").css("max-height", "350px");
					$(".popover").css("overflow-y", "auto");
					$(".ctr").css("border","1px solid black");
					$(".ctd").css("border","1px solid black");
					$(".ct").css("width", "100%");
					$(".ctd").css("text-align", "center");
					$('.close-popover').off('click');
					$('.close-popover').on('click', function(e) {
						e.preventDefault();
        				$(this).parents(".popover").popover('hide');
    				});
				}
				else{
					toastr.error(res.msg);
				}

			});
		});

}

function semanticDownload(){
	$('#semantic-download').off('click');
	$('#semantic-download').on('click', function(e) {
		e.preventDefault();
		current = this
		$(current).popover('dispose');
		var meta_id =$(location).attr('href').match(/viewsemantic\/\d+/g)[0].match(/\d+$/g);
		// if ($("#aconm").val()!='' && $("#acoid").val()!='' && $("#source_name").val()!='' && $("#source_id").val()!=''){
			$.ajax({
				'type'	:	'post',
				'url'	:	'/viewsemantic/'+meta_id+'/view/',
				'data'	:	{ table: $(current).attr('table'), action: 'getSemanticDownload','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
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
			    		    	link.download =$(current).attr('table') +'_semantics.xlsx';

			    				document.body.appendChild(link);

			    				link.click();

			    				document.body.removeChild(link);
							}
						});

});
}

