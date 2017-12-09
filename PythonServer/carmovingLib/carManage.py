'''
Created on Nov 4, 2017

@author: eliiyui
'''
import pandas as pd
import numpy as np
import os
from mylib import *
import scipy.stats as stats
import time
import matplotlib.pyplot as plt
from io import BytesIO
import base64
from matplotlib.dates import datestr2num
from database import DatabaseAdapter 
import json


class CarManage:
    def __init__(self):
        self.regionlist = list()
        self.path = 'C:\\local_data\\codecenter\\AVIS\\data\\'
        self.rst_df = pd.DataFrame()
        self.task_df = None
        self.info_df = None
    
    def initFromDB(self,datestr,db):
        tablename = "sitedemand"
        sql = """
           select d.siteid, d.regionid, 
                  si.lat,si.lon,si.priority as priority,
                  d.supply as storage,d.demand as required
           from %s as d, siteinfo as si 
           where date='%s'
           and d.siteid=si.siteid
           and d.regionid=si.regionid;
          """% ( tablename,datestr)
#         print (sql)
        
        self.info_df=pd.read_sql(sql,db.conn())
        self.info_df["gap"] = 0
        self.info_df["gap"] = self.info_df['storage']-self.info_df['required']
        self.info_df["in"] = 0
        self.info_df["out"] = 0     
        self.info_df["state"] = 0
#         print self.info_df
        self.initdistanceFromDB(db)
    def initFromFile(self,filename):

        self.info_df =  pd.read_csv(self.path+filename, delimiter=',', quotechar='|')
        self.info_df["gap"] = self.info_df['storage']-self.info_df['required']
        self.info_df["in"] = 0
        self.info_df["out"] = 0
     
        self.info_df["state"] = 0  # 0 means not start
    
#         print self.info_df
    def initdistanceData(self,filename = "distance.csv"):
        if os.path.exists(self.path+filename) :       
            self.distance_df =  pd.read_csv(self.path+filename, delimiter=',', quotechar='|')
            
        else:
            self.distance_df = self.calDistance()
           
#         print self.distance_df
    def initdistanceFromDB(self,db):
        tablename = "sitedistance"
        sql = """
           select siteidi, siteidj,distance
           from %s           
          """% ( tablename)
        
        self.distance_df=pd.read_sql(sql,db.conn())
    def calDistance(self):
        row = self.info_df.shape[0]
        distance_df = pd.DataFrame(index=range(0,row*row),columns=('siteidi','siteidj','distance'))

      
        newrow = 0
        for i in range(row):
            datai = self.info_df.loc[i]
            for j in range(row):
                dataj = self.info_df.loc[j]
                if i == j :
                    distance = 0
                else:
                    distance = MyLib.CalGPSDistance(datai['lat'],datai['lon'],dataj['lat'],dataj['lon'])                
#                 print [datai['siteid'] , dataj['siteid'], distance]
                distance_df.loc[newrow,:] = [datai['siteid'] , dataj['siteid'], distance]
                newrow = newrow+1

        distance_df.to_csv(self.path+"distance.csv", index = False)
        return distance_df
    
    def feedFun(self, algo = 'random4',loopcnt=100):
   
        starttime = time.time()
        surplus = np.sum(self.info_df.loc[self.info_df.gap>=0,['gap']].values)
        short = np.sum(self.info_df.loc[self.info_df.gap<0,['gap']].values)
        gaptotal = np.sum(self.info_df['gap'].values)
        
        self.rst_df = self.distance_df
        self.rst_cnt = 0

