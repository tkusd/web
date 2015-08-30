import React from 'react';
import cx from 'classnames';
import pureRender from '../../decorators/pureRender';

if (process.env.BROWSER){
  require('../../styles/Screen/ScalableView.styl');
}

@pureRender
class ScalableView extends React.Component {
  static propTypes = {
    screenSize: React.PropTypes.string.isRequired,
    screenDimension: React.PropTypes.string.isRequired,
    screenScale: React.PropTypes.number.isRequired,
    project: React.PropTypes.object.isRequired
  }

  render(){
    const {
      screenSize,
      screenDimension,
      project,
      screenScale
    } = this.props;
    let [width, height] = screenSize.split('x');

    if (screenDimension === 'horizontal'){
      [height, width] = [width, height];
    }

    let style = {
      width,
      height,
      transform: `scale(${screenScale})`
    };

    return (
      <div className={cx('scalable-view', project.get('theme'))} style={style}>
        {this.props.children}
      </div>
    );
  }
}

export default ScalableView;
