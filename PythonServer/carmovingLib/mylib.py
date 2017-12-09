'''
Created on Jun 13, 2017

@author: eliiyui
'''
import math
import pandas as pd
import numpy as np
class MyLib(object):
    def __init__(self):
        return
    
    @staticmethod    
    def CalGPSDistance(lati1,longti1,lati2,longti2):   
        EARTH_RADIUS = 6378.137
        lati1 = math.radians(lati1)
        lati2 = math.radians(lati2)
        longti1 = math.radians(longti1)
        longti2 = math.radians(longti2)
                  

        latiDelta  = lati1 - lati2
        longiDelta = longti1 - longti2

        dis = 2 * math.asin( math.sqrt(pow(math.sin(latiDelta/2),2) +\
        math.cos(lati1)*math.cos(lati2)*pow(math.sin(longiDelta/2),2)))
        dis = dis * EARTH_RADIUS
        return dis
    
    @staticmethod
    def calPercentile(valuelist,value):
        
        if len(valuelist) is 0:
            return -1
        newlist = np.sort(valuelist)
        cnt = 0
        for i in newlist:
            
            if float(i) >  value:
                break
            cnt += 1.0
        #print cnt/len(valuelist)
        
        return cnt/len(valuelist)
        
    
    @staticmethod  
    def checkNull(a = list()):
        l = list(a)
        #print l
        nullCnt = 0
        for i in l:
            #print type(i)
            if pd.isnull(i):
                nullCnt += 1
            #if type(i) is not str:
            #    if math.isnan(float(i)):
            #        #print type(i)                
            #        nullCnt += 1
        
        return nullCnt

