from __future__ import unicode_literals
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
import json
import sqlalchemy as sa
from sqlalchemy.orm import sessionmaker
import pandas as pd
import xlsxwriter
from django.http import HttpResponse, HttpResponseRedirect,StreamingHttpResponse
import io
import StringIO
from django.shortcuts import render
import base64
from utils import getTableDesc,getSchemaTables,runQuery,getAcoNames,getPayerforClaims,getfromdtclaims,getcategoryforcl

#class RedshiftUtils(object):

def connection():
	#Get DB credetial from Config file
	with open('app/config.json') as config_file:
		data = json.load(config_file)
	DATABASE = data['redshift']['database']
	USER = data['redshift']['user']
	PASSWORD = data['redshift']['password']
	HOST = data['redshift']['host']
	PORT = data['redshift']['port'] 

	try:
	    connection_string = "postgresql+psycopg2://%s:%s@%s:%s/%s" % (USER,PASSWORD,HOST,str(PORT),DATABASE)
	    engine = sa.create_engine(connection_string)
	except Exception as e:
	    print "Error During Connection: "+str(e)
	session = sessionmaker()
	session.configure(bind=engine)
	return session()

def dataCompletion(request):
    
    #print request.method
    if (request.method == 'POST'):   	
        action = request.POST.get('action')
        aco_nm = request.POST.get('acon_nm1')        
        schema = request.POST.get('schema')
        payer_ty=request.POST.get('type')
        if action =='getpayer':
            payer= getPayerforClaims(schema,aco_nm,payer_ty)
            
            return HttpResponse(json.dumps({'payer':payer}),content_type='application/json')
        if action =='getfromdt':
            payer=request.POST.get('payer')
            date_ty=request.POST.get('date_ty')
            from_dt= getfromdtclaims('l2',payer,date_ty)

            return HttpResponse(json.dumps({'from_dt':from_dt}),content_type='application/json')
        # print "hello"
        if action=='getcategory':
        	facility=request.POST.get('facility')
        	category= getcategoryforcl(facility)
        	return HttpResponse(json.dumps({'category':category}),content_type='application/json')
        if action =='checkSource':
            msg = checkSource(request.POST.get('source_id'),request.POST.get('aco_id'),request.POST.get('workflow_id'))
            if(msg)!='0':
                return HttpResponse(json.dumps({'status':'1','message':msg}),content_type='application/json')
            else:
                return HttpResponse(json.dumps({'status':'2','message':"Go Ahead"}),content_type='application/json')
         
    else:
        aco_nm= getAcoNames('l2')

        #print l2_tables
        return render(request, 'dataCompletion.html',{'aco_nm':aco_nm})
    

    return render(request, 'dataCompletion.html')

def getAllDataForClaims():
	con =connection()
	SetPath = "SET search_path TO l2"
	con.execute(SetPath)
	query ="select sstp,rcdt,count(distinct empi) from l2.pd_activity where lower(st)='claims'  group by sstp,rcdt order by rcdt"
	rr = con.execute(query)
	print query
	all_results =  rr.fetchall()
	#workbook=xlswriter.workbook('allclaims.xlsx')	

	#bool=createExcel1(all_results,'allClaims.xlsx')
	return all_results

def getAllAttributiondata():
	con =connection()
	SetPath = "SET search_path TO l2"
	con.execute(SetPath)
	query ='select prnm as Payer,atrdt,count(distinct empi) from l2.pd_attribution group by prnm,atrdt order by atrdt desc'
	rr = con.execute(query)
	print query
	all_results =  rr.fetchall()
	#workbook=xlswriter.workbook('allclaims.xlsx')	

	#bool=createExcel1(all_results,'AllAttribution.xlsx')
	return all_results	
	

def getAllClinicalData():
	con =connection()
	SetPath = "SET search_path TO l2"
	con.execute(SetPath)
	query ="select sstp,ingdt::date,count(distinct empi) from l2.pd_activity where  lower(st)='clinical' group by sstp, ingdt::date order by ingdt::date"
	rr = con.execute(query)
	print query
	all_results =  rr.fetchall()
	#workbook=xlswriter.workbook('allclaims.xlsx')	

	#bool=createExcel1(all_results,'allClaims.xlsx')
	return all_results

	
	
