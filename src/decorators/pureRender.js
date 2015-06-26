import shouldPureComponentUpdate from 'react-pure-render/function';

function pureRender(Component){
  return class extends Component {
    static displayName = Component.displayName || Component.name || 'PureRenderComponent'

    shouldComponentUpdate(nextProps, nextState, nextContext){
      return shouldPureComponentUpdate.call(this, nextProps, nextState, nextContext);
    }
  };
}

export default pureRender;
