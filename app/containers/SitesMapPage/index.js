/*
 * FeaturePage
 *
 * List all the features
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import {Grid,Row,Col,Button} from 'react-bootstrap';

import H1 from 'components/H1';
import messages from './messages';
import List from './List';
import ListItem from './ListItem';
import ListItemTitle from './ListItemTitle';
import SiteMapBox from 'components/SiteMapBox';
import SiteMapBox2 from 'components/SiteMapBox2';
import LineChartSupplyDemand from 'components/LineChartSupplyDemand';
import BarChartDemandWeather from 'components/BarChartDemandWeather';

import TimelineBox from 'components/TimelineBox';

import { row,col } from 'bootstrap-css'
export default class SitesMapPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

	
  // Since state and props are static,
  // there's no need to re-render this component
  shouldComponentUpdate() {
    return false;
  }

//  <Button><Link to="/solutions">Solutions</Link></Button>
  render() {
    return (
    <div>
        <Helmet>
          <title>Site Map Page</title>
          <meta name="description" content="Site Map page" />
        </Helmet>

        
        <Row className="show-grid">            
    	<Col xs={12} sm={6} md={8}><SiteMapBox2 /></Col>
    	<Col xs={6} md={4} ><LineChartSupplyDemand/></Col>
    	<Col xs={6} md={4}><BarChartDemandWeather/></Col>
        </Row>
        <Row className="show-grid">
        <Col xs={12} sm={12} md={8}><TimelineBox/></Col>        
        </Row>
    </div>
       

    );
  }
}
