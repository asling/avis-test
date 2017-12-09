'''
Created on Dec 5, 2017

@author: eliiyui
'''
from database import DatabaseAdapter
import pandas as pd
import re
# Load packages
import pandas as pd
import numpy as np
import math
from math import radians,sin,cos,pow,sqrt, asin
import datetime
from time import localtime
import time
import os
import psycopg2
from mylib import *

class dataHandler(object):
    def __init__(self):
        self.databaseAdapter = DatabaseAdapter('avis')
        #self.path = "C:\\local_data\\codecenter\\AVIS\\data\\car demand data\\"
        self.path = "C:\\local_data\\codecenter\\AVIS\\data\\car_demand_prediction\\"
    def createTables(self):
        sql = """CREATE TABLE IF NOT EXISTS siteinfo
          (
              siteid character varying NOT NULL,
              sitename character varying NOT NULL,
              regionid character varying NOT NULL,
              regionname character varying,
              priority double precision NOT NULL,
              address character varying,
              lat double precision,
              lon double precision,
              CONSTRAINT siteinfo_key PRIMARY KEY (siteid, regionid)
            )"""
        print "Try to create Table: %s"%sql
        self.databaseAdapter.updateDB(sql)
        self.databaseAdapter.commitDB()
        
    
    
        sql = """CREATE TABLE IF NOT EXISTS sitedemand
          (
            siteid character varying NOT NULL,
            regionid character varying NOT NULL,
            date date,
            season smallint,
            holiday smallint,
            workingday smallint,
            weather smallint,
            temperature double precision,
            humidity double precision,
            windspeed double precision,
            count int,
            prediction int,
            demand int,
            supply int,
            pred integer,
            CONSTRAINT sitedemand_key PRIMARY KEY (siteid, regionid,date)
            )"""
        print "Try to create Table: %s"%sql
        self.databaseAdapter.updateDB(sql)
        self.databaseAdapter.commitDB()
        sql = """CREATE TABLE IF NOT EXISTS sitedistance
            (
              siteidi character varying NOT NULL,
              regionidi character varying NOT NULL,
              siteidj character varying NOT NULL,
              regionidj character varying NOT NULL,
              distance double precision,
              CONSTRAINT sitedistance_key PRIMARY KEY (siteidi, regionidi,siteidj,regionidj)
            )"""
        print "Try to create Table: %s"%sql
        self.databaseAdapter.updateDB(sql)
        self.databaseAdapter.commitDB()        
        
        
    
    def insertdemandData(self):
        
        path = self.path
     
        tablename = "sitedemand"        

        filelist = []
        for filename in os.listdir( path ):
            if filename.startswith("car_demand") and filename.endswith(".csv"):
                filelist.append(filename)
        d = dict()
        for filename in filelist:
            query_sql = ""
            df = pd.read_csv(path+filename, delimiter=',', quotechar='|')
            
            siteid = ""
            print filename
            #m = re.match(r'car_demand_s(\d+)\.csv',filename)
         
            m = re.match(r'car_demand_prediction_s(\d+)\.csv',filename)
            id = 0
            if m:
                id =  m.group(1)
            siteid = "s0000"+str(id)            
            if int(id) >=10:
                siteid = "s000"+str(id)
            
                
            print siteid
            regionid="1"

            sql = "insert into %s (siteid,regionid,date,season,holiday,workingday,weather,temperature,humidity,windspeed,count,prediction) values"%(tablename)
            for index, row in df.iterrows(): 
             
#                 if  row['pred'] !=row['pred']:
#                     print "yyy"
                pred = -1
                if row['pred'] > -1:
                    pred = row['pred']
                
                key = siteid +"|"+regionid+"|"+row['datetime']
                if( d.has_key(key) ):
                    continue
                else:
                    d[key] = 1                     
                
                
                values="""('%s','%s','%s',%s,%s,%s,%s,%s,%s,%s,%s,%s)"""\
                 %(siteid,regionid,
                    row['datetime'],
                    row['season'],
                    row['holiday'],
                    row['workingday'],
                    row['weather'],
                    row['temp'],
                    row['humidity'],
                    row['windspeed'],
                    row['count'],
                    pred)
                sql = sql + values +","            
            sql = sql +";"     
            sql = re.sub(r'\,;$',';',sql)
            query_sql = sql  
           
#             print query_sql       
            try:
                self.databaseAdapter.updateDB(query_sql)
                self.databaseAdapter.commitDB()
                                               
            except Exception, e:
                print "sql: %s error: %s" %( query_sql , e.args[0])
        
        #update sitedemand as s set demand=floor(s.count/10)
        #update sitedemand as s set pred=floor(s.prediction/10)
        #update sitedemand as s set pred=s.prediction where s.prediction = -1
        #update sitedemand as s set supply =  floor(s.count/10) + floor(random()*20) - 10
    def genDemandSupply(self):        
        query_sql = "select siteid,regionid,date,count,prediction from sitedemand"
        tablename= "sitedemand"
        try:
            cur = self.databaseAdapter.queryCur
            cur.execute(query_sql)
            rows = cur.fetchall()
            for row in rows:
          
                siteid = row[0]
                region = row[1]
                date=row[2]
                count = row[3]
                prediction = row[4]
                           
                demand = int(count/10)
                pred=-1
                if prediction > -1: 
                    pred = int(prediction/10)
                #supply = max(0,demand + np.random.randint(-15,20))
                low = max(0,demand*0.5)
                high = max(demand*2,10)
                supply = max(0,np.random.randint(low,high))
                
                sql = """update "%s"  set demand = '%s',supply = '%s' , pred= '%s'                 
                 where siteid = '%s' and regionid ='%s' and date='%s' ;
                 """  % ( tablename, demand, supply, pred, siteid,region, date)

                #print sql
                self.databaseAdapter.updateDB(sql)
                self.databaseAdapter.commitDB()  
        except Exception, e:
            print "sql: %s error: %s" %( query_sql , e.args[0])
            
    def caldistance(self):
        query_sql = "select siteid,regionid,lat,lon from siteinfo"
        try:
            cur = self.databaseAdapter.queryCur
            cur.execute(query_sql)
            rows1 = cur.fetchall()
            
            for row1 in rows1:
          
                siteid1 = row1[0]
                regionid1 = row1[1]
                lat1 = row1[2]
                lon1 = row1[3]
                
                query_sql2 = "select siteid,regionid,lat,lon from siteinfo"
                cur2 = self.databaseAdapter.queryCur
                cur2.execute(query_sql2)
                rows2 = cur.fetchall()
                sql = "insert into sitedistance(siteidi,regionidi,siteidj,regionidj,distance) values "
                for row2 in rows2:
              
                    siteid2 = row2[0]
                    regionid2 = row2[1]
                    lat2 = row2[2]
                    lon2 = row2[3]
                    
                    
                    distance = 0
                    if siteid1 != siteid2 :
                        distance = MyLib.CalGPSDistance(lat1,lon1,lat2,lon2)                

                    #print (siteid1,lat1,lon1,siteid2,lat2,lon2,distance)
                    sql = sql + "('%s','%s','%s','%s',%s)," %(siteid1,regionid1,siteid2,regionid2,distance)
                sql = sql +";"
                #print sql
                sql = re.sub(r'\,;$',';',sql)     
          
                self.databaseAdapter.updateDB(sql)
                self.databaseAdapter.commitDB() 
               
        except Exception, e:
            print "sql: %s error: %s" %( query_sql , e.args[0])          
        
if __name__ == '__main__':
    dh = dataHandler()
#     dh.createTables()
#     dh.insertdemandData()
    dh.genDemandSupply()
   # dh.caldistance()