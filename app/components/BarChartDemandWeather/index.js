import React from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';

import echarts from 'echarts';


class BarChartDemandWeather extends React.Component { // eslint-disable-line react/prefer-stateless-function
	constructor(props){
		super(props);
		this.chart = null;
		this.chartType = 'bar';
	}

	componentDidMount(){
		// 1-clear
		// 2-mist
		// 3-light
		// 4-heavy
		const chart = echarts.init(findDOMNode(this.chart));
//		const cleardata = [62,213,95,44,28,1];
//		const mistddata = [58,119,40,8,5];
//		const lightdata = [37,14,1,0,0];
//		const heavydata = [0,0,0,0,0];
		const cleardata = [50,140,164,89];
		const mistddata = [26,95,87,22];
		const lightdata = [6,22,23,1];
		const heavydata = [0,0,0,0];
		const legenddata=['clear','mist','light','heavy'];
		const axisxdata = ['0-10','10-20','20-30','30-40'];
		const siteid = "s00001";
		
		const xtype=this.chartType;
		const option = 
			{
				
				backgroundColor:'#FAFAFA',
			    title: {
			        text: siteid+' Weather vs Demand ',			        
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
			        data:axisxdata,
			        axisLabel: {
			            formatter: '{value}°C'
			        }
			    },
			    yAxis: {
			        type: 'value',
			        axisLabel: {
			            formatter: '{value}'
			        }
			    },
			    series: [
			        {  
			            name:'clear',
			            type:xtype,
			            data:cleardata			            
			        },
			        {
			            name:'mist',
			            type:xtype,
			            data:mistddata
			        },
			        {
			            name:'light',
			            type:xtype,
			            data:lightdata

			        },
			        {
			            name:'heavy',
			            type:xtype,
			            data:heavydata
			        }			        
			    ]
			};

		// console.log("option",option);
		chart.setOption(option);
	}

  	render() {
	  	const ChartDiv = styled.div`
	  		height: 280px;

	  	`;
	    return (
	      <ChartDiv ref={ e => this.chart = e }>
	      </ChartDiv>
	    );
  	}
}

export default BarChartDemandWeather;
