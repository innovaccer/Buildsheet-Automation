$(function() {
		getSQL();
		deleteBuildsheet();
		getReport();
	// getBuildsheet();
	$('.getbuildsheet').off('click');
	$('.getbuildsheet').on('click', function(e) {
		
		// getbuildsheet = this
		getBuildsheet($(this).attr('aco_id'),$(this).attr('source_id'),$(this).attr('meta_id'));


	});


	$('.edit').off('click');
	$('.edit').on('click', function(e) {
		window.location.href= window.location.origin+'/buildsheets/'+$(this).attr('buildsheet_id')+'/update/'+$(this).attr('meta_id')+'/';
		// editBuildsheet( $(this).attr('meta_id'))
	});
	
	$('#closeReport').off('click');
	$('#closeReport').on('click', function(e) {
		buildsheetPage();
		$('#report-modal').attr('hidden','');
		$(".container").css("overflow", "");
		$('.box').jmspinner(false);
		$('.box').attr("hidden",'');
	});
	$('.deleteOption').off('click');
	$('.deleteOption').on('click', function(e) {
		$('.delete').attr('meta_id',$(this).attr('meta_id'));
	

	});
	
	$('.download-buildsheet').off('click');
	$('.download-buildsheet').on('click', function(e) {
		e.preventDefault();
		// getbuildsheet = this
		var acoid=$(this).attr('aco_id');
		var sourceid=$(this).attr('source_id');
		getBuildsheet(acoid,sourceid,'');

	});

	$('.download-report').off('click');
	$('.download-report').on('click', function(e) {
		e.preventDefault();
		// getbuildsheet = this
		var acoid=$(this).attr('aco_id');
		var sourceid=$(this).attr('source_id');
		downloadReport(acoid,sourceid,'');

	});

});

function backtoBuildsheetPage(){
	window.location.href=  window.location.origin+window.location.href.match(/\/buildsheets\/\d+/g)[0];
}
function leverPage() {
	window.location.href= window.location.origin+'/valueLevers/'

}
function buildsheetPage() {
	window.location.href= window.location.origin+'/buildsheets/'

}
function datacompletion() {
	window.location.href= window.location.origin+'/dataCompletion/'
}
function createPage() {
	window.location.href= window.location.origin+'/create/'
}
function auditPage() {
	window.location.href= window.location.origin+'/auditListing/'
}
function setError(where, what) {
	// var parent = $(where).parents('.form-group:eq(0)');
	// parent.addClass('has-error').append('<span class="help-block">' + what + '</span>');
	toastr.error(what);
}

function unsetError(where) {
	var parent = $(where).parents('.form-group:eq(0)');
	parent.removeClass('has-error').find('.help-block').remove();
}

function unique() {
	window.location.href= window.location.origin+'/uniqueEntity/'
}

function getSQL(){
	$('.getsql').off('click');
	$('.getsql').on('click', function(e) {
		// $('.sql').attr("hidden",'');
		getsql = this
	// console.log($(this).parent().parent().parent().find('.row').find('.catergory').text());
	var req = {}; 
	$.ajax({
		'type'	:	'post',
		'url'	:	'/buildsheets/',
		'data'	:	{'meta_id':$(this).attr('buildsheet_id') ,'csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
	}).done(function(res) {
		if (res.status =='2'){
				// console.log(res.query);
				// console.log($(this).parent().parent().parent().find('.row').find('.sql'));
				// $(this).parent().parent().parent().find('.row').find('.sql')

				$('#query-textarea').text(res.query);
				// $("html, body").animate({ scrollTop: 0 }, "slow");
				
			}
			// console.log(JSON.stringify(res.toString()))
			
		}).fail(function(res){
			toastr.error(res);
			//console.log(res);
		});
	});
}

function getSQLToModal(query){

	// $('#getsql').off('click');
	// $('#getsql').on('click', function(e) {
	// 	$('#sql').text(query).removeAttr("hidden");
	// });
	$('#closemodal').off('click');
	$('#closemodal').on('click', function(e) {
		document.location.href = window.location.origin+'/buildsheets/';
	});
	$('#getbuildsheet').off('click');
	$('#getbuildsheet').on('click', function(e) {
		getBuildsheet($('#aco_id').val(),$('#source_id').val(),$('.load-build').attr('meta_id'));
	});



}
function base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
}

