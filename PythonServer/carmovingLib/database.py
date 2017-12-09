'''
Created on May 28, 2015

@author: eqansun
'''

import sys

import psycopg2
from _sqlite3 import Row


class DatabaseAdapter:
    def __init__(self, databaseName): 
        # connect database    
        try:  
            self.pgdb_conn = psycopg2.connect(database = databaseName, host = '127.0.0.1', port="5432", user = 'postgres', password = 'postgres')  
            self.cur = self.pgdb_conn.cursor()
            self.tmpcur = self.pgdb_conn.cursor()
            self.updateDbCur = self.pgdb_conn.cursor()            
            self.queryCur = self.pgdb_conn.cursor()
        except Exception, e:  
            print "conntect postgre database failed, ret = %s" % e.args[0]       
            sys.exit()   
    def conn(self):
        return self.pgdb_conn
    def queryDB(self,query_sql): 
        result = None
        if query_sql == "":
            return None        
        try:
            self.queryCur.execute(query_sql)
            rows = self.queryCur.fetchall()
            for row in rows:
                print row
        except Exception, e:
            print "sql: %s error: %s" %( query_sql , e.args[0])
            return result                 
        return result
    
    def updateDB(self, update_sql):
        
        result = None
        if update_sql == "":
            return None
        
        try:
            self.updateDbCur.execute(update_sql)            
            self.pgdb_conn.commit() 
        except Exception, e: 
            print "sql: %s error: %s" %( update_sql , e.args[0])
            sys.exit()          
        
        try:
            result = self.updateDbCur.fetchall()            
        except Exception, e:
            #print "sql: %s error: %s" %( update_sql , e.args[0])
            return result
            
        return result
                
    def insertDB(self, update_sql):
        
        try:
            self.updateDbCur.execute(update_sql)            
            #self.pgdb_conn.commit() 
        except Exception, e: 
            print "sql: %s error: %s" %( update_sql , e.args[0])
            sys.exit()          
         
                
    def commitDB(self):
        try:
            #self.updateDbCur.execute(update_sql)
            self.pgdb_conn.commit() 
        except Exception, e: 
            print "error commit db: %s"%e.args[0]  
            sys.exit()                   
       
    def close(self):
        self.cur.close()
        self.pgdb_conn.close()