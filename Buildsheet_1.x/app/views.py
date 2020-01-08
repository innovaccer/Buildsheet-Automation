# -*- coding: utf-8 -*-
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
from redshift.utils import l1tol2,getTableDesc,getSchemaTables,runQuery,runQuery,schemaList,getSchemaAll
from mysql.utils import getTestcase,getQuality,getsqlforl1tol2,getSementicSQL,fetchTemplate,getMandatoryColumns,getl2Query,getsemanticreportfromdb,getontologyreportfromdb,getauditreportfromdb,getRules,insertData,getBuildsheetCategories,getSQL,checkSource,getBuildsheet,getBuildsheetByMeta,runMysqlQuery,fetchBuildsheet,getMetaDetails,fetchBuildsheetByID,runSelectQuery,getAcowiseBuildsheet
from django.views.decorators.csrf import csrf_protect
import json
import re
import xlwt
import csv
import pandas as pd
import xlsxwriter
import base64
import io
import numpy as np
try:
    from io import BytesIO as IO # for modern python
except ImportError:
    from io import StringIO as IO # for legacy python



def BuidsheetOptions(request):
    if (request.method == 'POST'):
        action = request.POST.get('action')
        table = request.POST.get('table')
        schema = request.POST.get('schema')
        olap_version=request.POST.get('schema')
        df = pd.read_csv('app/pd_activity_schema.csv', delimiter = ',')
        if action =='checkSource':
            msg = checkSource(request.POST.get('source_name'),request.POST.get('aco_name'),request.POST.get('l2_table'))
            if(msg)!='0':
                return HttpResponse(json.dumps({'status':'1','msg':msg}),content_type='application/json')
            else:
                return HttpResponse(json.dumps({'status':'2','msg':"Go Ahead"}),content_type='application/json')

        if action =='getL2Columns':
            olap_version=request.POST.get('olap_version')
            print("Olap")
            print(olap_version)
            columns= getTableDesc(schema,table)
            schemas= schemaList()
            mandatorycolumn=getMandatoryColumns(table,olap_version)
            print("asasasasasasasasasasasasas")
            print(mandatorycolumn)
            # l1_tables= getSchemaTables('accessnurocare_l1')
            rules= getRules()
            return HttpResponse(json.dumps({'schemas':schemas,'rules':rules,'columns':columns,'mandatorycolumn':mandatorycolumn}),content_type='application/json')

        if action =='getSchemaTables':
            tables= getSchemaTables(schema)
            return HttpResponse(json.dumps({'tables': tables,'status':'2'}),content_type='application/json')

        if action == 'getTableColumn':
            columns = getTableDesc(schema,table);
            #mandatorycolumn=getMandatoryColumns(table)
            return HttpResponse(json.dumps({'columns': columns,'status':'2'}),content_type='application/json')
         
    else:
        schemas= schemaList()
        return render(request, 'buildsheetCreate.html',{'schemas':schemas})


def BuildsheetSubmit(request):
    try:
            if (request.method == 'POST'):
                #Buildsheet column insert
                if (request.POST.get('action') == 'submitAliasBuild'):
                    meta_data= request.POST.get('meta_data')
                    meta_data= json.loads(meta_data) 
                    meta_id= request.POST.get('meta_id')
                    buildsheet_data = json.loads(request.POST.get('buildsheet_data'))
                    rows = ''
                    for data in buildsheet_data:
                        transform = re.sub(r'\\_',"_",re.escape(data['transform']))
                        transform = re.sub(r'\\%',"%",transform)
                        dest_table = re.sub(r'\\_',"_",re.escape(data['dest_table']))
                        dest_table = re.sub(r'\\%',"%",dest_table)
                        # print data
                        rows +="('"+request.POST.get('buildsheet_id')+"','"+request.POST.get('category')+"','"+data['alias']+"','"+data['source_schema']+"','"+data['source_table']+"','"+data['source_column']+"','"+data['rule']+"','"+transform+"','"+data['dest_schema']+"','"+dest_table+"','"+data['dest_column']+"','"+data['dest_datatype']+"','"+meta_id+"','"+meta_data[0]['source_id']+"','"+meta_data[0]['aco_id']+"'),"
                    rows = re.sub(',$','',rows)
                    runMysqlQuery("delete from  buildsheet_data  where  meta_id="+meta_id+" and rule_type in ('from','inner join','left join','right join')")
                    build_columns= 'buildsheet_workspaces_id,category,alias,l1_schema,source_table,source_column,rule_type,rule,l2_schema,destination_table,destination_column,data_type,meta_id,source_id,aco_id';
                    build_id = insertData('buildsheet_data',build_columns,rows)
                    if build_id!='':
                        return HttpResponse(json.dumps({'status':'2','msg':'Alias Details Submitted.','meta_id':meta_id}),content_type='application/json')
                    else:
                        return None
              #meta columns insert
                if (request.POST.get('action') == 'submitMetaBuild'):
                    meta_data= request.POST.get('meta_data')
                    meta_data= json.loads(meta_data)
                    if(request.POST.get('meta_id') =='0'):
                        msg = checkSource(re.sub(r'\\%',"%",re.sub(r'\\_',"_",re.escape(meta_data[0]['source_name']))),re.sub(r'\\%',"%",re.sub(r'\\_',"_",re.escape(meta_data[0]['aco_nm']))),meta_data[0]['l2_table'])
                        if(msg)!='0':
                            return HttpResponse(json.dumps({'status':'1','msg':msg}),content_type='application/json')
                        else:
                            meta_values = "(now(),'"+meta_data[0]['data_source_version']+"','"+meta_data[0]['data_source']+"','"+request.POST.get('buildsheet_id')+"','"+meta_data[0]['default_l1schema']+"','"+meta_data[0]['l2_schema']+"','"+meta_data[0]['l2_table']+"','"+meta_data[0]['sfn']+"','"+meta_data[0]['source_id']+"','"+re.sub(r'\\%',"%",re.sub(r'\\_',"_",re.escape(meta_data[0]['source_name'])))+"','"+meta_data[0]['source_type']+"','"+meta_data[0]['workflow_id']+"','"+meta_data[0]['author']+"','"+meta_data[0]['vendor_version']+"','"+re.sub(r'\\%',"%",re.sub(r'\\_',"_",re.escape(meta_data[0]['vendor_name'])))+"','"+meta_data[0]['aco_id']+"','"+re.sub(r'\\%',"%",re.sub(r'\\_',"_",re.escape(meta_data[0]['aco_nm'])))+"','"+meta_data[0]['workspace_id']+"','"+meta_data[0]['pipeline_id']+"')"
                            meta_columns= 'buildsheet_last_update,data_source_version,data_source,buildsheet_workspaces_id,l1_schema,l2_schema,l2_table,source_file_name,source_id,source_name,source_type,workflow_id,author,vendor_version,vendor_name,aco_id,aco_name,workspace_id,pipeline_id'
                            meta_id = insertData('meta_data',meta_columns,meta_values)
                            if meta_id!='':
                               return HttpResponse(json.dumps({'status':'2','msg':'Meta Details Submitted.' ,'meta_id':meta_id}),content_type='application/json') 
                    else:
                        meta_data= request.POST.get('meta_data')
                        meta_id= request.POST.get('meta_id')
                        meta_data= json.loads(meta_data)
                        update_meta = "buildsheet_last_update=now() ,data_source_version='"+meta_data[0]['data_source_version']+"',data_source='"+meta_data[0]['data_source']+"',buildsheet_workspaces_id='"+request.POST.get('buildsheet_id')+"',l1_schema='"+meta_data[0]['default_l1schema']+"',l2_schema='"+meta_data[0]['l2_schema']+"',l2_table='"+meta_data[0]['l2_table']+"',source_file_name='"+meta_data[0]['sfn']+"',source_id='"+meta_data[0]['source_id']+"',source_name='"+re.sub(r'\\%',"%",re.sub(r'\\_',"_",re.escape(meta_data[0]['source_name'])))+"',source_type='"+meta_data[0]['source_type']+"',workflow_id='"+meta_data[0]['workflow_id']+"',author='"+meta_data[0]['author']+"',vendor_version='"+meta_data[0]['vendor_version']+"',vendor_name='"+re.sub(r'\\%',"%",re.sub(r'\\_',"_",re.escape(meta_data[0]['vendor_name'])))+"',aco_id='"+meta_data[0]['aco_id']+"',aco_name='"+re.sub(r'\\%',"%",re.sub(r'\\_',"_",re.escape(meta_data[0]['aco_nm'])))+"',workspace_id='"+meta_data[0]['workspace_id']+"',pipeline_id='"+meta_data[0]['pipeline_id']+"'"
                        update_Query = "update meta_data set "+update_meta+" where id='"+meta_id+"';"
                        if runMysqlQuery(update_Query):
                            return HttpResponse(json.dumps({'status':'2','msg':'Meta Details Updated.' ,'meta_id':meta_id}),content_type='application/json')
                               
                      

                if(request.POST.get('action') == 'submitMappingBuild'):
                    meta_data= request.POST.get('meta_data')
                    meta_data= json.loads(meta_data) 
                    meta_id= request.POST.get('meta_id')
                    buildsheet_data = json.loads(request.POST.get('buildsheet_data'))
                    rows = ''
                    for data in buildsheet_data:
                        transform = re.sub(r'\\_',"_",re.escape(data['transform']))
                        transform = re.sub(r'\\%',"%",transform)
                        dest_table = re.sub(r'\\_',"_",re.escape(data['dest_table']))
                        dest_table = re.sub(r'\\%',"%",dest_table)
                        rows +="('"+data['unique_key']+"','"+request.POST.get('buildsheet_id')+"','"+request.POST.get('category')+"','"+data['alias']+"','"+data['source_schema']+"','"+data['source_table']+"','"+data['source_column']+"','"+data['rule']+"','"+transform+"','"+data['dest_schema']+"','"+dest_table+"','"+data['dest_column']+"','"+data['dest_datatype']+"','"+meta_id+"','"+meta_data[0]['source_id']+"','"+meta_data[0]['aco_id']+"'),"
                    rows = re.sub(',$','',rows)
                    runMysqlQuery("delete from  buildsheet_data  where  meta_id="+meta_id+" and rule_type not in ('from','inner join','left join','right join')")
                    build_columns= 'unique_flag,buildsheet_workspaces_id,category,alias,l1_schema,source_table,source_column,rule_type,rule,l2_schema,destination_table,destination_column,data_type,meta_id,source_id,aco_id';
                    build_id = insertData('buildsheet_data',build_columns,rows)
                    if build_id!='':
                        query = getSQL(meta_id)
                        return HttpResponse(json.dumps({'status':'2','msg':'Buildsheet SuccessFully Submitted.','query':query}),content_type='application/json')
                    else:
                        return None

            else:
                return None
    except Exception as e:
        return HttpResponse(json.dumps({'status':'1','msg':str(e)}),content_type='application/json')



