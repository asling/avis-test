'''
Created on Dec 5, 2017

@author: eliiyui
'''
from flask import Flask
from flask import request
from carManage import CarManage
from HTTPServerFunctions import HTTPServerFunctions
from flask_cors import CORS, cross_origin
import re
app = Flask(__name__)
CORS(app)

import json

##for init value###
fun=HTTPServerFunctions('avis')
# siteid='s00001'
# regionid=1
# startdate='2017-11-01'
# enddate='2017-11-30'


@app.route("/")
def hello():
    return "Hello World!"

##/solution/date/2017-10-31/type/1
@app.route("/solution/date/<string:date>/type/<int:type>", methods=["GET"])
def solution(date,type):
    print "date:%s type:%s" %(date,type)
    if type==1:
        algo="distancefirst"
    else:
        algo="random4"
    cm = CarManage()
    rst=cm.callbyHTTPServer(date,algo,10)

    return str(rst)
#/sitesmap/?city=Paris
@app.route("/sitesmap/", methods=["GET"])
def getsiteinfo():
    qs = request.query_string
    
    
    rst = dict()
    rst['result']='fail'
    paracheck = re.match('city=',qs)
    if paracheck:
        qs=qs.split('&')
        paras=dict()
        for q in qs:
            q = q.split('=')
            paras[q[0]]=q[1]
        
        city=paras['city']
        rst = fun._getSiteinfo(city)
    
    return str(rst)
#/supplydemand/?siteid=s00001&regionid=1&startdate=2017-11-01&enddate=2017-11-30
@app.route("/supplydemand/", methods=["GET"])
def getsupplydemand():
    qs = request.query_string
    rst = dict()
    rst['result']='fail'
   
    matchgroup = ['siteid=','regionid=','startdate=','enddate=']
    paracheck = True
    print qs
    for m in matchgroup:        
        if re.search(m,qs) is None:
              paracheck = False
              break          
 
    if paracheck:
        qs=qs.split('&')
        paras=dict()    
        for q in qs:
            q = q.split('=')
            paras[q[0]]=q[1]
    
        siteid=paras['siteid']
        regionid=paras['regionid']
        startdate=paras['startdate']
        enddate=paras['enddate']
        rst = fun._getSupplyDemand(siteid,regionid,startdate,enddate)
    
    return str(rst)    

@app.route("/demandweather/", methods=["GET"])
def getdemandWeather():
    qs = request.query_string
    
    rst = dict()
    rst['result']='fail'
   
    matchgroup = ['siteid=','regionid=','startdate=','enddate=']
    paracheck = True
    print qs
    for m in matchgroup:        
        if re.search(m,qs) is None:
              paracheck = False
              break          
 
    if paracheck:
        qs=qs.split('&')
        paras=dict()    
        for q in qs:
            q = q.split('=')
            paras[q[0]]=q[1]
    
        siteid=paras['siteid']
        regionid=paras['regionid']
        startdate=paras['startdate']
        enddate=paras['enddate']
        rst = fun._getdemandWeather(siteid,regionid,startdate,enddate)
    
    return str(rst)   

if __name__ == "__main__":
    
    
    app.run()