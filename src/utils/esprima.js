export function generateLiteral(value){
  return {
    type: 'Literal',
    value
  };
}

export function generateIdentifier(name){
  return {
    type: 'Identifier',
    name
  };
}

export function generateArrayExpression(elements){
  return {
    type: 'ArrayExpression',
    elements
  };
}

export function generateObjectExpression(obj){
  return {
    type: 'ObjectExpression',
    properties: Object.keys(obj).map(key => {
      return {
        type: 'Property',
        key: generateIdentifier(key),
        value: obj[key],
        kind: 'init'
      };
    })
  };
}

export function generateMemberExpression(key){
  let split = key.split('.');
  let last = split.pop();

  let expr = {
    type: 'MemberExpression',
    object: split.length > 1 ? generateMemberExpression(split.join('.')) : generateIdentifier(split[0]),
    property: generateIdentifier(last)
  };

  return expr;
}

export function generateASTFromObject(obj){
  let result = {};

  Object.keys(obj).forEach(key => {
    let value = obj[key];

    if (Array.isArray(value)){
      result[key] = generateArrayExpression(value);
    } else if (typeof value === 'object'){
      result[key] = generateObjectExpression(value);
    } else {
      result[key] = generateLiteral(value);
    }
  });

  return generateObjectExpression(result);
}
