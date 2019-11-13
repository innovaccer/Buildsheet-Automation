$(function() {

measureClick();
levelClick();



});

function measureClick() {
	$('.measure-click').off('click');
	$('.measure-click').on('click', function(e) {
		val = $(this).parent().parent().find('.hidden-button').prop('hidden');
		$('.measure-click').parent().parent().find('.hidden-button').prop('hidden','true');
		$(this).parent().parent().find('.hidden-button').prop('hidden',val);

		console.log(val);
		$(this).parent().parent().find('.hidden-button').prop('hidden',!val);
		$('.lever-columns').html('');
		$('.lever-tables').html('');


		  // if(val=true){
		  //     $(this).parent().parent().find('.hidden-button').prop('hidden','false');
		  // }
		  // else{
		  //     $(this).parent().parent().find('.hidden-button').prop('hidden','true');
		  // }
	});	
}

function levelClick() {
	$('.l5-lever,.l3-lever,.l2-lever').off('click');
	$('.l5-lever,.l3-lever,.l2-lever').on('click', function(e) {
		fetchTables(this);
		val = $(this).parent().find('div:first').prop('hidden');
		$('.l5-lever,.l3-lever,.l2-lever').parent().find('div:first').prop('hidden','true');
		$(this).parent().find('div:first').prop('hidden',val);

		console.log(val);
		$(this).parent().find('div:first').prop('hidden',!val);

		  // if(val=true){
		  //     $(this).parent().parent().find('.hidden-button').prop('hidden','false');
		  // }
		  // else{
		  //     $(this).parent().parent().find('.hidden-button').prop('hidden','true');
		  // }
	});	
}
// $(current).parent().parent().parent().parent().find('#lever_id').attr('lever-name')
function fetchTables(current) {
	$('.lever-tables').html('');
	$.ajax({
			'type'	:	'post',
			'url'	:	'/valueLevers/',
			'data'	:	{'lever_name':'Reduce SNF cost','level':$(current).attr('level') , 'action': 'fetchTables','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
	}).done(function(res) {
		if (res.status =='2'){
			col_row = ''
			$.each(res.columns, function( index, value){
				bg =$(current).css('background');
				value = value[0]
				if(index==0){
				col_row +='<div style="margin-top: -25px;height: 66px;"> <svg id="chart" style="width: 21px;margin: -8px;"> <line x1="20" y1="40" x2="20" y2="110" style="stroke: #555555;stroke-width:1;"></line> </svg> <svg class="svg-link" style="margin-left: 4px;"><path stroke="black" d="M5 40 l215 0"></path></svg> <button type="button" class="btn btn-primary custom-btn column-button table-button" table-name="'+value+'" style="background: '+bg+';">'+value.replace(/^\./g,'')+'</button><div style="display: grid;width: max-content;padding: 0;margin: 0;position: absolute;margin-left: 314px;margin-top: -69px;" class="lever-columns" hidden="true"></div></div></div>';

				}
				else{
				col_row +='<div style="margin-top: 0px;height: 66px;"> <svg id="chart" style="width: 21px;margin: -8px;"> <line x1="20" y1="40" x2="20" y2="110" style="stroke: #555555;stroke-width:1;"></line> </svg> <svg class="svg-link" style="margin-left: 4px;"><path stroke="black" d="M5 40 l215 0"></path></svg> <button type="button" class="btn btn-primary custom-btn column-button table-button" table-name="'+value+'" style="background: '+bg+';">'+value.replace(/^\./g,'')+'</button><div style="display: grid;width: max-content;padding: 0;margin: 0;position: absolute;margin-left: 314px;margin-top: -69px;" class="lever-columns" hidden="true"></div></div></div>';
				}
			});
			$(current).parent().find('.lever-tables').html(col_row);
			$('.table-button').off('click');
			$('.table-button').on('click', function(e) {
				$(this).parent()
				fetchColumns(current,this);
				val = $(current).parent().find('.lever-columns').prop('hidden');
				$('.lever-columns').prop('hidden','true');
				$(current).parent().find('.lever-columns').prop('hidden',val);

				console.log(val);
				$(current).parent().find('.lever-columns').prop('hidden',!val);
					});	
		}
	});
}
function fetchColumns(current,table) {
	$('.lever-columns').html('');
	$.ajax({
			'type'	:	'post',
			'url'	:	'/valueLevers/',
			'data'	:	{'lever_name':'Reduce SNF cost','level':$(current).attr('level'),'table_name':$(table).attr('table-name') , 'action': 'fetchColumns','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
	}).done(function(res) {
		if (res.status =='2'){
			col_row = ''
			$.each(res.columns, function( index, value){
				bg =$(current).css('background');
				value = value[0]
				if(index==0){
				col_row +='<div style="margin-top: -25px;height: 66px;"> <svg id="chart" style="width: 21px;margin: -8px;"> <line x1="20" y1="40" x2="20" y2="110" style="stroke: #555555;stroke-width:1;"></line> </svg> <svg class="svg-link" style="margin-left: 4px;"><path stroke="black" d="M5 40 l215 0"></path></svg> <button type="button" class="btn btn-primary custom-btn  column-button"  style="background: '+bg+';">'+value.replace(/^\./g,'')+'</button></div>';

				}
				else{
				col_row +='<div style="margin-top: 0px;height: 66px;"> <svg id="chart" style="width: 21px;margin: -8px;"> <line x1="20" y1="40" x2="20" y2="110" style="stroke: #555555;stroke-width:1;"></line> </svg> <svg class="svg-link" style="margin-left: 4px;"><path stroke="black" d="M5 40 l215 0"></path></svg> <button type="button" class="btn btn-primary custom-btn  column-button"  style="background: '+bg+';">'+value.replace(/^\./g,'')+'</button></div>';
				}
			});
			$(table).parent().find('.lever-columns').html(col_row);

		}
	});
}
