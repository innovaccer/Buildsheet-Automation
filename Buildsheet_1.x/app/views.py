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
from redshift.utils import getTableDesc,getSchemaTables,runQuery,runQueryByConnection,schemaList,getSchemaAll
from mysql.utils import getMandatoryColumns,getl2Query,getsemanticreportfromdb,getontologyreportfromdb,getauditreportfromdb,getRules,insertData,getBuildsheetCategories,getSQL,checkSource,getBuildsheet,getBuildsheetByMeta,runMysqlQuery,fetchBuildsheet,getMetaDetails,fetchBuildsheetByID,runSelectQuery,getAcowiseBuildsheet
from django.views.decorators.csrf import csrf_protect
import json
import re
import xlwt
import csv
import pandas as pd
import xlsxwriter
import base64
import io




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
                        # print data
                        rows +="('"+request.POST.get('buildsheet_id')+"','"+request.POST.get('category')+"','"+data['alias']+"','"+data['source_schema']+"','"+data['source_table']+"','"+data['source_column']+"','"+data['rule']+"','"+transform+"','"+data['dest_schema']+"','"+data['dest_table']+"','"+data['dest_column']+"','"+data['dest_datatype']+"','"+meta_id+"','"+meta_data[0]['source_id']+"','"+meta_data[0]['aco_id']+"'),"
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
                        msg = checkSource(meta_data[0]['source_name'],meta_data[0]['aco_nm'],meta_data[0]['l2_table'])
                        if(msg)!='0':
                            return HttpResponse(json.dumps({'status':'1','msg':msg}),content_type='application/json')
                        else:
                            meta_values = "('"+request.POST.get('buildsheet_id')+"','"+meta_data[0]['default_l1schema']+"','"+meta_data[0]['l2_schema']+"','"+meta_data[0]['l2_table']+"','"+meta_data[0]['sfn']+"','"+meta_data[0]['source_id']+"','"+meta_data[0]['source_name']+"','"+meta_data[0]['source_type']+"','"+meta_data[0]['workflow_id']+"','"+meta_data[0]['author']+"','"+meta_data[0]['vendor_version']+"','"+meta_data[0]['vendor_name']+"','"+meta_data[0]['aco_id']+"','"+meta_data[0]['aco_nm']+"','"+meta_data[0]['workspace_id']+"','"+meta_data[0]['pipeline_id']+"')"
                            meta_columns= 'buildsheet_workspaces_id,l1_schema,l2_schema,l2_table,source_file_name,source_id,source_name,source_type,workflow_id,author,vendor_version,vendor_name,aco_id,aco_name,workspace_id,pipeline_id'
                            meta_id = insertData('meta_data',meta_columns,meta_values)
                            if meta_id!='':
                               return HttpResponse(json.dumps({'status':'2','msg':'Meta Details Submitted.' ,'meta_id':meta_id}),content_type='application/json') 
                    else:
                        meta_data= request.POST.get('meta_data')
                        meta_id= request.POST.get('meta_id')
                        meta_data= json.loads(meta_data)
                        update_meta = "buildsheet_workspaces_id='"+request.POST.get('buildsheet_id')+"',l1_schema='"+meta_data[0]['default_l1schema']+"',l2_schema='"+meta_data[0]['l2_schema']+"',l2_table='"+meta_data[0]['l2_table']+"',source_file_name='"+meta_data[0]['sfn']+"',source_id='"+meta_data[0]['source_id']+"',source_name='"+meta_data[0]['source_name']+"',source_type='"+meta_data[0]['source_type']+"',workflow_id='"+meta_data[0]['workflow_id']+"',author='"+meta_data[0]['author']+"',vendor_version='"+meta_data[0]['vendor_version']+"',vendor_name='"+meta_data[0]['vendor_name']+"',aco_id='"+meta_data[0]['aco_id']+"',aco_name='"+meta_data[0]['aco_nm']+"',workspace_id='"+meta_data[0]['workspace_id']+"',pipeline_id='"+meta_data[0]['pipeline_id']+"'"
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
                        rows +="('"+data['unique_key']+"','"+request.POST.get('buildsheet_id')+"','"+request.POST.get('category')+"','"+data['alias']+"','"+data['source_schema']+"','"+data['source_table']+"','"+data['source_column']+"','"+data['rule']+"','"+transform+"','"+data['dest_schema']+"','"+data['dest_table']+"','"+data['dest_column']+"','"+data['dest_datatype']+"','"+meta_id+"','"+meta_data[0]['source_id']+"','"+meta_data[0]['aco_id']+"'),"
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
                column_values = "('"+request.POST.get('acoid')+"','"+request.POST.get('aconm')+"','"+request.POST.get('source_id')+"','"+request.POST.get('source_name')+"','"+request.POST.get('vendor_name')+"','"+request.POST.get('vendor_version')+"','"+request.POST.get('olap_version')+"')"
                columns_name= 'aco_id,aco_name,source_id,source_name,vendor_name,vendor_version,olap_version'
                id = insertData('buildsheet_workspaces',columns_name,column_values) 
                if id!='0' and id is not None:
                    return HttpResponse(json.dumps({'msg':'Buildsheet SuccessFully Created','status':'2'}),content_type='application/json')

            if (request.POST.get('action')=='updateBuildsheet'):
                update_values = "aco_id='"+request.POST.get('acoid')+"',aco_name='"+request.POST.get('aconm')+"',source_id='"+request.POST.get('source_id')+"',source_name='"+request.POST.get('source_name')+"',vendor_name='"+request.POST.get('vendor_name')+"',vendor_version='"+request.POST.get('vendor_version')+"',olap_version='"+request.POST.get('olap_version')+"'"
                update_Query = "update buildsheet_workspaces set "+update_values+" where id='"+request.POST.get('buildsheet_id')+"';"
                if runMysqlQuery(update_Query):
                    return HttpResponse(json.dumps({'msg':'Buildsheet SuccessFully Updated','status':'2'}),content_type='application/json')      
            else:    
                meta_id= request.POST.get('meta_id')
                #print meta_id
                query = getSQL(meta_id)
                #print query
                return HttpResponse(json.dumps({'query':query,'status':'2'}),content_type='application/json')
            

            
        else:
            buildsheets = runSelectQuery("select distinct concat(aco_name,'_',source_name),workspace_name,id,aco_id,aco_name,source_id,source_name,vendor_name,vendor_version,cast(modified as char),ifnull(category_count,'0'),olap_version,cast((ifnull(category_count,'0')/16)*100 as decimal(18,1)) from buildsheet_workspaces a left join (select count(*) as category_count ,buildsheet_workspaces_id from meta_data where delete_flag=0 group by buildsheet_workspaces_id) b on b.buildsheet_workspaces_id = a.id where  a.delete_flag=0");
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
            buildsheets = runSelectQuery("select distinct a.l2_table,a.id,a.aco_id,a.source_id,cast(a.modified as char),a.buildsheet_workspaces_id  from meta_data a left join buildsheet_data b on a.id =b.meta_id where a.delete_flag=0 and  a.buildsheet_workspaces_id='"+buildsheet_id+"'")
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
            source_type=runSelectQuery("select name from buildsheet_master where parent_id = 98");
            '''source_type=[]
            for col in source_type1:
                source_type.append(col[0])'''
        
            return render(request, 'buildsheet/category-create.html', {'buildsheet' :buildsheet[0],'schemas':schemas,'source_type':source_type})    
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
            print buildsheet[0][10]
            source_type1=runSelectQuery("select name from buildsheet_master where parent_id = 98");
            source_type=[]
            for col in source_type1:
                source_type.append(col[0])
            return render(request, 'buildsheet/category-update.html', {'buildsheet' :buildsheet[0],'schemas':schemas,'l2tables':l2tables,'source_type':source_type})    
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
        writer.writerow(['category','alias','l1_schema','source_table','source_column','rule','transformation','l2_schema','destination_table','destination_column','created','modified'])
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
            buildsheet = fetchBuildsheet(meta_id,'and rule_type not in ("inner join","left join","right join","from")')
            joins = fetchBuildsheet(meta_id,'and rule_type in ("inner join","left join","right join")')
            frm = fetchBuildsheet(meta_id,'and rule_type in ("from")')

            # print meta
            # buildsheet = fetchBuildsheet(meta_id)
            return HttpResponse(json.dumps({'buildsheet':buildsheet,'joins':joins,'from':frm,'status':'2'}),content_type='application/json')
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
                # columns=['Category','Source Table','Source Column','Rule','Transformation','Destination Table','Destination Tolumn','Total Count(Table Level)','Distinct Count(Table Level)','Total Count(After Joins)','Distinct Count(After Joins)','Total Count','Distinct Count','Difference Total Count','Difference Distinct Count','Semantic Match','Semantic Mismatch','Semantic Fill Rate','Ontology Match','Ontology Mismatch','Ontology Fill Rate']

                # df=pd.DataFrame(rows,columns=columns)
                # df1=df[['Category','Source Table','Source Column','Rule','Transformation','Destination Table','Destination Tolumn','Total Count(Table Level)','Distinct Count(Table Level)','Total Count(After Joins)','Distinct Count(After Joins)','Total Count','Distinct Count','Difference Total Count','Difference Distinct Count']]
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
                writer.writerow(['Category','Source Table','Source Column','Rule','Transformation','Destination Table','Destination Tolumn','Total Count(Table Level)','Distinct Count(Table Level)','Total Count(After Joins)','Distinct Count(After Joins)','Total Count','Distinct Count','Difference Total Count','Difference Distinct Count','Semantic Match','Semantic Mismatch','Semantic Fill Rate','Ontology Match','Ontology Mismatch','Ontology Fill Rate'])
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
                    # if row[21]!='' and row[21]!='None' and row[21] is not None:
                        
                    #     semantic_q = runQuery(row[29],row[21])
                        
                    #     semantic_q = str(semantic_q[0][0])
                    # if row[23]!='' and row[23]!='None' and row[23] is not None:
                        
                    #     ontology_q = runQuery(row[29],row[23])
                        
                    #     ontology_q = str(ontology_q[0][0])

                    update_Query = "update buildsheet_data set l1_total_cnt_wf='"+l1_total_cnt_wf_q+"', l1_unq_cnt_wf='"+l1_unq_cnt_wf_q+"', l1_total_cnt='"+l1_total_cnt_q+"',l1_unq_cnt='"+l1_unq_cnt_q+"', l2_total_cnt='"+l2_total_cnt_q+"', l2_unq_cnt='"+l2_unq_cnt_q+"', semantic_match="+semantic_q+", ontology_match="+ontology_q+" where id='"+str(row[0])+"';"
                    
                    runMysqlQuery(update_Query)

                    rows = getBuildsheet(request.POST.get('aco_id'),request.POST.get('source_id'),request.POST.get('meta_id'),'report')
                    # print rows
                    columns= ['Category','Source Table','Source Column','Rule','Transformation','Destination Table','Destination Tolumn','Total Count(Table Level)','Distinct Count(Table Level)','Total Count(After Joins)','Distinct Count(After Joins)','Total Count','Distinct Count','Difference Total Count','Difference Distinct Count','Semantic Match','Semantic Mismatch','Semantic Fill Rate','Ontology Match','Ontology Mismatch','Ontology Fill Rate']
                 
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
    df.insert(7, ' ','')

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
                    
                columns= ['Test Scenario','Test Case','Total Count in Source Table','Total Count in L2 Table','Count Match/Difference','Data Present ','Test Pass/Fail','Total Count in Source Table','Total Count in L2 Table','Count Match/Difference','Data Present','Test Pass/Fail']
                return HttpResponse(json.dumps({'buildsheet':rows,'status':'2','columns':columns}),content_type='application/json')
        else:
                buildsheets = getBuildsheetCategories()
                listing = getAcowiseBuildsheet()
                # print listing
                acos = runSelectQuery("select distinct aco_name,aco_id from meta_data");
                return render(request, 'auditListing.html', {'buildsheets': buildsheets,'acos':acos,'listing':listing})
    except Exception as e:
        return HttpResponse(json.dumps({'status':'1','msg':str(e)}),content_type='application/json')




