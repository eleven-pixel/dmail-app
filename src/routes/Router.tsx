import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Home from '../components/home';
import Inbox from '../components/inbox';
import Sent from '../components/sent';

const Routers: React.FC = () => {
  return (
    <HashRouter>
      <Switch>
      <Route path="/" component={Home} exact /> 
      <Route path="/inbox" component={Inbox} />
      <Route path="/sent" component={Sent} />
      </Switch>
    </HashRouter>
  );
};

export default Routers;
