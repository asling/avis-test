const Router = require('express-promise-router');

const db = require('../db');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()

// export our router to be mounted by the parent application
module.exports = router;


router.get('/:did/safetyData', async (req, res) => {
  const carId = req.params.did;
  
  const { rows: harshBreakRows } = await db.query(' select "carId", "tripId",("acc__-9p" + "acc_-9_-8p" + "acc_-8_-7p" + "acc_-7_-6p") as harsh_break_sum from "tripAcc" ');

  const { rows: harshAccRows } = await db.query(' select "carId", "tripId",("acc_9_p" + "acc_8_9p" + "acc_7_8p" + "acc_6_7p") as harsh_acc_sum from "tripAcc" ')

  const { rows: overSpeedRows } = await db.query(' select "carId", "tripId",("speed90_99p" + "speed100_109p" + "speed110_119p" + "speed120_129p" + "speed130_139p" + "speed140_p") as overspeed_sum from "tripSpeed" ');
  
  const { rows: laneKeepingRows } = await db.query(' select "carId","tripId","headingPercentage" from "tripHeading"');
  
  const { rows: scoreAvgRows } = await db.query(' select avg("hard_acc_score") as hard_acc_score,avg("hard_brake_score") as hard_brake_score,avg("speed_score") as speed_score,avg("seatbelt_score") as seatbelt_score,avg("acc_stability_score") as acc_stability_score from "tripCarscore_sum" ');

  const { rows: scoreSpecialRows } = await db.query(' select "hard_acc_score","hard_brake_score","speed_score","seatbelt_score","acc_stability_score" from "tripCarscore_sum" where "carId" = $1',[escape(carId)]);

  const safetyData = {
      "harshBreakData": harshBreakRows,
      "harshAccData": harshAccRows,
      "overspeedData": overSpeedRows,
      "laneKeepingData": laneKeepingRows,
      'scoreData': [scoreSpecialRows[0],scoreAvgRows[0]],
  }
  // console.log(tripBaseRowsV2);

  res.send(safetyData);
});
