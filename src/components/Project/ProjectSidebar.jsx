import React from 'react';
import ScreenPalette from './ScreenPalette';
import ComponentPalette from './ComponentPalette';
import SettingPalette from './SettingPalette';
import pureRender from '../../decorators/pureRender';
import FontAwesome from '../common/FontAwesome';
import {TabHost, TabPane} from '../tab';
import SharePalette from './SharePalette';

if (process.env.BROWSER){
  require('../../styles/Project/ProjectSidebar.styl');
}

@pureRender
class ProjectSidebar extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    editable: React.PropTypes.bool.isRequired
  }

  render(){
    return (
      <div className="project-sidebar">
        <TabHost>
          <TabPane tab={<FontAwesome icon="mobile"/>}>
            <ScreenPalette {...this.props}/>
          </TabPane>
          {this.renderComponentPalette()}
          {this.renderSettingPalette()}
        </TabHost>
        <div className="project-sidebar__links">
          <a href={this.makePreviewHref()} className="project-sidebar__link" target="_blank" onClick={this.openPreviewWindow}>
            <FontAwesome icon="eye"/>
          </a>
        </div>
      </div>
    );
  }

  renderComponentPalette(){
    if (!this.props.editable) return;

    return (
      <TabPane tab={<FontAwesome icon="cube"/>}>
        <ComponentPalette {...this.props}/>
      </TabPane>
    );
  }

  renderSettingPalette(){
    if (!this.props.editable) return;

    return (
      <TabPane tab={<FontAwesome icon="cog"/>}>
        <SettingPalette {...this.props}/>
      </TabPane>
    );
  }

  renderSharePalette(){
    return (
      <TabPane tab={<FontAwesome icon="share-alt"/>}>
        <SharePalette {...this.props}/>
      </TabPane>
    );
  }

  makePreviewHref(){
    const {project} = this.props;
    return `/projects/${project.get('id')}/preview`;
  }

  openPreviewWindow = (e) => {
    e.preventDefault();

    const {project} = this.props;

    window.open(this.makePreviewHref(), project.get('id'), 'menubar=no, location=no, width=360, height=640, status=no');
  }
}

export default ProjectSidebar;