def getClaimsByPayer(payer,from_dt,to_dt):
	query="select sstp,rcdt,count(distinct empi) from l2.pd_activity where lower(st)='claims' and sstp='"+payer+"' and date_part_year(rcdt)>='"+from_dt+"' and date_part_year(rcdt)<='"+to_dt+"' group by sstp, rcdt order by rcdt "
	con =connection()
	SetPath = "SET search_path TO l2"
	con.execute(SetPath)

	rr = con.execute(query)
	print query
	all_results =  rr.fetchall()
	#workbook=xlswriter.workbook('allclaims.xlsx')	
	#bool=createExcel1(all_results,'allClaimsbypayer.xlsx')

	return all_results
	

def getAllAttributionBypayer(payer,from_dt,to_dt):
	query="select prnm,atrdt,count(distinct empi) from l2.pd_attribution where  prnm='"+payer+"' and date_part_year(atrdt)>='"+from_dt+"' and date_part_year(atrdt)<='"+to_dt+"' group by prnm, atrdt order by atrdt"
	con =connection()
	SetPath = "SET search_path TO l2"
	con.execute(SetPath)

	rr = con.execute(query)
	print query
	all_results =  rr.fetchall()
	#workbook=xlswriter.workbook('allclaims.xlsx')	
	#bool=createExcel1(all_results,'allAttributionbyPayer.xlsx')

	return all_results

def getClinicalBypayer(acon,payer,cat,from_dt,to_dt):
	
	query=''
	if cat=='All' :
		query="select sstp,ingdt::date,count(distinct empi) from l2.pd_activity where lower(st)='clinical' and acon='"+acon+"' and sstp='"+payer+"' and ingdt::date>='"+from_dt+"' and ingdt::date<='"+to_dt+"'  group by sstp, ingdt::date order by ingdt::date"
	else:
		query="select sstp,ingdt::date,count(distinct empi) from l2.pd_activity where lower(st)='clinical' and acon='"+acon+"' and sstp='"+payer+"' and ingdt::date>='"+from_dt+"' and ingdt::date<='"+to_dt+"' and cltp='"+cat+"'  group by sstp, ingdt::date order by ingdt::date"
	

	con =connection()
	SetPath = "SET search_path TO l2"
	con.execute(SetPath)

	rr = con.execute(query)
	print query
	all_results =  rr.fetchall()
	#workbook=xlswriter.workbook('allclaims.xlsx')	
	#bool=createExcel1(all_results,'allAttributionbyPayer.xlsx')

	return all_results
def getClinicalBycategorty(acon,payer,cat,from_dt,to_dt):
	
	query=''

	if cat=='encounter':
		query="select sstp,efdt,count(distinct empi) from l2.pd_activity where lower(st)='clinical' and acon='"+acon+"' and sstp='"+payer+"' and efdt>='"+from_dt+"' and efdt<='"+to_dt+"' and cltp='"+cat+"'  group by sstp, efdt order by efdt"
	elif cat=='allergy' :
		query="select sstp,alrdt::date,count(distinct empi) from l2.pd_activity where lower(st)='clinical' and acon='"+acon+"' and sstp='"+payer+"' and alrdt::date>='"+from_dt+"' and alrdt::date<='"+to_dt+"' and cltp='"+cat+"'  group by sstp, alrdt::date order by alrdt::date"
	elif cat=='diagnosis':
		query="select sstp,ddt::date,count(distinct empi) from l2.pd_activity where lower(st)='clinical' and acon='"+acon+"' and sstp='"+payer+"' and ddt::date>='"+from_dt+"' and ddt::date<='"+to_dt+"' and cltp='"+cat+"'  group by sstp, ddt::date order by ddt::date"
	elif cat=='immunization':
		query="select sstp,imfdt::date,count(distinct empi) from l2.pd_activity where lower(st)='clinical' and acon='"+acon+"' and sstp='"+payer+"' and imfdt::date>='"+from_dt+"' and imfdt::date<='"+to_dt+"' and cltp='"+cat+"'  group by sstp, imfdt::date order by imfdt::date"
	elif cat=='appointment':
		query="select sstp,apfdt::date,count(distinct empi) from l2.pd_activity where lower(st)='clinical' and acon='"+acon+"' and sstp='"+payer+"' and apfdt::date>='"+from_dt+"' and apfdt::date<='"+to_dt+"' and cltp='"+cat+"'  group by sstp, apfdt::date order by apfdt::date"
	elif cat=='procedure':
		query="select sstp,pfdt::date,count(distinct empi) from l2.pd_activity where lower(st)='clinical' and acon='"+acon+"' and sstp='"+payer+"' and pfdt::date>='"+from_dt+"' and pfdt::date<='"+to_dt+"' and cltp='"+cat+"'  group by sstp, pfdt::date order by pfdt::date"

	con =connection()
	SetPath = "SET search_path TO l2"
	con.execute(SetPath)

	rr = con.execute(query)
	print query
	all_results =  rr.fetchall()
	return all_results

	#return all_results
