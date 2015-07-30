import shallowEqual from '../utils/shallowEqual';

export default function pureRender(Component) {
  return class extends Component {
    static displayName = Component.displayName || Component.name || 'PureRenderComponent'

    shouldComponentUpdate(nextProps, nextState, nextContext) {
      // TODO: Ignore context temporarily
      return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
    }
  };
}
