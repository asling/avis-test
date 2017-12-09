const Router = require('express-promise-router');

const db = require('../db');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()

// export our router to be mounted by the parent application
module.exports = router;


router.get('/:did/trip/:tripId', async (req, res) => {
  const carId = req.params.did;
  const tripId = req.params.tripId;
  const { rows : tripBaseRows } = await db.query(' select "carId","tripId","startLongti","startLati","endLongti","endLati","duration(min)" as duration,"distance","fuelConsumption" from "tripBase" where "carId" = $1 and "tripId" = $2 ',[escape(carId),escape(tripId)]);

  const { rows : tripGPSRows } = await db.query(' select "carId","tripId","latitude","longitude","speed" from "tripGPS" where "carId" = $1 and "tripId" = $2 and "type" != $3 ',[escape(carId),escape(tripId),'invalid']);

  const { rows: tripAccRows } = await db.query(' select "carId","tripId","hard_acc_p","hard_brake_p" from "tripAcc" where "carId" = $1 and "tripId" = $2',[escape(carId),escape(tripId)]);

  const { rows: tripRPMRows } = await db.query(' select "carId","tripId","RPM_mean" from "tripRPM" where "carId" = $1 and "tripId" = $2',[escape(carId),escape(tripId)]);

  const { rows: predictRows } = await db.query(' select "carId","tripId","predict" from "predictrst" where "carId" = $1 and "tripId" = $2',[escape(carId),escape(tripId)]);

  let tripAccRowsV2 = {}, tripRPMRowsV2 = {}, tripGPSRowsV2 = {}, predictRowsV2 = {},tripBase = tripBaseRows[0];

  tripGPSRows.map( v => {
  	if(!tripGPSRowsV2[v.tripId]){
  		tripGPSRowsV2[v.tripId] = [];
  	}
  	tripGPSRowsV2[v.tripId].push(v);
  })
  tripAccRows.map( v => {
  	// console.log(v);
  	tripAccRowsV2[v.tripId] = v;
  	return v;
  } );

  tripRPMRows.map( v => {
  	tripRPMRowsV2[v.tripId] = v;
  	return v;
  } );

  predictRows.map( v => {
  	predictRowsV2[v.tripId] = v;
  	return v;
  })

  const tripData = Object.assign(tripBase,{
      'hard_acc_p': tripAccRowsV2[tripBase.tripId] ? tripAccRowsV2[tripBase.tripId]['hard_acc_p'] : '',
      'hard_brake_p': tripAccRowsV2[tripBase.tripId] ? tripAccRowsV2[tripBase.tripId]['hard_brake_p'] : '',
      'RPM_mean': tripRPMRowsV2[tripBase.tripId] ? tripRPMRowsV2[tripBase.tripId]['RPM_mean'] : '',
      'path': tripGPSRowsV2[tripBase.tripId] && tripGPSRowsV2[tripBase.tripId].length > 0 ? tripGPSRowsV2[tripBase.tripId]: [],
      'predict': predictRowsV2[tripBase.tripId] ? predictRowsV2[tripBase.tripId]['predict'] : '1',
    });

  // console.log(tripBaseRowsV2);

  res.send(tripData);
});


