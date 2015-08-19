import React from 'react';
import {ModalPortal} from '../modal';
import Palette from './Palette';
import NewScreenModal from './NewScreenModal';
import ScreenItem from './ScreenItem';
import FontAwesome from '../common/FontAwesome';
import {FormattedMessage} from '../intl';
import pureRender from '../../decorators/pureRender';

if (process.env.BROWSER){
  require('../../styles/Project/ScreenPalette.styl');
}

@pureRender
class ScreenPalette extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    project: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    selectedScreen: React.PropTypes.string,
    editable: React.PropTypes.bool.isRequired
  }

  render(){
    const {elements} = this.props;

    let screens;

    if (elements.count()){
      screens = elements
        .filter(item => !item.get('element_id'))
        .map((item, id) => (
          <ScreenItem {...this.props} key={id} element={item}/>
        )).toArray();
    } else {
      screens = (
        <div className="screen-palette__empty">
          <FormattedMessage message="project.no_screens"/>
        </div>
      );
    }

    return (
      <div className="screen-palette">
        <Palette title={<FormattedMessage message="project.screens"/>}>
          {screens}
        </Palette>
        {this.renderPortal()}
      </div>
    );
  }

  renderPortal(){
    const {project, editable} = this.props;
    if (!editable) return;

    let btn = (
      <div className="screen-palette__new-screen">
        <FontAwesome icon="plus"/>
      </div>
    );

    return (
      <ModalPortal trigger={btn}>
        <NewScreenModal project={project}/>
      </ModalPortal>
    );
  }
}

export default ScreenPalette;
