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
from mysql.utils import patientValidateQuery,getl2CatSql,getllCatSql,runSelectQuery,getsemanticreportfromdb,getontologyreportfromdb,getauditreportfromdb,getRules,insertData,getBuildsheetCategories,getSQL,checkSource,getBuildsheet,getBuildsheetByMeta,runMysqlQuery,fetchBuildsheet,getMetaDetails,fetchBuildsheetByID,runSelectQuery,getAcowiseBuildsheet
from django.views.decorators.csrf import csrf_protect
import json
import re
import xlwt
import csv
import pandas as pd
import numpy as np
import xlsxwriter
import base64
import traceback
import io
import random
try:
    from io import BytesIO as IO # for modern python
except ImportError:
    from io import StringIO as IO # for legacy python

def runValidation(request):
    try:
        if (request.method == 'POST'):
            if (request.POST.get('action')=='runValidation'):
				meta_id = request.POST.get('meta_id')
				meta_details = runSelectQuery("select distinct l2_schema,l2_table from meta_data where id ="+meta_id)
				ids = runQuery(meta_details[0][0],'select distinct trim(local_member_id) from '+meta_details[0][1])
				ids_list ="("
				id_list=[]
				columns = ['local_member_id']
				for i in range(0,10):
					rand = random.choice(ids)
					# print rand[0]
					id_list.append(rand[0])
					ids_list += "\'"+rand[0]+"\',"
				ids_list= re.sub(r',$','',ids_list)
				ids_list +=")"
				c1 = patientValidateQuery(meta_id,ids_list,'L2',0)
				columns.extend(c1[0][0].split(','))
				# print(C1[0])
				l1 = patientValidateQuery(meta_id,ids_list,'L1',1)
				l1_out = runQuery('',l1[0][0]+' '+ids_list+ ' order by 1;')
				df1 = pd.DataFrame(l1_out)
				df1.columns = columns
				C2 = patientValidateQuery(meta_id,ids_list,'L2',0)
				# print(C2)
				l2 = patientValidateQuery(meta_id,ids_list,'L2',1)
				l2_out = runQuery(meta_details[0][0],l2[0][0]+' '+ids_list+ ' order by 1;')

				df2 = pd.DataFrame(l2_out)
				df2.columns =columns
				df_array=[]
				for ids in id_list:
					row_array=[]
					row_array.append(ids)

					try:
						print("inside loop")
						# print(ids)
						comp1 = df1.loc[df1['local_member_id'] == ids]
						print comp1
						comp2 = df2.loc[df2['local_member_id'] == ids]
						print comp2
						a=0
						for c in columns:
							# if(a>0):
								#print comp1
							print "for "+ c+ "sets is: "
							c1 = set(comp1[c].unique().tolist())
							c2 = set(comp2[c].unique().tolist())
							print "for "+ c+ "set c1 :"+str(c1)
							print "for "+ c+ "set : c2 "+str(c2)
							print "for "+ c+ "set : diff "+ str(c1==c2)
							row_array.append(str(c1==c2))
							# a=a+1
					except:
						message=traceback.format_exc()
						print(message)
					df_array.append(row_array)
					print df_array
				df_columns =['patient_id']
				df_columns.extend(columns)
				df_output = pd.DataFrame(df_array, columns = df_columns)
				excel_file = IO()

				xlwriter = pd.ExcelWriter(excel_file, engine='xlsxwriter')

				df_output.to_excel(xlwriter, meta_details[0][1], index=False)
				df1.to_excel(xlwriter, 'L1 Data', index=False)
				df2.to_excel(xlwriter, 'L2 Data', index=False)

				xlwriter.save()
				xlwriter.close()

				# important step, rewind the buffer or when it is read() you'll get nothing
				# but an error message when you try to open your zero length file in Excel
				excel_file.seek(0)

				# set the mime type so that the browser knows what to do with the file
				encoded = base64.b64encode(excel_file.read())
				response = HttpResponse(encoded, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

				# set the file name in the Content-Disposition header
				response['Content-Disposition'] = 'attachment; filename='+meta_details[0][1]+'_patient_validation.xlsx'

				print df_output
				return response
				# return HttpResponse(json.dumps({'status':'1','msg':meta_details[0][1]}),content_type='application/json')
    except Exception as e:
        return HttpResponse(json.dumps({'status':'1','msg':str(e)}),content_type='application/json')