router.get('/:did/trip/:tripId/getDetail', async (req, res) => {
  // console.log("req.params",req.params);
  const {did:carId,tripId} = req.params;
  // console.log("typeof tripId",typeof tripId);
  const { rows: row1 } = await db.query(' select "tripId","hard_acc_p","hard_brake_p","acc_[-0.50_0.50]" as steady_speed from "tripAcc" where "carId" = $1',[escape(carId)]);
  const { rows: row2 } = await db.query(' select "tripId","accacc_[-0.50_0.50]" as steady_acceleration from "tripAccacc" where "carId" = $1',[escape(carId)]);
  const {rows: row3} = await db.query(' select "tripId","RPM_mean", "RPM_std" from "tripRPM"  where "carId" = $1',[escape(carId)]);
  const {rows: row4} = await db.query(' select "tripId",("endTime"-"startTime") as "maintenance", "headingPercentage" from "tripHeading"  where "carId" = $1 ',[escape(carId)]);
  const {rows: row5} = await db.query(' select "tripId",("noSeatBeltDuration" * "duration(min)") as no_seatbelt_duration,"noSeatBeltSpeed" from "tripBase" where "carId" = $1 ',[escape(carId)]);
  // 'axis':{
  //       'maxSpeed': 'max speed without seatbelt',
  //       'duration': 'duration without seatbelt',
  //     },
  //     'data':{
  //       'own': seatBeltOwnList,
  //       'others':seatBeltOthersList,
  //     }

  let row1Format = {},steady_speedFormat = {},row2Format = {},row3Format = {},row4Format = {},row5Format = {};
  row1.map( v => {
    row1Format[v.tripId] = Object.assign({},v);
    steady_speedFormat[v.tripId] = v.steady_speed;
    delete row1Format[v.tripId]['tripId'];
    delete row1Format[v.tripId]['steady_speed'];
  } );

  row2.map( v => {
    row2Format[v.tripId] = Object.assign({},v);
    delete row2Format[v.tripId]['tripId'];
  });

  row3.map( v => {
    row3Format[v.tripId] = Object.assign({},v);
    delete row3Format[v.tripId]['tripId'];
  });

  row4.map( v => {
    row4Format[v.tripId] = Object.assign({},v);
    delete row4Format[v.tripId]['tripId'];
  });

  row5.map( v => {
    row5Format[v.tripId] = Object.assign({},v);
    delete row5Format[v.tripId]['tripId'];
  });

  // console.log("row1",row1);
  let harshFormat = {'own':[],'others':[]},harshIndex = '';
  for(let item in row1){
    if(""+row1[item]['tripId'] === tripId){
      harshIndex = 'own';
    }else{
      harshIndex = 'others';
    }
    harshFormat[harshIndex].push(row1Format[row1[item]['tripId']]);
  }

  let steadyFormat = {'own':[],'others':[]},steadyIndex = '';
  for(let item in row2){
    if(""+row2[item]['tripId'] === tripId){
      steadyIndex = 'own';
    }else{
      steadyIndex = 'others';
    }
     steadyFormat[steadyIndex].push({
        ...row2Format[row2[item]['tripId']],
        steady_speed:steady_speedFormat[tripId],
      });
  }

  let rpmFormat = {'own':[],'others':[]},rpmIndex = '';
  for(let item in row3){
    if(""+row3[item]['tripId'] === tripId){
      rpmIndex = 'own';
    }else{
      rpmIndex = 'others';
    }
    rpmFormat[rpmIndex].push(row3Format[row3[item]['tripId']]);
  }

  let laneMaintenanceFormat = {'own':[],'others':[]}, laneMaintenanceIndex = '';
  for(let item in row4){
    if(""+row4[item]['tripId'] === tripId){
      laneMaintenanceIndex = 'own';
    }else{
      laneMaintenanceIndex = 'others';
    }
    laneMaintenanceFormat[laneMaintenanceIndex].push(row4Format[row4[item]['tripId']]);
  }

  let noseatbeltFormat = {'own':[],'others':[]}, noseatbeltIndex = '';
  for(let item in row5){
    if(""+row5[item]['tripId'] === tripId){
      noseatbeltIndex = 'own';
    }else{
      noseatbeltIndex = 'others';
    }
    noseatbeltFormat[noseatbeltIndex].push(row5Format[row5[item]['tripId']]);
  }



  const harsh = {
    'axis': {
      'speed': 'harsh acceleration(%)',
      'brake': 'harsh brake(%)',
    },
    'data': {
      'own': harshFormat['own'],
      'others':harshFormat['others'],
    }
  }

  const steady = {
    'axis': {
      'steady_speed': 'steady_speed(%)',
      'steady_acceleration': 'steady_acceleration(%)',
    },
    'data':{
      'own': steadyFormat['own'],
      'others': steadyFormat['others'],
    }
  };

  const rpm = {
    'axis': {
      'RPM_std':'engine rpm std',
      'RPM_mean':'engine rpm mean',
    },
    'data':{
      'own': rpmFormat['own'],
      'others':rpmFormat['others']
    }
  };

  const lane = {
    'axis': {
      'maintenance':'lane maintenance',
      'headingPercentage':'lane distance(%p)',
    },
    'data':{
      'own': laneMaintenanceFormat['own'],
      'others':laneMaintenanceFormat['others']
    }
  }

  const noseatBelt = {
    'axis': {
      'no_seatbelt_duration':'No Seatbelt duration',
      'noSeatBeltSpeed':'No Seatbelt Max Speed',
    },
    'data':{
      'own': noseatbeltFormat['own'],
      'others':noseatbeltFormat['others']
    }
  }

  const tripDetailData = {
    'harsh_versus': harsh,
    'steady_versus': steady,
    'rpm_versus':rpm,
    'lane_versus':lane,
    'no_seatbelt_versus':noseatBelt,
  }
  res.send(tripDetailData);
});