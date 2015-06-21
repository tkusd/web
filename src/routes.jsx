import React from 'react'; // eslint-disable-line
import {Route, DefaultRoute, NotFoundRoute, createRoutesFromReactChildren} from 'react-router';
import Application from './components/Application';
import Signup from './components/Signup';
import Login from './components/Login';
import HomeContainer from './components/HomeContainer';
import Home from './components/Home';
import Settings from './components/Settings';
import Profile from './components/Profile';
import Project from './components/Project';
import NotFound from './components/NotFound';
import Dashboard from './components/Dashboard';
import LoginContainer from './components/LoginContainer';

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
    <Route handler={Application}>
      <Route handler={HomeContainer}>
        <DefaultRoute name="home" handler={Home}/>
      </Route>
      <Route handler={LoginContainer}>
        <Route name="signup" handler={Signup}/>
        <Route name="login" handler={Login}/>
      </Route>
      <Route handler={Dashboard}>
        <Route name="settings" handler={Settings}/>
        <Route name="profile" path="/users/:id" handler={Profile}/>
        <Route name="project" path="/projects/:id" handler={Project}/>
      </Route>
      <NotFoundRoute handler={NotFound}/>
    </Route>
  );

  bindRoutesHooks(context, routes);

  return routes;
}
