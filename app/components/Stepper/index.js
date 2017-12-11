/**
*
* Stepper
*
*/

 import React from 'react';
// import styled from 'styled-components';


import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Stepper from '../src/index.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: [{
        title: 'Step One',
        
      }, {
        title: 'Step Two',
        
      }, {
        title: 'Step Three',
        
      }, {
        title: 'Step Four',
        
      }],
    };
    this.onClickNext = this.onClickNext.bind(this);
    this.onClickPrev = tis.onClickPrev.bind(this);

  }

  onClickNext() {
    const { steps } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  }

  onClickPrev(){
  	const {steps} = this.state;
  	this.setState({
      currentStep: currentStep - 1,
    });
  }

  render() {
    const { steps } = this.state;
    const currentStep = this.prop.currentStep || 0;

    return (
      <div>
        <Stepper steps={ steps } activeStep={ this.state.currentStep } />
        <ButtonToolbar>
        	<Button bsSize="large" onClick={this.onClickPrev}  >Prev</Button>
		    <Button bsStyle="primary" bsSize="large" onClick={this.onClickNext} >Next</Button>
		    
		</ButtonToolbar>
      </div>
    );
  }
};

Stepper.propTypes = {

};

export default Stepper;
