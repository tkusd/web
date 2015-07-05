import React from 'react';
import Palette from '../Project/Palette';
import {Form, Input} from '../form';
import * as ElementAction from '../../actions/ElementAction';
import Translation from '../i18n/Translation';
import bindActions from '../../utils/bindActions';

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
    selectedElement: React.PropTypes.string
  }

  constructor(props, context){
    super(props, context);

    const {elements, selectedElement} = this.props;

    this.state = {
      element: elements.get(selectedElement)
    };

    this.handleSubmit = this.handleSubmit.bind(this);
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
      <Form className="attribute-palette" onSubmit={this.handleSubmit}>
        {/* Section: Size */}
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
        {/* Section: Position */}
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
        {/* Section: Style */}
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
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {
      width,
      height,
      position,
      top,
      left,
      right,
      bottom,
      opacity
    } = this.refs;

    const {selectedElement} = this.props;
    const {updateElement} = bindActions(ElementAction, this.context.flux);

    updateElement(selectedElement, {
      styles: {
        //
      }
    }).then(element => {
      //
    });


/*
    const {name} = this.refs;
    const {selectedElement} = this.props;

    if (name.getError()) return;

    this.context.executeAction(updateElement, selectedElement, {
      name: name.getValue()
    }).then(() => {
      this.setState({error: null});
    }).catch(err => {
      this.setState({error: err.body || err});
    });*/
  }
}

export default AttributePalette;
