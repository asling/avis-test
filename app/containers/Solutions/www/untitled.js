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
import {makeSelectSites} from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

import SiteMapBox2 from '../../components/SiteMapBox2'; 

import { Grid, Row, Col, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import { grid, row } from 'bootstrap-css';


export class Solutions extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  
  constructor(props){
    super(props);
    this.showSolutionDetail = this.showSolutionDetail.bind(this);
    this.solutionOne = Symbol("solutionOne");
    this.solutionTwo = Symbol("solutionTwo");
    // this.state = {
    //   detailShow: this.solutionOne,
    //    detailContent1: 'xsdffsdfsdfsdfsdfsfsdfsdffsdfsdfsdfsdfsdf',
    //   detailContent2: '44444444444444444422222222222222222',
    // }
  }
    
  showSolutionDetail(solution){
    this.setState({
      detailShow: solution,
    });
  }

  // <Grid>
  //         <Row>
  //           <Col xs={12} md={8}>
  //             <ListGroup>
  //               <ListGroupItem onClick={ () => { this.showSolutionDetail(this.solutionOne) }}>
  //               Solution A
  //                 <Panel collapsible expanded={detailShow === this.solutionOne}>
  //                   {detailContent1}
  //                 </Panel>
  //               </ListGroupItem>
  //               <ListGroupItem onClick={ () => { this.showSolutionDetail(this.solutionTwo) }}>
  //               Solution B
  //                 <Panel collapsible expanded={detailShow === this.solutionTwo}>
  //                   {detailContent2}
  //                 </Panel>
  //               </ListGroupItem>
                
  //             </ListGroup>
              
  //           </Col>
  //           <Col  md={4}>
                
  //           </Col>
  //         </Row>
  //       </Grid>

  render() {
    console.log("this.state",this.state);
    // const { detailShow, detailContent1, detailContent2 } = this.state;
    return (
      <div>
        <Helmet>
          <title>Solutions</title>
          <meta name="description" content="Description of Solutions" />
        </Helmet>
         1111111
      </div>
    );
  }
}

Solutions.propTypes = {
  dispatch: PropTypes.func.isRequired,
  sites: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  sites: makeSelectSites(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadSites: (evt) => dispatch(makeSelectSites(city)),
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
