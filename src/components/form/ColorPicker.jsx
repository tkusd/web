import React from 'react';
import {Dropdown, DropdownMenu, DropdownItem} from '../dropdown';
import chunk from 'lodash/array/chunk';

if (process.env.BROWSER){
  require('../../styles/form/ColorPicker.styl');
}

function noop(){}

// https://github.com/imathis/hsl-picker/blob/master/assets/javascripts/modules/color.coffee
const HEX3_REGEX = /^#([0-9a-f]{3})$/;
const HEX6_REGEX = /^#([0-9a-f]{6})$/;
const RGB_REGEX = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?\s*(0?\.?\d+)?\s*\)$/;
const HSL_REGEX = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\%\s*,\s*(\d{1,3})\%\s*,?\s*(0?\.?\d+)?\s*\)$/;

const COLOR_PALETTES = [
  // Gray
  {r: 0, g: 0, b: 0},
  {r: 67, g: 67, b: 67},
  {r: 102, g: 102, b: 102},
  {r: 153, g: 153, b: 153},
  {r: 183, g: 183, b: 183},
  {r: 204, g: 204, b: 204},
  {r: 217, g: 217, b: 217},
  {r: 239, g: 239, b: 239},
  {r: 243, g: 243, b: 243},
  {r: 255, g: 255, b: 255},
  // Color
  {r: 152, g: 0, b: 0},
  {r: 255, g: 0, b: 0},
  {r: 255, g: 153, b: 0},
  {r: 255, g: 255, b: 0},
  {r: 0, g: 255, b: 0},
  {r: 0, g: 255, b: 255},
  {r: 74, g: 134, b: 232},
  {r: 0, g: 0, b: 255},
  {r: 153, g: 0, b: 255},
  {r: 255, g: 0, b: 255},
  // Light color 3
  {r: 230, g: 184, b: 175},
  {r: 244, g: 204, b: 204},
  {r: 252, g: 229, b: 205},
  {r: 255, g: 242, b: 204},
  {r: 217, g: 234, b: 211},
  {r: 208, g: 224, b: 227},
  {r: 201, g: 218, b: 248},
  {r: 207, g: 226, b: 243},
  {r: 217, g: 210, b: 233},
  {r: 234, g: 209, b: 220},
  // Light color 2
  {r: 221, g: 126, b: 107},
  {r: 234, g: 153, b: 153},
  {r: 249, g: 203, b: 156},
  {r: 255, g: 229, b: 153},
  {r: 182, g: 215, b: 168},
  {r: 162, g: 196, b: 201},
  {r: 164, g: 194, b: 244},
  {r: 159, g: 197, b: 232},
  {r: 180, g: 167, b: 214},
  {r: 213, g: 166, b: 189},
  // Light color 1
  {r: 204, g: 65, b: 37},
  {r: 224, g: 102, b: 102},
  {r: 246, g: 178, b: 107},
  {r: 255, g: 217, b: 102},
  {r: 147, g: 196, b: 125},
  {r: 118, g: 165, b: 175},
  {r: 109, g: 158, b: 235},
  {r: 111, g: 168, b: 220},
  {r: 142, g: 124, b: 195},
  {r: 194, g: 123, b: 160},
  // Dark color 1
  {r: 166, g: 28, b: 0},
  {r: 204, g: 0, b: 0},
  {r: 230, g: 145, b: 56},
  {r: 241, g: 194, b: 50},
  {r: 106, g: 168, b: 79},
  {r: 69, g: 129, b: 142},
  {r: 60, g: 120, b: 216},
  {r: 61, g: 133, b: 198},
  {r: 103, g: 78, b: 167},
  {r: 166, g: 77, b: 121},
  // Dark color 2
  {r: 133, g: 32, b: 12},
  {r: 153, g: 0, b: 0},
  {r: 180, g: 95, b: 6},
  {r: 191, g: 144, b: 0},
  {r: 56, g: 118, b: 29},
  {r: 19, g: 79, b: 92},
  {r: 17, g: 85, b: 204},
  {r: 11, g: 83, b: 148},
  {r: 53, g: 28, b: 117},
  {r: 116, g: 27, b: 71},
  // Dark color 3
  {r: 91, g: 15, b: 0},
  {r: 102, g: 0, b: 0},
  {r: 120, g: 63, b: 4},
  {r: 127, g: 96, b: 0},
  {r: 39, g: 78, b: 19},
  {r: 12, g: 52, b: 61},
  {r: 28, g: 69, b: 135},
  {r: 7, g: 55, b: 99},
  {r: 32, g: 18, b: 77},
  {r: 76, g: 17, b: 48}
];

