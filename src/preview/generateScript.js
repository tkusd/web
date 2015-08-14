import escodegen from 'escodegen';
import {
  generateLiteral,
  generateIdentifier,
  generateExpressionStatement,
  generateCallExpression,
  generateBlockStatement,
  generateMemberExpression
} from '../utils/esprima';
import base62uuid from '../utils/base62uuid';

function getElementID(element){
  return '#e' + base62uuid(element.get('id'));
}

function generateEventAction(project, event){
  switch (event.get('action')){
    case 'alert':
      return generateCallExpression(
        generateMemberExpression('app.alert'),
        [
          generateLiteral(event.get('text')),
          generateLiteral(event.get('title', project.get('title')))
        ]
      );

    case 'confirm':
      return generateCallExpression(
        generateMemberExpression('app.confirm'),
        [
          generateLiteral(event.get('text')),
          generateLiteral(event.get('title', project.get('title')))
        ]
      );

    case 'prompt':
      return generateCallExpression(
        generateMemberExpression('app.prompt'),
        [
          generateLiteral(event.get('text')),
          generateLiteral(event.get('title', project.get('title')))
        ]
      );
  }
}

function generateEventBindings(flux, projectID){
  const {ProjectStore, ElementStore} = flux.getStore();
  const project = ProjectStore.getProject(projectID);
  const elements = ElementStore.getElementsOfProject(projectID);

  return elements.toArray().map(element => {
    return element.get('events').toArray().map(event => {
      return generateExpressionStatement(
        generateCallExpression({
          type: 'MemberExpression',
          object: generateCallExpression(
            generateIdentifier('Dom7'),
            [generateLiteral(getElementID(element))]
          ),
          property: generateIdentifier('on')
        }, [
          generateLiteral(event.get('type')),
          {
            type: 'FunctionExpression',
            params: [],
            body: generateBlockStatement([
              generateEventAction(project, event)
            ])
          }
        ])
      );
    });
  }).reduce((arr, item) => {
    return item ? arr.concat(item) : arr;
  }, []);
}

function generateProgram(flux, projectID){
  return [].concat(
    generateEventBindings(flux, projectID)
  );
}

export default function generateScript(flux, projectID){
  let ast = {
    type: 'Program',
    body: generateProgram(flux, projectID)
  };

  console.log(JSON.stringify(ast, null, '  '));

  return escodegen.generate(ast, {
    format: {
      indent: {
        style: '  '
      }
    }
  });
}
