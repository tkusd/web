import React from 'react';
import {RouteHandler} from 'react-router';
import DashboardHeader from './DashboardHeader';

if (process.env.BROWSER){
  require('../../styles/Dashboard/Dashboard.styl');
}

class Dashboard extends React.Component {
  render(){
    return (
      <div className="dashboard">
        <DashboardHeader/>
        <div className="dashboard__content">
          <RouteHandler/>
        </div>
      </div>
    );
  }
}

export default Dashboard;
