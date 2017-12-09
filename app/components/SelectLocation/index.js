import React from 'react';
import {InputGroup,ControlLabel,FormControl,HelpBlock,Button,Col} from 'react-bootstrap';
import { form,fromgroup,helpblock,btn,col,typeahead } from 'bootstrap-css';
import options from './cities_available';
import {Typeahead} from 'react-bootstrap-typeahead';
import PropTypes from 'prop-types';
import styled from 'styled-components';



class SelectLocation extends React.Component { // eslint-disable-line react/prefer-stateless-function
 
    state = {
    	    caseSensitive: false,
    	    ignoreDiacritics: true,
    	    city: '',
    };
	constructor(props,context) {
	    super(props);	
	    this.history = context.router.history;
	    this.handleClick = this.handleClick.bind(this);
	    this.handleChange = this.handleChange.bind(this);
	}    
	
	// componentDidMount(){
	// 	browserHistory.listen(location => {
	//       console.log(location.pathname) // /home
	//       this.setState({
	//       	test:'test',
	//       });
	//     });
	// }
	
	handleClick(e) {

		const { city } = this.state;
		if(city){
			this.history.push(`/sitesmap/${city}`);
		}
		
		
	}	
	handleChange(value) {
	    if(value){
	    	this.setState({
				city: value
			})
	    }
		
		
	}

	render() {
		

		
		const {caseSensitive, ignoreDiacritics,city } = this.state;
		return (				
				<form>
			        <InputGroup>
			          <Typeahead
			            labelKey="name"
			            options={options}
			            placeholder="Choose a place..."	
			            {...this.state} 
			            onChange = {this.handleChange}
			          />
			          
			          <InputGroup.Button>
			            <Button className="btn-secondary" onClick={this.handleClick}>
			                 Select Location
			            </Button>
			          </InputGroup.Button>
			        </InputGroup>
			      </form>
    );
  }
}

SelectLocation.contextTypes = {
  router: PropTypes.object
};

export default SelectLocation;