#         print  surplus,short,gaptotal
   
        surplus_df =  self.info_df.loc[self.info_df.gap>=0]
        short_df = self.info_df.loc[self.info_df.gap<0]
        
        print "used algorithm %s"%algo
        if algo == 'distancefirst':
            result_df = self.feedbyDistanceFirst(surplus_df,short_df,circle=0.1)
        elif algo == 'distancefirst_circle':
            result_df = self.feedbyDistanceFirst(surplus_df,short_df,circle=30)        
        elif algo == 'priority':
            result_df = self.feedbyPriority(surplus_df,short_df)
        elif algo == 'random1':
            result_df = self.feedbyRandom1(surplus_df,short_df,loopnumber=loopcnt)
        elif algo == 'random2':
            result_df = self.feedbyRandom2(surplus_df,short_df,loopnumber=loopcnt)
        elif algo == 'random3':
            result_df = self.feedbyRandom3(surplus_df,short_df,loopnumber=loopcnt)
        elif algo == 'random4':
            result_df = self.feedbyRandom4(surplus_df,short_df,loopnumber=loopcnt)

        print "timecost %s" %(time.time()-starttime)
        #self.display(result_df,surplus_df,short_df)
        
        self.task_df = result_df[result_df.i2j>0].copy()
        self.evaluateFunction(result_df,short_df,surplus_df)
        
        return self.genTasksImgBase64(result_df,surplus_df,short_df)
        
    
    def feedbyDistanceFirst(self,surplus_df,short_df,circle=50):
        
        result_df = self.distance_df
        result_df['i2j'] = 0
        result_df['i2j_best'] = 0
        
        siteilist = surplus_df['siteid'].values
        sitejlist = short_df['siteid'].values
            
        poolingdf = result_df.loc[( result_df.distance < circle) &\
                                ( result_df.siteidj.isin(sitejlist))&\
                                ( result_df.siteidi.isin(siteilist))]            
        poolingdf = poolingdf.sort_values(by=['distance'],ascending=[True])    

#         print "siteilist %s" %len(siteilist)
#         print siteilist
#         print surplus_df.loc[surplus_df.gap>0]['gap'].values
#         print "sitejlist %s" %len(sitejlist)
#         print sitejlist
#        print "pooling size is %s"%poolingdf.shape[0]
#         print poolingdf
        for index, poolingrow in poolingdf.iterrows(): 
            
            
            
            sitei = poolingrow['siteidi']
            sitej = poolingrow['siteidj']               
            
            canOffer = surplus_df[surplus_df.siteid== sitei]['gap'].values[0]
            need = -short_df[short_df.siteid == sitej]['gap'].values[0]
            
#             print need,canOffer
            if need > 0 and canOffer >= need:
               
                feed = min(canOffer,need)
                print sitei,sitej,canOffer,need
                result_df.loc[(result_df.siteidi == sitei) & (result_df.siteidj == sitej),['i2j']] = feed
               
                surplus_df.loc[(surplus_df.siteid== sitei),['gap']] -= feed
                surplus_df.loc[(surplus_df.siteid== sitei),['out']] += feed
                surplus_df.loc[(surplus_df.siteid== sitei),['state']] -= 1

                short_df.loc[(short_df.siteid== sitej),['in']] += feed
                short_df.loc[(short_df.siteid== sitej),['gap']] += feed
                short_df.loc[(short_df.siteid== sitej),['state']] += 1 
               
            #if the car cannot moving from one site get it from different sites
#         print "========================================================"   
        siteilist = surplus_df.loc[surplus_df.gap>0]['siteid'].values             
        sitejlist = short_df.loc[short_df.gap<0]['siteid'].values
       
        poolingdf = result_df.loc[( result_df.siteidj.isin(sitejlist))& (result_df.siteidi.isin(siteilist))]            
        poolingdf = poolingdf.sort_values(by=['distance'],ascending=[True])    
        
#         print "siteilist %s" %len(siteilist)
#         print siteilist
#         print surplus_df.loc[surplus_df.gap>0]['gap'].values
#         print "sitejlist %s" %len(sitejlist)
#         print sitejlist
#         print "pooling size is %s"% poolingdf.shape[0]
#         print poolingdf
            
        for index, poolingrow in poolingdf.iterrows(): 
            sitei = poolingrow['siteidi']
            sitej = poolingrow['siteidj']    
                
            canOffer = surplus_df[surplus_df.siteid== sitei]['gap'].values[0]
            need = -short_df[short_df.siteid == sitej]['gap'].values[0]
           
            if need <= 0:                        
                continue
            if canOffer <= 0:
                continue

            
            feed = min(canOffer,need)           
            result_df.loc[(result_df.siteidi == sitei) & (result_df.siteidj == sitej),['i2j']] = feed
               
            surplus_df.loc[(surplus_df.siteid== sitei),['gap']] -= feed
            surplus_df.loc[(surplus_df.siteid== sitei),['out']] += feed
            surplus_df.loc[(surplus_df.siteid== sitei),['state']] -= 1 
               
            short_df.loc[(short_df.siteid== sitej),['gap']] += feed
            short_df.loc[(short_df.siteid== sitej),['in']] += feed                     
            short_df.loc[(short_df.siteid== sitej),['state']] += 1                     
    
                           
         
        
        result_df['i2j_best'] = result_df['i2j']
        print result_df[result_df.i2j>0]
        self.evaluateFunction(result_df,short_df,surplus_df)

