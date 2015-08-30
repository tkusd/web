import React from 'react';
import {Saturation, Hue, Alpha, Checkboard} from 'react-color/lib/components/common';
import tinycolor from 'tinycolor2';
import {Dropdown, DropdownMenu} from '../dropdown';
import debounce from 'lodash/function/debounce';
import NumberInput from './NumberInput';
import HexInput from './HexInput';
import FontAwesome from '../common/FontAwesome';

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
      <div className={this.props.className}>
        <Dropdown className="color-picker__dropdown">
          <div className="color-picker__toggle">
            <Checkboard/>
            <div className="color-picker__toggle-color" style={{backgroundColor: this.props.value}}/>
          </div>
          {this.renderDialog()}
        </Dropdown>
        <button className="color-picker__reset" onClick={this.reset}>
          <FontAwesome icon="times"/>
        </button>
      </div>
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
          <Alpha hsl={hsl} rgb={rgb} onChange={this.handleChange}/>
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
        <label className="color-picker__input-double">
          <HexInput value={hex} onChange={this.handleHexChange}/>
          <span className="color-picker__input-label">Hex</span>
        </label>
        <label className="color-picker__input-single">
          <NumberInput value={rgb.r} min={0} max={255} onChange={this.handleRgbChange.bind(this, 'r')}/>
          <span className="color-picker__input-label">R</span>
        </label>
        <label className="color-picker__input-single">
          <NumberInput value={rgb.g} min={0} max={255} onChange={this.handleRgbChange.bind(this, 'g')}/>
          <span className="color-picker__input-label">G</span>
        </label>
        <label className="color-picker__input-single">
          <NumberInput value={rgb.b} min={0} max={255} onChange={this.handleRgbChange.bind(this, 'b')}/>
          <span className="color-picker__input-label">B</span>
        </label>
        <label className="color-picker__input-single">
          <NumberInput value={rgb.a} min={0} max={1} step={0.01} onChange={this.handleRgbChange.bind(this, 'a')}/>
          <span className="color-picker__input-label">A</span>
        </label>
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

  handleHexChange = (data) => {
    if (data.error) return;
    this.handleChange(data.value);
  }

  handleRgbChange = (key, value) => {
    const {color} = this.state;
    let rgb = color.toRgb();
    rgb[key] = value;

    this.handleChange(rgb);
  }

  handleDialogClick = (e) => {
    e.stopPropagation();
  }

  commitChange(){
    this.props.onChange(this.getColorString());
  }

  reset = () => {
    this.setState({
      color: tinycolor('')
    });
    this.props.onChange('');
  }
}

export default ColorPicker;