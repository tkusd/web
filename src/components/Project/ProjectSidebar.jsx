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
  static contextTypes = {
    __: React.PropTypes.func.isRequired
  }

  static propTypes = {
    editable: React.PropTypes.bool.isRequired
  }

  render(){
    const {__} = this.context;

    return (
      <TabHost className="project-sidebar">
        <TabPane tab={<FontAwesome icon="mobile"/>} title={__('project.screens')}>
          <ScreenPalette {...this.props}/>
        </TabPane>
        {this.renderComponentPalette()}
        {this.renderSettingPalette()}
        <TabPane tab={<FontAwesome icon="share-alt"/>} title={__('project.share')}>
          <SharePalette {...this.props}/>
        </TabPane>
      </TabHost>
    );
  }

  renderComponentPalette(){
    if (!this.props.editable) return;

    const {__} = this.context;

    return (
      <TabPane tab={<FontAwesome icon="cube"/>} title={__('project.components')}>
        <ComponentPalette {...this.props}/>
      </TabPane>
    );
  }

  renderSettingPalette(){
    if (!this.props.editable) return;

    const {__} = this.context;

    return (
      <TabPane tab={<FontAwesome icon="cog"/>} title={__('common.settings')}>
        <SettingPalette {...this.props}/>
      </TabPane>
    );
  }
}

export default ProjectSidebar;
