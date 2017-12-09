const Router = require('express-promise-router');

const db = require('../db');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

// export our router to be mounted by the parent application
module.exports = router;


router.get('/:did/economicData', async (req, res) => {
  const carId = req.params.did;
  
  const { rows: rpmNormalRows } = await db.query(' select avg("RPM_0_20_mean") as avg1, avg("RPM_20_40_mean") as avg2, avg("RPM_40_60_mean") as avg3, avg("RPM_60_80_mean") as avg4, avg("RPM_80_mean") as avg5 from "tripRPM" where "RPM_0_20_mean" != $1 and "RPM_20_40_mean" != $1 and "RPM_40_60_mean" != $1 and "RPM_60_80_mean" != $1 and "RPM_80_mean" != $1',['NaN']);
  const { rows: rpmSpecialRows } = await db.query('select avg("RPM_0_20_mean") as avg1, avg("RPM_20_40_mean") as avg2, avg("RPM_40_60_mean") as avg3, avg("RPM_60_80_mean") as avg4, avg("RPM_80_mean") as avg5 from "tripRPM" where "RPM_0_20_mean" != $1 and "RPM_20_40_mean" != $1 and "RPM_40_60_mean" != $1 and "RPM_60_80_mean" != $1 and "RPM_80_mean" != $1 and "carId" = $2',['NaN',carId]);

  const { rows: harshBreakRows } = await db.query(' select "carId", "tripId",("acc__-9p" + "acc_-9_-8p" + "acc_-8_-7p" + "acc_-7_-6p" + "acc_-6_-5p" + "acc_-5_-4p" + "acc_-4_-3p") as harsh_break_sum from "tripAcc" ');

  const { rows: harshAccRows } = await db.query(' select "carId", "tripId",("acc_9_p" + "acc_8_9p" + "acc_7_8p" + "acc_6_7p" + "acc_5_6p" + "acc_4_5p" + "acc_3_4p") as harsh_acc_sum from "tripAcc" ');

  const { rows: stableSpeedRows } = await db.query(' select "carId", "tripId", "acc_[-0.50_0.50]" as stable_speed from "tripAcc" ');

  const { rows: stableAccRows } = await db.query(' select "carId", "tripId", "accacc_[-0.50_0.50]" as stable_acc from "tripAccacc" ');

  const { rows: scoreAvgRows } = await db.query(' select avg("acc_3") as acc_3,avg("acc_m3") as acc_m3,avg("rpmmeanscore") as rpmmeanscore,avg("speed_stability_score") as speed_stability_score,avg("acc_stability_score") as acc_stability_score from "tripCarscore_sum" ');

  const { rows: scoreSpecialRows } = await db.query(' select "acc_3","acc_m3","rpmmeanscore","speed_stability_score","acc_stability_score" from "tripCarscore_sum" where "carId" = $1',[escape(carId)]);

  let axisRPM  = {};
  const valueNormalRPM = rpmNormalRows[0];
  const valueSpecialRPM = rpmSpecialRows[0];
  for(let item in valueSpecialRPM){
    switch(item){
      case 'avg1':
        axisRPM[item] = '(0,20)';
        break;
      case 'avg2':
        axisRPM[item] = '(20,40)';
        break;
      case 'avg3':
        axisRPM[item] = '(40,60)';
        break;
      case 'avg4':
        axisRPM[item] = '(60,80)';
        break;
      case 'avg5':
        axisRPM[item] = '(80,)';
        break;
      default:
        "";
    }
  }

  const economicData = {
      "rpmData": {
        axis: axisRPM,
        data: [{
          name: 'driver'+carId,
          // value: breakRows[0],
          value: valueSpecialRPM,
        },
        {
          name: 'drivers',
          value: valueNormalRPM
        }]
      },
      "harshBreakData": harshBreakRows,
      "harshAccData": harshAccRows,
      "stableSpeedData": stableSpeedRows,
      "stableAccData": stableAccRows,
      'scoreData': [scoreSpecialRows[0],scoreAvgRows[0]],
  }
  // console.log(tripBaseRowsV2);

  res.send(economicData);
});