function convertHue(p, q, h){
  if (h < 0) h++;
  if (h > 1) h--;

  let color;

  if (h * 6 < 1){
    color = p + (q - p) * h * 6;
  } else if (h * 2 < 1){
    color = q;
  } else if (h * 3 < 2){
    color = p + (q - p) * ((2 / 3) - h) * 6;
  } else {
    color = p;
  }

  return Math.round(color * 255);
}

function convertRGB(value){
  var str = value.toString(16);
  if (value < 16) return '0' + str;

  return str;
}

class ColorPicker extends React.Component {
  static propTypes = {
    initialValue: React.PropTypes.string,
    value: React.PropTypes.string,
    label: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element
    ]),
    onChange: React.PropTypes.func.isRequired,
    className: React.PropTypes.string
  }

  static defaultProps = {
    onChange: noop
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      value: this.parseColor(this.props.value != null ? this.props.value : this.props.initialValue)
    };
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.hasOwnProperty('value')){
      this.setState({value: this.parseColor(nextProps.value)});
    }
  }

  parseColor(color){
    if (!color) return;

    let data = {
      r: 0,
      g: 0,
      b: 0,
      a: 1
    };

    let txt, code, match;

    if (HEX3_REGEX.test(color)){
      txt = color.substring(1);
      code = parseInt(txt, 16);

      data.r = ((code & 0xF00) >> 8) * 17;
      data.g = ((code & 0xF0) >> 4) * 17;
      data.b = (code & 0xF) * 17;
    } else if (HEX6_REGEX.test(color)){
      txt = color.substring(1);
      code = parseInt(txt, 16);

      data.r = (code & 0xFF0000) >> 16;
      data.g = (code & 0xFF00) >> 8;
      data.b = code & 0xFF;
    } else if (RGB_REGEX.test(color)){
      match = color.match(RGB_REGEX);

      data.r = match[1] | 0;
      data.g = match[2] | 0;
      data.b = match[3] | 0;
      data.a = match[4] ? +match[4] : 1;
    } else if (HSL_REGEX.test(color)){
      let match = color.match(HSL_REGEX);

      let h = +match[1] / 360;
      let s = +match[2] / 100;
      let l = +match[3] / 100;

      data.a = match[4] ? +match[4] : 1;

      if (!s){
        data.r = data.g = data.b = l * 255;
      }

      let q = l < 0.5 ? l * (1 + s) : l + s - (l * s);
      let p = 2 * l - q;

      let rt = h + 1 / 3;
      let gt = h;
      let bt = h - 1 / 3;

      data.r = convertHue(p, q, rt);
      data.g = convertHue(p, q, gt);
      data.b = convertHue(p, q, bt);
    }

    return data;
  }

  getValue(){
    const {value} = this.state;

    if (!value) return;

    if (value.a < 1){
      return `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})`;
    } else {
      return `#${convertRGB(value.r)}${convertRGB(value.g)}${convertRGB(value.b)}`;
    }
  }

  setValue(value){
    switch (typeof value){
      case 'object':
        this.setState({value});
        break;

      case 'string':
        this.setState({value: this.parseColor(value)});
        break;

      default:
        this.setState({value: null});
    }

    setTimeout(() => {
      this.props.onChange(this.getValue());
    }, 0);
  }

  render(){
    const color = this.getValue();
    const {label} = this.props;

    return (
      <Dropdown className="color-picker">
        {label && <span className="color-picker__label">{label}</span>}
        <div className="color-picker__field">
          <span className="color-picker__value">{color}</span>
          <div className="color-picker__thumb" style={{backgroundColor: color}}/>
        </div>
        <DropdownMenu position="fixed">
          <DropdownItem>
            {this.renderDialog()}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  renderDialog(){
    return (
      <div>
        <button onClick={this.reset.bind(this)}>Reset</button>
        {chunk(COLOR_PALETTES, 10).map((group, i) => (
          <div className="color-picker__group" key={i}>
            {group.map((color, j) => (
              <button
                className="color-picker__common-btn"
                key={j}
                style={{backgroundColor: `rgb(${color.r},${color.g},${color.b})`}}
                onClick={this.selectCommonColor.bind(this, color)}/>
            ))}
          </div>
        ))}
        <button>Custom</button>
      </div>
    );
  }

  selectCommonColor(color){
    this.setValue({...color, a: 1});
  }

  reset(){
    this.setValue(null);
  }
}

export default ColorPicker;