#       
#         newstatedf = pd.concat([surplus_df,short_df])
#         newstatedf.to_csv(self.path+"feedbyDistanceFirst.csv", index = False)
#         
#         result_df[result_df.i2j>0].to_csv(self.path+"movingplan.csv", index = False)
#      
#         cost = self.CostFunction(result_df)
#         sat1 = self.Satisfaction(short_df)
#         sat2 = self.Satisfaction(surplus_df)
#         print "cost:%s,satisfaction short,surplus:%s,%s" %(cost,sat1,sat2)
        return result_df  
    
   
        
    def feedbyPriority(self,surplus_df,short_df):      
        result_df = self.distance_df
        result_df['i2j'] = 0
        result_df['i2j_best'] = 0
        

        surplus_df['hungryweight'] = surplus_df['priority'].values * surplus_df['gap'].values
        short_df['hungryweight'] = short_df['priority'].values * short_df['gap'].values
        short_df = short_df.sort_values(by=['priority','hungryweight'],ascending=[False,True])
        
        shortlist = short_df['siteid'].values         
        
        for shortid in shortlist:
            
            shortrow = short_df[short_df.siteid == shortid]
            
            myPriority = shortrow['priority'].values[0]
            
            prioritylist = short_df[short_df.priority == myPriority]['siteid'].values
            
            surpluslist = surplus_df[surplus_df.gap > 0 ]['siteid'].values
             
            poolingdf = result_df.loc[ ( result_df.siteidj.isin(prioritylist) )&\
                                       ( result_df.siteidi.isin(surpluslist)  ) ]

            
            poolingdf = poolingdf.sort_values(by=['distance'],ascending=[True])    

            print "pooling size is %s"%poolingdf.shape[0]

            for index, poolingrow in poolingdf.iterrows(): 
                sitei = poolingrow['siteidi']
                sitej = poolingrow['siteidj']
                
 
             
                canOffer = surplus_df[surplus_df.siteid== sitei]['gap'].values[0]
                need = -short_df[short_df.siteid == sitej]['gap'].values[0]
  
             
                if need <= 0:                        
                   continue
                if canOffer <= 0:
                   continue
     
                 
                feed = min(canOffer,need)           
                result_df.loc[(result_df.siteidi == sitei) & (result_df.siteidj == sitej),['i2j']] = feed
                    
                surplus_df.loc[(surplus_df.siteid== sitei),['gap']] -= feed
                surplus_df.loc[(surplus_df.siteid== sitei),['out']] += feed
                surplus_df.loc[(surplus_df.siteid== sitei),['state']] -= 1 
                    
                short_df.loc[(short_df.siteid== sitej),['gap']] += feed
                short_df.loc[(short_df.siteid== sitej),['in']] += feed                     
                short_df.loc[(short_df.siteid== sitej),['state']] += 1                     
     
                            
        result_df['i2j_best'] = result_df['i2j']
        print result_df[result_df.i2j>0]
                
#         newstatedf = pd.concat([surplus_df,short_df])
#         newstatedf.to_csv(self.path+"feedbyPriority.csv", index = False)
#       
#         cost = self.CostFunction(result_df)
#         sat1 = self.Satisfaction(short_df)
#         sat2 = self.Satisfaction(surplus_df)
#         print "cost:%s,satisfaction short,surplus:%s,%s" %(cost,sat1,sat2)
        return result_df  
    
    def feedbyRandom1(self,surplus_df,short_df,loopnumber=100):
              
        result_df = self.distance_df
        result_df['i2j'] = 0
             
        result_df['i2j_best'] = 0

        surplus_df['hungryweight'] = surplus_df['priority'].values * surplus_df['gap'].values
        
        #sort the short list by priority * gap
        short_df['hungryweight'] = short_df['priority'].values * short_df['gap'].values
        short_df = short_df.sort_values(by=['priority','hungryweight'],ascending=[False,True])
        
         
        surpluslist = surplus_df['siteid'].values
        
        totalstock =  np.sum(short_df['gap'].values) + np.sum(surplus_df['gap'].values)
        
        Maxcnt = loopnumber
        loopcnt = 0
        
        bestSat = 0
        lowestcost = 10000000000000.0
        costlist = list()
        
        
        while loopcnt < Maxcnt:
            short_df['newgap']=  short_df['gap']
            surplus_df['newgap']=  surplus_df['gap']
            result_df['i2j'] = 0    
            done=0        
            shortsize = short_df[short_df.newgap < 0 ].shape[0] 
            surplussize = surplus_df[surplus_df.newgap > 0 ].shape[0]
            
