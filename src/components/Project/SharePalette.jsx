import React from 'react';
import Palette from './Palette';
import {FormattedMessage} from '../intl';

class SharePalette extends React.Component {
  render(){
    return (
      <Palette title={<FormattedMessage message="project.share"/>}></Palette>
    );
  }
}

export default SharePalette;
