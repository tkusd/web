import Immutable from 'immutable';

function compare(objA, objB) {
  if (objA === objB || Immutable.is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || !Immutable.is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

export default function pureRender(Component) {
  return class extends Component {
    static displayName = Component.displayName || Component.name || 'PureRenderComponent'

    shouldComponentUpdate(nextProps, nextState, nextContext) {
      // TODO: Ignore context temporarily
      return !compare(this.props, nextProps) || !compare(this.state, nextState);
    }
  };
}
