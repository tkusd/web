import React from 'react';
import Palette from './Palette';
import {Form, InputGroup} from '../form';
import {validators} from 'react-form-input';
import Immutable from 'immutable';
import * as ProjectAction from '../../actions/ProjectAction';
import {ModalPortal} from '../modal';
import DeleteProjectModal from './DeleteProjectModal';
import bindActions from '../../utils/bindActions';
import {FormattedMessage} from '../intl';

if (process.env.BROWSER){
  require('../../styles/Project/SettingPalette.styl');
}

class SettingPalette extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    project: React.PropTypes.object.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      project: this.props.project,
      error: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps){
    let {error} = this.state;

    if (error && error.field){
      this.refs[error.field].setError(error.message);
    }
  }

  render(){
    const {project} = this.props;
    const {error} = this.state;

    let deleteBtn = (
      <div className="setting-palette__btn-wrap">
        <button className="setting-palette__delete">
          <FormattedMessage message="project.delete_project"/>
        </button>
      </div>
    );

    return (
      <Palette title={<FormattedMessage message="common.settings"/>}>
        <div className="setting-palette">
          {error && !error.field && <div>{error.message}</div>}
          <Form onSubmit={this.handleSubmit}>
            <InputGroup
              ref="title"
              label={<FormattedMessage message="common.title"/>}
              type="text"
              required
              validators={[
                validators.required('Title is required'),
                validators.maxLength(255, 'The maximum length of the title is 255')
              ]}
              defaultValue={project.get('title')}
              onChange={this.handleInputChange.bind(this, 'title')}/>
            <InputGroup
              ref="description"
              label={<FormattedMessage message="project.description"/>}
              type="textarea"
              defaultValue={project.get('description')}
              onChange={this.handleInputChange.bind(this, 'description')}/>
            <select
              ref="theme"
              defaultValue={project.get('theme')}
              onChange={this.handleInputChange.bind(this, 'theme')}>
              <option value="ios">ios</option>
              <option value="material">material</option>
            </select>
            <div className="setting-palette__btn-wrap">
              <button type="submit" className="setting-palette__save" disabled={!this.hasChanged()}>
                <FormattedMessage message="common.update"/>
              </button>
            </div>
          </Form>
          <ModalPortal trigger={deleteBtn}>
            <DeleteProjectModal {...this.props}/>
          </ModalPortal>
        </div>
      </Palette>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {title, description, theme} = this.refs;
    const {project} = this.props;
    const id = project.get('id');
    const {updateProject} = bindActions(ProjectAction, this.context.flux);

    if (title.getError() || description.getError()){
      return;
    }

    updateProject(id, {
      title: title.getValue(),
      description: description.getValue(),
      theme: theme.value
    }).then(() => {
      const {ProjectStore} = this.context.flux.getStore();

      this.setState({
        error: null,
        project: ProjectStore.get(id)
      });
    }).catch(err => {
      this.setState({error: err.body || err});
    });
  }

  hasChanged(){
    return !Immutable.is(this.props.project, this.state.project);
  }

  handleInputChange(name, {value}){
    this.setState({
      project: this.state.project.set(name, value)
    });
  }

  handleSelectChange(name, e){
    this.handleInputChange(name, {
      value: (e.target || e.currentTarget).value
    });
  }
}

export default SettingPalette;
