$(function() {
	getcount();
	$("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
	$("[meta-id='0']").trigger('click');
});


function getcount() {
	$('.entity-category').off('click');
	$('.entity-category').on('click', function(e) {
		e.preventDefault();
		current =this
		var buildsheet_id =$(location).attr('href').match(/uniqueEntity\/\d+/g)[0].match(/\d+$/g);

		$('.box').removeAttr("hidden");
		$('.box').jmspinner('large');
		$('.entity-category').removeClass('list-color');
		if($(this).attr('meta-id')!='0'){
			$(current).addClass('list-color');
			
			$.ajax({
					'type'	:	'post',
					'url'	:	'/uniqueEntity/'+buildsheet_id,
					'async': false,
					'data'	:	{'meta_id':$(current).attr('meta-id') , 'action': 'getEntityCount','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
				}).done(function(res) {
					if (res.status=='2'){
						$('.box').jmspinner(false);
						$('.box').attr("hidden",'');
						// console.log(res);
						$('.entity-table').html('<table class="table table-hover"><thead><tr><th scope="col">Source Tables</th><th scope="col">L1 Columns</th><th scope="col">L2 Columns</th><th scope="col">L1 Count</th><th scope="col">L2 Count</th></tr></thead><tbody><tr><td>'+res.tables+'</td><td>'+res.columns[0]+'</td><td>'+res.columns[1]+'</td><td>'+res.l1_count+'</td><td>'+res.l2_count+'</td></tr></tbody</table>')
					}
					else{
						$('.box').jmspinner(false);
						$('.box').attr("hidden",'');
						$('.entity-table').html(res.msg);
					}
				});
			
		}
		else{
			$(current).addClass('list-color');
			$('.box').jmspinner(false);
			$('.box').attr("hidden",'');
			meta_id = []
			$.each($('.entity-category'), function(i,v){
				if($(v).attr('meta-id')!='0'){
						meta_id.push($(v).attr('meta-id'));
					
				}
			});
			$.ajax({
					'type'	:	'post',
					'url'	:	'/uniqueEntity/'+buildsheet_id,
					'async': false,
					'data'	:	{'meta_id[]':meta_id , 'action': 'getAllEntityCount','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
				}).done(function(res) {
					if (res.status=='2'){
						$('.box').jmspinner(false);
						$('.box').attr("hidden",'');
						tr = ''
						$.each(res.rows, function(i,v){
							tr +='<tr>'
							console.log(v);
							tr += '<td>'+v[0]+'</td><td>'+v[1]+'</td><td>'+v[2]+'</td>'
							tr +='</tr>'

						});
						

						$('.entity-table').html('<table class="table table-hover"><thead><tr><th scope="col">Category</th><th scope="col">L1 Count</th><th scope="col">L2 Count</th></tr></thead><tbody>'+tr+'</tbody</table>')
					}
					else{

						$('.box').jmspinner(false);
						$('.box').attr("hidden",'');
						$('.entity-table').html(res.msg);
					}
			});
		}
	});	
}
 /*select 
group_concat(case when rule_type='from' then concat(l1_schema,'.',source_table,' as ',alias)
 else concat(l2_schema,'.',destination_table,' as ',alias)   end,'\n') as col_name
 from  buildsheet_project_staging.buildsheet_proj_stg_testing where meta_id='265' and 
 rule_type in ('from','inner join','left join','right join') group by meta_id; */