import React from 'react';
import Input from 'react-form-input';

const rHexColor = /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i;

function validateHex(value){
  if (!rHexColor.test(value)){
    return 'Not a valid hex color';
  }
}

class HexInput extends React.Component {
  render(){
    return (
      <Input {...this.props}
        type="text"
        validators={[validateHex]}/>
    );
  }
}

export default HexInput;
