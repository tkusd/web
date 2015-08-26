import React from 'react';
import Select from 'react-select';
import {formatIntlFromContext} from '../../utils/formatIntl';

if (process.env.BROWSER){
  require('../../styles/form/ThemePalette.styl');
}

const PALETTES = {
  ios: [
    {value: 'gray', color: '#8e8e93'},
    {value: 'white', color: '#fff'},
    {value: 'black', color: '#000'},
    {value: 'lightblue', color: '#5ac8fa'},
    {value: 'yellow', color: '#ffcc00'},
    {value: 'orange', color: '#ff9500'},
    {value: 'pink', color: '#ff2d55'},
    {value: 'blue', color: '#007aff'},
    {value: 'green', color: '#4cd964'},
    {value: 'red', color: '#ff3b30'}
  ],
  material: [
    {value: 'red', color: '#f44336'},
    {value: 'pink', color: '#e91e63'},
    {value: 'purple', color: '#9c27b0'},
    {value: 'deeppurple', color: '#673ab7'},
    {value: 'indigo', color: '#3f51b5'},
    {value: 'blue', color: '#2196f3'},
    {value: 'lightblue', color: '#03a9f4'},
    {value: 'cyan', color: '#00bcd4'},
    {value: 'teal', color: '#009688'},
    {value: 'green', color: '#4caf50'},
    {value: 'lightgreen', color: '#8bc34a'},
    {value: 'lime', color: '#cddc39'},
    {value: 'yellow', color: '#ffeb3b'},
    {value: 'amber', color: '#ffc107'},
    {value: 'orange', color: '#ff9800'},
    {value: 'deeporange', color: '#ff5722'},
    {value: 'brown', color: '#795548'},
    {value: 'gray', color: '#9e9e9e'},
    {value: 'bluegray', color: '#607d8b'},
    {value: 'white', color: '#fff'},
    {value: 'black', color: '#000'}
  ]
};

class ThemePalette extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    palette: React.PropTypes.oneOf(['ios', 'material']).isRequired
  }

  static defaultProps = {
    palette: 'ios'
  }

  render(){
    const {palette} = this.props;
    const intl = formatIntlFromContext(this.context.flux);
    let options = PALETTES[palette].map(data => ({
      ...data,
      label: intl.getIntlMessage(`color.${data.value}`)
    }));

    return <Select {...this.props} options={options} optionRenderer={this.renderSelectOption}/>;
  }

  renderSelectOption = (data) => {
    const intl = formatIntlFromContext(this.context.flux);

    return (
      <div>
        <span className="theme-palette__color" style={{backgroundColor: data.color}}/>
        {intl.getIntlMessage(`color.${data.value}`)}
      </div>
    );
  }
}

export default ThemePalette;
