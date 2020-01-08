import sqlalchemy as sa
from sqlalchemy.orm import sessionmaker
import json
import pandas as pd


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

def getTableDesc(schema,table):
	try:
		con = connection()
		SetPath = "SET search_path TO %s" % schema
		con.execute(SetPath)
		query="select distinct schemaname,tablename,\"column\",case when type like 'character varying(%' THEN replace (type,'character varying','varchar') when type like 'timestamp%' THEN 'timestamp' else type end as type from pg_table_def where tablename='"+table+"'"
		#query = 'select distinct schemaname,tablename,"column",type from pg_table_def where tablename =\''+table+'\'';
		rr = con.execute(query)
		all_results =  rr.fetchall()
		
		rows = [dict(zip([key for key in rr.keys()], row)) for row in all_results]
		return rows
	except Exception as e:
		print str(e)
		raise

def schemaList():
	try:
		con =connection()
		query = "select distinct nspname from pg_namespace where nspowner !='1' or nspname='public'";
		rr = con.execute(query)
		all_results =  rr.fetchall()
		schema= []
		for col in all_results:
			schema.append(col[0])
		return schema
	except Exception as e:
		print str(e)
		raise


def getSchemaTables(schema):
	try:
		con =connection()
		SetPath = "SET search_path TO %s" % schema
		con.execute(SetPath)

		query = "select distinct tablename from pg_table_def where schemaname = '"+schema+"'";
		# print query
		rr = con.execute(query)
		all_results =  rr.fetchall()
		tables= []
		for col in all_results:
			tables.append(col[0])
		return tables
	except Exception as e:
		print str(e)
		raise


def runQuery(schema,query):
	try:
		con =connection()
		if schema!='':
			SetPath = "SET search_path TO %s" % schema
			con.execute(SetPath)
		print query
		rr = con.execute(query)
		all_results =  rr.fetchall()

		return all_results
	except Exception as e:
		print str(e)
		raise

def l1tol2(schema,query):
	try:
		con =connection()
		if schema!='':
			SetPath = "SET search_path TO %s" % schema
			con.execute(SetPath)
		# print query
		con.execute(query)
		con.commit()
		all_results=''
		return all_results
	except Exception as e:
		print str(e)
		raise

def runQueryByConnection(schema,query,con):
	try:
		connection_string = "postgresql+psycopg2://%s:%s@%s:%s/%s" % (con[0],con[1],con[2],str(con[3]),con[4])
		engine = sa.create_engine(connection_string)
		session = sessionmaker()
		session.configure(bind=engine)
		con = session()
		SetPath = "SET search_path TO %s" % schema
		con.execute(SetPath)
		rr = con.execute(query)
		all_results =  rr.fetchall()
		return all_results
	except Exception as e:
	    print "Error During Connection: "+str(e)
	    raise

def getSchemaAll(schema):
	try:
		s={}
		t={}
		tables= getSchemaTables(schema)
		# for table in tables:
		# 	# desc= getTableDesc(schema,table)
		# 	# t[table]=desc
		# 	# print t

		s[schema]=tables
		return s

	except Exception as e:
		print "Error During Connection: "+str(e)
		raise




def getPayerforClaims(schema,acon,ptype):
	con =connection()
	SetPath = "SET search_path TO %s" % schema
	con.execute(SetPath)
	query=''
	if ptype=='sstp':
		query="select distinct sstp from l2.pd_activity where  acon='"+acon+"' and lower(st)='claims'"
	# query = "select distinct tablename from pg_table_def where schemaname = '"+schema+"'";
	elif ptype=='sstpcl':
		query="select distinct sstp from l2.pd_activity where  acon='"+acon+"' and lower(st)='clinical'"
	else:
		query="select distinct prnm from l2.pd_attribution where  acon='"+acon+"'"
		
	rr = con.execute(query)
	print (query)
	all_results =  rr.fetchall()
	payer= []
	for col in all_results:
		payer.append(col[0])
	return payer


def getfromdtclaims(schema,payer,date_ty):
	con =connection()
	SetPath = "SET search_path TO %s" % schema
	con.execute(SetPath)
	query=''
	if date_ty=='rcdt':
		query="select distinct date_part_year(rcdt)::VARCHAR(2000) as dt from l2.pd_activity where sstp='"+payer+"' and lower(st) ='claims' order by dt "
	# query = "select distinct tablename from pg_table_def where schemaname = '"+schema+"'";
	else:
		query="select distinct date_part_year(atrdt)::VARCHAR(2000) as dt from l2.pd_attribution where prnm='"+payer+"' order by dt "
	rr = con.execute(query)
	print query
	all_results =  rr.fetchall()
	fromdt= []
	for col in all_results:
		fromdt.append(col[0])
	return fromdt

def getAcoNames(schema):
	con =connection()
	SetPath = "SET search_path TO %s" % schema
	con.execute(SetPath)
	query="select distinct (UPPER (acon)) from l2.pd_activity"
	rr = con.execute(query)
	print query
	all_results =  rr.fetchall()
	tables= []
	for col in all_results:
		tables.append(col[0])
	return tables
	
	
