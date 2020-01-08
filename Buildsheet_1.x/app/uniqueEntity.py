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

from redshift.utils import  getdatafromdb,getingdtfromdb,getsourceid,getsourcetype,getAcoid,getTableDesc,getSchemaTables,runQuery,runQueryByConnection,schemaList,getSchemaAll
from mysql.utils import getl2CatSql,getllCatSql,runSelectQuery,getsemanticreportfromdb,getontologyreportfromdb,getauditreportfromdb,getRules,insertData,getBuildsheetCategories,getSQL,checkSource,getBuildsheet,getBuildsheetByMeta,runMysqlQuery,fetchBuildsheet,getMetaDetails,fetchBuildsheetByID,runSelectQuery,getAcowiseBuildsheet
from django.views.decorators.csrf import csrf_protect
import json
import re
import xlwt
import csv
import pandas as pd
import numpy as np
import xlsxwriter
import base64
import io

def uniqueRedirect(request, buildsheet_id):
    try:
        if (request.method == 'POST'):
            if (request.POST.get('action')=='getAllEntityCount'):
                meta_ids = request.POST.getlist('meta_id[]')
                print meta_ids
                rows = []
                for meta_id in meta_ids:
                    row =[]
                    category = runSelectQuery('select distinct  l2_table from meta_data_stg_testing where id='+meta_id)
                    l1CatSql=getllCatSql('','',meta_id,'l1')
                    # print l1CatSql[0][0]
                    if l1CatSql[0][0]!='':
                        l2CatSql=getllCatSql('','',meta_id,'l2')
                        l1_count = runQuery('',l1CatSql[0][4])
                        l2_count = runQuery('',l2CatSql[0][4])
                        row.append(category[0][0])
                        row.append(l1_count[0][0]) 
                        row.append(l2_count[0][0])
                        # print row
                        rows.append(row)
                if len(rows)!=0:        
                    return HttpResponse(json.dumps({'status':'2','rows':rows}),content_type='application/json')
                else:
                    return HttpResponse(json.dumps({'status':'1','msg':'Please Check any Column as Entity!'}),content_type='application/json')
                # buildsheets = runelectQuery("select distinct a.l2_table,a.id,a.aco_id,a.source_id,cast(a.modified as char),a.buildsheet_workspaces_id  from meta_data_stg_testing a left join buildsheet_proj_stg_testing b on a.id =b.meta_id where a.delete_flag=0 and  a.buildsheet_workspaces_id='"+buildsheet_id+"'") 
            if (request.POST.get('action')=='getEntityCount'):
                # rows = getdatafrommysql('','',request.POST.get('meta_id'))
                l1CatSql=getllCatSql('','',request.POST.get('meta_id'),'l1')
                if l1CatSql[0][0]!='':
                    l2CatSql=getllCatSql('','',request.POST.get('meta_id'),'l2')
                    l1_count = runQuery('',l1CatSql[0][4])
                    l2_count = runQuery('',l2CatSql[0][4])
                    tables = runSelectQuery("select group_concat(case when rule_type='from' then concat(source_table) else concat(destination_table)   end SEPARATOR '<br>') as col_name from  buildsheet_project_staging.buildsheet_proj_stg_testing where meta_id='"+request.POST.get('meta_id')+"' and rule_type in ('from','inner join','left join','right join') group by meta_id")
                    columns = runSelectQuery("select group_concat(source_column SEPARATOR '<br>'),group_concat(destination_column SEPARATOR '<br>') from buildsheet_proj_stg_testing where meta_id='"+request.POST.get('meta_id')+"' and unique_flag='1'")
                    return HttpResponse(json.dumps({'status':'2','tables':tables,'columns':columns[0],'l1_count':l1_count[0][0],'l2_count':l2_count[0][0]}),content_type='application/json')
                else:
                    return HttpResponse(json.dumps({'status':'1','msg':'Please Check any Column as Entity!'}),content_type='application/json')
                
        else:
            # getdatafrommysql('','','245')
            buildsheet = runSelectQuery("select distinct concat(aco_name,'_',source_name),workspace_name,id,aco_id,aco_name,source_id,source_name,vendor_name,vendor_version,olap_version from buildsheet_workspaces where delete_flag=0 and id='"+buildsheet_id+"'")
            buildsheets = runSelectQuery("select distinct a.l2_table,a.id,a.aco_id,a.source_id,cast(a.modified as char),a.buildsheet_workspaces_id  from meta_data_stg_testing a left join buildsheet_proj_stg_testing b on a.id =b.meta_id where a.delete_flag=0 and  a.buildsheet_workspaces_id='"+buildsheet_id+"'")
            olap_version =runSelectQuery("select name from buildsheet_master where parent_id = 99")
            vender_name=runSelectQuery("select name from buildsheet_master where parent_id = 97")
            # return render(request, 'viewUniqueEntity.html', {'buildsheet' :buildsheet[0],'buildsheets':buildsheets,'olap_version':olap_version,'vender_name':vender_name})    
            return render(request, 'uniqueEntity/entityView.html', {'buildsheet' :buildsheet[0],'buildsheets':buildsheets,'olap_version':olap_version,'vender_name':vender_name})    
    except Exception as e:
        return HttpResponse(json.dumps({'status':'1','msg':str(e)}),content_type='application/json')

def getdatafrommysql(aco_id,source_id,meta_id):
    l1CatSql=getllCatSql(aco_id,source_id,meta_id,'l1')
    l2CatSql=getllCatSql(aco_id,source_id,meta_id,'l2')

    df=pd.DataFrame(l1CatSql)
    print(df)
    df2=pd.DataFrame(l2CatSql)
    print(df2)
    df['l1count']=''
    df2['l2count']=''
    for i, row in df.iterrows():
        print(df.iloc[i,4])
        df.at[i,'l1count'] = runQuery('',df.iloc[i,4])
        #df.set_value(i,'l1count',ifor_val)
    for j, row1 in df2.iterrows():
        print(df2.iloc[i,4])
        df2.at[j,'l2count'] = runQuery('',df2.iloc[j,4])
        #df.set_value(j,'l2count',ifor_val1)
    res_df=pd.concat([df,df2], axis=1)

    print("l1 data")
    print(df)
    print("l2 data")
    print(df2)
    res_df.to_csv("uniqu.csv",mode='a',header=True,index=False,line_terminator='\n')
    print(res_df)
    #rows=res_df.to_numpy()
    return res_df




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
            buildsheets = runSelectQuery("select distinct concat(aco_name,'_',source_name),workspace_name,id,aco_id,aco_name,source_id,source_name,vendor_name,vendor_version,cast(modified as char),ifnull(category_count,'0'),olap_version,cast((ifnull(category_count,'0')/16)*100 as decimal(18,1)) from buildsheet_workspaces a left join (select count(*) as category_count ,buildsheet_workspaces_id from meta_data_stg_testing where delete_flag=0 group by buildsheet_workspaces_id) b on b.buildsheet_workspaces_id = a.id where  a.delete_flag=0");
            olap_version =runSelectQuery("select name from buildsheet_master where parent_id = 99");
            vender_name=runSelectQuery("select name from buildsheet_master where parent_id = 97");
            schema=schemaList()
            return render(request, 'uniqueEntity.html',{'schema':schema,'buildsheets': buildsheets,'olap_version':olap_version,'vender_name':vender_name})
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

if __name__=='__main__':
    getdatafrommysql('','','245')
    #getdatafrommysql('1','1','246')
    