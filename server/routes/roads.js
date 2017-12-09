const Router = require('express-promise-router');

const db = require('../db');

const exec = require('child_process').exec;

const path = require("path");

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

// export our router to be mounted by the parent application
module.exports = router;

//(\/)?(date)?(\/)?((?:[0-9]{4})\-(?:[0-9]{2})\-(?:[0-9]{2}))?(\/)?(timeline)?(\/)?([0-9]{2})
// \/date\/([0-9]{4}\-[0-9]{2}\-[0-9]{2})
router.get("/getRoadsDetail", async (req, res) => {
  const startDate = '2017-03-23';
  const startTimeline = '20';
  const { date = startDate, timeline = startTimeline } = req.query;
  const { rows: roadRows } = await db.query(' select cast("date" AS text) as date,"timeline","speed","osm_id_road" from demo_trafficdata where "osm_id_road" > 0 and "date" = $1 and "timeline" = $2 ',[date,timeline]);
  res.send(roadRows);
});

router.get("/getRoadsDetailPredict", async (req, res) => {
  const startDate = '2017-03-30';
  const startTimeline = '20';
  const accidentFlag = false;
  const { date = startDate, timeline = startTimeline, accident = accidentFlag } = req.query;
  if(accident){
    const { longitude = '0', latitude = '0' } = req.query;
    const param = {
      date,
      timeline,
      longitude,
      latitude,
    };
    exec('python ' + path.resolve(__dirname,"../vendor/python/traffic_propagation_k2.py") + ' ' + JSON.stringify(JSON.stringify(param)), (err, stdout, stderr) => {
      // console.log("---------------start-------------");
      // console.log("err",err);
      // console.log("stdout",stdout);
      // console.log("stderr",stderr);
      // console.log("---------------end-------------");
      // var out = JSON.parse(stdout);

      // if(out && out['Result'] === 'OK'){
      if(stdout && stdout.toString().match("OK")){
        db.query(' select cast("date" AS text) as date, "timeline","speed","osm_id_road","is_rewrite" from trafficfilleddata_rewrite where "is_rewrite" > $1',['0'],function(param,result){
          const { rows: roadRows } = result;
          res.send(roadRows);
        });
      }
    });
  }else{
    const { rows: roadRows } = await db.query(' select cast("date" AS text) as date,"timeline","speed","osm_id_road" from demo_trafficdata_predict where "osm_id_road" > 0 and "date" = $1 and "timeline" = $2 ',[decodeURIComponent(date),decodeURIComponent(timeline)]);
    res.send(roadRows);
  }
});

router.get('/getRoadsPoints',async(req,res) => {
  const { rows: roadRows } = await db.query('select "osm_id", "roads" from demo_ta_osm_roads');
  res.send(roadRows);
});

