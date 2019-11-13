from .models import User
from django.contrib.auth.backends import ModelBackend
import logging


class MyAuthBackend(ModelBackend):
    def authenticate(self, empid, password):    
        
        try:
            #print str(User.objects.all())
            user = User.objects.filter(empid=empid).values('empid','password','name')
            print user[0]
            if user.exists():
                if user[0]["password"]== password:
                    return user[0]
                else:
                    return None
            else:
                return None
            #user = User.objects(empid=empid).get()
            #print 'iske baad chalega'
            #print "user is in backend"+str(user)
            '''if user.check_password(password):
                print "password check "
                return user
            else:'''
            #return user
        except User.DoesNotExist:
            #logging.getLogger("error_logger").error("user with login %s does not exists " % login)
            return None
        except Exception as e:
            #logging.getLogger("error_logger").error(repr(e))
            print 'nahi chala'+str(e)
            return None



    def redshit(self):

            #>>>>>>>> MAKE CHANGES HERE <<<<<<<<<<<<< 
            DATABASE = "ahn_redshift"
            USER = "suresh.kumar"
            PASSWORD = "India123"
            HOST = "10.0.32.96"
            PORT = "5439"
            SCHEMA = "l1"      #default is "public" 

            ####### connection and session creation ############## 

            try:
                connection_string = "postgresql+psycopg2://%s:%s@%s:%s/%s" % (USER,PASSWORD,HOST,str(PORT),DATABASE)
                engine = sa.create_engine(connection_string)

            except Exception as e:
                print str(e)
            session = sessionmaker()
            session.configure(bind=engine)
            s = session()
            SetPath = "SET search_path TO %s" % SCHEMA
            print SetPath
            s.execute(SetPath)
            ###### All Set Session created using provided schema  #######

            ################ write queries from here ###################### 
            query = "SELECT * FROM demographics limit 2;"
            print query

            rr = s.execute(query)
            all_results =  rr.fetchall()
            print all_results
            def pretty(all_results):
                for row in all_results :
                    print "row start >>>>>>>>>>>>>>>>>>>>"
                    for r in row :
                        print " ----" , r
                    print "row end >>>>>>>>>>>>>>>>>>>>>>"


            pretty(all_results)


            ########## close session in the end ###############
            s.close()