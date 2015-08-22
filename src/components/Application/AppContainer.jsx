import React from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';
import Application from './Application';
import * as AppAction from '../../actions/AppAction';
import bindActions from '../../utils/bindActions';

@DragDropContext(HTML5Backend)
class AppContainer extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  componentDidMount() {
    const {setFirstRender} = bindActions(AppAction, this.context.flux);
    setFirstRender(false);
  }

  render(){
    return <Application {...this.props}/>;
  }
}

export default AppContainer;
