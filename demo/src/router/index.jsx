//@flow
import React from 'react';
import createHashHistory from 'history/createHashHistory';
import { Route, Router as HashRouter, Switch } from 'react-router-dom';
import Bundle from './Bundle';
import Config from './config';

const createComponent = (component) => (props) => (
  <Bundle load={component}>
    {(Component) => <Component {...props} />}
  </Bundle>
);
const MyRouter = () => (
  <HashRouter history={createHashHistory()}>
    <Switch>
      {
        Config.map(v => (
          <Route
            key={v.name}
            path={v.path}
            name={v.name}
            exact
            component={
              createComponent(v.component)
            }
          />
        ))
      }
    </Switch>
  </HashRouter>
);

export default MyRouter;