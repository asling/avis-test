import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link,  BrowserRouter as Router } from 'react-router-dom';

import A from './A';
import Img from './Img';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import messages from './messages';
import {Nav,NavItem,Navbar,NavDropdown,MenuItem} from 'react-bootstrap';
import AVISLOGO1 from 'images/avis-logo1.jpg';
//
//
import { nav } from 'bootstrap-css'
//import createBrowserHistory from 'history/createBrowserHistory'
//const browserHistory = createBrowserHistory();

//<NavDropdown eventKey={3} title="Solutions" id="solutions-nav-dropdown">
//<MenuItem eventKey={3.1}><Link to="/feature1">Feature1</Link></MenuItem>
//<MenuItem eventKey={3.2}>Feature2</MenuItem>
//<MenuItem eventKey={3.3}>...</MenuItem>
//<MenuItem divider />
//<MenuItem eventKey={3.3}>Separated link</MenuItem>
//</NavDropdown>
//   <NavItem eventKey={2}><Link to="/solutions">Solutions</Link></NavItem>

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  
	
	render() {
    return (
    		<div >		
			  <Navbar >
			    <Navbar.Header>
			      <Navbar.Brand>			        
			        <a href="https://www.avis.com/en/home">AVIS</a>
			      </Navbar.Brand>
			      <Navbar.Toggle />
			    </Navbar.Header>
			    <Nav pullLeft>			      
			       <NavItem eventKey={1}><Link to="/">Home</Link></NavItem>
			       <NavItem eventKey={2}><Link to="/sitesmap/Paris">SitesMap</Link></NavItem>
			    </Nav>			
			 </Navbar>
			</div>
    );
  }
}

export default Header;
