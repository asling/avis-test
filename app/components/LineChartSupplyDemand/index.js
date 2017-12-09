/**
*
* LineChart
*
*/

import React from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';

import echarts from 'echarts';


class LineChartSupplyDemand extends React.Component { // eslint-disable-line react/prefer-stateless-function
	constructor(props){
		super(props);
		this.chart = null;
		this.chartType = 'line';
	}

	componentDidMount(){
		const chart = echarts.init(findDOMNode(this.chart));
		const supplydata = [20, 31, 35, 33, 22, 23, 30, 25, 28, 30, 23, 25,25, 21];
		const demanddata = [25, 21, 25, 23, 32, 23, 25, 20, 31, 35, 33, 22, 23, 30];
		const predictdata= [23, 23, 25, 28, 30, 23, 25, 25, 23, 32, 23, 25, 20, 40];
		const axisxdata = ['2017-10-16','2017-10-17','2017-10-16','2017-10-17','2017-10-18',
			           '2017-10-19','2017-10-20','2017-10-21','2017-10-22','2017-10-23',
			           '2017-10-24','2017-10-25','2017-10-26','2017-10-27','2017-10-28'];
		const legenddata=['Supply','Demand','Prediction'];
		const siteid = "s00001";
		
		const xtype = this.chartType;
			
		const option = 
			{
				
				backgroundColor:'#FAFAFA',
			    title: {
			        text: siteid+' Supply , Demand and Prediction',
			        
			        subtext: 'car rental'
			    },
			    tooltip: {
			        trigger: 'axis'
			    },
			    legend: {
			        data:legenddata,
			    	bottom:10
			    },
			    xAxis:  {
			        type: 'category',
			        boundaryGap: true,
			        data:axisxdata 
			        	
			    },
			    yAxis: {
			        type: 'value',
			        axisLabel: {
			            formatter: '{value} '
			        }
			    },
			    series: [
			        {
			            name:'Supply',
			            type:xtype,
			            data:supplydata,
			        },
			        {
			            name:'Demand',
			            type:xtype,
			            data:demanddata,
			        },
			        {
			            name:'Prediction',
			            type:xtype,
			            data:predictdata,

			        }
			    ]
			};

		// console.log("option",option);
		chart.setOption(option);
	}

  	render() {
	  	const ChartDiv = styled.div`
	  		height: 300px;

	  	`;
	    return (
	      <ChartDiv ref={ e => this.chart = e }>
	      </ChartDiv>
	    );
  	}
}

export default LineChartSupplyDemand;
