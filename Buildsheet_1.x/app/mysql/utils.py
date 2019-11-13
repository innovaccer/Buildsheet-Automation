import mysql.connector
from mysql.connector import Error
import json


def connection():
	with open('app/config.json') as config_file:
		data = json.load(config_file)
	DATABASE = data['mysql']['database']
	USER = data['mysql']['user']
	PASSWORD = data['mysql']['password']
	HOST = data['mysql']['host']
	PORT = data['mysql']['port']

	try:
	    connection = mysql.connector.connect(host=HOST,
	                                         database=DATABASE,
	                                         user=USER,
	                                         password=PASSWORD)
	    if connection.is_connected():
	        return connection
	    else:
	    	return None   
	except Error as e:
	    print("Error while connecting to MySQL", e)
	    raise

def insertData(table,columns,values):
	try:
		con = connection()
		if con is not None:
			cursor = con.cursor()
			query = "INSERT INTO " +table+ "("+columns+") VALUES"+values
			
			print query
			cursor = con.cursor()
			result = cursor.execute(query)
			con.commit()
			print("Record inserted successfully")
			lastrowid = cursor.lastrowid
			cursor.close()
			return	str(lastrowid)
		else:
			print "please check db connection"
			return ''
	except Exception as e:
		print str(e)
		raise



def getRules():
	try:
		con = connection()
		if con is not None:
			cursor = con.cursor()
			cursor.execute("select distinct name from buildsheet_master where parent_id='2' order by name;")
			record = cursor.fetchall()
			rules= []
			for rule in record:
				rules.append(rule[0])
			#print rules
			return rules
		else:
			print "please check db connection"
	except Exception as e:
		print str(e)
		raise

def getBuildsheetCategories():
	try:
		con=connection()
		if con is not None:
			cursor = con.cursor()
			cursor.execute("select id,buildsheet_name,source_id,workflow_id,aco_id,cast(created as char) as created,cast(modified as char)  as modified from meta_data where delete_flag=0 order by buildsheet_name")
			record = cursor.fetchall()
			return record
		else:
			print "please check db connection"
	except Exception as e:
		print str(e)
		raise

def getSQL(meta_id):
	try:
		con=connection()
		if con is not None:
			cursor = con.cursor()
			# SET group_concat_max_len=18446744073709551615;
			cursor.execute('SET group_concat_max_len=18446744073709551615')
			record = cursor.callproc('dyn_query', [meta_id,])
			record =[]
			for result in cursor.stored_results():
					 record =result.fetchall()
			 
			return record[0]
		else:
			print "please check db connection"
			return None
	except Exception as e:
		print str(e)
		raise

def getl2Query(alias,schema,table,column,rule_type,rule,meta_id):
	try:
		con=connection()
		if con is not None:
			cursor = con.cursor()
			# SET group_concat_max_len=18446744073709551615;
			cursor.execute('SET group_concat_max_len=18446744073709551615')
			record = cursor.callproc('l2_data_load',[alias,schema,table,column,rule_type,rule,meta_id])
			record =[]
			for result in cursor.stored_results():
					 record =result.fetchall()
			 
			return record[0][0]
		else:
			print "please check db connection"
			return None
	except Exception as e:
		print str(e)
		raise

def getMandatoryColumns(table,olap):
	try:
		con=connection()
		if con is not None:
			cursor = con.cursor()
			# print "aco_id:"+aco_id+" source_id:"+source_id+" workflow_id:"+workflow_id
			record = cursor.callproc('get_mandatory_columns', [olap,table,])
			print("record")
			print(record)
			record =[]
			for result in cursor.stored_results():
					 record =result.fetchall()
			# print record 
			return record
			
		else:
			print "please check db connection"	
			return None
	except Exception as e:
		print str(e)
		raise

def getBuildsheet(aco_id,source_id,meta_id,usage):
	try:
		con=connection()
		if con is not None:
			cursor = con.cursor()
			# print "aco_id:"+aco_id+" source_id:"+source_id+" workflow_id:"+workflow_id
			record = cursor.callproc('dwn_buildsheet', [aco_id,source_id,meta_id,usage])

			record =[]
			for result in cursor.stored_results():
					 record =result.fetchall()
			# print record 
			return record
			
		else:
			print "please check db connection"	
			return None
	except Exception as e:
		print str(e)
		raise


def checkSource(source_nm,aco_nm,l2_table):
	try:
		con=connection()
		if con is not None:
			cursor = con.cursor()
			buildsheet_name = aco_nm+"_"+source_nm+"_"+l2_table
			c= cursor.execute("select count(*) from meta_data where delete_flag=0 and buildsheet_name='"+buildsheet_name+"';")

		
			row_count = cursor.fetchone()[0]
			
			if row_count!=0:
				
				return "This Category Buildsheet Already Exist."
			else:
				
				return str(row_count)
		else:
			return "please check db connection"	
			
	except Exception as e:
		print str(e)
		raise



def getBuildsheetByMeta(meta_id):
	try:
		con=connection()
		if con is not None:
			cursor = con.cursor()
			c= cursor.execute("select id, category, source_table, source_column, destination_table, destination_column, rule_type, rule, meta_id, l1_total_cnt_wf_q, l1_total_cnt_wf, l1_unq_cnt_wf_q, l1_unq_cnt_wf, l1_total_cnt_q, l1_total_cnt, l1_unq_cnt_q, l1_unq_cnt, l2_total_cnt_q, l2_total_cnt, l2_unq_cnt_q, l2_unq_cnt, semantic_q, semantic_match, ontology_q, ontology_match, cast(created as char), cast(modified as char),alias,l1_schema,l2_schema from buildsheet_data where meta_id='"+meta_id+"' and rule_type not in ('GETDATE()','where','from','inner join','left join','right join','alias') and delete_flag=0")
			record =cursor.fetchall()

			return record
			
		else:
			print "please check db connection"	
			return None
	except Exception as e:
		print str(e)
		raise







