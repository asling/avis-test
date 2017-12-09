'''
Created on Dec 8, 2017

@author: eliiyui
'''
from database import DatabaseAdapter 
import pandas as pd
class HTTPServerFunctions(object):
    def __init__(self,databasename):
        self.databaseAdapter = DatabaseAdapter(databasename)
        #self.path = "C:\\local_data\\codecenter\\AVIS\\data\\car demand data\\"
    
    def _getSiteinfo(self,city):
        
        query_sql = """select siteid,sitename,regionid,lat,lon from siteinfo where regionname='%s'""" %city
        df=pd.read_sql(query_sql,self.databaseAdapter.conn())

        rj=dict()
        
        rj['result']="success"
        if df.shape[0] < 1:
            rj['result']="fail"
            
        task=list()
        for i in range(df.shape[0]):
            d = dict(df.iloc[i])
            task.append(d)
        rj['siteinfo']=task
        return rj  
    
    def _getSupplyDemand(self,siteid,regionid,startdate,enddate):
        query_sql = """select * from sitedemand where siteid='%s' and regionid='%s' and date >='%s' and date<='%s' """ %(siteid,regionid,startdate,enddate)
        df=pd.read_sql(query_sql,self.databaseAdapter.conn())

        rj=dict()
        rj['result']="success"
        if df.shape[0] < 1:
            rj['result']="fail"
        task=list()
        for i in range(df.shape[0]):
            d = dict(df.iloc[i])
            task.append(d)
        rj['supplydemand']=task
        return rj    
        
    def _getdemandWeather(self,siteid,regionid,startdate,enddate):
 #       query_sql = """select * from sitedemand where siteid='%s' and regionid='%s' and date >='%s' and date<='%s' """ %(siteid,regionid,startdate,enddate)

        
        query_sql = """select avg(demand),floor(temperature/10) as temp, weather from sitedemand where siteid='%s' 
        and regionid='%s' and date >='%s' and date<='%s' group by floor(temperature/10),weather""" %(siteid,regionid,startdate,enddate)
  
        df=pd.read_sql(query_sql,self.databaseAdapter.conn())

        rj=dict()
        rj['result']="success"
        if df.shape[0] < 1:
            rj['result']="fail"
        task=list()
        for i in range(df.shape[0]):
            d = dict(df.iloc[i])
            task.append(d)
        rj['demandweather']=task
        return rj             
