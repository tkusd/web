import React from 'react';
import MainNav from './MainNav';
import ProfileNav from './ProfileNav';

if (process.env.BROWSER){
  require('../../styles/Application/Header.styl');
}

class Header extends React.Component {
  render(){
    return (
      <header id="header">
        <MainNav/>
        <ProfileNav/>
      </header>
    );
  }
}

export default Header;