def runSelectQuery(query):
	try:
		con=connection()
		if con is not None:
			cursor = con.cursor()
			print query
			cursor.execute(query)
			record =cursor.fetchall()
			
			return record
			
		else:
			print "please check db connection"	
			return None
	except Exception as e:
		print str(e)
		raise

def runMysqlQuery(query):
	try:
		con=connection()
		if con is not None:
			cursor = con.cursor()
			print query
			cursor.execute(query)
			con.commit()
			return True
			
		else:
			print "please check db connection"	
			return False
	except Exception as e:
		print str(e)
		raise



def getMetaDetails(meta_id):
	try:
		con=connection()
		if con is not None:
			cursor = con.cursor()

			cursor.execute("select id,buildsheet_name,source_id,source_name,source_type,workflow_id,author,cast(ingestion_datetime as char),vendor_version,vendor_name,aco_id,aco_name,source_file_name,workspace_id,cast(indata_created_on as char) ,pipeline_id,cast(created as char),cast(modified as char),delete_flag,l1_schema from meta_data where id="+meta_id)
			record = cursor.fetchall()
			return record
			
		else:
			print "please check db connection"	
			return None
	except Exception as e:
		print str(e)
		raise

def fetchBuildsheet(meta_id,condition):
	try:
		con=connection()
		if con is not None:
			cursor = con.cursor()
			cursor.execute("select id,category,source_table,source_column,destination_table,destination_column,rule_type,rule,meta_id,cast(created as char),cast(modified as char),delete_flag,l2_schema,l1_schema,data_type,alias,unique_flag from buildsheet_data where delete_flag=0 and  meta_id="+meta_id+" "+condition)
			# print "select id,category,source_table,source_column,destination_table,destination_column,rule_type,rule,meta_id,cast(created as char),cast(modified as char),delete_flag,l2_schema,l1_schema,data_type,alias from buildsheet_data where delete_flag=0 and  meta_id="+meta_id+" "+condition
			record = cursor.fetchall()
			return record
			
		else:
			print "please check db connection"	
			return None
	except Exception as e:
		print str(e)
		raise


def fetchBuildsheetByID(id):
	try:
		con=connection()
		if con is not None:
			cursor = con.cursor()
			cursor.execute("select id,category,source_table,source_column,destination_table,destination_column,rule_type,rule,meta_id,cast(created as char),cast(modified as char),delete_flag from buildsheet_data where delete_flag=0 and  id="+id)
			record = cursor.fetchall()
			return record
			
		else:
			print "please check db connection"	
			return None
	except Exception as e:
		print str(e)
		raise

def getauditreportfromdb(acoid,sourceid,meta_id):
	try:
		con=connection()
		if con is not None:
			cursor = con.cursor()
			# print "aco_id:"+aco_id+" source_id:"+source_id+" workflow_id:"+workflow_id
			record = cursor.callproc('qa_audit_report', [acoid,sourceid,meta_id,])

			record =[]
			for result in cursor.stored_results():
					 record =result.fetchall()
			# print record 
			return record
			
		else:
			print "please check db connection"	
			return None
	except Exception as e:
		print str(e)
		raise
def getsemanticreportfromdb(aco_id,source_id,meta_id):
	try:
		con=connection()
		if con is not None:
			cursor = con.cursor()
			# print "aco_id:"+aco_id+" source_id:"+source_id+" workflow_id:"+workflow_id
			record = cursor.callproc('qa_audit_semantic_report', [aco_id,source_id,meta_id,])

			record =[]
			for result in cursor.stored_results():
					 record =result.fetchall()
			# print record 
			return record
			
		else:
			print "please check db connection"	
			return None
	except Exception as e:
		print str(e)
		raise
def getontologyreportfromdb(meta_id):
	try:
		con=connection()
		if con is not None:
			cursor = con.cursor()
			# print "aco_id:"+aco_id+" source_id:"+source_id+" workflow_id:"+workflow_id
			record = cursor.callproc('qa_audit_ontology_report', [meta_id,])

			record =[]
			for result in cursor.stored_results():
					 record =result.fetchall()
			# print record 
			return record
			
		else:
			print "please check db connection"	
			return None
	except Exception as e:
		print str(e)
		raise

def getAcowiseBuildsheet():
	try:
		a={}
		
		# t=[]
		acos= runSelectQuery('select distinct aco_name,aco_id from meta_data where delete_flag=0')
		for aco in acos:
			# print aco
			s={}
			sources= runSelectQuery('select distinct source_name,source_id from meta_data where  delete_flag=0 and  aco_id='+aco[1])
			for source in sources:
				# print source
				category = runSelectQuery('select distinct category,meta_id from buildsheet_data where meta_id in (select distinct id from  meta_data where source_id='+source[1]+')')
				s[source]=category
				a[aco]=s

		# for table in tables:
		# 	# desc= getTableDesc(schema,table)
		# 	# t[table]=desc
		# 	# print t

		return a

	except Exception as e:
		print "Error During Connection: "+str(e)
		raise

def  getAllbuildsheetReport(aco_id,sourceid):
	try:
		con=connection()
		if con is not None:
			cursor = con.cursor()
			# print "aco_id:"+aco_id+" source_id:"+source_id+" workflow_id:"+workflow_id
			record = cursor.callproc('qa_audit_semantic_report', [aco_id,source_id,'',])

			record =[]
			for result in cursor.stored_results():
					 record =result.fetchall()
			# print record 
			return record
			
		else:
			print "please check db connection"	
			return None
	except Exception as e:
		print str(e)
		raise