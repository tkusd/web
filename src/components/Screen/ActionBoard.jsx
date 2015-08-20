import React from 'react';
import ActionNode from './ActionNode';
import uuid from 'node-uuid';
import Immutable, {OrderedSet} from 'immutable';

if (process.env.BROWSER){
  require('../../styles/Screen/ActionBoard.styl');
}

class ActionBoard extends React.Component {
  static propTypes = {
    actions: React.PropTypes.object.isRequired,
    actionID: React.PropTypes.string,
    project: React.PropTypes.object.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      actionID: this.props.actionID,
      actions: this.props.actions,
      queue: OrderedSet()
    };

    this.updateAction = this.updateAction.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if (this.props.actionID !== nextProps.actionID){
      this.setState({
        actionID: nextProps.actionID
      });
    }

    if (!Immutable.is(this.props.actions, nextProps.actions)){
      this.setState({
        actions: nextProps.actions
      });
    }
  }

  render(){
    const {actionID, actions} = this.state;
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
      </div>
    );
  }

  createNode = (e) => {
    if (e.target !== this.refs.board) return;

    // Only for create new event currently
    if (this.state.actionID) return;

    const {project} = this.props;
    const {queue, actions} = this.state;
    const id = '_' + uuid.v4();
    const now = new Date().toISOString();

    let newAction = Immutable.fromJS({
      id,
      name: '',
      project_id: project.get('id'),
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
}

export default ActionBoard;
