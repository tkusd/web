import React from 'react';
import {ModalPortal} from '../modal';
import Palette from './Palette';
import NewScreenModal from './NewScreenModal';
import ScreenItem from './ScreenItem';
import FontAwesome from '../common/FontAwesome';
import {FormattedMessage} from '../intl';
import pureRender from '../../decorators/pureRender';
import ItemTypes from '../../constants/ItemTypes';
import {DropTarget} from 'react-dnd';
import Immutable from 'immutable';
import bindActions from '../../utils/bindActions';
import * as ProjectAction from '../../actions/ProjectAction';

if (process.env.BROWSER){
  require('../../styles/Project/ScreenPalette.styl');
}

const spec = {
  drop(){
    //
  }
};

@DropTarget(ItemTypes.SCREEN_ITEM, spec, connect => ({
  connectDropTarget: connect.dropTarget()
}))
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

  constructor(props, context){
    super(props, context);

    this.state = {
      screens: this.getScreens()
    };

    this.moveScreen = this.moveScreen.bind(this);
    this.updateIndex = this.updateIndex.bind(this);
  }

  getScreens(props = this.props){
    return props.elements.filter(item => !item.get('element_id'));
  }

  componentWillReceiveProps(nextProps){
    if (!Immutable.is(this.props.elements, nextProps.elements)){
      this.setState({
        screens: this.getScreens(nextProps)
      });
    }
  }

  render(){
    return (
      <div className="screen-palette">
        <Palette title={<FormattedMessage message="project.screens"/>}>
          {this.renderContent()}
        </Palette>
        {this.renderPortal()}
      </div>
    );
  }

  renderContent(){
    const {screens} = this.state;

    if (!screens.count()){
      return (
        <div className="screen-palette__empty">
          <FormattedMessage message="project.noScreens"/>
        </div>
      );
    }

    const {connectDropTarget} = this.props;

    return connectDropTarget(
      <div className="screen-palette__list">
        {screens.map((item, id) => (
          <ScreenItem {...this.props}
            key={id}
            element={item}
            moveScreen={this.moveScreen}
            updateIndex={this.updateIndex}/>
        )).toArray()}
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

  moveScreen(id, atIndex){
    const screens = this.getScreens();
    const element = screens.get(id);
    let newScreens = screens.remove(id);
    let index = 1;

    this.setState({
      screens: newScreens.slice(0, atIndex - 1)
        .set(id, element)
        .concat(newScreens.slice(atIndex - 1))
        .map(element => element.set('index', index++))
    });
  }

  updateIndex(){
    const {project} = this.props;
    const {screens} = this.state;
    const {updateProject} = bindActions(ProjectAction, this.context.flux);

    let currentIndex = this.getScreens().map(element => element.get('id'));
    let newIndex = screens.map(element => element.get('id'));

    if (Immutable.is(currentIndex, newIndex)) return;

    updateProject(project.get('id'), {
      elements: newIndex.toArray()
    });
  }
}

export default ScreenPalette;