#             print "ss %s, st %s" %(shortsize,surplussize) 

            while done == 0:
                
                shortsize = short_df[short_df.newgap < 0 ].shape[0]                
                shortlist = short_df[short_df.newgap < 0 ]['siteid'].values 
                surpluslist = surplus_df[surplus_df.newgap > 0 ]['siteid'].values
                surplussize = surplus_df[surplus_df.newgap > 0 ].shape[0]    
                
                if shortsize == 0 or surplussize == 0:
                    done = 1
                    break
#                           
                idxj = np.random.randint(0, shortsize)                
                sitej =  shortlist[idxj]
                
                besti = -1
                bestfeed= -1
                minWeight = 1000000000.0
                
                sub_df = result_df.loc[ ( result_df.siteidj==sitej )&\
                                        ( result_df.siteidi.isin(surpluslist)  ) ]
                for sitei in surpluslist:            
                    canOffer = surplus_df[surplus_df.siteid== sitei]['newgap'].values[0]
                    need = -short_df[short_df.siteid == sitej]['newgap'].values[0]
                    
                    feed = min(canOffer,need)
                    
                    weight = feed * sub_df[(sub_df.siteidi==sitei) & (sub_df.siteidj==sitej)]['distance'].values[0]
                    if weight < minWeight:
                        minWeight = weight
                        besti = sitei
                        bestfeed = feed
                
                sitei = besti
                feed = bestfeed
                
                result_df.loc[(result_df.siteidi == sitei) & (result_df.siteidj == sitej),['i2j']] += feed
                surplus_df.loc[(surplus_df.siteid== sitei),['newgap']] -= feed                      
                short_df.loc[(short_df.siteid== sitej),['newgap']] += feed
                
                newcost = np.sum(result_df['distance'].values*result_df['i2j'].values)
                if newcost > lowestcost:
                    break
            
            cost = self.CostFunction(result_df)           
            if done == 1 and cost > 0 and  cost  <   lowestcost:
                lowestcost = cost
                costlist.append(cost)
                result_df['i2j_best'] = result_df['i2j']
                
            #print result_df[result_df.i2j_best >0]
            print "loop cnt :%s done: %s lowestcost %s cost %s" %(loopcnt,done,lowestcost,cost)                     
            loopcnt = loopcnt + 1
             
               
        print result_df[result_df.i2j_best >0]

        result_df['i2j'] = result_df['i2j_best']
#         self.evaluateFunction(result_df,short_df,surplus_df)
       
        return result_df
    


    def feedbyRandom2(self,surplus_df,short_df,loopnumber=100):
              
        result_df = self.distance_df
        result_df['i2j'] = 0
         
        result_df['i2j_best'] = 0

        surplus_df['hungryweight'] = surplus_df['priority'].values * surplus_df['gap'].values
        
        #sort the short list by priority * gap
        short_df['hungryweight'] = short_df['priority'].values * short_df['gap'].values
        short_df = short_df.sort_values(by=['priority','hungryweight'],ascending=[False,True])
        
         
        surpluslist = surplus_df['siteid'].values
        
        totalstock =  np.sum(short_df['gap'].values) + np.sum(surplus_df['gap'].values)
        
        Maxcnt = loopnumber
        loopcnt = 0
        
        bestSat = 0
        lowestcost = 10000000000000.0
        costlist = list()
        
        
        while loopcnt < Maxcnt:
            short_df['newgap']=  short_df['gap']
            surplus_df['newgap']=  surplus_df['gap']
            result_df['i2j'] = 0    
            done=0        
            shortsize = short_df[short_df.newgap < 0 ].shape[0] 
            surplussize = surplus_df[surplus_df.newgap > 0 ].shape[0]
            
#             print "ss %s, st %s" %(shortsize,surplussize) 

            while done == 0:
                
                shortsize = short_df[short_df.newgap < 0 ].shape[0]                
                shortlist = short_df[short_df.newgap < 0 ]['siteid'].values 
                surpluslist = surplus_df[surplus_df.newgap > 0 ]['siteid'].values
                surplussize = surplus_df[surplus_df.newgap > 0 ].shape[0]    
                
                if shortsize == 0 or surplussize == 0:
                    done = 1
                    break
                
                idxi = np.random.randint(0, surplussize)                
                sitei =  surpluslist[idxi]
