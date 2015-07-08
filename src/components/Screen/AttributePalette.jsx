import React from 'react';
import Palette from '../Project/Palette';
import {Form, Input} from '../form';
import Translation from '../i18n/Translation';

if (process.env.BROWSER){
  require('../../styles/Screen/AttributePalette.styl');
}

class AttributePalette extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    updateElement: React.PropTypes.func.isRequired
  }

  static propTypes = {
    components: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    selectedElement: React.PropTypes.string
  }

  constructor(props, context){
    super(props, context);

    const {elements, selectedElement} = this.props;

    this.state = {
      element: elements.get(selectedElement)
    };
  }

  componentDidUpdate(prevProps){
    const {elements, selectedElement} = this.props;

    if (selectedElement !== prevProps.selectedElement){
      this.setState({
        element: elements.get(selectedElement)
      });

      Object.keys(this.refs).forEach(key => {
        this.refs[key].reset();
      });
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
      <Form className="attribute-palette">
        <Input
          name="width"
          type="number"
          label="Width"
          initialValue={element.get('styles').width}
          min={0}
          onChange={this.handleInputChange.bind(this, 'styles.width')}/>
        <Input
          name="height"
          type="number"
          label="Height"
          initialValue={element.get('styles').height}
          min={0}
          onChange={this.handleInputChange.bind(this, 'styles.height')}/>
        <Input
          name="marginLeft"
          type="number"
          label="Margin (left)"
          initialValue={element.get('styles').marginLeft}
          onChange={this.handleInputChange.bind(this, 'styles.marginLeft')}/>
        <Input
          name="marginRight"
          type="number"
          label="Margin (right)"
          initialValue={element.get('styles').marginRight}
          onChange={this.handleInputChange.bind(this, 'styles.marginRight')}/>
        <Input
          name="marginTop"
          type="number"
          label="Margin (top)"
          initialValue={element.get('styles').marginTop}
          onChange={this.handleInputChange.bind(this, 'styles.marginTop')}/>
        <Input
          name="marginBottom"
          type="number"
          label="Margin (bottom)"
          initialValue={element.get('styles').marginBottom}
          onChange={this.handleInputChange.bind(this, 'styles.marginBottom')}/>
        <Input
          name="paddingLeft"
          type="number"
          label="Padding (left)"
          initialValue={element.get('styles').paddingLeft}
          min={0}
          onChange={this.handleInputChange.bind(this, 'styles.paddingLeft')}/>
        <Input
          name="paddingRight"
          type="number"
          label="Padding (right)"
          initialValue={element.get('styles').paddingRight}
          min={0}
          onChange={this.handleInputChange.bind(this, 'styles.paddingRight')}/>
        <Input
          name="paddingTop"
          type="number"
          label="Padding (top)"
          initialValue={element.get('styles').paddingTop}
          min={0}
          onChange={this.handleInputChange.bind(this, 'styles.paddingTop')}/>
        <Input
          name="paddingBottom"
          type="number"
          label="Padding (bottom)"
          initialValue={element.get('styles').paddingBottom}
          min={0}
          onChange={this.handleInputChange.bind(this, 'styles.paddingBottom')}/>
      </Form>
    );
/*
    return (
      <Form className="attribute-palette" onSubmit={this.handleSubmit}>
        <section className="attribute-palette__section">
          <div className="attribute-palette__half-wrap">
            <div className="attribute-palette__half">
              <Input
                name="width"
                type="number"
                ref="width"
                label={<Translation id="project.width"/>}
                initialValue={element.get('styles').width}
                min={0}/>
            </div>
            <div className="attribute-palette__half">
              <Input
                name="height"
                type="number"
                ref="height"
                label={<Translation id="project.height"/>}
                initialValue={element.get('styles').height}
                min={0}/>
            </div>
          </div>
        </section>
        <section className="attribute-palette__section">
          <h4 className="attribute-palette__section-title">
            <Translation id="project.position"/>
          </h4>
          <Input
            name="position"
            type="select"
            ref="position"
            initialValue={element.get('styles').position}>
            <option value="">
              <Translation id="project.default"/>
            </option>
            <option value="relative">
              <Translation id="project.position_relative"/>
            </option>
            <option value="absolute">
              <Translation id="project.position_absolute"/>
            </option>
            <option value="fixed">
              <Translation id="project.position_fixed"/>
            </option>
          </Input>
          <div className="attribute-palette__half-wrap">
            <div className="attribute-palette__half-center">
              <Input
                name="top"
                type="number"
                ref="top"
                label={<Translation id="project.top"/>}
                initialValue={element.get('styles').top}/>
            </div>
          </div>
          <div className="attribute-palette__half-wrap">
            <div className="attribute-palette__half">
              <Input
                name="left"
                type="number"
                ref="left"
                label={<Translation id="project.left"/>}
                initialValue={element.get('styles').left}/>
            </div>
            <div className="attribute-palette__half">
              <Input
                name="right"
                type="number"
                ref="right"
                label={<Translation id="project.right"/>}
                initialValue={element.get('styles').right}/>
            </div>
          </div>
          <div className="attribute-palette__half-wrap">
            <div className="attribute-palette__half-center">
              <Input
                name="bottom"
                type="number"
                ref="bottom"
                label={<Translation id="project.bottom"/>}
                initialValue={element.get('styles').bottom}/>
            </div>
          </div>
        </section>
        <section className="attribute-palette__section">
          <h4 className="attribute-palette__section-title">
            <Translation id="project.style"/>
          </h4>
          <Input
            name="opacity"
            type="text"
            ref="opacity"
            label={<Translation id="project.opacity"/>}
            initialValue={element.get('opacity')}/>
        </section>
        <div className="attribute-palette__btn-wrap">
          <button className="attribute-palette__save">
            <Translation id="common.update"/>
          </button>
        </div>
      </Form>
    );*/
  }

  handleInputChange(key, data){
    if (data.error) return;

    const {element} = this.state;
    const split = key.split('.');
    let obj = element.get(split[0]);
    obj[split[1]] = data.value;
    let newElement = element.set(split[0], obj);

    this.context.updateElement(this.props.selectedElement, newElement);
  }

  handleSubmit(e){
    e.preventDefault();
  }
}

export default AttributePalette;