def BuildsheetUtils(request):
    try:
        if (request.method == 'POST'):
            if (request.POST.get('action')=='createBuildsheet'):
                column_values = "('"+request.POST.get('acoid')+"','"+re.sub(r'\\%',"%",re.sub(r'\\_',"_",re.escape(request.POST.get('aconm'))))+"','"+request.POST.get('source_id')+"','"+re.sub(r'\\%',"%",re.sub(r'\\_',"_",re.escape(request.POST.get('source_name'))))+"','"+re.sub(r'\\%',"%",re.sub(r'\\_',"_",re.escape(request.POST.get('vendor_name'))))+"','"+request.POST.get('vendor_version')+"','"+request.POST.get('olap_version')+"')"
                columns_name= 'aco_id,aco_name,source_id,source_name,vendor_name,vendor_version,olap_version'
                id = insertData('buildsheet_workspaces',columns_name,column_values) 
                if id!='0' and id is not None:
                    return HttpResponse(json.dumps({'msg':'Buildsheet SuccessFully Created','status':'2'}),content_type='application/json')

            if (request.POST.get('action')=='updateBuildsheet'):
                update_values = "aco_id='"+request.POST.get('acoid')+"',aco_name='"+re.sub(r'\\%',"%",re.sub(r'\\_',"_",re.escape(request.POST.get('aconm'))))+"',source_id='"+request.POST.get('source_id')+"',source_name='"+re.sub(r'\\%',"%",re.sub(r'\\_',"_",re.escape(request.POST.get('source_name'))))+"',vendor_name='"+re.sub(r'\\%',"%",re.sub(r'\\_',"_",re.escape(request.POST.get('vendor_name'))))+"',vendor_version='"+request.POST.get('vendor_version')+"',olap_version='"+request.POST.get('olap_version')+"'"
                update_Query = "update buildsheet_workspaces set "+update_values+" where id='"+request.POST.get('buildsheet_id')+"';"
                if runMysqlQuery(update_Query):
                    return HttpResponse(json.dumps({'msg':'Buildsheet SuccessFully Updated','status':'2'}),content_type='application/json')      
            
            if(request.POST.get('action') == 'insertL1toL2'):
                    meta_id= request.POST.get('meta_id')
                    print(meta_id)
                    create_temp=getsqlforl1tol2(meta_id,1)
                    # print("crre")
                    # print(create_temp)
                    l1tol2('',create_temp[0][0])
                    insert_totemp=getsqlforl1tol2(meta_id,2)
                    # print(insert_totemp)
                    l1tol2('',insert_totemp[0][0]);
                    update_l1tol2=getsqlforl1tol2(meta_id,3)
                    # print(insert_temptol2)
                    l1tol2('',update_l1tol2[0][0]);
                    insert_l1tol2=getsqlforl1tol2(meta_id,4)
                    # print insert_l1tol2
                    print('l2_insert : '+insert_l1tol2[0][0])
                    l1tol2('',insert_l1tol2[0][0]);
                    drop_temp=getsqlforl1tol2(meta_id,5)
                    l1tol2('',drop_temp[0][0]);

                    return HttpResponse(json.dumps({'status':'2','msg':'data SuccessFully inserted.'}),content_type='application/json')

            else:    
                meta_id= request.POST.get('meta_id')
                #print meta_id
                query = getSQL(meta_id)
                #print query
                return HttpResponse(json.dumps({'query':query,'status':'2'}),content_type='application/json')
            

            
        else:
            buildsheets = runSelectQuery("select distinct concat(aco_name,'_',source_name),workspace_name,id,aco_id,aco_name,source_id,source_name,vendor_name,vendor_version,cast(modified as char),ifnull(category_count,'0'),olap_version,cast((ifnull(category_count,'0')/35)*100 as decimal(18,1)) from buildsheet_workspaces a left join (select count(*) as category_count ,buildsheet_workspaces_id from meta_data where delete_flag=0 group by buildsheet_workspaces_id) b on b.buildsheet_workspaces_id = a.id where  a.delete_flag=0");
            olap_version =runSelectQuery("select name from buildsheet_master where parent_id = 99");
            vender_name=runSelectQuery("select name from buildsheet_master where parent_id = 97");
            # progress_percentile = buildsheets[0]
            # print buildsheets
            # print progress_percentile
            return render(request, 'buildsheet/buildsheets-list.html', {'buildsheets': buildsheets,'olap_version':olap_version,'vender_name':vender_name})
    except Exception as e:
        return HttpResponse(json.dumps({'status':'1','msg':str(e)}),content_type='application/json')