function getBuildsheet(aco_id,source_id,meta_id) {
// if ($("#where_table option:selected").val()!=''){
	
	
	var req = {}; 
	$.ajax({
		'type'	:	'post',
		'url'	:	'/downloadBuildsheet/',
		'data'	:	{'aco_id':aco_id,'source_id':source_id , 'meta_id': meta_id,'csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
	}).done(function(res) {
			// if (res.status =='2'){
				// toastr.success(res.message);
				// setTimeout(function() {window.location = 'buildsheet/';}, 1100);
				
				//console.log(res);
				var blob = new Blob([res], { type: 'data:application/vnd.csv' });
				var downloadUrl = URL.createObjectURL(blob);
				var a = document.createElement("a");
				a.href = downloadUrl;
				a.download = aco_id+"_"+source_id+".csv";
				document.body.appendChild(a);
				a.click();
				
			// }
			// console.log(JSON.stringify(res.toString()))
			
		});
	

}


// function editBuildsheet(meta_id) {
// 		var req = {}; 
// 			$.ajax({
// 				'type'	:	'post',
// 				'url'	:	'/buildsheets/'+meta_id+'/update/',
// 				'data'	:	{'action':'notOPassing','meta_id':meta_id , 'csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
// 			}).done(function(res) {
// 				if(res.status=='2'){
// 					console.log(res)
// 					window.location=res.url;
// 				}


// 			});
// }


function getReport() {
	$('.getReport').off('click');
	$('.getReport').on('click', function(e) {
		$('#thead').html("");
		$('#tbody').html("");
		$('.box').removeAttr("hidden");
		$('.box').jmspinner('large');
		$('#report-modal').modal('show');
		$('#report-modal').removeAttr('hidden');
		aco_id= $(this).attr('aco_id');
		source_id= $(this).attr('source_id');
		meta_id= $(this).attr('meta_id');
		var req = {}; 
		$.ajax({
			'type'	:	'post',
			'url'	:	'/getReport/',
			'data'	:	{'meta_id':$(this).attr('meta_id'),'source_id':$(this).attr('source_id'),'aco_id':$(this).attr('aco_id'),'action':'getReport','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
		}).done(function(res) {
			if (res.status =='2'){
				//console.log(res.buildsheet);
				$('.box').jmspinner(false);
				$('.box').attr("hidden",'');
				$(".container").css("overflow", "scroll");
				$('.reportTable').removeAttr("hidden");

				thead= '<tr>'
				$.each(res.columns, function( index, value){
					if(index<=14){
						thead +='<th>'+value+'</th>';
					}
				});
				thead+='</tr>'
				$('#thead').html(thead);
				tbody =''
				$.each(res.buildsheet, function( index, value){
					tbody +='<tr>'
					$.each(value, function( inindex, invalue){
						if(inindex<=14){
							if(inindex=='13'||inindex=='14'){
								if (invalue!='0'){
									tbody +='<td style=" color: red;">'+invalue+'</td>';
								}
								else{
									tbody +='<td style="color: #23e523;">'+invalue+'</td>';
								}

							}
							else{

								tbody +='<td>'+invalue+'</td>';
							}
						}		
					});
					tbody +='</tr>'
				});

				$('#tbody').html(tbody);

				$('#downloadReport').off('click');
				$('#downloadReport').on('click', function(e) {
					downloadReport(aco_id,source_id,meta_id);
				});

			}
			else{
				console.log(res.msg);
				$('.box').jmspinner(false);
				$('.box').html(res.msg);
			}


		});
	});
}




function downloadReport(aco_id,source_id,meta_id) {
	// if ($("#where_table option:selected").val()!=''){

		
	var req = {}; 
	$.ajax({
		'type'	:	'post',
		'url'	:	'/getReport/',
		'data'	:	{'source_id':source_id,'aco_id':aco_id,'meta_id':meta_id,'action':'getReportDownload','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
	}).done(function(res) {
		if (res.status =='1'){
			toastr.error(res.msg);
				// setTimeout(function() {window.location = 'buildsheet/';}, 1100);
				
				
				
			}
			else{
				//console.log(res);
				var blob = new Blob([res], { type: 'data:application/vnd.csv' });
				var downloadUrl = URL.createObjectURL(blob);
				var a = document.createElement("a");
				a.href = downloadUrl;
				a.download = aco_id+"_"+source_id+"_Report.csv";
				document.body.appendChild(a);
				a.click();
			}
			// console.log(JSON.stringify(res.toString()))
			
		});
	

}

function deleteBuildsheet() {
	$('.delete').off('click');
	$('.delete').on('click', function(e) {
		current = this
		var req = {}; 
		$.ajax({
			'type'	:	'post',
			'url'	:	'/buildsheetDelete/',
			'data'	:	{'meta_id':$(this).attr('meta_id') , 'action': 'delete','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
		}).done(function(res) {
			if (res.status =='2'){
				window.location.href= window.location.origin+'/buildsheets/'+ window.location.href.match(/buildsheets\/\d+/g)[0].replace(/buildsheets\//g,'');
			}
			else{
				toastr.error(res.msg);
			}
			
			
		});
	});
}

function copy(text){
  var aux = document.createElement("textarea");
  aux.setAttribute("contentEditable", true);
  aux.innerHTML = text;
  aux.setAttribute("onfocus", "document.execCommand('selectAll',false,null)"); 
  document.body.appendChild(aux);
  aux.focus();
  document.execCommand("copy");
  document.body.removeChild(aux);
}


function animatedCreateForm() {
		/*create From*/

	//jQuery time
	var current_fs, next_fs, previous_fs; //fieldsets
	var left, opacity, scale; //fieldset properties which we will animate
	var animating; //flag to prevent quick multi-click glitches

	$(".next").click(function(){
		if(animating) return false;
		animating = true;
		
		current_fs = $(this).parent();
		next_fs = $(this).parent().next();
		
		//activate next step on progressbar using the index of next_fs
		$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
		
		//show the next fieldset
		next_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale current_fs down to 80%
				scale = 1 - (1 - now) * 0.2;
				//2. bring next_fs from the right(50%)
				left = (now * 50)+"%";
				//3. increase opacity of next_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({
	        'transform': 'scale('+scale+')',
	        'position': 'absolute'
	      });
				next_fs.css({'left': left, 'opacity': opacity});
			}, 
			duration: 800, 
			complete: function(){
				console.log(current_fs);
				current_fs.hide();
				animating = false;
			}, 
			//this comes from the custom easing plugin
			
		});
	});

	$(".previous").click(function(){
		if(animating) return false;
		animating = true;
		
		current_fs = $(this).parent();
		previous_fs = $(this).parent().prev();
		
		//de-activate current step on progressbar
		$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
		
		//show the previous fieldset
		previous_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale previous_fs from 80% to 100%
				scale = 0.8 + (1 - now) * 0.2;
				//2. take current_fs to the right(50%) - from 0%
				left = ((1-now) * 50)+"%";
				//3. increase opacity of previous_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({'left': left});
				previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
			}, 
			duration: 800,
			complete: function(){
				current_fs.hide();
				animating = false;
			} 
			//this comes from the custom easing plugin
			
		});
	});

	$(".submit").click(function(){
		return false;
	})
	/* end create form*/

}

function error(msg){
	$('body').find('.alert').remove();
	$('body').prepend('<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Oh snap! </strong>'+msg+'</div>');
	$('body').find('.alert').fadeOut(8000);
}
function warning(msg) {
	$('body').find('.alert').remove();
	$('body').prepend('<div class="alert alert-dismissible alert-warning"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Warning! </strong>'+msg+'</div>');
	$('body').find('.alert').fadeOut(8000);
}
function success(msg) {
	$('body').find('.alert').remove();
	$('body').prepend('<div class="alert alert-dismissible alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Well done! </strong>'+msg+'</div>');
	$('body').find('.alert').fadeOut(8000);
}
function info(msg) {
	$('body').find('.alert').remove();
	$('body').prepend('<div class="alert alert-dismissible alert-info"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Heads up! </strong>'+msg+'</div>');
	$('body').find('.alert').fadeOut(8000);
}
