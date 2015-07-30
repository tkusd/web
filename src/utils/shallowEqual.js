import Immutable from 'immutable';

export default function shallowEqual(objA, objB) {
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
  for (var i = 0, len = keysA.length; i < len; i++) {
    if (!objB.hasOwnProperty(keysA[i]) || !Immutable.is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}
