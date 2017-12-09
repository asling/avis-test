import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL, {Marker} from 'react-map-gl';


const MAPBOX_TOKEN = process.env.MapboxAccessToken;  // Set your mapbox token here
import ControlPanel from './control-panel';

import sites from './sites_available';

import MARKER_STYLE from './marker-style';


class SiteMapBox extends Component {

  state = {
		  
    width_scaler:0.8,
	height_scaler:0.8,
    viewport: {
      latitude: 48.86223,
      longitude: 2.341511,
      zoom: 11,
      bearing: 0,
      pitch: 0,
      width: 500,
      height: 400
    },
    settings: {
      dragPan: true,
      dragRotate: true,
      scrollZoom: true,
      touchZoomRotate: true,
      doubleClickZoom: true,
      minZoom: 0,
      maxZoom: 20,
      minPitch: 0,
      maxPitch: 85,
     
    }
  };

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

  _onViewportChange = viewport => this.setState({viewport});

  _onSettingChange = (name, value) => this.setState({
    settings: {...this.state.settings, [name]: value}
  });

  _renderMarker(station, i) {
    const {name, coordinates} = station;
    return (
      <Marker key={i} longitude={coordinates[0]} latitude={coordinates[1]} >
        <div className="station"><span>{name}</span></div>
      </Marker>
    );
  }

  render() {

    const {viewport, settings} = this.state;

    return (
      <MapGL
        {...viewport}
        {...settings}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onViewportChange={this._onViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN} >
        <style>{MARKER_STYLE}</style>
        { sites.map(this._renderMarker) }
   
      </MapGL>
    );
  }

}

export default SiteMapBox;
