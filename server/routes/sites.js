const Router = require('express-promise-router');

const db = require('../db');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()

// export our router to be mounted by the parent application
module.exports = router;

router.get("/", async (req,res) => {
	const limit = req.query.limit || 30;
	const page = req.query.page && req.query.page > 0 ? req.query.page : 1; 
	// console.log("limit",limit);
	// console.log("page",page);
	const { rows: vehicleRows } = await db.query(' select "carId",sum("distance") as distance, sum("fuelConsumption") as fuel, sum("duration(min)") as duration from "tripBase" group by "carId" limit $1 offset $2  ',[limit,(page-1)*limit]);
	const { rows: totalRows } = await db.query(' select count( distinct ("carId") ) from "tripBase" ');
	const data = {
		data: vehicleRows,
		total: totalRows[0],
	}
	res.send(data);

} )