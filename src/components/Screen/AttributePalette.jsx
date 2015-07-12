import React from 'react';
import Palette from '../Project/Palette';
import {LayoutBox, SizeInput} from '../form';
import Translation from '../i18n/Translation';
import AttributeSection from './AttributeSection';

if (process.env.BROWSER){
  require('../../styles/Screen/AttributePalette.styl');
}

class AttributePalette extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    components: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    activeElement: React.PropTypes.string,
    updateElement: React.PropTypes.func.isRequired
  }

  constructor(props, context){
    super(props, context);

    const {elements, activeElement} = this.props;

    this.state = {
      element: elements.get(activeElement)
    };
  }

  componentWillReceiveProps(nextProps) {
    const {activeElement} = this.props;

    if (activeElement !== nextProps.activeElement) {
      this.setState({
        element: nextProps.elements.get(nextProps.activeElement)
      });

      setTimeout(() => {
        Object.keys(this.refs).forEach(key => {
          this.refs[key].reset();
        });
      }, 0);
    }
  }

  render(){
    return (
      <Palette title={<Translation id="project.attributes"/>}>
        {this.renderForm()}
      </Palette>
    );
  }

  renderForm(){
    const {element} = this.state;

    if (!element){
      return (
        <div className="attribute-palette__empty">
          <Translation id="project.select_element_hint"/>
        </div>
      );
    }

    return (
      <div className="attribute-palette">
        {this.renderDimensionSection()}
        {this.renderMarginSection()}
        {this.renderPaddingSection()}
        {this.renderTypographySection()}
      </div>
    );
  }

  renderDimensionSection(){
    const {element} = this.state;

    return (
      <AttributeSection title="Dimensions">
        <div className="attribute-palette__half-wrap">
          <div className="attribute-palette__half">
            <SizeInput
              label="Width"
              value={element.get('styles').width}
              onChange={this.handleInputChange.bind(this, 'styles.width')}/>
          </div>
          <div className="attribute-palette__half">
            <SizeInput
              label="Height"
              value={element.get('styles').height}
              onChange={this.handleInputChange.bind(this, 'styles.height')}/>
          </div>
        </div>
      </AttributeSection>
    );
  }

  renderMarginSection(){
    const {element} = this.state;

    return (
      <AttributeSection title="Margin">
        <LayoutBox
          value={{
            top: element.get('styles').marginTop,
            left: element.get('styles').marginLeft,
            right: element.get('styles').marginRight,
            bottom: element.get('styles').marginBottom
          }}
          onChange={this.handleBoxChange.bind(this, 'styles.margin')}/>
      </AttributeSection>
    );
  }

  renderPaddingSection(){
    const {element} = this.state;

    return (
      <AttributeSection title="Padding">
        <LayoutBox
          value={{
            top: element.get('styles').paddingTop,
            left: element.get('styles').paddingLeft,
            right: element.get('styles').paddingRight,
            bottom: element.get('styles').paddingBottom
          }}
          onChange={this.handleBoxChange.bind(this, 'styles.padding')}/>
      </AttributeSection>
    );
  }

  renderTypographySection(){
    const {element} = this.state;

    return (
      <AttributeSection title="Typography">
        <SizeInput
          label="Size"
          value={element.get('styles').fontSize}
          onChange={this.handleInputChange.bind(this, 'styles.fontSize')}/>
      </AttributeSection>
    );
  }

  handleInputChange(key, data) {
    const {element} = this.state;
    const split = key.split('.');
    let obj = element.get(split[0]);
    obj[split[1]] = data;
    let newElement = element.set(split[0], obj);

    this.props.updateElement(this.props.activeElement, newElement);
  }

  handleBoxChange(key, data){
    const {element} = this.state;
    const split = key.split('.');
    let obj = element.get(split[0]);

    Object.keys(data).forEach(key => {
      obj[split[1] + key[0].toUpperCase() + key.substring(1)] = data[key];
    });

    let newElement = element.set(split[0], obj);
    this.props.updateElement(this.props.activeElement, newElement);
  }
}

export default AttributePalette;
