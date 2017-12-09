const Router = require('express-promise-router');

const db = require('../db');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

// export our router to be mounted by the parent application
module.exports = router;

router.get('/:did/trips1', async (req, res) => { });

router.get('/:did/trips', async (req, res) => {
  const carId = req.params.did;
  const { rows : tripBaseRows } = await db.query(' select "carId","tripId","startLongti","startLati","endLongti","endLati","duration(min)" as duration,"distance","fuelConsumption" from "tripBase" where "carId" = $1 ',[escape(carId)]);

  const { rows : tripGPSRows } = await db.query(' select "carId","tripId","latitude","longitude","speed" from "tripGPS" where "carId" = $1 and "type" != $2 ',[escape(carId),'invalid']);

  const { rows: tripAccRows } = await db.query(' select "carId","tripId","hard_acc_p","hard_brake_p" from "tripAcc" where "carId" = $1 ',[escape(carId)]);

  const { rows: tripRPMRows } = await db.query(' select "carId","tripId","RPM_mean" from "tripRPM" where "carId" = $1 ',[escape(carId)]);

  const { rows: predictRows } = await db.query(' select "carId","tripId","predict" from "predictrst" where "carId" = $1 ',[escape(carId)]);

  let tripAccRowsV2 = {}, tripRPMRowsV2 = {}, tripGPSRowsV2 = {}, predictRowsV2 = {};

  tripGPSRows.map( v => {
  	if(!tripGPSRowsV2[v.tripId]){
  		tripGPSRowsV2[v.tripId] = [];
  	}
  	tripGPSRowsV2[v.tripId].push(v);
  });
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
  });

  const tripBaseRowsV2 = tripBaseRows.map( v => {
  	let tripAccRow = tripAccRowsV2[v.tripId];
  	// console.log('tripAccRow',tripAccRow);
  	// console.log('tripAccRow["hard_acc_p"]',tripAccRow.hard_acc_p);
  	return Object.assign(v,{
  		'hard_acc_p': tripAccRowsV2[v.tripId] ? tripAccRowsV2[v.tripId]['hard_acc_p'] : '',
  		'hard_brake_p': tripAccRowsV2[v.tripId] ? tripAccRowsV2[v.tripId]['hard_brake_p'] : '',
  		'RPM_mean': tripRPMRowsV2[v.tripId] ? tripRPMRowsV2[v.tripId]['RPM_mean'] : '',
  		'path': tripGPSRowsV2[v.tripId] && tripGPSRowsV2[v.tripId].length > 0 ? tripGPSRowsV2[v.tripId]: [],
  		'predict': predictRowsV2[v.tripId] ? predictRowsV2[v.tripId]['predict'] : '1',
  	});
  });

  // console.log(tripBaseRowsV2);

  res.send(tripBaseRowsV2);
});