#                           
                idxj = np.random.randint(0, shortsize)                
                sitej =  shortlist[idxj]

                canOffer = surplus_df[surplus_df.siteid== sitei]['newgap'].values[0]
                need = -short_df[short_df.siteid == sitej]['newgap'].values[0]                 
                feed = min(canOffer,need)
              

                result_df.loc[(result_df.siteidi == sitei) & (result_df.siteidj == sitej),['i2j']] += feed
                surplus_df.loc[(surplus_df.siteid== sitei),['newgap']] -= feed                      
                short_df.loc[(short_df.siteid== sitej),['newgap']] += feed
                
                newcost = np.sum(result_df['distance'].values*result_df['i2j'].values)
                if newcost > lowestcost:
                    break
            
            cost = self.CostFunction(result_df)           
            if done == 1 and cost > 0 and  cost  <   lowestcost:
                lowestcost = cost
                costlist.append(cost)
                result_df['i2j_best'] = result_df['i2j']
                
            #print result_df[result_df.i2j_best >0]
            print "loop cnt :%s done: %s lowestcost %s cost %s" %(loopcnt,done,lowestcost,cost)                     
            loopcnt = loopcnt + 1
             
        result_df['i2j'] = result_df['i2j_best']              
        print result_df[result_df.i2j_best >0]
        print costlist
        
        
#         self.evaluateFunction(result_df,short_df,surplus_df)   
           
        return result_df



    def feedbyRandom3(self,surplus_df,short_df,loopnumber=100):
              
        result_df = self.distance_df
        result_df['i2j'] = 0
         
        result_df['i2j_best'] = 0

        surplus_df['hungryweight'] = surplus_df['priority'].values * surplus_df['gap'].values
        
        #sort the short list by priority * gap
        short_df['hungryweight'] = short_df['priority'].values * short_df['gap'].values
        short_df = short_df.sort_values(by=['priority','hungryweight'],ascending=[False,True])
        
         
        surpluslist = surplus_df['siteid'].values
        
        
        Maxcnt = loopnumber
        loopcnt = 0
        

        lowestcost = 10000000000000.0
        costlist = list()
        
        
        while loopcnt < Maxcnt:
            short_df['newgap']=  short_df['gap']
            surplus_df['newgap']=  surplus_df['gap']
            result_df['i2j'] = 0    
            done=0        
            shortsize = short_df[short_df.newgap < 0 ].shape[0] 
            surplussize = surplus_df[surplus_df.newgap > 0 ].shape[0]
            
#             print "ss %s, st %s" %(shortsize,surplussize) 

            while done == 0:
                
                shortsize = short_df[short_df.newgap < 0 ].shape[0]                
                shortlist = short_df[short_df.newgap < 0 ]['siteid'].values 
                surpluslist = surplus_df[surplus_df.newgap > 0 ]['siteid'].values
                surplussize = surplus_df[surplus_df.newgap > 0 ].shape[0]
                
                idxi = np.random.randint(0, surplussize)                
                sitei =  surpluslist[idxi]
#                           
#                 idxj = np.random.randint(0, shortsize)                
#                 sitej =  shortlist[idxj]

            
                
                
                if shortsize == 0 or surplussize == 0:
                    done = 1
                    break
                
                
                poolingdf = result_df.loc[ ( result_df.siteidj.isin(shortlist) )&\
                                           ( result_df.siteidi==sitei  ) ]