def createExcel1(data,file_name):
		
	#output = io.BytesIO()
	#workbook = xlsxwriter.Workbook(file_name, {'in_memory': True})

	success_flag=True
	df=pd.DataFrame(data,columns=['Payer','Record date','Count(distinct empi)'])
	df=df.pivot(columns='Payer',index='Record date',values='Count(distinct empi)')
	print(df)
	if(len(df)==0):
		success_flag=False
	writer=pd.ExcelWriter(file_name,engine='xlsxwriter')
	df.to_excel(writer,sheet_name='Report')
	'''for row in range(0, row_max):
		for col in range(0, col_max):
			worksheet.write(row, col, df[row][col])'''
	
	workbook=writer.book
	worksheet=writer.sheets['Report']
	worksheet.set_column('A:A',40)
	chart=workbook.add_chart({'type':'line'})
	max_row=len(df)+1

	rn=len(df.columns)

	print(rn)
	column=df.columns
	print (column)


	for i in range(0,rn):
		col=i+1
		print(col)
		chart.add_series({
			'name':['Report',0,col],
			'categories':['Report',1,0,max_row,0],
			'values':['Report',1,col,max_row,col],
			'line':{'width':1.00}
		})

	chart.set_legend({'position':'right'})
	chart.set_x_axis({'name':'Record Date'})
	chart.set_y_axis({
		'name':'count(distinct empi)',
		'major_gridlines':{
				'visible':True,
				'line':{'dash_type':'dash'}}
		})
	chart.set_size({'x_scale': 1.6, 'y_scale': 1.6})
	worksheet.insert_chart('E3',chart)


	

	for z in range(0,rn):
		df1=df[[str(column[z])]]
		#df2=df1.dropna()
		#print (df2)
		df1.to_excel(writer,sheet_name=str(column[z]))
		workbook1=writer.book
		worksheet1=writer.sheets[str(column[z])]
		worksheet1.set_column('A:A',25)	
		chart=workbook1.add_chart({'type':'line'})
		max_row1=len(df1)
		chart.add_series({
			'name':[str(column[z]),0,1],
			'categories':[str(column[z]),1,0,max_row,0],
			'values':[str(column[z]),1,1,max_row,1],
			'line':{'width':1.00}
		})
		chart.set_x_axis({'name':'Record Date'})
		chart.set_y_axis({
				'name':'count(distinct empi)',
				'major_gridlines':{
				'visible':True,
				'line':{'dash_type':'dash'}}
		})
		chart.set_size({'x_scale': 1.5, 'y_scale': 1.5})
		worksheet1.insert_chart('D5',chart)
	#chart.add_series({'values':'=D1!$B$2:$B$24:'})
	
	
	
	
	if success_flag==True:
		writer.save()
	else:
		print('No data received')

def getindexDate(flag):
	if flag==1:
		return 'Record Date (rcdt)'
	elif flag==2:
		return 'Attribution Date (atrdt)'
	elif flag==3:
		return 'Ingestion Date (ingdt)'


