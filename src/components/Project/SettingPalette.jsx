import React from 'react';
import Palette from './Palette';
import Translation from '../i18n/Translation';
import {Form, Input} from '../form';
import Immutable from 'immutable';
import {updateProject} from '../../actions/ProjectAction';
import Portal from 'react-portal';
import DeleteProjectModal from './DeleteProjectModal';
import ProjectStore from '../../stores/ProjectStore';

if (process.env.BROWSER){
  require('../../styles/Project/SettingPalette.styl');
}

class SettingPalette extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    __: React.PropTypes.func.isRequired,
    router: React.PropTypes.func.isRequired,
    getStore: React.PropTypes.func.isRequired
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
          <Translation id="project.delete_project"/>
        </button>
      </div>
    );

    return (
      <Palette title={<Translation id="common.settings"/>}>
        <div className="setting-palette">
          {error && !error.field && <div>{error.message}</div>}
          <Form onSubmit={this.handleSubmit}>
            <Input
              name="title"
              ref="title"
              label={<Translation id="common.title"/>}
              type="text"
              required
              maxLength={255}
              initialValue={project.get('title')}
              onChange={this.handleInputChange.bind(this, 'title')}/>
            <Input
              name="description"
              ref="description"
              label={<Translation id="project.description"/>}
              type="textarea"
              initialValue={project.get('description')}
              onChange={this.handleInputChange.bind(this, 'description')}/>
            <div className="setting-palette__btn-wrap">
              <button type="submit" className="setting-palette__save" disabled={!this.hasChanged()}>
                <Translation id="common.update"/>
              </button>
            </div>
          </Form>
          <Portal openByClickOn={deleteBtn} closeOnEsc={true}>
            <DeleteProjectModal {...this.props} context={this.context}/>
          </Portal>
        </div>
      </Palette>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {title, description} = this.refs;
    const {project} = this.props;
    const id = project.get('id');

    if (title.getError() || description.getError()){
      return;
    }

    this.context.executeAction(updateProject, id, {
      title: title.getValue(),
      description: description.getValue()
    }).then(() => {
      this.setState({
        error: null,
        project: this.context.getStore(ProjectStore).get(id)
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
}

export default SettingPalette;