#                 poolingdf = result_df.loc[ ( result_df.siteidj.isin(shortlist) )&\
#                                            ( result_df.siteidi.isin(shortlist)  ) ]                
                poolingdf['weight'] = -1
                maxweight = 0
                
                
                bestsitei = ''
                bestsitej = ''
                for index, poolingrow in poolingdf.iterrows(): 
                    sitei = poolingrow['siteidi']
                    sitej = poolingrow['siteidj']
                            
 

                    canOffer = surplus_df[surplus_df.siteid== sitei]['newgap'].values[0]
                    need = -short_df[short_df.siteid == sitej]['newgap'].values[0]                 
                    feed = min(canOffer,need)
                    
                    distance = poolingrow['distance']+0.000001
                    poolingrow['weight'] = feed/distance
                    
                    if maxweight < poolingrow['weight'] :
                         maxweight = poolingrow['weight']
                         bestsitei = sitei
                         bestsitej = sitej
                        # print maxweight,sitei,sitej
              
                sitei = bestsitei
                sitej = bestsitej
                
                result_df.loc[(result_df.siteidi == sitei) & (result_df.siteidj == sitej),['i2j']] += feed
                surplus_df.loc[(surplus_df.siteid== sitei),['newgap']] -= feed                      
                short_df.loc[(short_df.siteid== sitej),['newgap']] += feed
                
                newcost = np.sum(result_df['distance'].values*result_df['i2j'].values)
                if newcost > lowestcost:
                    break
            
            cost = self.CostFunction(result_df)           
            if done == 1 and cost > 0 and  cost  <   lowestcost:
                lowestcost = cost
                costlist.append(cost)
                result_df['i2j_best'] = result_df['i2j']
                
            #print result_df[result_df.i2j_best >0]
            print "loop cnt :%s done: %s lowestcost %s cost %s" %(loopcnt,done,lowestcost,cost)                     
            loopcnt = loopcnt + 1
             
       
        result_df['i2j'] = result_df['i2j_best']        
        print result_df[result_df.i2j_best >0]
        print costlist
#         self.evaluateFunction(result_df,short_df,surplus_df)    
           
        return result_df
    
    
    def feedbyRandom4(self,surplus_df,short_df,loopnumber=100):
              
        result_df = self.distance_df
        result_df['i2j'] = 0
         
        result_df['i2j_best'] = 0
        surpluslist = surplus_df['siteid'].values
        
       
        Maxcnt = loopnumber
        loopcnt = 0
        

        lowestcost = 10000000000000.0
        costlist = list()
        
        
        while loopcnt < Maxcnt:
            short_df['newgap']=  short_df['gap']
            surplus_df['newgap']=  surplus_df['gap']
            result_df['i2j'] = 0  
              
            done=0        
 
            while done == 0:
                
                shortsize = short_df[short_df.newgap < 0 ].shape[0]                
                shortlist = short_df[short_df.newgap < 0 ]['siteid'].values 
                surpluslist = surplus_df[surplus_df.newgap > 0 ]['siteid'].values
                surplussize = surplus_df[surplus_df.newgap > 0 ].shape[0]
             
              
                if shortsize == 0 or surplussize == 0:
                    done = 1
                    break

                poolingdf = result_df.loc[ ( result_df.siteidj.isin(shortlist) )&\
                                           ( result_df.siteidi.isin(surpluslist)  ) ]                

                
                siteilist= list()
                sitejlist = list()
                weightlist = list()
                distancelist = list()
                feedlist = list()
                for index, poolingrow in poolingdf.iterrows(): 
                    sitei = poolingrow['siteidi']
                    sitej = poolingrow['siteidj']     
                    if sitei == sitej: # 
                        continue  

                    canOffer = surplus_df[surplus_df.siteid== sitei]['newgap'].values[0]
                    need = -short_df[short_df.siteid == sitej]['newgap'].values[0]                 
                    feed = min(canOffer,need)
                    
                    distance = poolingrow['distance']
                    
                    
                    siteilist.append(sitei)
                    sitejlist.append(sitej)
                    distancelist.append(distance)                    
                    feedlist.append(feed)
              
                r = self.SelectionRandom(siteilist, sitejlist, distancelist,feedlist)
                sitei = siteilist[r]
                sitej = sitejlist[r]
                feed = feedlist[r]
                
#                 print sitei,sitej
                
                result_df.loc[(result_df.siteidi == sitei) & (result_df.siteidj == sitej),['i2j']] += feed
                surplus_df.loc[(surplus_df.siteid== sitei),['newgap']] -= feed                      
                short_df.loc[(short_df.siteid== sitej),['newgap']] += feed
                
                newcost = np.sum(result_df['distance'].values*result_df['i2j'].values)
                if newcost > lowestcost:
                    break
            
            cost = self.CostFunction(result_df)           
            if done == 1 and cost > 0 and  cost  <   lowestcost:
                lowestcost = cost
                costlist.append(cost)
                result_df['i2j_best'] = result_df['i2j']
                
            #print result_df[result_df.i2j_best >0]
            print "loop cnt :%s done: %s lowestcost %s cost %s" %(loopcnt,done,lowestcost,cost)                     
            loopcnt = loopcnt + 1
             
        
        result_df['i2j'] = result_df['i2j_best']
             
        print result_df[result_df.i2j_best >0]
        print costlist
