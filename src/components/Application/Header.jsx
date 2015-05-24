import React from 'react';
import MainNav from './MainNav';
import HeaderActions from './HeaderActions';

if (process.env.BROWSER){
  require('../../styles/Application/Header.styl');
}

class Header extends React.Component {
  render(){
    return (
      <header id="header">
        <MainNav/>
        <HeaderActions/>
      </header>
    );
  }
}

export default Header;
