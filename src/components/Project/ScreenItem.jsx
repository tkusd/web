import React from 'react';
import cx from 'classnames';
import {Link} from 'react-router';
import {Dropdown, DropdownMenu, DropdownItem} from '../dropdown';
import FontAwesome from '../common/FontAwesome';
import * as ProjectAction from '../../actions/ProjectAction';
import * as ElementAction from '../../actions/ElementAction';
import {ModalPortal} from '../modal';
import DeleteScreenModal from './DeleteScreenModal';
import {InlineInput} from '../form';
import bindActions from '../../utils/bindActions';
import {FormattedMessage} from '../intl';

if (process.env.BROWSER){
  require('../../styles/Project/ScreenItem.styl');
}

class ScreenItem extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    element: React.PropTypes.object.isRequired,
    selectedScreen: React.PropTypes.string,
    editable: React.PropTypes.bool.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.setMainScreen = this.setMainScreen.bind(this);
    this.rename = this.rename.bind(this);
    this.handleRenameSubmit = this.handleRenameSubmit.bind(this);
  }

  render(){
    const {element, selectedScreen} = this.props;
    let className = cx('screen-item', {
      'screen-item--selected': selectedScreen === element.get('id')
    });

    return (
      <div className={className}>
        <InlineInput
          ref="input"
          name="name"
          defaultValue={element.get('name')}
          required
          maxLength={255}
          onSubmit={this.handleRenameSubmit}>
          <Link to={`/projects/${element.get('project_id')}/screens/${element.get('id')}`} className="screen-item__name">{element.get('name')}</Link>
          {this.renderMenu()}
        </InlineInput>
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
            <a onClick={this.rename}>
              <FormattedMessage message="common.rename"/>
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

  rename(e){
    e.preventDefault();
    this.refs.input.startInput();
  }

  handleRenameSubmit(){
    const {input} = this.refs;
    const {element} = this.props;
    const {updateElement} = bindActions(ElementAction, this.context.flux);

    if (input.getError() || input.getValue() === element.get('name')) return;

    updateElement(element.get('id'), {
      name: input.getValue()
    }).then(() => {
      input.stopInput();
    });
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