#         self.evaluateFunction(result_df,short_df,surplus_df)
        
        return result_df
    
    def SelectionRandom(self,siteilist, sitejlist, distancelist,feedlist):
        
        weightlist = ( np.array(feedlist) / ( np.array(distancelist) + 0.00000001)** 3 )         
        sumweight = np.sum(weightlist)
        cdflist = np.cumsum(weightlist)/sumweight
      
        p = np.random.random()
        
        r = 0
        for c in cdflist:
            if c > p:
                break
            r = r + 1
        return r      
    
    def crossOver(self):
        return 

    def CostFunction(self,result_df):
        cost = 0.0
        cost = np.sum(result_df['distance'].values*result_df['i2j'].values)        
        
        return cost
    
    def evaluateFunction(self,result_df,short_df,surplus_df):  
        cost = self.CostFunction(result_df)
        
        rstdf = result_df[result_df.i2j_best >0]
        row = rstdf.shape[0]

        for idx,row in rstdf.iterrows():
            sitei = row['siteidi']            
            sitej = row['siteidj']            
            
            short_df.loc[(short_df.siteid==sitej),['gap']] +=  row['i2j']
            short_df.loc[(short_df.siteid==sitej),['in']] +=  row['i2j']
            short_df.loc[(short_df.siteid==sitej),['state']] += 1
            
             
            surplus_df.loc[(surplus_df.siteid==sitei),['gap']] -=  row['i2j']       
            surplus_df.loc[(surplus_df.siteid==sitei),['out']] -=  row['i2j']     
            surplus_df.loc[(surplus_df.siteid== sitei),['state']] -= 1
        
        sat1 = self.Satisfaction(short_df)
        sat2 = self.Satisfaction(surplus_df)

        rstdf.to_csv(self.path+"movingplan.csv", index = False)

        print "cost:%s,satisfaction short,surplus:%s,%s" %(cost,sat1,sat2)  
    def Satisfaction(self,df):
        sat = np.sum(df['priority'].values * df['gap'].values)        
        return sat
    
        
    def display(self,result_df,surplus_df,short_df,packagesize =  12):        
        
        asize = packagesize
        plt.figure('init state')

                
        
        lon = surplus_df['lon']
        lat = surplus_df['lat']
        text =surplus_df['storage'].values -surplus_df['required']
       
        area = np.pi * (surplus_df['storage'].values -surplus_df['required'].values )**2 /asize
         
        plt.scatter(lon, lat, s=area, alpha=0.5, color='green')        
        for x,y,t in zip(lon,lat,text):
            plt.text(x+0.01, y-0.01, t, ha='center', va= 'bottom')
        

        lon = short_df['lon']
        lat = short_df['lat']
        text =short_df['storage'].values -short_df['required']

        area =  np.pi * (short_df['required'].values - short_df['storage'].values )**2 /asize        
        plt.scatter(lon, lat, s=area, alpha=0.5, color='red' )      
           
        for x,y,t in zip(lon,lat,text):
            plt.text(x+0.01, y-0.01, t, ha='center', va= 'bottom')           
         
        
        plt.xlabel('longitude')
        plt.ylabel('latitude')
       
        ####################################
    
        plt.figure('car moving')
        df = result_df[result_df.i2j>0]
        
        for row in range(df.shape[0]):
             
            i2j =   df.iloc[row]['i2j']
            sitei = df.iloc[row]['siteidi']    
            sitej = df.iloc[row]['siteidj']
            lati = surplus_df.loc[surplus_df.siteid == sitei]['lat'].values[0]
            loni = surplus_df.loc[surplus_df.siteid == sitei]['lon'].values[0]
             
            latj = short_df.loc[short_df.siteid == sitej]['lat'].values[0]
            lonj = short_df.loc[short_df.siteid == sitej]['lon'].values[0]
            
            ax = plt.axes()

           # plt.plot(pointlon,pointlat,'-',linewidth = width,color = 'black')
            plt.text((loni+lonj)/2, (lati+latj)/2, i2j, ha='center', va= 'bottom')
            plt.annotate('',xy=(lonj, latj), xytext=(loni, lati), arrowprops=dict(arrowstyle='->',facecolor='black'))
           
        
        
        lon = surplus_df['lon']
        lat = surplus_df['lat']
        text =surplus_df['siteid']
       
        area = np.pi * (surplus_df['storage'].values -surplus_df['required'].values )**2 /asize
         
        plt.scatter(lon, lat, s=area, alpha=0.5, color='green')
        lon = short_df['lon']
        lat = short_df['lat']
        text =short_df['siteid']
        

        area =  np.pi * (short_df['required'].values - short_df['storage'].values )**2 /asize
         
        plt.scatter(lon, lat, s=area, alpha=0.5, color='red' )        
   
        plt.xlabel('longitude')
        plt.ylabel('latitude')                    
            
        plt.show()

    def genTasksDict(self,img=""):
        
        df = self.task_df