def BuildsheetRedirect(request, buildsheet_id):
    try:
        if (request.method == 'POST'):
            print request
        else:
            buildsheet = runSelectQuery("select distinct concat(aco_name,'_',source_name),workspace_name,id,aco_id,aco_name,source_id,source_name,vendor_name,vendor_version,olap_version from buildsheet_workspaces where delete_flag=0 and id='"+buildsheet_id+"'")
            buildsheets = runSelectQuery("select distinct a.l2_table,a.id,a.aco_id,a.source_id,cast(a.buildsheet_last_update as char),a.buildsheet_workspaces_id,a.aco_name,a.source_name  from meta_data a left join buildsheet_data b on a.id =b.meta_id where a.delete_flag=0 and  a.buildsheet_workspaces_id='"+buildsheet_id+"'")
            olap_version =runSelectQuery("select name from buildsheet_master where parent_id = 99");
            vender_name=runSelectQuery("select name from buildsheet_master where parent_id = 97");
            return render(request, 'buildsheet/category-list.html', {'buildsheet' :buildsheet[0],'buildsheets':buildsheets,'olap_version':olap_version,'vender_name':vender_name})    
    except Exception as e:
        return HttpResponse(json.dumps({'status':'1','msg':str(e)}),content_type='application/json')

def valueLevers(request):
    try:
        if (request.method == 'POST'):
            if (request.POST.get('action')=='fetchTables'):
                columns= runSelectQuery("select DISTINCT source_table val from value_levers where value_lever = '"+request.POST.get('lever_name')+"' and lev = '"+request.POST.get('level')+"'")    
                return HttpResponse(json.dumps({'columns':columns,'status':'2'}),content_type='application/json')
            if (request.POST.get('action')=='fetchColumns'):
                columns= runSelectQuery("select DISTINCT source_column val from value_levers where value_lever = '"+request.POST.get('lever_name')+"' and source_table='"+request.POST.get('table_name')+"' and lev = '"+request.POST.get('level')+"'")    
                return HttpResponse(json.dumps({'columns':columns,'status':'2'}),content_type='application/json')
        else:
            # buildsheet = runSelectQuery("select distinct concat(aco_name,'_',source_name),workspace_name,id,aco_id,aco_name,source_id,source_name,vendor_name,vendor_version from buildsheet_workspaces where delete_flag=0 and id='"+buildsheet_id+"'")
            # buildsheets = runSelectQuery("select distinct b.category,a.id,a.aco_id,a.source_id,cast(a.modified as char),a.buildsheet_workspaces_id  from meta_data a inner join buildsheet_data b on a.id =b.meta_id where a.delete_flag=0 and  a.buildsheet_workspaces_id='"+buildsheet_id+"'")
            return render(request, 'buildsheet/value-lever.html', {})    
    except Exception as e:
        return HttpResponse(json.dumps({'status':'1','msg':str(e)}),content_type='application/json')

def CategoryCreate(request, buildsheet_id):
    try:
        if (request.method == 'POST'):
            print request
        else:
            schemas= schemaList()
            buildsheet = runSelectQuery("select distinct concat(aco_name,'_',source_name),workspace_name,id,aco_id,aco_name,source_id,source_name,vendor_name,vendor_version,olap_version from buildsheet_workspaces where delete_flag=0 and id='"+buildsheet_id+"'")
            source_type = runSelectQuery("select name from buildsheet_master where parent_id = 98");
            data_kinds = runSelectQuery("select id,name from buildsheet_master where parent_id = 116"); 
            '''source_type=[]
            for col in source_type1:
                source_type.append(col[0])'''
        
            return render(request, 'buildsheet/category-create.html', {'buildsheet' :buildsheet[0],'schemas':schemas,'source_type':source_type,'data_kinds':data_kinds})    
    except Exception as e:
        return HttpResponse(json.dumps({'status':'1','msg':str(e)}),content_type='application/json')

def CategoryUpdate(request, buildsheet_id,meta_id):
    try:
        if (request.method == 'POST'):
            print request
        else:
            schemas= schemaList()
            buildsheet = runSelectQuery("select distinct concat(a.aco_name,'_',a.source_name),workspace_name,a.id,a.aco_id,a.aco_name,a.source_id,a.source_name,a.vendor_name,a.vendor_version,b.l2_table,b.l1_schema,b.l2_schema,b.source_type,ifnull(b.workflow_id,''),b.author,ifnull(b.source_file_name,''),ifnull(b.workspace_id,''),b.pipeline_id,b.id,a.olap_version from buildsheet_workspaces a inner join meta_data  b on a.id=b.buildsheet_workspaces_id where a.delete_flag=0 and a.id='"+buildsheet_id+"' and b.id='"+meta_id+"'")
            l2tables= getSchemaTables(buildsheet[0][11])
            data_kinds = runSelectQuery("select id,name from buildsheet_master where parent_id = 116"); 
            source_type1=runSelectQuery("select name from buildsheet_master where parent_id = 98");
            source_type=[]
            for col in source_type1:
                source_type.append(col[0])
            return render(request, 'buildsheet/category-update.html', {'buildsheet' :buildsheet[0],'schemas':schemas,'l2tables':l2tables,'source_type':source_type,'data_kinds':data_kinds})    
    except Exception as e:
        return HttpResponse(json.dumps({'status':'1','msg':str(e)}),content_type='application/json')  


def downloadBuildsheet(request):
    if (request.method == 'POST'):
        # response content type
        response = HttpResponse(content_type='text/csv')
        #decide the file name
        response['Content-Disposition'] = 'attachment; filename="ThePythonDjango.csv"'

        writer = csv.writer(response, csv.excel)
        response.write(u'\ufeff'.encode('utf8'))
        rows = getBuildsheet(request.POST.get('aco_id'),request.POST.get('source_id'),request.POST.get('meta_id'),'download')
        print rows
        #write the headers
        writer.writerow(['category','alias','l1_schema','source_table','source_column','unique_flag','rule','transformation','l2_schema','destination_table','destination_column','data_type','created','modified'])
        #get data from database or from text file....
         #dummy function to fetch data
        for row in rows:
          writer.writerow(row)
        return response