# if __name__ == '__main__':
#     getnavc()

def viewAuditReport(request,meta_id):
    if (request.method == 'POST'):
        print "post"  

        
    else:
      rows = getauditreportfromdb('','',meta_id)
      audit_name = runSelectQuery('select DISTINCT CONCAT(aco_name,">",IFNULL(source_name, ""),">",IFNULL(b.category, "")) from meta_data m inner join buildsheet_data b on m.id=b.meta_id where  m.id="'+meta_id+'"')
      columns= ['Test Scenario','Test Case','Category','Total Count in Source Table','Total Count in L2 Table','Count Match/Difference','Data Present ','Test Pass/Fail','Total Count in Source Table','Total Count in L2 Table','Count Match/Difference','Data Present','Test Pass/Fail']
      return render(request, 'auditView.html', {'rows': rows,'columns': columns,'audit_name':audit_name[0][0]})

def viewsemanticReport(request,meta_id):
    if (request.method == 'POST'):
        print "post" 
    else:
      rows = getsemanticreportfromdb('','',meta_id)
      audit_name = runSelectQuery('select DISTINCT CONCAT(aco_name,">",IFNULL(source_name, ""),">",IFNULL(b.category, "")) from meta_data m inner join buildsheet_data b on m.id=b.meta_id where  m.id="'+meta_id+'"')
      columns= ['Test Scenario','Test Case','Category','Total Count in L2 Table','Semantic Match', 'Semantic Mismatch', 'Semantic Fill Rate','Sementic Test','Ontology Match', 'Ontology Mismatch', 'Ontology Fill Rate','Ontology Test']
      return render(request, 'auditView.html', {'rows': rows,'columns': columns,'audit_name':audit_name[0][0]})

