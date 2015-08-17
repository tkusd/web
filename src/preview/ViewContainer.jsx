import React from 'react';
import View from '../components/preview/View';
import connectToStores from '../decorators/connectToStores';

@connectToStores(['ProjectStore', 'ElementStore'], (stores, props) => ({
  project: stores.ProjectStore.getProject(props.projectID),
  elements: stores.ElementStore.getElementsOfProject(props.projectID)
}))
class ViewContainer extends React.Component {
  render(){
    const {elements} = this.state;

    let pages = elements.filter(element => !element.get('element_id'))
      .map((element, key) => (
        <View {...this.state} element={element} key={key}/>
      ))
      .toArray();

    return (
      <div className="views">
        <div className="view view-main">
          <div className="pages">
            {pages}
          </div>
        </div>
      </div>
    );
  }
}

export default ViewContainer;