def updateBuildsheet(request,meta_id):
    if (request.method == 'POST'):
        if (request.POST.get('action')=='getMeta'):
            meta = getMetaDetails(meta_id)
            # print meta
            buildsheet = fetchBuildsheet(meta_id," and l2_schema!='' and rule_type not in ('GETDATE()','where','from','inner join','left join','right join')")
            # print buildsheet
            return HttpResponse(json.dumps({'msg':'ok','meta':meta ,'category':buildsheet[0][1],'l2_schema':buildsheet[0][12],'status':'2'}),content_type='application/json')
        if (request.POST.get('action')=='getMetaBuild'):
            meta = getMetaDetails(meta_id)
            buildsheet = fetchBuildsheet(meta_id,'and rule_type not in ("inner join","left join","right join","from")')
            joins = fetchBuildsheet(meta_id,'and rule_type in ("inner join","left join","right join")')
            frm = fetchBuildsheet(meta_id,'and rule_type in ("from")')

            # print meta
            # buildsheet = fetchBuildsheet(meta_id)
            return HttpResponse(json.dumps({'meta':meta[0],'buildsheet':buildsheet,'joins':joins,'from':frm,'status':'2'}),content_type='application/json')
        if (request.POST.get('action')=='getL1Column'):
            buildsheet = fetchBuildsheet(meta_id,'and id='+request.POST.get('buildsheet_id'))
            # print meta
            # buildsheet = fetchBuildsheet(meta_id)
            return HttpResponse(json.dumps({'buildsheet':buildsheet,'status':'2'}),content_type='application/json')
        if (request.POST.get('action')=='getFJW'):
            buildsheet = fetchBuildsheet(meta_id,"and rule_type in ('where','from','inner join','left join','right join')")
            # print meta
            # buildsheet = fetchBuildsheet(meta_id)
            return HttpResponse(json.dumps({'buildsheet':buildsheet,'status':'2'}),content_type='application/json')
        if (request.POST.get('action')=='updateBuild'):
            
            meta_data= request.POST.get('meta_data')
            meta_data= json.loads(meta_data)
            update_meta = "l1_schema='"+meta_data[0]['default_l1schema']+"',l2_schema='"+meta_data[0]['l2_schema']+"',l2_table='"+meta_data[0]['l2_table']+"',source_file_name='"+meta_data[0]['sfn']+"',source_id='"+meta_data[0]['source_id']+"',source_name='"+meta_data[0]['source_name']+"',source_type='"+meta_data[0]['source_type']+"',workflow_id='"+meta_data[0]['workflow_id']+"',author='"+meta_data[0]['author']+"',vendor_version='"+meta_data[0]['vendor_version']+"',vendor_name='"+meta_data[0]['vendor_name']+"',aco_id='"+meta_data[0]['aco_id']+"',aco_name='"+meta_data[0]['aco_nm']+"',workspace_id='"+meta_data[0]['workspace_id']+"',pipeline_id='"+meta_data[0]['pipeline_id']+"'"
            update_Query = "update meta_data set "+update_meta+" where id='"+meta_id+"';"
            print update_Query
            if runMysqlQuery(update_Query):
              #Buildsheet column insert 
                buildsheet_data = json.loads(request.POST.get('buildsheet_data'))
                rows = ''
                for data in buildsheet_data:
                    transform = re.sub(r'\\_',"_",re.escape(data['transform']))
                    rows +="('"+request.POST.get('category')+"','"+data['alias']+"','"+data['source_schema']+"','"+data['source_table']+"','"+data['source_column']+"','"+data['rule']+"','"+transform+"','"+data['dest_schema']+"','"+data['dest_table']+"','"+data['dest_column']+"','"+data['dest_datatype']+"','"+meta_id+"','"+meta_data[0]['source_id']+"','"+meta_data[0]['aco_id']+"'),"
                rows = re.sub(',$','',rows)
                build_columns= 'category,alias,l1_schema,source_table,source_column,rule_type,rule,l2_schema,destination_table,destination_column,data_type,meta_id,source_id,aco_id';
                build_id = insertData('buildsheet_data',build_columns,rows)
                if build_id!='':
                    runMysqlQuery("delete from  buildsheet_data  where  meta_id="+meta_id+" and created !=(select created from (select max(created) as created from  buildsheet_data  where  meta_id="+meta_id+") a)")
                    query = getSQL(meta_id)
                    return HttpResponse(json.dumps({'status':'2','msg':'Buildsheet SuccessFully Submitted.','query':query}),content_type='application/json')
          
            # print request
            else:
                return HttpResponse(json.dumps({'status':'1','msg':'Something went wrong'}),content_type='application/json')
            # return HttpResponse(json.dumps({'status':'2','msg':'Buildsheet SuccessFully Submitted.'}),content_type='application/json')
        


    else:
        schemas= schemaList()
        return render(request, 'buildsheetUpdate.html',{'schemas':schemas})


