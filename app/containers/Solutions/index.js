/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import { changeUsername, sitesAction,solutionAction } from './actions';
import { makeSelectSites, makeCity, makeSolutionParam } from './selectors';
import reducer from './reducer';
import saga from './saga';

import { Grid, Row, Col, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import { grid, row } from 'bootstrap-css';
import SiteMapBox2 from 'components/SiteMapBox2';
import Img from 'components/Img';

export class Solutions extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */

   constructor(props,context){
    super(props);
    this.router = context.router;

    // console.log("this.router",this.router);
    let search = "";
    if(this.router && this.router.route && this.router.route.location && this.router.route.location.search){
       search = this.router.route.location.search;
    }


    const searchCityMatch = search.match(/city=([a-zA-Z0-9]+)/);
    const searchDateMatch = search.match(/date=([_0-9]+)/);
    const searchStypeMatch = search.match(/stype=([0-9]+)/);
    const city = searchCityMatch && searchCityMatch[1] ? searchCityMatch[1] : null;
    const date = searchDateMatch && searchDateMatch[1] ? searchDateMatch[1] : null;
    const stype = searchStypeMatch && searchStypeMatch[1] ? searchStypeMatch[1] : null;
    // console.log("this.city",this.city);
    this.showSolutionDetail = this.showSolutionDetail.bind(this);
    this.solutionOne = Symbol("solutionOne");
    this.solutionTwo = Symbol("solutionTwo");
    this.state = {
      city,
      detailShow: this.solutionOne,
      date,
      stype,
    }
   }
  componentDidMount() {
    const { city, date, stype } = this.state;
    this.props.onloadSites(city);
    this.props.onloadSolution({date,stype});
  }

  showSolutionDetail(type){
    this.setState({
      detailShow: type
    });
  }

  render() {
    const { sites, solution } = this.props;
    const { detailShow } = this.state;

    return (
      <article>
        <div>
        
        <Grid>
          <Row>
            <Col md={4}>
              <ListGroup>
                <ListGroupItem onClick={ () => { this.showSolutionDetail(this.solutionOne) }}>
                Solution A
                  <Panel collapsible expanded={detailShow === this.solutionOne}>
                   detailContent1
                  </Panel>
                </ListGroupItem>
                <ListGroupItem onClick={ () => { this.showSolutionDetail(this.solutionTwo) }}>
                Solution B
                  <Panel collapsible expanded={detailShow === this.solutionTwo}>
                    detailContent2
                  </Panel>
                </ListGroupItem>
                
              </ListGroup>
              
            </Col>
            <Col  xs={12} md={8} >
                <SiteMapBox2 />

                <Img className="solution-img" />

                <SiteMapBox2 />

            </Col>
          </Row>
        </Grid> 
        
        </div>
      </article>
    );
  }
}

Solutions.propTypes = {
  onLoadSites: PropTypes.func,
  sites: PropTypes.object,
  // city: PropTypes.string,
  // solutionParam: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.string,
  // ]),
};

Solutions.contextTypes = {
  router: PropTypes.object
};

export function mapDispatchToProps(dispatch) {
  return {
    onloadSites: (city) => {
      console.log("onLoadSites");
      dispatch(sitesAction(city));
      
    },

    onloadSolution: ({date,stype}) => {
      dispatch(solutionAction({date,stype}));
    }

  };
}

const mapStateToProps = createStructuredSelector({
  sites: makeSelectSites(),
  city: makeCity(),
  solutionParam: makeSolutionParam(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'solutions', reducer });
const withSaga = injectSaga({ key: 'solutions', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Solutions);
