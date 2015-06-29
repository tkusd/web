import React from 'react';
import Palette from './Palette';
import Translation from '../i18n/Translation';

class SharePalette extends React.Component {
  render(){
    return (
      <Palette title={<Translation id="project.share"/>}></Palette>
    );
  }
}

export default SharePalette;