def getReport(request):
    try:
        if(request.method == 'POST'):
            if(request.POST.get('action')=='getReportDownload'):
                response = HttpResponse(content_type='text/csv')
                #decide the file name
                response['Content-Disposition'] = 'attachment; filename="ThePythonDjango.csv"'
                

                writer = csv.writer(response, csv.excel)
                response.write(u'\ufeff'.encode('utf8'))
                rows = getBuildsheet(request.POST.get('aco_id'),request.POST.get('source_id'),request.POST.get('meta_id'),'report')
                # output=io.BytesIO()
                # columns=['Category','Source Table','Source Column','Rule','Transformation','Destination Table','Destination Column','Total Count(Table Level)','Distinct Count(Table Level)','Total Count(After Joins)','Distinct Count(After Joins)','Total Count','Distinct Count','Difference Total Count','Difference Distinct Count','Semantic Match','Semantic Mismatch','Semantic Fill Rate','Ontology Match','Ontology Mismatch','Ontology Fill Rate']

                # df=pd.DataFrame(rows,columns=columns)
                # df1=df[['Category','Source Table','Source Column','Rule','Transformation','Destination Table','Destination Column','Total Count(Table Level)','Distinct Count(Table Level)','Total Count(After Joins)','Distinct Count(After Joins)','Total Count','Distinct Count','Difference Total Count','Difference Distinct Count']]
                # writer=pd.ExcelWriter(output,engine='xlsxwriter')
                # df1.to_excel(writer,startrow=1,index=False,sheet_name='Report')
                # workbook=writer.book
                # worksheet=writer.sheets['Report']
                # worksheet.freeze_panes(2, 1)
                # writer.save()
                # writer.close()

                # output.seek(0)
                # encoded = base64.b64encode(output.read())
                #return encoded
                #write the headers
                writer.writerow(['Category','Source Table','Source Column','Rule','Transformation','Destination Table','Destination Column','Total Count(Table Level)','Distinct Count(Table Level)','Total Count(After Joins)','Distinct Count(After Joins)','Total Count','Distinct Count','Difference Total Count','Difference Distinct Count'])
                #get data from database or from text file....
                 #dummy function to fetch data
                for row in rows:
                 writer.writerow(row)
                return response  
            if(request.POST.get('action')=='getReport'):
                buildsheet = getBuildsheetByMeta(request.POST.get('meta_id'))
                # print buildsheet
                # q = []
                for row in buildsheet:
                    # l1_schema = ''
                    # if row[28] !='':
                    #     l1_schema = fetchBuildsheet(request.POST.get('meta_id'),'and rule_type="alias" and rule="'+row[28]+'"')
                    #     l1_schema = l1_schema[0][13]
                    l1_total_cnt_wf_q='0'
                    l1_unq_cnt_wf_q='0'
                    l1_total_cnt_q='0'
                    l1_unq_cnt_q='0'
                    l2_total_cnt_q='0'
                    l2_unq_cnt_q='0'
                    semantic_q= 'Null'
                    ontology_q= 'Null'
                    if row[9]!='None' and row[9] is not None and row[27]!='' and row[3]!='' and row[6]!='hardcode':
                        l1_total_cnt_wf_q= runQuery(row[28],row[9])
                        l1_total_cnt_wf_q= str(l1_total_cnt_wf_q[0][0])
                    if row[11]!='None' and row[11] is not None and row[27]!='' and row[3]!='' and row[6]!='hardcode':
                        l1_unq_cnt_wf_q= runQuery(row[28],row[11])
                        l1_unq_cnt_wf_q = str(l1_unq_cnt_wf_q[0][0])
                    if row[13]!='None' and row[13] is not None and row[27]!='' and row[3]!='' and row[6]!='hardcode' :
                        l1_total_cnt_q = runQuery(row[28],row[13]) 
                        l1_total_cnt_q = str(l1_total_cnt_q[0][0])
                    if row[15]!='None' and row[15] is not None  and row[27]!='' and row[3]!='' and row[6]!='hardcode':
                        l1_unq_cnt_q = runQuery(row[28],row[15])
                        l1_unq_cnt_q = str(l1_unq_cnt_q[0][0])
                    if row[17]!='None' and row[17] is not None and row[6]!='hardcode':
                        l2_total_cnt_q = runQuery(row[29],row[17])
                        l2_total_cnt_q = str(l2_total_cnt_q[0][0])
                    if row[19]!='None' and row[19] is not None and row[6]!='hardcode':
                        l2_unq_cnt_q = runQuery(row[29],row[19])
                        l2_unq_cnt_q = str(l2_unq_cnt_q[0][0])
                    if row[21]!='' and row[21]!='None' and row[21] is not None:
                        
                        semantic_q = runQuery('l2',row[21])
                        
                        semantic_q = str(semantic_q[0][0])
                    if row[23]!='' and row[23]!='None' and row[23] is not None:
                        
                        ontology_q = runQuery('l2',row[23])
                        
                        ontology_q = str(ontology_q[0][0])

                    update_Query = "update buildsheet_data set l1_total_cnt_wf='"+l1_total_cnt_wf_q+"', l1_unq_cnt_wf='"+l1_unq_cnt_wf_q+"', l1_total_cnt='"+l1_total_cnt_q+"',l1_unq_cnt='"+l1_unq_cnt_q+"', l2_total_cnt='"+l2_total_cnt_q+"', l2_unq_cnt='"+l2_unq_cnt_q+"', semantic_match="+semantic_q+", ontology_match="+ontology_q+" where id='"+str(row[0])+"';"
                    
                    runMysqlQuery(update_Query)

                    rows = getBuildsheet(request.POST.get('aco_id'),request.POST.get('source_id'),request.POST.get('meta_id'),'report')
                    # print rows
                    columns= ['Category','Source Table','Source Column','Rule','Transformation','Destination Table','Destination Column','Total Count(Table Level)','Distinct Count(Table Level)','Total Count(After Joins)','Distinct Count(After Joins)','Total Count','Distinct Count','Difference Total Count','Difference Distinct Count','Semantic Match','Semantic Mismatch','Semantic Fill Rate','Ontology Match','Ontology Mismatch','Ontology Fill Rate']
                 
                return HttpResponse(json.dumps({'buildsheet':rows,'status':'2','columns':columns}),content_type='application/json')
    except Exception as e:
        return HttpResponse(json.dumps({'status':'1','msg':str(e)}),content_type='application/json')


def buildsheetDelete(request):
    try:
        if (request.method == 'POST'):
            if(request.POST.get('action')=='delete'):
                meta_id= request.POST.get('meta_id')
                output = runMysqlQuery('update meta_data set delete_flag=1 where id='+meta_id)
                print output
                if (output):
                    return HttpResponse(json.dumps({'msg':"Deleted..",'status':'2'}),content_type='application/json') 
                else:
                    return HttpResponse(json.dumps({'msg':output,'status':'1'}),content_type='application/json') 
            if(request.POST.get('action')=='deleteWorkspace'):
                buildsheet_id= request.POST.get('buildsheet_id')
                output = runMysqlQuery('update buildsheet_workspaces set delete_flag=1 where id='+buildsheet_id)
                print output
                if (output):
                    return HttpResponse(json.dumps({'msg':"Deleted..",'status':'2'}),content_type='application/json') 
                else:
                    return HttpResponse(json.dumps({'msg':output,'status':'1'}),content_type='application/json') 
            
            #print query
    except Exception as e:
        return HttpResponse(json.dumps({'msg':str(e),'status':'1'}),content_type='application/json') 

def createExcel(rows):
    output=io.BytesIO()
    columns= ['Test Scenario','Test Case','Category','Total Count in Source Table','Total Count in L2 Table','Count Match/Difference','Data Present ','Test Pass/Fail','Total Count in Source Table','Total Count in L2 Table','Count Match/Difference','Data Present','Test Pass/Fail']

    df=pd.DataFrame(rows,columns=columns)
    df.insert(8, ' ','')

    writer=pd.ExcelWriter(output,engine='xlsxwriter')
    df.to_excel(writer,startrow=1,index=False,sheet_name='Audit Report')
    workbook=writer.book
    worksheet=writer.sheets['Audit Report']




    worksheet.freeze_panes(2, 1)
    merge_format = workbook.add_format({
        'bold': 1,
        'border': 1,
        'align': 'center',
        'valign': 'vcenter',
        })
    worksheet.merge_range('C1:G1', 'Total Count', merge_format)
    worksheet.merge_range('I1:M1', 'Distinct Count', merge_format)
    format = workbook.add_format({'text_wrap': True})

# Setting the format but not setting the column width.
    worksheet.set_column('A:M', None, format)
    worksheet.set_column('A:A',40)
    worksheet.set_column('B:B',40)
    writer.save()
    writer.close()

    output.seek(0)
    encoded = base64.b64encode(output.read())
    return encoded

