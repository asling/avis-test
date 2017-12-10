/*
 * FeaturePage
 *
 * List all the features
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { sitesAction, } from './actions';
import {  makeSelectSites, makeCity, } from './selectors';


import { Grid, Row, Col, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import { grid, row } from 'bootstrap-css';


export class Solutions extends React.Component { // eslint-disable-line react/prefer-stateless-function

  // Since state and props are static,
  // there's no need to re-render this component
  constructor(props){
    super(props);
  }

  render() {
    const { sites } = this.props;
    return (
      <div>
        <Helmet>
          <title>Feature Page</title>
          <meta name="description" content="Feature page of React.js Boilerplate application" />
        </Helmet>
        dfsdff
      </div>
    );
  }
}


Solutions.propTypes = {
  
  onLoadSites: PropTypes.func,
  sites: PropTypes.object,
  city: PropTypes.string,
};

export function mapDispatchToProps(dispatch) {
  return {
    onLoadSites: (city) => {
      console.log("onLoadSites");
      dispatch(sitesAction(city));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  sites: makeSelectSites(),
  city: makeCity(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'xx', reducer });
const withSaga = injectSaga({ key: 'xx', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Solutions);