def createExcelforClaims(request):
	data=None
	flag=1
	alldataFlag=True
	
	if (request.method == 'POST'):
		if (request.POST.get('action')=='allClaims'):
			data=getAllDataForClaims()
			flag=1

		elif (request.POST.get('action')=='atalldata'):
			data=getAllAttributiondata()
			flag=2

		if (request.POST.get('action')=='allClinical'):
			data=getAllClinicalData()
			flag=3
			
		elif (request.POST.get('action')=='attributionByPayer'):
			payer=request.POST.get('payer')
			from_dt=request.POST.get('from_dt')
			to_dt=request.POST.get('to_dt')
			flag=2
			data=getAllAttributionBypayer(payer,from_dt,to_dt)
			alldataFlag=False

		elif (request.POST.get('action')=='claimsDataByPayer'):
			payer=request.POST.get('payer')
			from_dt=request.POST.get('from_dt')
			to_dt=request.POST.get('to_dt')
			flag=1
			data=getClaimsByPayer(payer,from_dt,to_dt)
			alldataFlag=False

		elif (request.POST.get('action')=='clinicalbypayer'):
			acon=request.POST.get('acon')
			payer=request.POST.get('payer')
			cat=request.POST.get('cat')
			from_dt=request.POST.get('from_dt')
			to_dt=request.POST.get('to_dt')
			flag=3
			data=getClinicalBypayer(acon,payer,cat,from_dt,to_dt)
			alldataFlag=False

		elif (request.POST.get('action')=='clinicalbycategory'):
			acon=request.POST.get('acon')
			payer=request.POST.get('payer')
			cat=request.POST.get('cat')
			from_dt=request.POST.get('from_dt')
			to_dt=request.POST.get('to_dt')
			flag=4
			data=getClinicalBycategorty(acon,payer,cat,from_dt,to_dt)
			alldataFlag=False
	
	if flag<4:
		date_col_name=getindexDate(flag)
	else:
		cate=request.POST.get('cat').lower()
		if cate=='encounter':
			date_col_name='Encounter first Date (efdt)'
		elif cate=='allergy' :
			date_col_name='Allergy record date (alrdt)'
		elif cate=='procedure' :
			date_col_name='Procedure Start date (pfdt)'
		elif cate=='diagnosis':
			date_col_name='Diagnosis Date (ddt)'
		elif cate=='immunization':
			date_col_name='Immunization Start date (imfdt)'
		elif cate=='appointment':
			date_col_name='appointment Start Date (apfdt)'
			

	print(date_col_name)
	
	output=StringIO.StringIO()
	success_flag=True	
	df=pd.DataFrame(data,columns=['Payer',date_col_name,'Count(distinct empi)'])
	df=df.pivot(columns='Payer',index=date_col_name,values='Count(distinct empi)')
	print(df)

	if(len(df)==0):
		success_flag=False
		return HttpResponse(json.dumps({'status':'1','message':"No data available"}),content_type='application/json')
	

	writer=pd.ExcelWriter(output,engine='xlsxwriter')
	df.to_excel(writer,sheet_name='Report')
	workbook=writer.book
	worksheet=writer.sheets['Report']
	worksheet.set_column('A:A',40)
	chart=workbook.add_chart({'type':'line'})
	max_row=len(df)+1

	rn=len(df.columns)
	print(rn)
	column=df.columns
	print (column)


	for i in range(0,rn):
		col=i+1
		print(col)
		chart.add_series({
			'name':['Report',0,col],
			'categories':['Report',1,0,max_row,0],
			'values':['Report',1,col,max_row,col],
			'line':{'width':1.00}
		})

	chart.set_legend({'position':'right'})
	chart.set_x_axis({'name':date_col_name})
	chart.set_y_axis({
		'name':'count(distinct empi)',
		'major_gridlines':{
				'visible':True,
				'line':{'dash_type':'dash'}}
		})
	chart.set_size({'x_scale': 2, 'y_scale': 1.6})
	chart_pos=''
	if alldataFlag==False:
		chart_pos='D5'
	else:
		chart_pos='E'+str((max_row+2))
	worksheet.insert_chart(chart_pos,chart)

	


	if alldataFlag==True:
		for z in range(0,rn):
			df1=df[[str(column[z])]]
			#df2=df1.dropna()
			print (df1)
			df1.to_excel(writer,sheet_name=str(column[z])[:30])
			workbook1=writer.book
			worksheet1=writer.sheets[str(column[z])[:30]]
			worksheet1.set_column('A:A',25)	
			chart=workbook1.add_chart({'type':'line'})
			max_row1=len(df1)
			chart.add_series({
				'name':[str(column[z])[:30],0,1],
				'categories':[str(column[z])[:30],1,0,max_row,0],
				'values':[str(column[z])[:30],1,1,max_row,1],
				'line':{'width':1.00}
			})
			chart.set_x_axis({'name':date_col_name})
			chart.set_y_axis({
					'name':'count(distinct empi)',
					'major_gridlines':{
					'visible':True,
					'line':{'dash_type':'dash'}}
			})
			chart.set_size({'x_scale': 1.5, 'y_scale': 1.5})
			worksheet1.insert_chart('D5',chart)
	
	
	if success_flag==True:
		writer.save()
		writer.close()
	else:
		print('No data received')
		
	output.seek(0)
	encoded = base64.b64encode(output.read()) 
	response = HttpResponse(encoded, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64')
	response['Content-Disposition'] = 'attachment; filename=myfile.xlsx'
	return response


#def createExcelFileforAttribution(request):
def createExcel(data):
	output=io.BytesIO()
	success_flag=True	
	df=pd.DataFrame(data,columns=['Payer','Record date','Count(distinct empi)'])
	df=df.pivot(columns='Payer',index='Record date',values='Count(distinct empi)')
	print(df)
	if(len(df)==0):
		success_flag=False
	writer=pd.ExcelWriter(output,engine='xlsxwriter')
	df.to_excel(writer,sheet_name='Complete_data_report')
	workbook=writer.book
	worksheet=writer.sheets['Complete_data_report']
	worksheet.set_column('A:A',40)	
	chart=workbook.add_chart({'type':'line'})
	max_row=len(df)+1
	rn=len(df.columns)
	print(rn)
	#chart.add_series({'values':'=D1!$B$2:$B$24:'})
	for i in range(0,rn):
		col=i+1
		print(col)
		chart.add_series({
			'name':['Complete_data_report',0,col],
			'categories':['Complete_data_report',1,0,max_row,0],
			'values':['Complete_data_report',1,col,max_row,col],
			'line':{'width':2.00}
		})

	chart.set_legend({'position':'top'})
	chart.set_x_axis({'name':'Record Date'})
	chart.set_y_axis({
		'name':'count(distinct empi)',
		'major_gridlines':{
				'visible':True,
				'line':{'dash_type':'dash'}}
		})
	worksheet.insert_chart('K5',chart)
	print(rn)
	c=5
	j=0
	
	try:
		while j<rn:
			print (j)
			char=workbook.add_chart({'type':'line'})
			col1=j+1
			print(col1)
			char.add_series({
				'name':['Complete_data_report',0,col1],
				'categories':['Complete_data_report',1,0,max_row,0],
				'values':['Complete_data_report',1,col1,max_row,col1],
				'line':{'width':2.00}
			})
			c+=15
			char_sv='K'+str(c)
			worksheet.insert_chart(char_sv,char)
			j+=1
	except :
		success_flag=False
		print('No data available')
	
	if success_flag==True:
		writer.save()
		writer.close()
	else:
		print('No data received')
	output.seek(0)

	#response = HttpResponse(output, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
	#response['Content-Disposition'] = 'attachment; filename=myfile.xlsx'
	return output.read()


if __name__ == '__main__':
	#getAllDataForClaims()
	#getClaimsByPayer('Aetna MA','2017','2018')
	#getAllAttributiondata()
	#getAllAttributionBypayer('UHC MA','2017','2018')
	getAllClinicalData()
