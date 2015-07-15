import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';
import Screen from './Screen';
import pureRender from '../../decorators/pureRender';
import Immutable, {OrderedMap} from 'immutable';
import debounce from 'lodash/function/debounce';

// Save automatically every 5 secs
const DEBOUNCE_DELAY = 5000;

@connectToStores(['ElementStore', 'ComponentStore', 'ProjectStore'], (stores, props) => ({
  elements: stores.ElementStore.getElementsOfProject(props.params.projectID),
  components: stores.ComponentStore.getList(),
  editable: stores.ProjectStore.isEditable(props.params.projectID)
}))
@pureRender
class ScreenContainer extends React.Component {
  static onEnter(state, transition){
    const {AppStore} = this.getStore();
    const {getChildElements} = bindActions(ElementAction, this);

    if (AppStore.isFirstRender()){
      return Promise.resolve();
    }

    return getChildElements(state.params.screenID).catch(err => {
      if (err.response && err.response.status === 404){
        transition.to('/projects/' + state.params.projectID);
      } else {
        throw err;
      }
    });
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      commits: OrderedMap(),
      updating: false
    };

    this.routerWillLeave = this.routerWillLeave.bind(this);
    this.updateElement = this.updateElement.bind(this);
    this.debouncedSaveElement = debounce(this.commitElementChange.bind(this), DEBOUNCE_DELAY);
  }

  componentDidMount(){
    this.context.router.addTransitionHook(this.routerWillLeave);
  }

  componentWillUnmount(){
    this.context.router.removeTransitionHook(this.routerWillLeave);
  }

  routerWillLeave(state, transition){
    if (this.hasUnsavedChanges()){
      alert('The data has not been saved yet!');
      transition.abort();
      this.commitElementChange();
    }
  }

  render(){
    return <Screen {...this.state}
      selectedScreen={this.props.params.screenID}
      updateElement={this.updateElement}
      hasUnsavedChanges={this.hasUnsavedChanges()}
      isSavingChanges={this.state.updating}/>;
  }

  updateElement(id, data){
    this.setState({
      commits: this.state.commits.set(id, data)
    });

    setTimeout(() => {
      this.debouncedSaveElement();
    }, 0);
  }

  commitElementChange(){
    if (this.state.updating) return;

    const {updateElement} = bindActions(ElementAction, this.context.flux);
    const {commits, elements} = this.state;
    let promise = Promise.resolve();
    let resolvedKeys = [];

    this.setState({updating: true});

    commits.forEach((element, id) => {
      // Do nothing if the element is unchanged
      if (Immutable.is(elements.get(id), element)){
        resolvedKeys.push(id);
        return;
      }

      promise = promise.then(() => {
        return updateElement(id, {
          attributes: element.get('attributes').toObject(),
          styles: element.get('styles').toObject(),
          name: element.get('name')
        }).then(() => {
          resolvedKeys.push(id);
        });
      }).catch(err => {
        console.error(err);
      });
    });

    promise.then(() => {
      this.setState({
        updating: false,
        commits: this.state.commits.filter((element, id) => !~resolvedKeys.indexOf(id))
      });
    });
  }

  hasUnsavedChanges(){
    return !this.state.commits.isEmpty();
  }
}

export default ScreenContainer;