def getAuditReport(request):
    try:
        if(request.method == 'POST'):
            if(request.POST.get('action')=='getAuditReportDownload'):
                
                rows = getauditreportfromdb('','',request.POST.get('meta_id'))
                encoded=createExcel(rows)           
                response = HttpResponse(encoded, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64')
                response['Content-Disposition'] = 'attachment; filename=AuditReport.xlsx'
                return response

            if(request.POST.get('action')=='allBuildsheetReport'):
                rows = getauditreportfromdb(request.POST.get('aco_id'),request.POST.get('source_id'),'')
                encoded=createExcel(rows)           
                response = HttpResponse(encoded, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64')
                response['Content-Disposition'] = 'attachment; filename=AuditReport.xlsx'
                return response
                '''code to download complete report '''
            if(request.POST.get('action')=='getBuildsheetDownload'):
                '''code to download complete buildsheet '''

                
            if(request.POST.get('action')=='getAuditReport'):
                
                rows = getauditreportfromdb(request.POST.get('meta_id'))
                tp=0
                columns= ['Test Scenario','Test Case','Total Count in Source Table','Total Count in L2 Table','Count Match/Difference','Data Present ','Test Pass/Fail','Total Count in Source Table','Total Count in L2 Table','Count Match/Difference','Data Present','Test Pass/Fail']
                return HttpResponse(json.dumps({'buildsheet':rows,'status':'2','columns':columns}),content_type='application/json')
        else:
                #buildsheets = getBuildsheetCategories()
                #buildsheets = runSelectQuery("select distinct concat(aco_name,'_',source_name),workspace_name,id,aco_id,aco_name,source_id,source_name,vendor_name,vendor_version,cast(modified as char),ifnull(category_count,'0'),olap_version,cast((ifnull(category_count,'0')/16)*100 as decimal(18,1)) from buildsheet_workspaces a left join (select count(*) as category_count ,buildsheet_workspaces_id from meta_data where delete_flag=0 group by buildsheet_workspaces_id) b on b.buildsheet_workspaces_id = a.id where  a.delete_flag=0");
                #listing = getAcowiseBuildsheet()
                # print listing
                buildsheets = runSelectQuery("select distinct concat(aco_name,'_',source_name),workspace_name,id,aco_id,aco_name,source_id,source_name,vendor_name,vendor_version,cast(modified as char),ifnull(category_count,'0'),olap_version,cast((ifnull(category_count,'0')/16)*100 as decimal(18,1)) from buildsheet_workspaces a left join (select count(*) as category_count ,buildsheet_workspaces_id from meta_data where delete_flag=0 group by buildsheet_workspaces_id) b on b.buildsheet_workspaces_id = a.id where  a.delete_flag=0");
                olap_version =runSelectQuery("select name from buildsheet_master where parent_id = 99");
                vender_name=runSelectQuery("select name from buildsheet_master where parent_id = 97");
                #acos = runSelectQuery("select distinct aco_name,aco_id from meta_data");
                return render(request, 'auditListing.html', {'buildsheets': buildsheets,'olap_version':olap_version,'vender_name':vender_name})
    except Exception as e:
        return HttpResponse(json.dumps({'status':'1','msg':str(e)}),content_type='application/json')




# if __name__ == '__main__':
#     getnavc()

def viewAuditReport(request,buildsheet_id):
    if (request.method == 'POST'):
        print "post"  

        
    else:
        buildsheet = runSelectQuery("select distinct concat(aco_name,'_',source_name),workspace_name,id,aco_id,aco_name,source_id,source_name,vendor_name,vendor_version,olap_version from buildsheet_workspaces where delete_flag=0 and id='"+buildsheet_id+"'")
        buildsheets = runSelectQuery("select distinct a.l2_table,a.id,a.aco_id,a.source_id,cast(a.modified as char),a.buildsheet_workspaces_id  from meta_data a left join buildsheet_data b on a.id =b.meta_id where a.delete_flag=0 and  a.buildsheet_workspaces_id='"+buildsheet_id+"'")
        olap_version =runSelectQuery("select name from buildsheet_master where parent_id = 99");
        vender_name=runSelectQuery("select name from buildsheet_master where parent_id = 97");
        return render(request, 'auditView.html', {'buildsheet' :buildsheet[0],'buildsheets':buildsheets,'olap_version':olap_version,'vender_name':vender_name})     
      #rows = getauditreportfromdb('','',meta_id)
      #audit_name = runSelectQuery('select DISTINCT CONCAT(aco_name,">",IFNULL(source_name, ""),">",IFNULL(b.category, "")) from meta_data m inner join buildsheet_data b on m.id=b.meta_id where  m.id="'+meta_id+'"')
      #columns= ['Test Scenario','Test Case','Category','Total Count in Source Table','Total Count in L2 Table','Count Match/Difference','Data Present ','Test Pass/Fail','Total Count in Source Table','Total Count in L2 Table','Count Match/Difference','Data Present','Test Pass/Fail']
        #return render(request, 'auditView.html', {'buildsheet': buildsheet})
def viewCategoryAuditReport(request,meta_id):
    if (request.method == 'POST'):
        print "post" 
    else:
      rows = getauditreportfromdb('','',meta_id)
      tp=0
      #audit_name = runSelectQuery('select DISTINCT CONCAT(aco_name,">",IFNULL(source_name, ""),">",IFNULL(b.category, "")) from meta_data m inner join buildsheet_data b on m.id=b.meta_id where  m.id="'+meta_id+'"')
      columns= ['Test Case','Category','Total Count in Source Table','Total Count in L2 Table','Count Match/Difference','Data Present ','Test Pass/Fail','Total Count in Source Table','Total Count in L2 Table','Count Match/Difference','Data Present','Test Pass/Fail']
      return render(request, 'auditView1.html', {'rows': rows,'columns': columns})

def viewsemanticReport(request,meta_id):
    if (request.method == 'POST'):
        if(request.POST.get('action')=='getSemanticView'):
            query = getSementicSQL(meta_id,request.POST.get('table'),request.POST.get('column'))
            rows = runQuery('l2',query[0][0])
            result = [[row[0],row[1],row[2]] for row in rows]
            return HttpResponse(json.dumps({'status':'2','rows':result}),content_type='application/json')
        if(request.POST.get('action')=='getSemanticDownload'):
            columns = runSelectQuery("select distinct destination_column from buildsheet_data where (semantic_q is not null or ontology_q is not null) and destination_table='"+request.POST.get('table')+"' and  meta_id='"+meta_id+"';" )
            print columns
            full_semantic =[]
            result =[]
            for column in columns:
                query = getSementicSQL(meta_id,request.POST.get('table'),column[0])
                rows = runQuery('l2',query[0][0])
                result.extend([[request.POST.get('table'),column[0],row[0],row[1],re.sub(r'^Green$','Matched',re.sub(r'^Red$','UnMatched',row[2]))] for row in rows])
                
            full_semantic.append(result)
            semantic_df = pd.DataFrame(full_semantic[0],columns = ['Table','Column','Value','Count','Result'])
            print semantic_df
            excel_file = IO()
            xlwriter = pd.ExcelWriter(excel_file, engine='xlsxwriter')

            semantic_df.to_excel(xlwriter,request.POST.get('table') , index=False)


            xlwriter.save()
            xlwriter.close()

            # important step, rewind the buffer or when it is read() you'll get nothing
            # but an error message when you try to open your zero length file in Excel
            excel_file.seek(0)

            # set the mime type so that the browser knows what to do with the file
            encoded = base64.b64encode(excel_file.read())
            response = HttpResponse(encoded, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

            # set the file name in the Content-Disposition header
            response['Content-Disposition'] = 'attachment; filename='+request.POST.get('table')+'_semantic.xlsx'

            return response
            # return HttpResponse(json.dumps({'status':'1','msg':meta_details[0][1]}),content_type='application/json')

    else:
        check = runSelectQuery("select count(*) from meta_data where id='"+meta_id+"' and semantic_last_run is  null or semantic_last_run<buildsheet_last_update;")
        if check[0][0]!=0:
            buildsheet = getBuildsheetByMeta(meta_id)
            for row in buildsheet:
                # l1_total_cnt_wf_q='0'
                # l1_unq_cnt_wf_q='0'
                l1_total_cnt_q='0'
                l1_unq_cnt_q='0'
                l2_total_cnt_q='0'
                l2_unq_cnt_q='0'
                semantic_q= 'Null'
                ontology_q= 'Null'
                if row[17]!='None' and row[17] is not None and row[6]!='hardcode':
                    l2_total_cnt_q = runQuery(row[29],row[17])
                    l2_total_cnt_q = str(l2_total_cnt_q[0][0])
                if row[19]!='None' and row[19] is not None and row[6]!='hardcode':
                    l2_unq_cnt_q = runQuery(row[29],row[19])
                    l2_unq_cnt_q = str(l2_unq_cnt_q[0][0])
                if row[13]!='None' and row[13] is not None and row[27]!='' and row[3]!='' and row[6]!='hardcode' :
                    l1_total_cnt_q = runQuery(row[28],row[13]) 
                    l1_total_cnt_q = str(l1_total_cnt_q[0][0])
                if row[15]!='None' and row[15] is not None  and row[27]!='' and row[3]!='' and row[6]!='hardcode':
                    l1_unq_cnt_q = runQuery(row[28],row[15])
                    l1_unq_cnt_q = str(l1_unq_cnt_q[0][0])
                if row[21]!='' and row[21]!='None' and row[21] is not None:
                            
                    semantic_q = runQuery('l2',row[21])
                            
                    semantic_q = str(semantic_q[0][0])
                if row[23]!='' and row[23]!='None' and row[23] is not None:
                            
                    ontology_q = runQuery('l2',row[23])
                            
                    ontology_q = str(ontology_q[0][0])

                update_Query = "update buildsheet_data set l2_total_cnt='"+l2_total_cnt_q+"', l2_unq_cnt='"+l2_unq_cnt_q+"', l1_total_cnt='"+l1_total_cnt_q+"',l1_unq_cnt='"+l1_unq_cnt_q+"',semantic_match="+semantic_q+", ontology_match="+ontology_q+" where id='"+str(row[0])+"';"
                        
                runMysqlQuery(update_Query)
        rows = getsemanticreportfromdb('','',meta_id)
      
      #audit_name = runSelectQuery('select DISTINCT CONCAT(aco_name,">",IFNULL(source_name, ""),">",IFNULL(b.category, "")) from meta_data m inner join buildsheet_data b on m.id=b.meta_id where  m.id="'+meta_id+'"')
        columns= ['Category','Column','L1 Total count','L1 Unique Count','L2 Total count','L2 Unique Count','Sementic Match','Sementic Mismatch','Sementic Fill Rate']
        return render(request, 'buildsheet/sementic-view.html', {'rows': rows,'columns': columns})

def viewontologyReport(request,meta_id):
    if (request.method == 'POST'):
        print "post" 
    else:
      #ontology and semantic report
      rows = getontologyreportfromdb(meta_id)
      audit_name = runSelectQuery('select DISTINCT CONCAT(aco_name,">",IFNULL(source_name, ""),">",IFNULL(b.category, "")) from meta_data m inner join buildsheet_data b on m.id=b.meta_id where  m.id="'+meta_id+'"')
      columns= ['Test Case','Category','Total Count in L2 Table','Semantic Match', 'Semantic Mismatch', 'Semantic Fill Rate','Sementic Test','Ontology Match', 'Ontology Mismatch', 'Ontology Fill Rate','Ontology Test']
      return render(request, 'auditView1.html', {'rows': rows,'columns': columns})

def loadData(request):
    try:
        if(request.method == 'POST'):
            if(request.POST.get('action') =='getL1Data'):
                schema = request.POST.get('schema')
                table = request.POST.get('table')
                if(schema.lower()=='subquery'):
                    schema=''
                    table = '('+table+')'
                column = request.POST.get('column')
                query = "select distinct \""+column+"\"::varchar from "+table+" limit 10000;"
                all_results = runQuery(schema,query)
                result = [row[0] for row in all_results]
                # print len(result)
                return HttpResponse(json.dumps({'result':result,'status':'2'}),content_type='application/json')
            if(request.POST.get('action') =='getL2Data'):
                schema = request.POST.get('schema')
                table = request.POST.get('table')
                if(schema.lower()=='subquery'):
                    schema=''
                    table = '('+table+')'
                alias = request.POST.get('alias')
                rule = request.POST.get('rule')
                transform = request.POST.get('transform')
                meta_id = request.POST.get('meta_id')
                column = request.POST.get('column')

                query = getl2Query(alias,schema,table,column,rule,transform,meta_id)
                print query
                all_results = runQuery(schema,query+" limit 10000")
                result = [[row[0],row[1]] for row in all_results]
                return HttpResponse(json.dumps({'result':result,'status':'2'}),content_type='application/json')
    except Exception as e:
        return HttpResponse(json.dumps({'status':'1','msg':str(e)}),content_type='application/json')


def allBuildsheetReport(request,aco_id,source_id):
    if (request.method == 'POST'):
        print "post" 
    else:
      #ontology and semantic report
      rows = getauditreportfromdb(aco_id,source_id,'')
      tp=0

      audit_name = runSelectQuery('select DISTINCT CONCAT(aco_name,">",IFNULL(source_name, "") ) from meta_data where aco_id='+aco_id+' and source_id='+source_id)
      columns= ['Test Case','Category','Total Count in Source Table','Total Count in L2 Table','Count Match/Difference','Data Present ','Test Pass/Fail','Total Count in Source Table','Total Count in L2 Table','Count Match/Difference','Data Present','Test Pass/Fail']
      return render(request, 'auditView1.html', {'rows': rows,'columns': columns,'tp':tp})

def allonseReport(request,aco_id,source_id):
    if (request.method == 'POST'):
        print "post" 
    else:
      rows = getsemanticreportfromdb(aco_id,source_id,'')
      tp=0
      #audit_name='abc'
      #audit_name = runSelectQuery('select DISTINCT CONCAT(aco_name,">",IFNULL(source_name, "") ) from meta_data where aco_id='+aco_id+' and source_id='+source_id)
      columns= ['Test Case','Category','Total Count in L2 Table','Semantic Match', 'Semantic Mismatch', 'Semantic Fill Rate','Sementic Test','Ontology Match', 'Ontology Mismatch', 'Ontology Fill Rate','Ontology Test']
      return render(request, 'auditView1.html', {'rows': rows,'columns': columns,'tp':tp})

def templatesUtils(request):
    try:
        if (request.method == 'POST'):
            if (request.POST.get('action')== 'getSourceVersion'):
                # print request
                data_versions = runSelectQuery("select id,name from buildsheet_master where parent_id = "+request.POST.get('data_id'));
                return HttpResponse(json.dumps({'status':'2','versions':data_versions}),content_type='application/json')
            if(request.POST.get('action') == 'getAliasMapping'):
                schemas= schemaList()
                mapping = runSelectQuery("select case when rule_type='from' then source_schema else destination_schema end as source_schema,alias,case when rule_type='from' then source_table else destination_table end as source_column from templates where source_name = '"+request.POST.get('source')+"' and source_version = '"+request.POST.get('source_version')+"' and rule_type in ('from','inner join','left join','right join')") 
                return HttpResponse(json.dumps({'status':'2','mapping':mapping,'schemas':schemas}),content_type='application/json')
            if(request.POST.get('action') == 'getTemplateMapping'):
                buildsheet = fetchTemplate(request.POST.get('source'),request.POST.get('source_version'),'and rule_type not in ("inner join","left join","right join","from") or rule_type is null')
                joins = fetchTemplate(request.POST.get('source'),request.POST.get('source_version'),'and rule_type in ("inner join","left join","right join")')
                frm = fetchTemplate(request.POST.get('source'),request.POST.get('source_version'),'and rule_type in ("from")')

            # print meta
            # buildsheet = fetchBuildsheet(meta_id)
                return HttpResponse(json.dumps({'buildsheet':buildsheet,'joins':joins,'from':frm,'status':'2'}),content_type='application/json')
            if(request.POST.get('action') == 'verifyBuildsheet'):
                files = request.FILES
                csv_file = files.get('file')
                df = pd.read_csv(csv_file, sep =",")
                source_table = df.where(df.rule.isin(['from','inner join','left join','right join']), inplace = False).source_table.unique()
                destination_table = df.where(df.rule.isin(['from','inner join','left join','right join']), inplace = False).destination_table.unique()
                mergedlist = []
                mergedlist.extend(source_table)
                mergedlist.extend(destination_table)
                mergedlist =np.unique(mergedlist)
                tables = []
                for e in mergedlist:
                    if e !='nan':
                        tables.append(e)
                # print tables
                schemas= schemaList()
                reader = csv.reader(csv_file)
                next(reader, None)
                rows=[]
                frm =[]
                join = []
                where = []
                for row in reader:
                    if row[6]=='from':
                        frm.append(row)
                    elif row[6]=='inner join' or row[6]=='left join' or row[6]=='right join':
                        join.append(row)

                    elif row[6]=='where':
                        where.append(row)
                    else:    
                        rows.append(row)
                return HttpResponse(json.dumps({'status':'2','msg':'All good','tables':tables,'schemas':schemas,'rows':rows,'from':frm,'joins':join,'where':where}),content_type='application/json')
        else:
            return None
        
    except Exception as e:
        # print str(e)
        return HttpResponse(json.dumps({'status':'1','msg':str(e)}),content_type='application/json')


def loadQuality(request):
    try:
        if(request.method == 'POST'):
            if(request.POST.get('action') =='categoryQuality'):
                meta_id = request.POST.get('meta_id')
                check = runSelectQuery("select count(*) from meta_data where id='"+meta_id+"' and semantic_last_run is  null or semantic_last_run<buildsheet_last_update;")
                if check[0][0]!=0:
                    buildsheet = getBuildsheetByMeta(meta_id)
                    for row in buildsheet:
                       
                        semantic_q= 'Null'
                        ontology_q= 'Null'
                        l2_total_cnt_q='0'
                        if row[17]!='None' and row[17] is not None and row[6]!='hardcode':
                            l2_total_cnt_q = runQuery(row[29],row[17])
                            l2_total_cnt_q = str(l2_total_cnt_q[0][0])
                        if row[21]!='' and row[21]!='None' and row[21] is not None:
                                    
                            semantic_q = runQuery('l2',row[21])
                                    
                            semantic_q = str(semantic_q[0][0])
                        if row[23]!='' and row[23]!='None' and row[23] is not None:
                                    
                            ontology_q = runQuery('l2',row[23])
                                    
                            ontology_q = str(ontology_q[0][0])

                        update_Query = "update buildsheet_data set l2_total_cnt='"+l2_total_cnt_q+"',semantic_match="+semantic_q+", ontology_match="+ontology_q+" where id='"+str(row[0])+"';"
                        runMysqlQuery(update_Query)
                        runMysqlQuery("update meta_data set semantic_last_run = now() where id = "+meta_id)
                        print "quality check in redshift"
                                
                quality = getQuality('0','0',meta_id)
                print quality
                return HttpResponse(json.dumps({'quality':quality[0][2],'status':'2'}),content_type='application/json')
            if(request.POST.get('action') =='buildsheetQuality'):
                aco_id = request.POST.get('aco_id')
                source_id = request.POST.get('source_id')
                quality = getQuality(aco_id,source_id,'')
                # print quality
                return HttpResponse(json.dumps({'quality':quality[0][2],'status':'2'}),content_type='application/json')
    except Exception as e:
        return HttpResponse(json.dumps({'status':'1','msg':str(e)}),content_type='application/json')


def testCaseReport(request,meta_id):
    try:
        if(request.method == 'POST'):
            if(request.POST.get('action') =='getTestcaseScore'):
                score = getTestcase('0','0',meta_id,'0')
                # print score
                return HttpResponse(json.dumps({'score':score[0][0],'status':'2'}),content_type='application/json')
            if(request.POST.get('action') =='getAllTestcaseScore'):
                score = getTestcase(request.POST.get('aco_id'),request.POST.get('source_id'),'0','2')
                # print score
                return HttpResponse(json.dumps({'score':score[0][0],'status':'2'}),content_type='application/json')

            if(request.POST.get('action') =='getTestcaseDownload'):
                check = runSelectQuery("select count(*) from meta_data where id='"+meta_id+"' and test_cases_last_run is  null or test_cases_last_run<buildsheet_last_update;")
                if check[0][0]!=0:
                    table = request.POST.get('table')
                    meta_row = runSelectQuery('select distinct aco_id,source_id from meta_data where id ='+meta_id)
                    testcases = runSelectQuery('select * from l2_test_cases where active_flag="1" and category=\''+table+'\'')
                    replace = ' where table.aco_id='+meta_row[0][0]+' and table.source_id='+meta_row[0][1]+' and '
                    report = []
                    rows =''
                    for testcase in testcases:
                        arr = [testcase[1],testcase[2],testcase[3]]
                        pattern = re.compile(r'(?i)(from\s+)\S+')
                        from_table = pattern.search(testcase[4])
                        from_table = re.sub(r'(?i)(from\s+)','',from_table.group(0))
                        query = re.sub(r'\n?;?$',' limit 10;',re.sub(r'(?i)(\swhere\s)',re.sub("table",from_table,replace),testcase[4]))
                        output = runQuery('l2',query)
                        # print output
                        result = ''
                        if len(output)==0:
                            arr.append('Pass')
                            result ='Pass'
                        else:
                            arr.append('Fail')
                            result = 'Fail'
                        arr.append(str(output))
                        report.append(arr)
                        output = re.sub(r'\'',"\"",str(output))
                        case = re.sub(r'\'',"\"", testcase[3])
                        query = re.sub(r'\'',"\"",testcase[4])
                        rows +="('"+meta_id+"','"+table+"','"+testcase[2]+"','"+case+"','"+query+"','"+result+"','"+output+"','"+meta_row[0][0]+"','"+meta_row[0][1]+"'),"
                    rows = re.sub(',$','',rows)
                    # buildsheet = getBuildsheetByMeta(meta_id)
                    runMysqlQuery("delete from  test_cases_result  where  meta_id="+meta_id+" and category='"+table+"';")
                    columns= 'meta_id,category,columnname,test_case,test_query,result,sample_data,aco_id,source_id'
                    build_id = insertData('test_cases_result',columns,rows)
                    runMysqlQuery("update meta_data set test_cases_last_run = now() where id = "+meta_id)
                report = getTestcase('0','0',meta_id,'1')
                print report
                testcase_df = pd.DataFrame(report,columns = ['Table','Column','Testcase','Result','data'])
                print testcase_df
                excel_file = IO()
                xlwriter = pd.ExcelWriter(excel_file, engine='xlsxwriter')

                testcase_df.to_excel(xlwriter,request.POST.get('table') , index=False)


                xlwriter.save()
                xlwriter.close()

                # important step, rewind the buffer or when it is read() you'll get nothing
                # but an error message when you try to open your zero length file in Excel
                excel_file.seek(0)

                # set the mime type so that the browser knows what to do with the file
                encoded = base64.b64encode(excel_file.read())
                response = HttpResponse(encoded, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

                # set the file name in the Content-Disposition header
                response['Content-Disposition'] = 'attachment; filename='+request.POST.get('table')+'_testcase.xlsx'

                return response

    except Exception as e:
        # return HttpResponse(json.dumps({'status':'1','msg':str(testcase[0])+' '+str(e)}),content_type='application/json') 
        return HttpResponse(json.dumps({'status':'1','msg':str(e)}),content_type='application/json')    

