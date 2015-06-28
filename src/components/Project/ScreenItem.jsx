import React from 'react';
import cx from 'classnames';
import {Link} from 'react-router';
import {Dropdown, DropdownMenu, DropdownItem} from '../dropdown';
import FontAwesome from '../common/FontAwesome';
import {updateProject} from '../../actions/ProjectAction';
import {updateElement} from '../../actions/ElementAction';
import Portal from 'react-portal';
import DeleteScreenModal from './DeleteScreenModal';
import Translation from '../i18n/Translation';
import {InlineInput} from '../form';

if (process.env.BROWSER){
  require('../../styles/Project/ScreenItem.styl');
}

class ScreenItem extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    router: React.PropTypes.func.isRequired,
    __: React.PropTypes.func.isRequired
  }

  static propTypes = {
    element: React.PropTypes.object.isRequired,
    selectedScreen: React.PropTypes.string
  }

  constructor(props, context){
    super(props, context);

    this.setMainScreen = this.setMainScreen.bind(this);
    this.rename = this.rename.bind(this);
    this.handleRenameSubmit = this.handleRenameSubmit.bind(this);
  }

  render(){
    const {element, selectedScreen} = this.props;

    let params = {
      projectID: element.get('project_id'),
      screenID: element.get('id')
    };

    let className = cx('screen-item', {
      'screen-item--selected': selectedScreen === element.get('id')
    });

    let deleteBtn = (
      <a>
        <Translation id="common.delete"/>
      </a>
    );

    return (
      <div className={className}>
        <InlineInput
          ref="input"
          name="name"
          initialValue={element.get('name')}
          required
          maxLength={255}
          onSubmit={this.handleRenameSubmit}>
          <Link to="screen" params={params} className="screen-item__name">{element.get('name')}</Link>
          <Dropdown className="screen-item__dropdown">
            <button className="screen-item__more-btn">
              <FontAwesome icon="ellipsis-v"/>
            </button>
            <DropdownMenu position="fixed">
              <DropdownItem>
                <a onClick={this.setMainScreen}>
                  <Translation id="project.set_as_main_screen"/>
                </a>
              </DropdownItem>
              <DropdownItem>
                <a onClick={this.rename}>
                  <Translation id="common.rename"/>
                </a>
              </DropdownItem>
              <DropdownItem>
                <Portal openByClickOn={deleteBtn} closeOnEsc={true}>
                  <DeleteScreenModal {...this.props} context={this.context}/>
                </Portal>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </InlineInput>
      </div>
    );
  }

  rename(e){
    e.preventDefault();
    this.refs.input.startInput();
  }

  handleRenameSubmit(){
    const {input} = this.refs;
    const {element} = this.props;

    if (input.getError() || input.getValue() === element.get('name')) return;

    this.context.executeAction(updateElement, element.get('id'), {
      name: input.getValue()
    }).then(() => {
      input.stopInput();
    });
  }

  setMainScreen(e){
    e.preventDefault();

    const {element} = this.props;

    this.context.executeAction(updateProject, element.get('project_id'), {
      main_screen: element.get('id')
    });
  }
}

export default ScreenItem;