def viewontologyReport(request,meta_id):
    if (request.method == 'POST'):
        print "post" 
    else:
      #ontology and semantic report
      rows = getontologyreportfromdb(meta_id)
      audit_name = runSelectQuery('select DISTINCT CONCAT(aco_name,">",IFNULL(source_name, ""),">",IFNULL(b.category, "")) from meta_data m inner join buildsheet_data b on m.id=b.meta_id where  m.id="'+meta_id+'"')
      columns= ['Test Scenario','Test Case','Category','Total Count in L2 Table','Semantic Match', 'Semantic Mismatch', 'Semantic Fill Rate','Sementic Test','Ontology Match', 'Ontology Mismatch', 'Ontology Fill Rate','Ontology Test']
      return render(request, 'auditView.html', {'rows': rows,'columns': columns,'audit_name':audit_name[0][0]})

def loadData(request):
    try:
        if(request.method == 'POST'):
            if(request.POST.get('action') =='getL1Data'):
                schema = request.POST.get('schema')
                table = request.POST.get('table')
                column = request.POST.get('column')
                query = "select distinct \""+column+"\" from "+table+" limit 10000;"
                all_results = runQuery(schema,query)
                result = [row[0] for row in all_results]
                # print len(result)
                return HttpResponse(json.dumps({'result':result,'status':'2'}),content_type='application/json')
            if(request.POST.get('action') =='getL2Data'):
                schema = request.POST.get('schema')
                table = request.POST.get('table')
                alias = request.POST.get('alias')
                rule = request.POST.get('rule')
                transform = request.POST.get('transform')
                meta_id = request.POST.get('meta_id')
                column = request.POST.get('column')

                query = getl2Query(alias,schema,table,column,rule,transform,meta_id)
                print query
                all_results = runQuery(schema,query+" limit 1000")
                result = [row[0] for row in all_results]
                return HttpResponse(json.dumps({'result':result,'status':'2'}),content_type='application/json')
    except Exception as e:
        return HttpResponse(json.dumps({'status':'1','msg':str(e)}),content_type='application/json')


