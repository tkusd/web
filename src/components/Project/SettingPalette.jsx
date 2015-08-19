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
import RadioGroup from 'react-radio-group';
import FontAwesome from '../common/FontAwesome';

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
    const {project, error} = this.state;

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
              value={project.get('title')}
              onChange={this.handleInputChange.bind(this, 'title')}/>
            <InputGroup
              ref="description"
              label={<FormattedMessage message="project.description"/>}
              type="textarea"
              value={project.get('description')}
              onChange={this.handleInputChange.bind(this, 'description')}/>
            <RadioGroup
              selectedValue={project.get('theme')}
              onChange={this.handleRadioChange.bind(this, 'theme')}>
              {Radio => (
                <div className="setting-palette__radio-group">
                  <div className="setting-palette__radio-group-title">Theme</div>
                  <label className="setting-palette__radio">
                    <Radio value="ios"/>
                    <FontAwesome icon="apple"/>iOS
                  </label>
                  <label className="setting-palette__radio">
                    <Radio value="material"/>
                    <FontAwesome icon="android"/>Material
                  </label>
                </div>
              )}
            </RadioGroup>
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

    const {title, description} = this.refs;
    const {project} = this.state;
    const id = project.get('id');
    const {updateProject} = bindActions(ProjectAction, this.context.flux);

    if (title.getError() || description.getError()){
      return;
    }

    updateProject(id, {
      title: project.get('title'),
      description: project.get('description'),
      theme: project.get('theme')
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

  handleRadioChange(name, value){
    this.handleInputChange(name, {value});
  }
}

export default SettingPalette;
