import escodegen from 'escodegen';
import {
  generateLiteral,
  generateIdentifier,
  generateArrayExpression,
  generateObjectExpression,
  generateMemberExpression,
  generateASTFromObject
} from '../utils/esprima';
import ElementTypes from '../constants/ElementTypes';

const ReactCreateElement = generateMemberExpression('React.createElement');
const ReactCreateClass = generateMemberExpression('React.createClass');

function generateRouteChildren(elements, element){
  const elementID = element.get('id');
  const childElements = elements.filter(item => item.get('element_id') === elementID);

  let props = {
    style: generateASTFromObject(element.get('styles').toJS()),
    key: generateLiteral(elementID)
  };

  const children = childElements.map(item => generateRouteChildren(elements, item)).toArray();

  let tagName = 'div';

  switch (element.get('type')){
    case ElementTypes.text:
      children.unshift(
        generateLiteral(element.getIn(['attributes', 'text']))
      );
      break;

    case ElementTypes.button:
      tagName = 'button';
      break;

    case ElementTypes.input:
      tagName = 'input';
      break;

    case ElementTypes.link:
      tagName = 'a';
      break;

    case ElementTypes.image:
      tagName = 'img';
      break;

    case ElementTypes.list:
      tagName = 'ul';
      break;
  }

  return {
    type: 'CallExpression',
    callee: ReactCreateElement,
    arguments: [
      generateLiteral(tagName),
      generateObjectExpression(props),
      generateArrayExpression(children)
    ]
  };
}

function generateRouteComponent(elements, screen){
  return {
    type: 'CallExpression',
    callee: ReactCreateClass,
    arguments: [
      generateObjectExpression({
        displayName: generateLiteral(`Screen(${screen.get('name')})`),
        render: {
          type: 'FunctionExpression',
          params: [],
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ReturnStatement',
                argument: generateRouteChildren(elements, screen)
              }
            ]
          }
        }
      })
    ]
  };
}

function generateRoutes(flux, projectID){
  const {ElementStore, ProjectStore} = flux.getStore();
  const project = ProjectStore.getProject(projectID);
  const elements = ElementStore.getElementsOfProject(projectID);
  const mainScreen = project.get('main_screen');

  let routes = elements
    .filter(screen => !screen.get('element_id'))
    .map(screen => {
      return generateObjectExpression({
        path: generateLiteral('/' + screen.get('id')),
        component: generateRouteComponent(elements, screen)
      });
    }).toArray();

  if (mainScreen){
    routes.push(generateObjectExpression({
      path: generateLiteral('*'),
      onEnter: {
        type: 'FunctionExpression',
        params: [
          generateIdentifier('state'),
          generateIdentifier('transition')
        ],
        body: {
          type: 'BlockStatement',
          body: [
            {
              type: 'CallExpression',
              callee: generateMemberExpression('transition.to'),
              arguments: [
                generateLiteral('/' + mainScreen)
              ]
            }
          ]
        }
      }
    }));
  }

  return generateArrayExpression(routes);
}

function generateReactRender(flux, projectID){
  return {
    type: 'CallExpression',
    callee: generateMemberExpression('ReactDOM.render'),
    arguments: [
      {
        type: 'CallExpression',
        callee: ReactCreateElement,
        arguments: [
          generateMemberExpression('ReactRouter.Router'),
          generateObjectExpression({
            history: generateMemberExpression('HashHistory.history'),
            children: generateRoutes(flux, projectID)
          })
        ]
      },
      {
        type: 'CallExpression',
        callee: generateMemberExpression('document.getElementById'),
        arguments: [
          generateLiteral('root')
        ]
      }
    ]
  };
}

function generateRequire(identifier, moduleName){
  return {
    type: 'VariableDeclaration',
    declarations: [
      {
        type: 'VariableDeclarator',
        id: generateIdentifier(identifier),
        init: {
          type: 'CallExpression',
          callee: generateIdentifier('require'),
          arguments: [
            generateLiteral(moduleName)
          ]
        }
      }
    ],
    kind: 'var'
  };
}

function generateBody(flux, projectID){
  return [
    {
      type: 'CallExpression',
      callee: generateIdentifier('require'),
      arguments: [
        generateLiteral('./src/styles/preview/base.styl')
      ]
    },
    generateRequire('React', 'react'),
    generateRequire('ReactRouter', 'react-router'),
    generateRequire('HashHistory', 'react-router/lib/HashHistory'),
    generateRequire('ReactDOM', 'react-dom'),
    {
      type: 'ExpressionStatement',
      expression: generateReactRender(flux, projectID)
    }
  ];
}

export default function generateScript(flux, projectID){
  let ast = {
    type: 'Program',
    body: generateBody(flux, projectID)
  };

  return escodegen.generate(ast, {
    format: {
      indent: {
        style: '  '
      }
    }
  });
}
