const Router = require('express-promise-router');

const db = require('../db');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()

// export our router to be mounted by the parent application
module.exports = router;

const statusRows = [
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
];

const behaviorRows = {
	acceleration:[

	]
}

const reduce = Array.prototype.reduce;

const getValues = Object.values;

router.get("/:did/status",async(req,res) => {
	const carId = req.params.did;
	const { rows: scoreSpecialRows } = await db.query(' select "hard_acc_score","hard_brake_score","speed_score","seatbelt_score","acc_stability_score" from "tripCarscore_sum" where "carId" = $1',[escape(carId)]);
	const scoreSpecialRow = scoreSpecialRows[0];
	const keys = Object.keys(scoreSpecialRow);
	res.send(keys.map( (v) => {
		return {
			label: v,
			content: (scoreSpecialRow[v]*100).toFixed(2),
		}
	}));
})

router.get("/:did/behavior",async(req,res) => {
	let result = {};
	let accAxisList = {};
	let breakAxisList = {};
	let accDataList = {};
	let breakDataList = {};
	let speedAxisList = {};
	let accAccAxisList = {};
	let seatBeltOwnList = [], seatBeltOthersList = [];
	const carId = req.params.did;
	const { rows:breakRows } = await db.query('select sum("acc__-9") as acc1,sum("acc_-9_-8") as acc2,sum("acc_-8_-7") as acc3,sum("acc_-7_-6") as acc4,sum("acc_-6_-5") as acc5,sum("acc_-5_-4") as acc6,sum("acc_-4_-3") as acc7,sum("acc_-3_-2") as acc8,sum("acc_-2_-1") as acc9,sum("acc_-1_0" ) as acc10 from "tripAcc"where "carId" = $1 ',[escape(carId)]);

	const { rows:accRows } = await db.query('select sum("acc_0_1") as acc11,sum("acc_1_2") as acc12,sum("acc_2_3") as acc13,sum("acc_3_4") as acc14,sum("acc_4_5") as acc15,sum("acc_5_6") as acc16,sum("acc_6_7") as acc17,sum("acc_7_8") as acc18,sum("acc_8_9") as acc19,sum("acc_9_" ) as acc20 from "tripAcc"where "carId" = $1 ',[escape(carId)]);

	const { rows:rows2 } = await db.query('select sum("acc__-9") as acc1,sum("acc_-9_-8") as acc2,sum("acc_-8_-7") as acc3,sum("acc_-7_-6") as acc4,sum("acc_-6_-5") as acc5,sum("acc_-5_-4") as acc6,sum("acc_-4_-3") as acc7,sum("acc_-3_-2") as acc8,sum("acc_-2_-1") as acc9,sum("acc_-1_0" ) as acc10,sum("acc_0_1") as acc11,sum("acc_1_2") as acc12,sum("acc_2_3") as acc13,sum("acc_3_4") as acc14,sum("acc_4_5") as acc15,sum("acc_5_6") as acc16,sum("acc_6_7") as acc17,sum("acc_7_8") as acc18,sum("acc_8_9") as acc19,sum("acc_9_" ) as acc20 from "tripAcc" ');

	const { rows: speedSpecialRows } = await db.query('select sum("speed0_9") as spd1,sum("speed20_29") as spd2,sum("speed40_49") as spd3,sum("speed60_69") as spd4,sum("speed80_89") as spd5,sum("speed100_109") as spd6,sum("speed120_129") as spd7 from "tripSpeed" where "carId" = $1 ',[escape(carId)]);

	const { rows: speedNormalRows } = await db.query('select sum("speed0_9") as spd1,sum("speed20_29") as spd2,sum("speed40_49") as spd3,sum("speed60_69") as spd4,sum("speed80_89") as spd5,sum("speed100_109") as spd6,sum("speed120_129") as spd7 from "tripSpeed"');

	const { rows: accAccSpecialRows } = await db.query('select sum("accacc__-9") as acc1,sum("accacc_-9_-8") as acc2,sum("accacc_-8_-7") as acc3,sum("accacc_-7_-6") as acc4,sum("accacc_-6_-5") as acc5,sum("accacc_-5_-4") as acc6,sum("accacc_-4_-3") as acc7,sum("accacc_-3_-2") as acc8,sum("accacc_-2_-1") as acc9,sum("accacc_-1_0" ) as acc10,sum("accacc_0_1") as acc11,sum("accacc_1_2") as acc12,sum("accacc_2_3") as acc13,sum("accacc_3_4") as acc14,sum("accacc_4_5") as acc15,sum("accacc_5_6") as acc16,sum("accacc_6_7") as acc17,sum("accacc_7_8") as acc18,sum("accacc_8_9") as acc19,sum("accacc_9_" ) as acc20 from "tripAccacc" where "carId" = $1',[escape(carId)]);

	const { rows: accAccNormalRows } = await db.query('select sum("accacc__-9") as acc1,sum("accacc_-9_-8") as acc2,sum("accacc_-8_-7") as acc3,sum("accacc_-7_-6") as acc4,sum("accacc_-6_-5") as acc5,sum("accacc_-5_-4") as acc6,sum("accacc_-4_-3") as acc7,sum("accacc_-3_-2") as acc8,sum("accacc_-2_-1") as acc9,sum("accacc_-1_0" ) as acc10,sum("accacc_0_1") as acc11,sum("accacc_1_2") as acc12,sum("accacc_2_3") as acc13,sum("accacc_3_4") as acc14,sum("accacc_4_5") as acc15,sum("accacc_5_6") as acc16,sum("accacc_6_7") as acc17,sum("accacc_7_8") as acc18,sum("accacc_8_9") as acc19,sum("accacc_9_" ) as acc20 from "tripAccacc" ');

	const { rows: seatbeltRows } = await db.query('select "carId",avg("noSeatBeltSpeed") as maxSpeed,sum("duration(min)" * "noSeatBeltDuration") as duration from "tripBase" group by "carId"');
	// const { rows: seatbeltRows } = await db.query('select "carId", sum("duration(min)" * "noSeatBeltDuration") as duration, percentile_cont(.70) within group(order by "noSeatBeltSpeed" ) as maxSpeed from "tripBase" group by "carId"'); 

	const { rows: scoreSpecialRows } = await db.query(' select "hard_acc_score","hard_brake_score","speed_score","seatbelt_score","acc_stability_score" from "tripCarscore_sum" where "carId" = $1',[escape(carId)]);

	const { rows: scoreAvgRows } = await db.query(' select avg("hard_acc_score") as hard_acc_score,avg("hard_brake_score") as hard_brake_score,avg("speed_score") as speed_score,avg("seatbelt_score") as seatbelt_score,avg("acc_stability_score") as acc_stability_score from "tripCarscore_sum" ');

	const { rows: fuelRows } = await db.query(' select "carId","distance/fuelConsumption" as distancePerFuel from "tripBase" ');

	const { rows: durationRows } = await db.query(' select "carId", "duration(min)" as tripDuration from "tripBase" ');

	// console.log('rows1',rows1);
	// console.log('rows2',rows2);
	// console.log("rows1[0]['acc1']",rows1[0]['acc1']);
	const breakRowCopy = Object.assign({},breakRows[0]);
	const breakRowValues = getValues(breakRows[0]);
	const breakRowSum = reduce.call(breakRowValues, (sum,value) => {
		return sum + parseInt(value);  
	},0);

	const accRowCopy = Object.assign({},accRows[0]);
	const accRowValues = getValues(accRows[0]);
	const accRowSum = reduce.call(accRowValues, (sum,value) => {
		return sum + parseInt(value);  
	},0);

	const row2Values = getValues(rows2[0]);

	// console.log('row2Values1',row2Values);

	const breakOthers = row2Values.slice(0,9);

	// console.log('row2Values2',row2Values);

	const accOthers = row2Values.slice(10,19);

	const breakOtherSum = reduce.call(breakOthers, (sum,value) => {
		return sum + parseInt(value);  
	},0);
	const accOtherSum = reduce.call(accOthers, (sum,value) => {
		return sum + parseInt(value);  
	},0);

	const speedSpecialRowCopy = Object.assign({},speedSpecialRows[0]);
	const speedSpecialRowValues = getValues(speedSpecialRows[0]);
	const speedSpecialRowSum = reduce.call(speedSpecialRowValues, (sum,value) => {
		return sum + parseInt(value);  
	},0);

	const speedNormalRowCopy = Object.assign({},speedNormalRows[0]);
	const speedNormalRowValues = getValues(speedNormalRows[0]);
	const speedNormalRowSum = reduce.call(speedNormalRowValues, (sum,value) => {
		return sum + parseInt(value);  
	},0);

	const accAccSpecialRowCopy = Object.assign({},accAccSpecialRows[0]);
	const accAccSpecialRowValues = getValues(accAccSpecialRows[0]);
	const accAccSpecialRowSum = reduce.call(accAccSpecialRowValues, (sum,value) => {
		return sum + parseInt(value);  
	},0);

	const accAccNormalRowCopy = Object.assign({},accAccNormalRows[0]);
	const accAccNormalRowValues = getValues(accAccNormalRows[0]);
	const accAccNormalRowSum = reduce.call(accAccNormalRowValues, (sum,value) => {
		return sum + parseInt(value);  
	},0); 

	// console.log(accOtherSum);

	for(let item in breakRows[0]){
		let curr = rows2[0];

		breakRowCopy[item] = parseInt(breakRows[0][item]) / breakRowSum;

		breakDataList[item] = parseInt(curr[item]) / breakOtherSum;

		switch(item){
			case 'acc1':
				breakAxisList[item] = '(,-9)';
				break;
			case 'acc2':
				breakAxisList[item] = '(-9,-8)';
				break;
			case 'acc3':
				breakAxisList[item] = '(-8,-7)';
				break;
			case 'acc4':
				breakAxisList[item] = '(-7,-6)';
				break;
			case 'acc5':
				breakAxisList[item] = '(-6,-5)';
				break;
			case 'acc6':
				breakAxisList[item] = '(-5,-4)';
				break;
			case 'acc7':
				breakAxisList[item] = '(-4,-3)';
				break;
			case 'acc8':
				breakAxisList[item] = '(-3,-2)';
				break;
			case 'acc9':
				breakAxisList[item] = '(-2,-1)';
				break;
			case 'acc10':
				breakAxisList[item] = '(-1,-0)';
				break;
			default:
				"";
		}
	}

	// console.log('accOtherSum',accOtherSum);

	for(let item in accRows[0]){
		let curr = rows2[0];

		accRowCopy[item] = parseInt(accRows[0][item]) / accRowSum;
		// console.log('item',item);
		// console.log('curr[item]',curr[item]);

		accDataList[item] = parseInt(curr[item]) / accOtherSum;

		switch(item){
			case 'acc11':
				accAxisList[item] = '(0,1)';
				break;
			case 'acc12':
				accAxisList[item] = '(1,2)';
				break;
			case 'acc13':
				accAxisList[item] = '(2,3)';
				break;
			case 'acc14':
				accAxisList[item] = '(3,4)';
				break;
			case 'acc15':
				accAxisList[item] = '(4,5)';
				break;
			case 'acc16':
				accAxisList[item] = '(5,6)';
				break;
			case 'acc17':
				accAxisList[item] = '(6,7)';
				break;
			case 'acc18':
				accAxisList[item] = '(7,8)';
				break;
			case 'acc19':
				accAxisList[item] = '(8,9)';
				break;
			case 'acc20':
				accAxisList[item] = '(9,)';
				break;
			default:
				"";
		}
	}

	for(let item in speedSpecialRows[0]){

		speedSpecialRowCopy[item] = parseInt(speedSpecialRows[0][item]) / speedSpecialRowSum;
		speedNormalRowCopy[item] = parseInt(speedNormalRows[0][item]) / speedNormalRowSum;

		switch(item){
			case 'spd1':
				speedAxisList[item] = '(0,9)';
				break;
			case 'spd2':
				speedAxisList[item] = '(20,29)';
				break;
			case 'spd3':
				speedAxisList[item] = '(40,49)';
				break;
			case 'spd4':
				speedAxisList[item] = '(60,69)';
				break;
			case 'spd5':
				speedAxisList[item] = '(80,89)';
				break;
			case 'spd6':
				speedAxisList[item] = '(100,109)';
				break;
			case 'spd7':
				speedAxisList[item] = '(120,129)';
				break;
			default:
				"";
		}
	}

	for(let item in accAccSpecialRows[0]){

		accAccSpecialRowCopy[item] = parseInt(accAccSpecialRows[0][item]) / accAccSpecialRowSum;
		accAccNormalRowCopy[item] = parseInt(accAccNormalRows[0][item]) / accAccNormalRowSum;

		switch(item){
			case 'acc1':
				accAccAxisList[item] = '(-9)';
				break;
			case 'acc2':
				accAccAxisList[item] = '(-9,-8)';
				break;
			case 'acc3':
				accAccAxisList[item] = '(-8,-7)';
				break;
			case 'acc4':
				accAccAxisList[item] = '(-7,-6)';
				break;
			case 'acc5':
				accAccAxisList[item] = '(-6,-5)';
				break;
			case 'acc6':
				accAccAxisList[item] = '(-5,-4)';
				break;
			case 'acc7':
				accAccAxisList[item] = '(-4,-3)';
				break;
			case 'acc8':
				accAccAxisList[item] = '(-3,-2)';
				break;
			case 'acc9':
				accAccAxisList[item] = '(-2,-1)';
				break;
			case 'acc10':
				accAccAxisList[item] = '(-1,-0)';
				break;
			case 'acc11':
				accAccAxisList[item] = '(0,1)';
				break;
			case 'acc12':
				accAccAxisList[item] = '(1,2)';
				break;
			case 'acc13':
				accAccAxisList[item] = '(2,3)';
				break;
			case 'acc14':
				accAccAxisList[item] = '(3,4)';
				break;
			case 'acc15':
				accAccAxisList[item] = '(4,5)';
				break;
			case 'acc16':
				accAccAxisList[item] = '(5,6)';
				break;
			case 'acc17':
				accAccAxisList[item] = '(6,7)';
				break;
			case 'acc18':
				accAccAxisList[item] = '(7,8)';
				break;
			case 'acc19':
				accAccAxisList[item] = '(8,9)';
				break;
			case 'acc20':
				accAccAxisList[item] = '(9,)';
				break;
			default:
				"";
		}
	}

	for(let item in seatbeltRows){
		if(seatbeltRows[item]['carId'] === carId){
			delete seatbeltRows[item]['carId'];
			seatBeltOwnList[0] = seatbeltRows[item];
		}else{
			delete seatbeltRows[item]['carId'];
			seatBeltOthersList.push(seatbeltRows[item]);
		}
	}

	result  = {
		'breakData':{
			axis: breakAxisList,
			data:[
				{
					name: 'driver'+carId,
					// value: breakRows[0],
					value: breakRowCopy,
				},
				{
					name: 'drivers',
					value: breakDataList
				}
			]
		},
		'accData':{
			axis:accAxisList,
			data:[
				{
					name: 'drivers'+carId,

					value: accRowCopy,
				},
				{
					name: 'drivers',
					value: accDataList,
				}
			]
		},
		'speedData':{
			axis: speedAxisList,
			data:[
				{
					name: 'driver'+carId,
					// value: speedSpecialRows[0]
					value: speedSpecialRowCopy,
				},
				{
					name: 'drivers',
					// value: speedNormalRows[0],
					value: speedNormalRowCopy
				}
			]
		},
		'accAccData':{
			'axis': accAccAxisList,
			'data':[
				{
					name:'driver'+carId,
					// value: accAccSpecialRows[0],
					value: accAccSpecialRowCopy,
				},
				{
					name: 'drivers',
					// value: accAccNormalRows[0],
					value: accAccNormalRowCopy
				}
			]
		},
		'seatBeltData':{
            'axis':{
                'maxSpeed': 'max speed without seatbelt',
                'duration': 'duration',
            },
            'data':{
                'own': seatBeltOwnList,
                'others':seatBeltOthersList,
            }
        }, 
		'scoreData': [scoreSpecialRows[0],scoreAvgRows[0]],
		'durationData': durationRows,
		'fuelData': fuelRows,
	}
	res.send(result);
});