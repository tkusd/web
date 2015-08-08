import React from 'react';
import connectToStores from '../decorators/connectToStores';

@connectToStores(['ProjectStore', 'ElementStore'], (stores, props) => ({
  project: stores.ProjectStore.getProject(props.projectID),
  elements: stores.ElementStore.getElementsOfProject(props.projectID)
}))
class Views extends React.Component {
  static propTypes = {
    projectID: React.PropTypes.string.isRequired
  }

  render(){
    const {elements} = this.state;

    let pages = elements
      .filter(screen => !screen.get('element_id'))
      .map(screen => (
        <div className="page" data-page={screen.get('id')}>
          <div className="page-content"></div>
        </div>
      ))
      .toArray();

    return (
      <div className="views">
        <div className="view view-main">
          <div className="pages">{pages}</div>
        </div>
      </div>
    );
  }
}

export default Views;
