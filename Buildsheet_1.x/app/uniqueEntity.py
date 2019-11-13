from __future__ import unicode_literals

from django.shortcuts import render
import string
# Create your views here.
from django.views.generic import TemplateView # Import TemplateView

from app.forms import SignupForm

from django.http import HttpResponse, HttpResponseRedirect
#from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from app.backends import MyAuthBackend

from redshift.utils import getdatafromdb,getingdtfromdb,getsourceid,getsourcetype,getAcoid,getTableDesc,getSchemaTables,runQuery,runQueryByConnection,schemaList,getSchemaAll
from mysql.utils import getsemanticreportfromdb,getontologyreportfromdb,getauditreportfromdb,getRules,insertData,getBuildsheetCategories,getSQL,checkSource,getBuildsheet,getBuildsheetByMeta,runMysqlQuery,fetchBuildsheet,getMetaDetails,fetchBuildsheetByID,runSelectQuery,getAcowiseBuildsheet
from django.views.decorators.csrf import csrf_protect
import json
import re
import xlwt
import csv
import pandas as pd
import xlsxwriter
import base64
import io



def getResult(request):
    try:
        if(request.method == 'POST'):
        	print("asasas")
        	action=request.POST.get('action')
        	if(action=='getbasetable'):
        		schema=request.POST.get('schema')
        		tables=getSchemaTables(schema)
        		return HttpResponse(json.dumps({'tables':tables}),content_type='application/json')
        	if(action=='getbasecolumn'):
        		schema=request.POST.get('schema')
        		table=request.POST.get('table')
        		columns=getTableDesc(schema,table)
        		
        		return HttpResponse(json.dumps({'columns': columns,'status':'2'}),content_type='application/json')
        	if(action=='getbasecolumn2'):
        		schema=request.POST.get('schema')
        		table=request.POST.get('table')
        		columns=getTableDesc(schema,table)
        		acoid=getAcoid(schema,table)
        		return HttpResponse(json.dumps({'columns': columns,'status':'2','acoid':acoid}),content_type='application/json')
        	
        	
        	
        	if(action=='getsourcetype'):
        		schema=request.POST.get('schema')
        		table=request.POST.get('table')
        		acoid=request.POST.get('acoid')
        		sourcetype=getsourcetype(schema,table,acoid)
        		return HttpResponse(json.dumps({'sourcetype':sourcetype}),content_type='application/json')
        	if(action=='getsourceid'):
        		schema=request.POST.get('schema')
        		table=request.POST.get('table')
        		acoid=request.POST.get('acoid')
        		sourceid=getsourceid(schema,table,acoid)
        		sourcetype=getsourcetype(schema,table,acoid)
        		return HttpResponse(json.dumps({'sourceid':sourceid,'sourcetype':sourcetype}),content_type='application/json')
        	if(action=='getingdt'):
        		schema=request.POST.get('schema2')
        		table=request.POST.get('schematable2')
        		aco_id=request.POST.get('aco_id')
        		source_id=request.POST.get('source_id')
        		source_type=request.POST.get('source_type')
        		ingdt=getingdtfromdb(schema,table,aco_id,source_id,source_type)
        		return HttpResponse(json.dumps({'ingdt': ingdt,'status':'2'}),content_type='application/json')
        	if(action=='getuniqueEntity'):
        		schema1=request.POST.get('schemau')        		
        		table1=request.POST.get('SchemaTableu')       		
        		tablecolumns1=request.POST.getlist('schemabaseColumns[]')        		
        		schema2=request.POST.get('schema2')        		
        		table2=request.POST.get('schematable2')        		
        		tableColumns2=request.POST.getlist('schemaColumns2[]')        		
        		aco_id=request.POST.get('aco_id')        		
        		source_id=request.POST.get('source_id')        		
        		source_type=request.POST.get('source_type')        		
        		ingdt=request.POST.get('ingdt')        		
        		rows=getdatafromdb(schema1,table1,tablecolumns1,schema2,table2,tableColumns2,aco_id,source_id,source_type,ingdt)
        		print(rows)        		
           		print("after rows")
        		#columns=["schema","tablename","unique_columns","total_count","schema","tablename","unique_columns","total_count"]
        		#return render(request, 'viewunique.html', {'rows': rows,'columns': columns})
        		return HttpResponse(json.dumps({'l1': rows.iloc[3],'status':'2','l2':rows.iloc[7]}),content_type='application/json')
        else:
        	schema=schemaList()
        	return render(request, 'uniqueEntity.html',{'schema':schema})
    except Exception as e:
        return HttpResponse(json.dumps({'status':'1','msg':str(e)}),content_type='application/json')


'''def getdatafromdb1(schema1,table1,tablecolumns1,schema2,table2,tableColumns2,aco_id,source_id,source_type,ingdt):
	try:
			final_df=pd.DataFrame()
			for k,v in self.table.iteritems():  #here k is key and v is value
				passed_ingestion_datetime="%"+v['ingdt']+"%"
				len_inp= len(v['tablecolumns1'])
				len_out= len(v['tableColumns2'])
				input_str=""
				input_str_unq=""
				output_str=""
				output_str_unq=""
#loop to get input columns name with null handling#
				for i in range(len_inp):
					if i==(len_inp-1):
						input_str=input_str+"isnull(cast("+v['tablecolumns1'][i]+" as varchar(300)),'')"
					else:	
						input_str=input_str+"isnull(cast("+v['tablecolumns1'][i]+" as varchar(300)),'')||"
#loop to get input columns name only to show#
				for i in range(len_inp):
					if i==(len_inp-1):
						input_str_unq=input_str_unq+v['tablecolumns1'][i]
					else:	
						input_str_unq=input_str_unq+v['tablecolumns1'][i]+"||"
#loop to get input columns name with null handling#
				for i in range(len_out):
					if i==(len_out-1):
						output_str=output_str+"isnull(cast("+v['tableColumns2'][i]+" as varchar(300)),'')"
					else:
						output_str=output_str+"isnull(cast("+v['tableColumns2'][i]+" as varchar(300)),'')||"
#loop to get input columns name only to show#
				for i in range(len_out):
					if i==(len_out-1):
						output_str_unq=output_str_unq+v['tableColumns2'][i]
					else:	
						output_str_unq=output_str_unq+v['tableColumns2'][i]+"||"
#From here query will start and take the inputs form input file and above variables#

				query = "select '"+schema1+"' as schema, '"+table1+"' as tablename,(replace(('"+input_str_unq+"'),'||',', ')) as unique_columns,count(distinct ("+input_str+")) as total_count from  "+schema1+"."+table1+" "
				src_df = pd.read_sql_query(query,conn,params={"passed_ingestion_datetime":passed_ingestion_datetime})
				query = "select 'l2' as schema, '"+table2+"' as tablename,(replace(('"+output_str_unq+"'),'||',', ')) as unique_columns,count(distinct ("+output_str+")) as total_count from "+schema1+"."+table1+" where aco_id = '"+vaco_id+"'' and source_id = '"+source_id+"' and source_type) = '"+source_type+"' and ingestion_datetime in %(passed_ingestion_datetime)s"
				trg_df = pd.read_sql_query(query,conn,params={"passed_ingestion_datetime":passed_ingestion_datetime})
				res_df=pd.concat([src_df,trg_df], axis=1)
				final_df=final_df.append(res_df)
			final_df.to_csv(self.file_name+'_'+v['source_name']+'_'+dt+".csv",index=False)'''