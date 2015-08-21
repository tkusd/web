import React from 'react';
import ActionNode from './ActionNode';
import uuid from 'node-uuid';
import Immutable, {OrderedSet} from 'immutable';
import bindActions from '../../utils/bindActions';
import * as ActionAction from '../../actions/ActionAction';
import FontAwesome from '../common/FontAwesome';

if (process.env.BROWSER){
  require('../../styles/Screen/ActionBoard.styl');
}

function getActionBody(action){
  return {
    name: action.get('name'),
    action: action.get('action'),
    data: action.get('data').toJS()
  };
}

class ActionBoard extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    actions: React.PropTypes.object.isRequired,
    actionID: React.PropTypes.string,
    element: React.PropTypes.object.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      actionID: this.props.actionID,
      actions: this.props.actions,
      queue: OrderedSet(),
      isSaving: false
    };

    this.updateAction = this.updateAction.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if (this.props.actionID !== nextProps.actionID){
      this.setState({
        actionID: nextProps.actionID,
        queue: OrderedSet()
      });
    }

    if (!Immutable.is(this.props.actions, nextProps.actions)){
      this.setState({
        actions: nextProps.actions
      });
    }
  }

  render(){
    const {actionID, actions, isSaving} = this.state;
    let content;

    if (actionID){
      content = (
        <ActionNode {...this.props}
          action={actions.get(actionID)}
          updateAction={this.updateAction}/>
      );
    } else {
      content = (
        <div className="action-board__hint">
          Click here to create a new action
        </div>
      );
    }

    return (
      <div className="action-board" onClick={this.createNode} ref="board">
        {content}
        {isSaving && (
          <div className="action-board__saving-hint">
            <FontAwesome icon="circle-o-notch" spin/>Saving...
          </div>
        )}
      </div>
    );
  }

  createNode = (e) => {
    if (e.target !== this.refs.board) return;

    // Only for create new event currently
    if (this.state.actionID) return;

    const {element} = this.props;
    const {queue, actions} = this.state;
    const id = '_' + uuid.v4();
    const now = new Date().toISOString();

    let newAction = Immutable.fromJS({
      id,
      name: '',
      project_id: element.get('project_id'),
      action: '',
      data: {},
      created_at: now,
      updated_at: now
    });

    this.setState({
      actionID: id,
      queue: queue.add(id),
      actions: actions.set(id, newAction)
    });
  }

  updateAction(action){
    const {actions, queue} = this.state;
    const id = action.get('id');

    this.setState({
      actions: actions.set(id, action),
      queue: queue.add(id)
    });
  }

  saveChanges(){
    const {createAction, updateAction} = bindActions(ActionAction, this.context.flux);
    const {element} = this.props;
    let {actions, queue} = this.state;
    let promise = Promise.resolve();

    if (!queue.count()) return promise;

    this.setState({
      isSaving: true
    });

    queue.forEach(id => {
      promise = promise.then(() => {
        const action = actions.get(id);
        queue = queue.remove(id);

        if (id[0] === '_'){
          return createAction(element.get('project_id'), getActionBody(action))
            .then(data => {
              actions = actions.remove(id)
                .set(data.id, Immutable.fromJS(data))
                .map(item => {
                  if (item.get('action_id') !== id) return item;
                  return item.set('action_id', data.id);
                });

              let newState = {actions, queue};

              if (this.state.actionID === id){
                newState.actionID = data.id;
              }

              this.setState(newState);
            });
        } else {
          return updateAction(id, getActionBody(action))
            .then(data => {
              actions = actions.set(data.id, Immutable.fromJS(data));
              this.setState({actions, queue});
            });
        }
      });
    });

    promise = promise.then(() => {
      this.setState({
        isSaving: false
      });
    });

    return promise;
  }

  getActionID(){
    return this.state.actionID;
  }
}

export default ActionBoard;
