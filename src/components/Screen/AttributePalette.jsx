import React from 'react';
import Palette from '../Project/Palette';
import {LayoutBox, SizeInput, ColorPicker} from '../form';
import AttributeSection from './AttributeSection';
import {FormattedMessage} from '../intl';

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
    this.setState({
      element: nextProps.elements.get(nextProps.activeElement)
    });
  }

  render(){
    return (
      <Palette title={<FormattedMessage message="project.attributes"/>}>
        {this.renderForm()}
      </Palette>
    );
  }

  renderForm(){
    const {element} = this.state;

    if (!element){
      return (
        <div className="attribute-palette__empty">
          <FormattedMessage message="project.select_element_hint"/>
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
    const styles = element.get('styles');

    return (
      <AttributeSection title="Dimensions">
        <div className="attribute-palette__half-wrap">
          <div className="attribute-palette__half">
            <SizeInput
              label="Width"
              value={styles.get('width')}
              onChange={this.handleInputChange.bind(this, 'styles.width')}/>
          </div>
          <div className="attribute-palette__half">
            <SizeInput
              label="Height"
              value={styles.get('height')}
              onChange={this.handleInputChange.bind(this, 'styles.height')}/>
          </div>
        </div>
      </AttributeSection>
    );
  }

  renderMarginSection(){
    const {element} = this.state;
    const styles = element.get('styles');

    return (
      <AttributeSection title="Margin">
        <LayoutBox
          value={{
            top: styles.get('marginTop'),
            left: styles.get('marginLeft'),
            right: styles.get('marginRight'),
            bottom: styles.get('marginBottom')
          }}
          onChange={this.handleBoxChange.bind(this, 'styles.margin')}/>
      </AttributeSection>
    );
  }

  renderPaddingSection(){
    const {element} = this.state;
    const styles = element.get('styles');

    return (
      <AttributeSection title="Padding">
        <LayoutBox
          value={{
            top: styles.get('paddingTop'),
            left: styles.get('paddingLeft'),
            right: styles.get('paddingRight'),
            bottom: styles.get('paddingBottom')
          }}
          onChange={this.handleBoxChange.bind(this, 'styles.padding')}/>
      </AttributeSection>
    );
  }

  renderTypographySection(){
    const {element} = this.state;
    const styles = element.get('styles');

    return (
      <AttributeSection title="Typography">
        <div className="attribute-palette__half-wrap">
          <div className="attribute-palette__half">
            <SizeInput
              label="Size"
              value={styles.get('fontSize')}
              onChange={this.handleInputChange.bind(this, 'styles.fontSize')}/>
          </div>
          <div className="attribute-palette__half">
            <SizeInput
              label="Line height"
              value={styles.get('lineHeight')}
              onChange={this.handleInputChange.bind(this, 'styles.lineHeight')}/>
          </div>
        </div>
        <ColorPicker
          label="Color"
          value={styles.get('color')}
          onChange={this.handleInputChange.bind(this, 'styles.color')}/>
      </AttributeSection>
    );
  }

  handleInputChange(key, data) {
    const {element} = this.state;
    const split = key.split('.');
    let obj = element.get(split[0]).set(split[1], data);
    let newElement = element.set(split[0], obj);

    this.props.updateElement(this.props.activeElement, newElement);
  }

  handleBoxChange(key, data){
    const {element} = this.state;
    const split = key.split('.');
    let obj = element.get(split[0]);

    Object.keys(data).forEach(key => {
      obj = obj.set(split[1] + key[0].toUpperCase() + key.substring(1), data[key]);
    });

    let newElement = element.set(split[0], obj);
    this.props.updateElement(this.props.activeElement, newElement);
  }
}

export default AttributePalette;
