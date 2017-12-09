import React, {Component} from 'react';
import {render} from 'react-dom';
import { Link} from 'react-router-dom';	     

import MapGL, {Marker, Popup, NavigationControl} from 'react-map-gl';
import {Button} from 'react-bootstrap';

import ControlPanel from './control-panel';
import SitePin from './site-pin';
import SiteInfo from './site-info';

import SITES from './sites';
import styled from 'styled-components';

const TOKEN =  process.env.MapboxAccessToken; // Set your mapbox token here

const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};

const solutionBtnStyle = {
	position: 'absolute',
	left: '0.5em',
	bottom: '2.5em'
}



class SiteMapBox2 extends Component {

  constructor(props) {
    super(props);
    
    const lat = 48.86223;
    const lon = 2.341511;
    
    this.state = {
     width_scaler:0.9,
     height_scaler:0.8,
    
      viewport: {
        latitude: lat,
        longitude: lon,
        zoom: 9,
        bearing: 0,
        pitch: 0,
        width: 500,
        height: 500,
      },
      popupInfo: null
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _resize = () => {
	  
	const { width_scaler,height_scaler } = this.state;
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: (this.props.width || window.innerWidth)*width_scaler,
        height: (this.props.height || window.innerHeight)*height_scaler
      }
    });
  };

  _updateViewport = (viewport) => {
    this.setState({viewport});
  }

  _renderSiteMarker = (site, index) => {
    return (
      <Marker key={`marker-${index}`}
        longitude={site.longitude}
        latitude={site.latitude} >
        <SitePin size={20} onClick={() => this.setState({popupInfo: site})} />
      </Marker>
    );
  }

  _renderPopup() {
    const {popupInfo} = this.state;

    return popupInfo && (
      <Popup tipSize={5}
        anchor="top"
        longitude={popupInfo.longitude}
        latitude={popupInfo.latitude}
        onClose={() => this.setState({popupInfo: null})} >
        <SiteInfo info={popupInfo} />
      </Popup>
    );
  }

  render() {

    const {viewport} = this.state;
    

    return (
    <div>
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/bright-v9"
        onViewportChange={this._updateViewport}
        mapboxApiAccessToken={TOKEN} >

        { SITES.map(this._renderSiteMarker) }

        {this._renderPopup()}

        <div className="nav" style={navStyle}>
          <NavigationControl onViewportChange={this._updateViewport} />
        </div>

        <ControlPanel containerComponent={this.props.containerComponent} />

        <Button style={solutionBtnStyle} ><Link  to="/solutions">I want Solutions</Link></Button>
      </MapGL>
      
      
    </div>
    );
  }

}
export default SiteMapBox2;
