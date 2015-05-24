import React from 'react'; // eslint-disable-line
import {Route, DefaultRoute, createRoutesFromReactChildren} from 'react-router';
import Application from './components/Application';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Settings from './components/Settings';
import Profile from './components/Profile';

function bindHook(hook, context){
  return function(){
    this.context = context;
    return hook.apply(this, arguments);
  };
}

function bindRoutesHooks(context, routes){
  routes.forEach(route => {
    if (route.handler){
      let handler = route.handler;

      if (typeof handler.onEnter === 'function'){
        route.onEnter = bindHook(handler.onEnter, context);
      }

      if (typeof handler.onLeave === 'function'){
        route.onLeave = bindHook(handler.onLeave, context);
      }
    }

    if (route.childRoutes){
      bindRoutesHooks(context, route.childRoutes);
    }
  });
}

export default function(context){
  let routes = createRoutesFromReactChildren(
    <Route name="app" path="/" handler={Application}>
      <Route name="signup" handler={Signup}/>
      <Route name="login" handler={Login}/>
      <Route name="settings" handler={Settings}/>
      <Route name="profile" path="/users/:id" handler={Profile}/>
      <DefaultRoute name="home" handler={Home}/>
    </Route>
  );

  bindRoutesHooks(context, routes);

  return routes;
}