def getcategoryforcl(facility):
	con =connection()
	SetPath = "SET search_path TO l2" 
	con.execute(SetPath)
	query="select distinct lower(cltp) from l2.pd_activity where sstp='"+facility+"'"
	rr = con.execute(query)
	print query
	all_results =  rr.fetchall()
	tables= []
	for col in all_results:
		tables.append(col[0])
	return tables

def getAcoid(schema,table):
	con =connection()
	SetPath = "SET search_path TO %s" % schema
	con.execute(SetPath)
	query="select distinct aco_id from "+schema+"."+table+""
	rr = con.execute(query)
	print query
	all_results =  rr.fetchall()
	tables= []
	for col in all_results:
		tables.append(col[0])
	return tables

def getsourcetype(schema,table,acoid):
	con =connection()
	SetPath = "SET search_path TO %s" % schema
	con.execute(SetPath)
	query="select distinct source_type from "+schema+"."+table+" where aco_id='"+acoid+"'"
	rr = con.execute(query)
	print query
	all_results =  rr.fetchall()
	tables= []
	for col in all_results:
		tables.append(col[0])
	return tables

def getsourceid(schema,table,acoid):
	con =connection()
	SetPath = "SET search_path TO %s" % schema
	con.execute(SetPath)
	query="select distinct source_id from "+schema+"."+table+" where aco_id='"+acoid+"'"
	rr = con.execute(query)
	print query
	all_results =  rr.fetchall()
	tables= []
	for col in all_results:
		tables.append(col[0])
	return tables
def getingdtfromdb(schema,table,aco_id,source_id,source_type):
	con =connection()
	SetPath = "SET search_path TO %s" % schema
	con.execute(SetPath)
	query="select distinct ingestion_datetime::date::varchar(65335) from "+schema+"."+table+" where aco_id='"+aco_id+"' and source_id='"+source_id+"' and source_type='"+source_type+"'"
	rr = con.execute(query)
	print query
	all_results =  rr.fetchall()
	tables= []
	for col in all_results:
		tables.append(col[0])
	return tables

def getdatafromdb(schema1,table1,tablecolumns1,schema2,table2,tableColumns2,aco_id,source_id,source_type,ingdt):
	try:
		passed_ingestion_datetime=ingdt		
		len_inp= len(tablecolumns1)		
		len_out= len(tableColumns2)		
		input_str=""
		input_str_unq=""
		output_str=""
		output_str_unq=""
#loop to get input columns name with null handling#
		for i in range(len_inp):
			if i==(len_inp-1):
				input_str=input_str+"isnull(cast("+tablecolumns1[i]+" as varchar(300)),'')"
			else:	
				input_str=input_str+"isnull(cast("+tablecolumns1[i]+" as varchar(300)),'')||"
#loop to get input columns name only to show#
		for k in range(len_inp):
			if k==(len_inp-1):
				input_str_unq=input_str_unq+tablecolumns1[k]
			else:	
				input_str_unq=input_str_unq+tablecolumns1[k]+"||"
#loop to get input columns name with null handling#
		for i in range(len_out):
			if i==(len_out-1):
				output_str=output_str+"isnull(cast("+tableColumns2[i]+" as varchar(300)),'')"
			else:
				output_str=output_str+"isnull(cast("+tableColumns2[i]+" as varchar(300)),'')||"
#loop to get input columns name only to show#
		for i in range(len_out):
			if i==(len_out-1):
				output_str_unq=output_str_unq+tableColumns2[i]
			else:	
				output_str_unq=output_str_unq+tableColumns2[i]+"||"
#From here query will start and take the inputs form input file and above variables#
		query = "select '"+schema1+"' as schema, '"+table1+"' as tablename,'"+input_str_unq+"' as unique_columns,count(distinct ("+input_str+")) as total_count from  "+schema1+"."+table1+" "		
		con =connection()
		SetPath = "SET search_path TO %s" % schema1
		con.execute(SetPath)
		rr = con.execute(query)
		all_results =  rr.fetchall()
		rows = [dict(zip([key for key in rr.keys()], row)) for row in all_results]
		print(rows)
		df=pd.DataFrame(all_results)
		print(df)
		query1="select '"+schema2+"' as schema, '"+table2+"' as tablename,'"+output_str_unq+"' as unique_columns,count(distinct ("+output_str+")) as total_count from "+schema2+"."+table2+" where aco_id = '"+aco_id+"' and source_id = '"+source_id+"' and source_type= '"+source_type+"' and ingestion_datetime::date='"+ingdt+"'"
		print(query1)
		con1 =connection()
		SetPath1 = "SET search_path TO %s" % schema2
		con1.execute(SetPath1)
		rr1 = con1.execute(query1)
		all_results1 =  rr1.fetchall()
		print(all_results1)
		rows1 = [dict(zip([key for key in rr1.keys()], row)) for row in all_results1]
		print(rows1)
		df2=pd.DataFrame(all_results1)	
		print(df2)	
		res_df=pd.concat([df,df2], axis=1)
		print(res_df)
		return res_df.iloc[0]
	except Exception as e:
		return HttpResponse(json.dumps({'status':'1','msg':str(e)}),content_type='application/json')