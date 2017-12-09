import React from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';

import HorizontalTimeline from 'react-horizontal-timeline';


class TimelineBox extends React.Component { // eslint-disable-line react/prefer-stateless-function
	//state = { value: 0, previous: 0 };
	state = {
		      value: 0,
		      previous: 0,
//		      showConfigurator: false,
//
//		      // timelineConfig
		      minEventPadding: 20,
		      maxEventPadding: 50,
		      linePadding: 50,
		      labelWidth: 100,
//		      fillingMotionStiffness: 150,
//		      fillingMotionDamping: 25,
//		      slidingMotionStiffness: 150,
//		      slidingMotionDamping: 25,
		      stylesBackground: '#f8f8f8',
		      stylesForeground: '#7b9dce',
		      stylesOutline: '#dfdfdf',
//		      isTouchEnabled: true,
//		      isKeyboardEnabled: true,
//		      isOpenEnding: true,
//		      isOpenBeginning: true
	};
	
	render() {
		const state = this.state;
		const VALUES = ['2017-07-16', '2017-07-17','2017-07-18','2017-07-19','2017-07-20','2017-07-21'];
	    return (
	      
	      <div>
	        {/* Bounding box for the Timeline */}
	        <div style={{ width: '100%', height: '70px', margin: '0 auto' }}>
	          <HorizontalTimeline
	            index={this.state.value}
	            indexClick={(index) => {
	              this.setState({ value: index, previous: this.state.value });
	            }}
	            styles={{
	                background: state.stylesBackground,
	                foreground: state.stylesForeground,
	                outline: state.stylesOutline
	              }}
	            labelWidth={state.labelWidth}
	            linePadding={state.linePadding}
	            maxEventPadding={state.maxEventPadding}
	            minEventPadding={state.minEventPadding}	          
	            values={ VALUES } />
	        </div>
	        <div className='text-center'>
	          {/* any arbitrary component can go here */}    
	          {this.state.value}
	        </div>
	      </div>
	    );
	 
	}
}


export default TimelineBox;
