const sites = require('./sites')

const path = require("path");
/*

total summary:
	1.特定司机的所有trip数据： /analysis/driver/:did/trips
	2.特定司机的特定trip数据： /analysis/driver/:did/trip/:tid
	3.特定司机的驾驶行为数据：	/analysis/driver/:did/behavior
	4.所有司机的驾驶行为数据： /analysis/drivers/behavior
	5.道路数据			 ： /analysis/roads
	1: [
		{
			label: 'Duration (days)',
			content: 30,
		},
		{
			label: 'Total Trips',
			content: 100,
		},
		{
			label: 'Abnormal Trips',
			content: 1,
		},
		{
			label: 'Trips per day',
			content: 12,
		},
		{
			label: 'Avg Fuel per 100km',
			content: 5,
		}
	]

*/


module.exports = (app,options) => {
	const publicPath = options.publicPath || '/';
	//CORS server turned on.
	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});


  app.use(path.join(publicPath,'api/sites'), sites);
  
  // etc..
}