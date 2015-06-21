import React from 'react';
import Palette from './Palette';
import Translation from '../i18n/Translation';

class SettingPalette extends React.Component {
  render(){
    return (
      <Palette title={<Translation id="common.settings"/>}></Palette>
    );
  }
}

export default SettingPalette;
