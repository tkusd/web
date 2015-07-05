import React from 'react';
import HomeHeader from './HomeHeader';

if (process.env.BROWSER){
  require('../../styles/HomeContainer/HomeContainer.styl');
}

class HomeContainer extends React.Component {
  render(){
    return (
      <div className="home-container">
        <div className="home-container__inner">
          <HomeHeader/>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default HomeContainer;
