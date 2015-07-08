import Immutable from 'immutable';

export default function pureRender(Component) {
  return class extends Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
      // TODO: Ignore context temporarily
      return !Immutable.is(this.props, nextProps) || !Immutable.is(this.state, nextState);
    }
  };
}