#         arr = []
#         result = {}
        rj=dict()
        rj['result']="success"
        
        task=list()
        for i in range(df.shape[0]):
            d = dict(df.iloc[i])
            task.append(d)
#             print d
#             taskstr = taskstr + \
#             """{ "siteidi":"%s",
#                  "siteidj":"%s",
#                  "distance":"%s",
#                  "i2j":"%s"},
#                  """%(df.iloc[i]['siteidi'],\
#                       df.iloc[i]['siteidj'],\
#                       df.iloc[i]['distance'],\
#                       df.iloc[i]['i2j']  )
        rj['task']=task
        rj['img']=img
        return rj

    def genTasksImgBase64(self,result_df,surplus_df,short_df,packagesize =  12):        
        
        asize = packagesize
       
        ####################################
    
        plt.figure('car moving')
        df = result_df[result_df.i2j>0]
        
        for row in range(df.shape[0]):
             
            i2j =   df.iloc[row]['i2j']
            sitei = df.iloc[row]['siteidi']    
            sitej = df.iloc[row]['siteidj']
            lati = surplus_df.loc[surplus_df.siteid == sitei]['lat'].values[0]
            loni = surplus_df.loc[surplus_df.siteid == sitei]['lon'].values[0]
             
            latj = short_df.loc[short_df.siteid == sitej]['lat'].values[0]
            lonj = short_df.loc[short_df.siteid == sitej]['lon'].values[0]
            
            ax = plt.axes()

           # plt.plot(pointlon,pointlat,'-',linewidth = width,color = 'black')
            plt.text((loni+lonj)/2, (lati+latj)/2, i2j, ha='center', va= 'bottom')
            plt.annotate('',xy=(lonj, latj), xytext=(loni, lati), arrowprops=dict(arrowstyle='->',facecolor='black'))
           
        
        
        lon = surplus_df['lon']
        lat = surplus_df['lat']
        text =surplus_df['siteid']
       
        area = np.pi * (surplus_df['storage'].values -surplus_df['required'].values )**2 /asize
         
        plt.scatter(lon, lat, s=area, alpha=0.5, color='green')
        lon = short_df['lon']
        lat = short_df['lat']
        text =short_df['siteid']
        

        area =  np.pi * (short_df['required'].values - short_df['storage'].values )**2 /asize
         
        plt.scatter(lon, lat, s=area, alpha=0.5, color='red' )        
   
        plt.xlabel('longitude')
        plt.ylabel('latitude')
                    
            
        #plt.show()
        #plt.savefig(self.path+'img'+'.jpg')
        figfile = BytesIO()
        plt.savefig(figfile, format='png')
        figfile.seek(0)  # rewind to beginning of file
         
         #figdata_png = base64.b64encode(figfile.read())
        figdata_png = base64.b64encode(figfile.getvalue())
        
        #print figdata_png 
        return figdata_png
    
    def callbyHTTPServer(self,datestr,algo='distancefirst',loop=10):
        db =DatabaseAdapter('avis')
        self.initFromDB(datestr,db)
        myalgo = 'distancefirst'
        
        if algo == 'random4':    
            myalgo = 'random4'
        
        imgstr = self.feedFun(algo = myalgo , loopcnt=loop)
        
        
        result= self.genTasksDict(imgstr)
        return result  
    
 
if __name__ == "__main__": 
    cm = CarManage()     
    ##call by local
#    cm.initFromFile("test_short.csv")
#    cm.initFromFile("test_sufficent.csv")
#    cm.initFromFile("test_paris.csv")
#     cm.initdistanceData()
    ### call by remote
    db =DatabaseAdapter('avis')
    cm.initFromDB("2017-12-30",db)    
    imgstr = cm.feedFun(algo = 'random4',loopcnt=5)
    cm.genTasksDict(imgstr)
    
    

    
    