def allBuildsheetReport(request,aco_id,source_id):
    if (request.method == 'POST'):
        print "post" 
    else:
      #ontology and semantic report
      rows = getauditreportfromdb(aco_id,source_id,'')
      

      audit_name = runSelectQuery('select DISTINCT CONCAT(aco_name,">",IFNULL(source_name, "") ) from meta_data where aco_id='+aco_id+' and source_id='+source_id)
      columns= ['Test Scenario','Test Case','Category','Total Count in Source Table','Total Count in L2 Table','Count Match/Difference','Data Present ','Test Pass/Fail','Total Count in Source Table','Total Count in L2 Table','Count Match/Difference','Data Present','Test Pass/Fail']
      return render(request, 'auditView.html', {'rows': rows,'columns': columns,'audit_name':audit_name[0][0]})

def allonseReport(request,aco_id,source_id):
    if (request.method == 'POST'):
        print "post" 
    else:
      rows = getsemanticreportfromdb(aco_id,source_id,'')
      #audit_name='abc'
      audit_name = runSelectQuery('select DISTINCT CONCAT(aco_name,">",IFNULL(source_name, "") ) from meta_data where aco_id='+aco_id+' and source_id='+source_id)
      columns= ['Test Scenario','Test Case','Category','Total Count in L2 Table','Semantic Match', 'Semantic Mismatch', 'Semantic Fill Rate','Sementic Test','Ontology Match', 'Ontology Mismatch', 'Ontology Fill Rate','Ontology Test']
      return render(request, 'auditView.html', {'rows': rows,'columns': columns,'audit_name':audit_name[0][0]})
