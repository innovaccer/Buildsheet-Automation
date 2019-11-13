$(function() {
	downloadClaimsAllData();
	downloadAttAlldata();
	selectL2Table();
	selectpayer();
	fromdate();
	selectpayerAt();
	fromdateAt();
	downloadClaimsbypayer();
	downloadAttByPayer();
	downloadClinicalAllData();
	selectpayercl();
	clCategory();
	validateDSC();
	Categoryselectpayercl();
	catclCategory();
	datetype();
	downloadclinicalByCategory();
	downloadclinicalByPayer()
});


function dataCompletion() {
	window.location.href= window.location.origin+'/dataCompletion/'
		
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

function downloadClaimsAllData() {
	$('#alldata').off('click');
	$('#alldata').on('click', function(e) {
		console.log("createnext");
		e.preventDefault();
		
			$.ajax({
				'type'	:	'POST',
				'url'	:	'/downloadDataReport/',
				'data'	:	{ action: 'allClaims','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			
			}).done(function(res) {
	

				if(res.status=='1'){
					toastr.error(res.message);
				
				}
				else{
					
					console.log(res);
		       	 	ct='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64';
		       	 	var ab=base64toBlob(res,ct);
		   			var blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    				var link = document.createElement('a');
    				link.href = window.URL.createObjectURL(blob);
    		    	link.download = 'myfile.xlsx';

    				document.body.appendChild(link);

    				link.click();

    				document.body.removeChild(link);
			  	}
						

        		
			
			
			});
		
		
	});
}

function downloadClaimsbypayer() {
	$('#claimsbypayer').off('click');
	$('#claimsbypayer').on('click', function(e) {
		console.log("createnext");
		e.preventDefault();
		if (validateDSC('claims')){
			$.ajax({
				'type'	:	'POST',
				'url'	:	'/downloadDataReport/',
				'data'	:	{ action: 'claimsDataByPayer',payer:$('#payer').val(),from_dt:$('#fromdt').val(),to_dt:$('#todate').val(),'csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			
			}).done(function(res) {
	

				if(res.status==1){
					toastr.error(res.message);
				
				}
				else{
					
					console.log(res);
		      		ct='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64';
		     		var ab=base64toBlob(res,ct);
		   			var blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    				var link = document.createElement('a');
    				link.href = window.URL.createObjectURL(blob);
    		    	link.download = 'myfile.xlsx';

    				document.body.appendChild(link);

    				link.click();

    				document.body.removeChild(link);
			 	 }
						

        		
			
				
			});
		
		}
	});
}

function downloadAttAlldata() {
	$('#atalldata').off('click');
	$('#atalldata').on('click', function(e) {
		console.log("Attribution All Data");
		e.preventDefault();
		$.ajax({
			'type'	:	'POST',
			'url'	:	'/downloadDataReport/',
			'data'	:	{ action: 'atalldata','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			
		}).done(function(res) {
	

			if(res.status==1){
				toastr.error(res.message);
				
			}
			else{
					
				console.log(res);
		        ct='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64';
		        var ab=base64toBlob(res,ct);
		   		var blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    			var link = document.createElement('a');
    			link.href = window.URL.createObjectURL(blob);
    		    link.download = 'myfile.xlsx';

    			document.body.appendChild(link);

    			link.click();

    			document.body.removeChild(link);
			  }
						

        		
			
				
		});
		

	});
}

function downloadAttByPayer() {
	$('#attributionByPayer').off('click');
	$('#attributionByPayer').on('click', function(e) {
		console.log("Attribution All Data");
		e.preventDefault();
		if (validateDSC('attribution')){
			$.ajax({
				'type'	:	'POST',
				'url'	:	'/downloadDataReport/',
				'data'	:	{ action: 'attributionByPayer',payer:$('#payerAt').val(),from_dt:$('#fromdtAt').val(),to_dt:$('#todateAt').val(),'csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			
				}).done(function(res) {
	

				if(res.status==1){
					toastr.error(res.message);
				
				}
				else{
					
					console.log(res);
		    	    ct='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64';
		     	   var ab=base64toBlob(res,ct);
		   			var blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    				var link = document.createElement('a');
    				link.href = window.URL.createObjectURL(blob);
    		   		link.download = 'myfile.xlsx';

    				document.body.appendChild(link);

    				link.click();

    				document.body.removeChild(link);
			 	 }
						

        		
			
				
			});
		}

	});
}

function downloadClinicalAllData() {
	$('#clalldata').off('click');
	$('#clalldata').on('click', function(e) {
		console.log("createnext");
		e.preventDefault();
		$.ajax({
			'type'	:	'POST',
			'url'	:	'/downloadDataReport/',
			'data'	:	{ action: 'allClinical','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			
		}).done(function(res) {
	

			if(res.status==1){
				toastr.error(res.message);
				
			}
			else{
					
				console.log(res);
		        ct='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64';
		        var ab=base64toBlob(res,ct);
		   		var blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    			var link = document.createElement('a');
    			link.href = window.URL.createObjectURL(blob);
    		    link.download = 'myfile.xlsx';

    			document.body.appendChild(link);

    			link.click();

    			document.body.removeChild(link);
			  }
						

        		
			
				
		});
		

	});
}

function downloadclinicalByPayer() {
	$('#clinicalByPayer').off('click');
	$('#clinicalByPayer').on('click', function(e) {
		console.log("Attribution All Data");
		e.preventDefault();
		if (validateDSC('clinical')){
			$.ajax({
				'type'	:	'POST',
				'url'	:	'/downloadDataReport/',
				'data'	:	{ action: 'clinicalbypayer',acon:$('#aco_nm3').val(),payer:$('#payercl').val(),cat:$('#clcategory').val(),from_dt:$('#fromdtcl').val(),to_dt:$('#todtcl').val(),'csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			
			}).done(function(res) {


				if(res.status==1){
					toastr.error(res.message);

				}
				else{
					
					console.log(res);
					ct='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64';
					var ab=base64toBlob(res,ct);
					var blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

					var link = document.createElement('a');
					link.href = window.URL.createObjectURL(blob);
					link.download = 'myfile.xlsx';

					document.body.appendChild(link);

					link.click();

					document.body.removeChild(link);
				}
						

        		
			
				
			});
		
		}
	});
}

function downloadclinicalByCategory() {
	$('#categoryclinical').off('click');
	$('#categoryclinical').on('click', function(e) {
		console.log("Attribution All Data");
		e.preventDefault();
		if (validateDSC('catclinical')){
			$.ajax({
				'type'	:	'POST',
				'url'	:	'/downloadDataReport/',
				'data'	:	{ action: 'clinicalbycategory',acon:$('#aco_nm4').val(),payer:$('#payercatcl').val(),cat:$('#clcategory1').val(),from_dt:$('#fromdtcatcl').val(),to_dt:$('#todtcatcl').val(),'csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			
			}).done(function(res) {


				if(res.status==1){
					toastr.error(res.message);

				}
				else{
					
					console.log(res);
					ct='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64';
					var ab=base64toBlob(res,ct);
					var blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

					var link = document.createElement('a');
					link.href = window.URL.createObjectURL(blob);
					link.download = 'myfile.xlsx';

					document.body.appendChild(link);

					link.click();

					document.body.removeChild(link);
				}
						

        		
			
				
			});
		
		}
	});
}

function selectpayer() {
	$('#aco_nm1').off('change');
	$('#aco_nm1').on('change', function(e) {
		console.log("asasasa");
		var select = this;
		e.preventDefault();
		if ($(this). children("option:selected"). val()!=''){
			 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/dataCompletion/',
				'data'	:	{schema:'l2',acon_nm1:$(this). children("option:selected"). val() ,type:'sstp', action: 'getpayer','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				console.log(res);

				var payer1 ='<option value="">Select Payer</option>'
				$.each(res.payer, function( index, value){
					console.log("ok");
					payer1 +='<option value="'+value+'">'+value+'</option>';

				});
				// console.log($(select).parent('.row').find('.l1_column'));
				console.log("here")
				$('#payer').empty();
				$('#payer').append(payer1); 
				//$(select).parent().parent().find('#payer').html(payer);

				
					
			});
			
		}
		else{}
		
	});
}

function fromdate() {
	$('#payer').off('change');
	$('#payer').on('change', function(e) {
		console.log("asasasa");
		var select = this;
		e.preventDefault();
		if ($(this). children("option:selected"). val()!=''){
			 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/dataCompletion/',
				'data'	:	{schema:'l2',payer:$(this). children("option:selected"). val() , date_ty:'rcdt',action: 'getfromdt','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				console.log(res);

				var from_dt1 ='<option value="">Select Year</option>'
				$.each(res.from_dt, function( index, value){
					console.log("ok");
					from_dt1 +='<option value="'+value+'">'+value+'</option>';

				});
				// console.log($(select).parent('.row').find('.l1_column'));
				console.log("here")
				$('#fromdt').empty();
				$('#todate').empty();
				$('#fromdt').append(from_dt1);
				$('#todate').append(from_dt1); 
				//$(select).parent().parent().find('#payer').html(payer);

				
					
			});
			
		}
		else{}
		
	});
}


function selectpayerAt() {
	$('#aco_nm2').off('change');
	$('#aco_nm2').on('change', function(e) {
		console.log("asasasa");
		var select = this;
		e.preventDefault();
		if ($(this). children("option:selected"). val()!=''){
			 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/dataCompletion/',
				'data'	:	{schema:'l2',acon_nm1:$(this). children("option:selected"). val(),type:'plnm' , action: 'getpayer','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				console.log(res);

				var payer1 ='<option value="">Select Payer</option>'
				$.each(res.payer, function( index, value){
					console.log("ok");
					payer1 +='<option value="'+value+'">'+value+'</option>';

				});
				// console.log($(select).parent('.row').find('.l1_column'));
				console.log("here")
				$('#payerAt').empty();
				$('#payerAt').append(payer1); 
				//$(select).parent().parent().find('#payer').html(payer);

				
					
			});
			
		}
		else{}
		
	});
}

function fromdateAt() {
	$('#payerAt').off('change');
	$('#payerAt').on('change', function(e) {
		console.log("asasasa");
		var select = this;
		e.preventDefault();
		if ($(this). children("option:selected"). val()!=''){
			 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/dataCompletion/',
				'data'	:	{schema:'l2',payer:$(this). children("option:selected"). val() ,date_ty:'atrdt', action: 'getfromdt','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				console.log(res);

				var from_dt1 ='<option value="">Select Year</option>'
				$.each(res.from_dt, function( index, value){
					console.log("ok");
					from_dt1 +='<option value="'+value+'">'+value+'</option>';

				});
				// console.log($(select).parent('.row').find('.l1_column'));
				console.log("here")
				$('#fromdtAt').empty();
				$('#todateAt').empty();
				$('#fromdtAt').append(from_dt1);
				$('#todateAt').append(from_dt1); 
				//$(select).parent().parent().find('#payer').html(payer);

				
					
			});
			
		}
		else{}
		
	});
}


function selectpayercl() {
	$('#aco_nm3').off('change');
	$('#aco_nm3').on('change', function(e) {
		console.log("asasasa");
		var select = this;
		e.preventDefault();
		if ($(this). children("option:selected"). val()!=''){
			 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/dataCompletion/',
				'data'	:	{schema:'l2',acon_nm1:$(this). children("option:selected"). val(),type:'sstpcl' , action: 'getpayer','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				console.log(res);

				var payer1 ='<option value="">Select Facility</option>'
				$.each(res.payer, function( index, value){
					console.log("ok");
					payer1 +='<option value="'+value+'">'+value+'</option>';

				});
				// console.log($(select).parent('.row').find('.l1_column'));
				console.log("here")
				$('#payercl').empty();
				$('#payercl').append(payer1); 
				//$(select).parent().parent().find('#payer').html(payer);

				
					
			});
			
		}
		else{}
		
	});
}

function Categoryselectpayercl() {
	$('#aco_nm4').off('change');
	$('#aco_nm4').on('change', function(e) {
		console.log("asasasa");
		var select = this;
		e.preventDefault();
		if ($(this). children("option:selected"). val()!=''){
			 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/dataCompletion/',
				'data'	:	{schema:'l2',acon_nm1:$(this). children("option:selected"). val(),type:'sstpcl' , action: 'getpayer','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				console.log(res);

				var payer1 ='<option value="">Select Facility</option>'
				$.each(res.payer, function( index, value){
					console.log("ok");
					payer1 +='<option value="'+value+'">'+value+'</option>';

				});
				// console.log($(select).parent('.row').find('.l1_column'));
				console.log("here")
				$('#payercatcl').empty();
				$('#payercatcl').append(payer1); 
				//$(select).parent().parent().find('#payer').html(payer);

				
					
			});
			
		}
		else{}
		
	});
}

function clCategory() {
	$('#payercl').off('change');
	$('#payercl').on('change', function(e) {
		console.log("asasasa");
		var select = this;
		e.preventDefault();
		if ($(this). children("option:selected"). val()!=''){
			 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/dataCompletion/',
				'data'	:	{schema:'l2',facility:$(this). children("option:selected"). val(), action: 'getcategory','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				console.log(res);

				var category1 ='<option value="">Select Category</option>'
				category1 +='<option value="All">All</option>'
				$.each(res.category, function( index, value){
					console.log("ok");
					category1 +='<option value="'+value+'">'+value+'</option>';

				});
				// console.log($(select).parent('.row').find('.l1_column'));
				console.log("here")
				$('#clcategory').empty();
				$('#clcategory').append(category1); 
				//$(select).parent().parent().find('#payer').html(payer);

				
					
			});
			
		}
		else{}
		
	});
}

function catclCategory() {
	$('#payercatcl').off('change');
	$('#payercatcl').on('change', function(e) {
		console.log("asasasa");
		var select = this;
		e.preventDefault();
		if ($(this). children("option:selected"). val()!=''){
			 
			$.ajax({
				'type'	:	'post',
				'url'	:	'/dataCompletion/',
				'data'	:	{schema:'l2',facility:$(this). children("option:selected"). val(), action: 'getcategory','csrfmiddlewaretoken':$( "input[name='csrfmiddlewaretoken']" ).val()}
			}).done(function(res) {
				console.log(res);

				var category1 ='<option value="">Select Category</option>'
				
				$.each(res.category, function( index, value){
					console.log("ok");
					if(value=='encounter' ||value=='allergy'||value=='diagnosis'||value=='immunization'||value=='appointment'||value=='procedure'){
						category1 +='<option value="'+value+'">'+value+'</option>';
					}

				});
				// console.log($(select).parent('.row').find('.l1_column'));
				console.log("here")
				$('#clcategory1').empty();
				$('#clcategory1').append(category1); 
				//$(select).parent().parent().find('#payer').html(payer);

				
					
			});
			
		}
		else{}
		
	});
}

function datetype() {
	$('#clcategory1').off('change');
	$('#clcategory1').on('change', function(e) {
		// console.log("datetype");
		var select = this;
		e.preventDefault();
		if ($(this). children("option:selected"). val()!=''){
			dtype='' 
			if($(this). children("option:selected"). val()=='encounter'){
				// console.log("datetype");
				dtype='efdt';
				// console.log(dtype)
			}
			if($(this). children("option:selected"). val()=='allergy'){
				dtype='alrdt';
			}
			if($(this). children("option:selected"). val()=='diagnosis'){
				dtype='ddt';
			}
			if($(this). children("option:selected"). val()=='immunization'){
				dtype='imfdt';
			}
			if($(this). children("option:selected"). val()=='appointment'){
				dtype='apfdt';
			}
			if($(this). children("option:selected"). val()=='procedure'){
				dtype='pfdt';
			}	
			console.log(dtype);
			$("#date_type").val(dtype);
			//$('#dare_price').val(value);
   			
			//$('#date_type').empty();
			//$('#date_type').append(dtype); 
				//$(select).parent().parent().find('#payer').html(payer);

				
					
			
			
		}
		else{}
		
	});
}


function validateDSC(type){
	console.log("validate");
	if(type=='claims'){
		unsetError($('#aco_nm1'));
		unsetError($('#payer'));
		unsetError($('#fromdt'));
		unsetError($('#todate'));
		if ($('#aco_nm1').val()==''){
		setError($('#aco_nm1'),'Please select ACO Name.');
		return false;
	}
	if ($('#payer').val()==''){
		setError($('#payer'),'Please select payer.');
		return false;
	}
	if ($('#fromdt').val()==''){
		setError($('#fromdt'),'Please select From date.');
		return false;
	}
	if ($('#fromdt').val()=='null'){
		setError($('#fromdt'),'Record date not available in DB. Report cannot be downloaded.');
		return false;
	}
	if ($('#todate').val()=='' ){
		setError($('#todate'),'Please seelct To Date.');
		return false;
	}
	if ($('#todate').val()<$('#fromdt').val()){
		setError($('#todate'),'TO date should be greater or equal to from date.');
		return false;
	}

	}

	if(type=='attribution'){
		unsetError($('#aco_nm2'));
		unsetError($('#payerAt'));
		unsetError($('#fromdtAt'));
		unsetError($('#todateAt'));
		if ($('#aco_nm2').val()==''){
		setError($('#aco_nm2'),'Please select ACO Name.');
		return false;
	}
	if ($('#payerAt').val()==''){
		setError($('#payerAt'),'Please select payer.');
		return false;
	}
	if ($('#fromdtAt').val()==''){
		setError($('#fromdtAt'),'Please select From date.');
		return false;
	}
	if ($('#todateAt').val()=='' ){
		setError($('#todateAt'),'Please seelct To Date.');
		return false;
	}
	if ($('#todateAt').val()<$('#fromdtAt').val()){
		setError($('#todateAt'),'TO date should be greater or equal to from date.');
		return false;
	}

	}

	if(type=='clinical'){
		unsetError($('#aco_nm3'));
		unsetError($('#payercl'));
		unsetError($('#clcategory'));
		unsetError($('#fromdtcl'));
		unsetError($('#todtcl'));
		if ($('#aco_nm3').val()==''){
		setError($('#aco_nm3'),'Please select ACO Name.');
		return false;
	}
	if ($('#payercl').val()==''){
		setError($('#payercl'),'Please select Facility.');
		return false;
	}
	if ($('#clcategory').val()==''){
		setError($('#clcategory'),'Please select category.');
		return false;
	}
	if ($('#fromdtcl').val()==''){
		setError($('#fromdtcl'),'Please select From date.');
		return false;
	}
	
	if ($('#todtcl').val()=='' ){
		setError($('#todtcl'),'Please seelct To Date.');
		return false;
	}
	if ($('#todtcl').val()<$('#fromdtcl').val()){
		setError($('#todtcl'),'TO date should be greater or equal to from date.');
		return false;
	}

	}
	if(type=='catclinical'){
		unsetError($('#aco_nm4'));
		unsetError($('#payercatcl'));
		unsetError($('#clcategory'));
		unsetError($('#fromdtcl'));
		unsetError($('#todtcatcl'));
		if ($('#aco_nm4').val()==''){
		setError($('#aco_nm4'),'Please select ACO Name.');
		return false;
	}
	if ($('#payercatcl').val()==''){
		setError($('#payercatcl'),'Please select Facility.');
		return false;
	}
	if ($('#clcategory1').val()==''){
		setError($('#clcategory1'),'Please select category.');
		return false;
	}
	if ($('#fromdtcatcl').val()==''){
		setError($('#fromdtcatcl'),'Please select From date.');
		return false;
	}
	
	if ($('#todtcatcl').val()=='' ){
		setError($('#todtcatcl'),'Please seelct To Date.');
		return false;
	}
	if ($('#todtcatcl').val()<$('#fromdtcatcl').val()){
		setError($('#todtcatcl'),'TO date should be greater or equal to from date.');
		return false;
	}

	}

	return true;

}