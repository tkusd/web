import React from 'react';
import {ModalPortal} from '../modal';
import Palette from './Palette';
import NewScreenModal from './NewScreenModal';
import ScreenItem from './ScreenItem';
import FontAwesome from '../common/FontAwesome';
import Translation from '../i18n/Translation';

if (process.env.BROWSER){
  require('../../styles/Project/ScreenPalette.styl');
}

class ScreenPalette extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    __: React.PropTypes.func.isRequired,
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    project: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    selectedScreen: React.PropTypes.string,
    editable: React.PropTypes.bool.isRequired
  }

  render(){
    const {elements, selectedScreen, project, editable} = this.props;

    let screens;

    if (elements.count()){
      screens = elements
        .filter(item => !item.get('element_id'))
        .map((item, id) => (
          <ScreenItem key={id} element={item} selectedScreen={selectedScreen} editable={editable}/>
        )).toArray();
    } else {
      screens = (
        <div className="screen-palette__empty">
          <Translation id="project.no_screens"/>
        </div>
      );
    }

    return (
      <div className="screen-palette">
        <Palette title={<Translation id="project.screens"/>}>
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
