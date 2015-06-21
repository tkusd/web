import React from 'react';
import Palette from './Palette';

class StylePalette extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired
  }

  static propTypes = {
    elements: React.PropTypes.object.isRequired,
    selectedElement: React.PropTypes.string
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      error: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(){
    let {error} = this.state;

    if (error && error.field){
      this.refs[error.field].setError(error.message);
    }
  }

  render(){
    return (
      <Palette title="Styles">
        {this.renderForm()}
      </Palette>
    );
  }

  renderForm(){
    const {elements, selectedElement} = this.props;
    if (!selectedElement) return;
  }

  handleSubmit(e){
    e.preventDefault();
  }
}

export default StylePalette;
