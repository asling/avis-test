/**
 *
 * Solutions
 *
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
import makeSelectSolutions from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

import SiteMapBox2 from 'components/SiteMapBox2'; 

import { Grid, Row, Col, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import { grid, row } from 'bootstrap-css';


export class Solutions extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  
  constructor(props){
    super(props);
    this.showSolutionDetail = this.showSolutionDetail.bind(this);
    this.solutionOne = Symbol("solutionOne");
    this.solutionTwo = Symbol("solutionTwo");
    this.state = {
      detailShow: this.solutionOne,
       detailContent1: 'xsdffsdfsdfsdfsdfsfsdfsdffsdfsdfsdfsdfsdf',
      detailContent2: '44444444444444444422222222222222222',
    }
  }
    
  showSolutionDetail(solution){
    this.setState({
      detailShow: solution,
    });
  }

  render() {
    console.log("this.state",this.state)
    const { detailShow, detailContent1, detailContent2 } = this.state;
    return (
      <div>
        <Helmet>
          <title>Solutions</title>
          <meta name="description" content="Description of Solutions" />
        </Helmet>
        <Grid>
          <Row>
            <Col xs={12} md={8}>
              <ListGroup>
                <ListGroupItem onClick={ () => { this.showSolutionDetail(this.solutionOne) }}>
                Solution A
                  <Panel collapsible expanded={detailShow === this.solutionOne}>
                    {detailContent1}
                  </Panel>
                </ListGroupItem>
                <ListGroupItem onClick={ () => { this.showSolutionDetail(this.solutionTwo) }}>
                Solution B
                  <Panel collapsible expanded={detailShow === this.solutionTwo}>
                    {detailContent2}
                  </Panel>
                </ListGroupItem>
                
              </ListGroup>
              
            </Col>
            <Col xs={6} md={4}>
                <div><SiteMapBox2 beforeData={} /></div>
                <div></div>
                <div><SiteMapBox2 afterData={} /></div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

Solutions.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  solutions: makeSelectSolutions(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'solutions', reducer });
const withSaga = injectSaga({ key: 'solutions', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Solutions);
