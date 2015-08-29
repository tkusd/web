import React from 'react';
import {EditableInput, Saturation, Hue, Alpha, Checkboard} from 'react-color/lib/components/common';
import tinycolor from 'tinycolor2';
import assign from 'lodash/object/assign';
import {Dropdown, DropdownMenu} from '../dropdown';
import debounce from 'lodash/function/debounce';

if (process.env.BROWSER){
  require('../../styles/form/ColorPicker.styl');
}

function noop(){}

const DEBOUNCE_DELAY = 100;

const presetColors = ['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF'];

class ColorPicker extends React.Component {
  static propTypes = {
    value: React.PropTypes.any,
    onChange: React.PropTypes.func.isRequired,
    active: React.PropTypes.bool.isRequired,
    presetColors: React.PropTypes.arrayOf(React.PropTypes.string)
  }

  static defaultProps = {
    onChange: noop,
    active: false,
    presetColors
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      color: tinycolor(this.props.value)
    };

    this.commitChange = debounce(this.commitChange.bind(this), DEBOUNCE_DELAY, {
      leading: false
    });
  }

  componentWillReceiveProps(nextProps){
    if (this.props.value !== nextProps.value){
      this.setState({
        color: tinycolor(nextProps.value)
      });
    }

    if (nextProps.hasOwnProperty('active')){
      this.setState({
        active: nextProps.active
      });
    }
  }

  getColorString(){
    const {color} = this.state;

    if (color.getAlpha() < 1){
      return color.toRgbString();
    }

    return color.toHexString();
  }

  render(){
    return (
      <Dropdown className={this.props.className}>
        <div className="color-picker__toggle">
          <Checkboard/>
          <div className="color-picker__toggle-color" style={{backgroundColor: this.props.value}}/>
        </div>
        {this.renderDialog()}
      </Dropdown>
    );
  }

  renderDialog(){
    const {color} = this.state;
    const hsl = color.toHsl();
    const rgb = color.toRgb();
    const hsv = color.toHsv();

    return (
      <DropdownMenu className="color-picker__dialog" position="fixed" onClick={this.handleDialogClick}>
        <div className="color-picker__saturation">
          <Saturation hsl={hsl} hsv={hsv} onChange={this.handleChange}/>
        </div>
        <div className="color-picker__slider">
          <Hue hsl={hsl} onChange={this.handleChange}/>
        </div>
        <div className="color-picker__slider">
          <Alpha rgb={rgb} onChange={this.handleChange}/>
        </div>
        {this.renderFields()}
        {this.renderPresetColors()}
      </DropdownMenu>
    );
  }

  renderFields(){
    const {color} = this.state;
    const hex = color.toHex();
    const rgb = color.toRgb();

    return (
      <div className="color-picker__input-group">
        <div className="color-picker__input-double">
          <EditableInput label="hex" value={hex} onChange={this.handleInputChange}/>
        </div>
        <div className="color-picker__input-single">
          <EditableInput label="r" value={rgb.r} onChange={this.handleInputChange}/>
        </div>
        <div className="color-picker__input-single">
          <EditableInput label="g" value={rgb.g} onChange={this.handleInputChange}/>
        </div>
        <div className="color-picker__input-single">
          <EditableInput label="b" value={rgb.b} onChange={this.handleInputChange}/>
        </div>
        <div className="color-picker__input-single">
          <EditableInput label="a" value={rgb.a} onChange={this.handleInputChange}/>
        </div>
      </div>
    );
  }

  renderPresetColors(){
    let btns = this.props.presetColors.map((color, i) => (
      <button className="color-picker__preset-color"
        key={i}
        style={{backgroundColor: color}}
        onClick={this.handleChange.bind(this, color)}/>
    ));

    return (
      <div className="color-picker__preset-color-group">
        {btns}
      </div>
    );
  }

  handleChange = (color) => {
    this.setState({
      color: tinycolor(color)
    });

    this.commitChange();
  }

  handleInputChange = (data) => {
    if (data.r || data.g || data.b || data.a){
      let {rgb} = this.state.color;
      this.handleChange(assign(rgb, data));
    } else if (data.hex){
      this.handleChange(data.hex);
    }
  }

  handleDialogClick = (e) => {
    e.stopPropagation();
  }

  commitChange(){
    this.props.onChange(this.getColorString());
  }
}

export default ColorPicker;