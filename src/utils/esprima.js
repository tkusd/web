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

export function generateArrayExpression(elements = []){
  if (!Array.isArray(elements)) elements = [elements];

  return {
    type: 'ArrayExpression',
    elements
  };
}

export function generateExpressionStatement(expression){
  return {
    type: 'ExpressionStatement',
    expression
  };
}

export function generateCallExpression(callee, args = []){
  if (!Array.isArray(args)) args = [args];

  return {
    type: 'CallExpression',
    callee: callee,
    arguments: args
  };
}

export function generateCallStatement(callee, args){
  return generateExpressionStatement(
    generateCallExpression(callee, args)
  );
}

export function generateBlockStatement(body){
  if (!Array.isArray(body)) body = [body];

  return {
    type: 'BlockStatement',
    body
  };
}

export function generateObjectExpression(obj = {}){
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

export function generateVariableDeclaration(declarations = [], kind = 'var'){
  if (!Array.isArray(declarations)) declarations = [declarations];

  return {
    type: 'VariableDeclaration',
    declarations,
    kind: 'var'
  };
}

export function generateVariableDeclarator(identifier, init){
  return {
    type: 'VariableDeclarator',
    id: generateIdentifier(identifier),
    init
  };
}

export function generateVariable(identifier, init){
  return generateVariableDeclaration([
    generateVariableDeclarator(identifier, init)
  ]);
}

export function generateRequire(identifier, moduleName){
  return generateVariable(identifier, generateCallExpression(generateIdentifier('require'), [
    generateLiteral(moduleName)
  ]));
}

export function generateBinaryExpression(operator, left, right){
  return {
    type: 'BinaryExpression',
    operator,
    left,
    right
  };
}

export function generateLogicalExpression(operator, left, right){
  return {
    type: 'LogicalExpression',
    operator,
    left,
    right
  };
}

export function generateAssignmentExpression(operator, left, right){
  return {
    type: 'AssignmentExpression',
    operator,
    left,
    right
  };
}

export function generateAssignmentStatement(operator, left, right){
  return generateExpressionStatement(generateAssignmentExpression(operator, left, right));
}
