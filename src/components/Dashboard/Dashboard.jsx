import React from 'react';
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
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Dashboard;
