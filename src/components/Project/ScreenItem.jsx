import React from 'react';
import cx from 'classnames';
import {Link} from 'react-router';
import {Dropdown, DropdownMenu, DropdownItem} from '../dropdown';
import FontAwesome from '../common/FontAwesome';
import * as ProjectAction from '../../actions/ProjectAction';
import {ModalPortal} from '../modal';
import DeleteScreenModal from './DeleteScreenModal';
import bindActions from '../../utils/bindActions';
import {FormattedMessage} from '../intl';
import pureRender from '../../decorators/pureRender';

if (process.env.BROWSER){
  require('../../styles/Project/ScreenItem.styl');
}

@pureRender
class ScreenItem extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    project: React.PropTypes.object.isRequired,
    element: React.PropTypes.object.isRequired,
    selectedScreen: React.PropTypes.string,
    editable: React.PropTypes.bool.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.setMainScreen = this.setMainScreen.bind(this);
  }

  render(){
    const {element, selectedScreen, project} = this.props;
    let className = cx('screen-item', {
      'screen-item--selected': selectedScreen === element.get('id'),
      'screen-item--main': project.get('main_screen') === element.get('id')
    });

    return (
      <div className={className}>
        <Link to={`/projects/${element.get('project_id')}/screens/${element.get('id')}`} className="screen-item__name">
          {element.get('name')}
        </Link>
        {this.renderMenu()}
      </div>
    );
  }

  renderMenu(){
    if (!this.props.editable) return;

    let deleteBtn = (
      <a>
        <FormattedMessage message="common.delete"/>
      </a>
    );

    return (
      <Dropdown className="screen-item__dropdown">
        <button className="screen-item__more-btn">
          <FontAwesome icon="ellipsis-v"/>
        </button>
        <DropdownMenu position="fixed">
          <DropdownItem>
            <a onClick={this.setMainScreen}>
              <FormattedMessage message="project.set_as_main_screen"/>
            </a>
          </DropdownItem>
          <DropdownItem>
            <ModalPortal trigger={deleteBtn}>
              <DeleteScreenModal {...this.props}/>
            </ModalPortal>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  setMainScreen(e){
    e.preventDefault();

    const {element} = this.props;
    const {updateProject} = bindActions(ProjectAction, this.context.flux);

    updateProject(element.get('project_id'), {
      main_screen: element.get('id')
    });
  }
}

export default ScreenItem;
