/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Switch, Route,BrowserRouter as Router,Link} from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import FeaturePage1 from 'containers/FeaturePage1/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import SitesMapPage from 'containers/SitesMapPage/Loadable';
import Solutions from 'containers/Solutions/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

const AppWrapper = styled.div`

  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

export default class App extends React.Component{
  
  constructor(props,context){
    super(props);
  }

  render(){
    return (
      <AppWrapper>
        <Helmet
          titleTemplate="%s"
          defaultTitle="React.js Boilerplate"
        >
        <meta name="description" content="Power by Ericsson" />
        </Helmet>
        <Header />            
        <Switch> 
          <Route exact path="/" component={HomePage} />
          <Route path="/sitesmap/:city" component={SitesMapPage} />
          <Route path="/feature1" component={FeaturePage1} />
          <Route path="/solutions" component={Solutions} />        
          <Route path="" component={NotFoundPage} />
          
        </Switch>
        
        <Footer />
      </AppWrapper>
    );

  }


}

