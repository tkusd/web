import escodegen from 'escodegen';
import {
  generateLiteral,
  generateIdentifier,
  generateArrayExpression,
  generateObjectExpression,
  generateMemberExpression,
  generateASTFromObject,
  generateRequire,
  generateCallExpression,
  generateCallStatement,
  generateBlockStatement,
  generateVariable,
  generateBinaryExpression,
  generateAssignmentStatement
} from '../utils/esprima';
import ElementTypes from '../constants/ElementTypes';

function ReactCreateElement(tag, props, children){
  let args = [tag];

  if (props){
    args.push(generateObjectExpression(props));
  }

  if (children){
    args.push(generateArrayExpression(children));
  }

  return generateCallExpression(generateMemberExpression('React.createElement'), args);
}

function ReactCreateClass(obj){
  return generateCallExpression(generateMemberExpression('React.createClass'), generateObjectExpression(obj));
}

const ReactDiv = ReactCreateElement.bind(null, generateLiteral('div'));
const TouchstoneViewManager = ReactCreateElement.bind(null, generateMemberExpression('touchstone.ViewManager'));
const TouchstoneView = ReactCreateElement.bind(null, generateMemberExpression('touchstone.View'));

function generateViewChildren(elements, element){
  const elementID = element.get('id');
  const childElements = elements.filter(item => item.get('element_id') === elementID);

  let props = {
    style: generateASTFromObject(element.get('styles').toJS()),
    key: generateLiteral(elementID)
  };

  let children = childElements.map(item => generateViewChildren(elements, item)).toArray();
  let tagName = 'div';

  switch (element.get('type')){
    case ElementTypes.text:
      children.unshift(
        generateLiteral(element.getIn(['attributes', 'text'], ''))
      );
      break;

    case ElementTypes.button:
      tagName = 'button';
      children.unshift(
        generateLiteral(element.getIn(['attributes', 'text'], ''))
      );
      break;

    case ElementTypes.image:
      tagName = 'img';
      props.src = generateLiteral(element.getIn(['attributes', 'src'], ''));
      props.alt = generateLiteral(element.getIn(['attributes', 'alt'], ''));
      children = null;
      break;
  }

  return ReactCreateElement(generateLiteral(tagName), props, children);
}

function generateView(elements, screen){
  return TouchstoneView({
    name: generateLiteral(screen.get('id')),
    component: ReactCreateClass({
      render: {
        type: 'FunctionExpression',
        params: [],
        body: generateBlockStatement([
          {
            type: 'ReturnStatement',
            argument: generateViewChildren(elements, screen)
          }
        ])
      }
    })
  });
}

function generateViewManager(flux, projectID){
  const {ElementStore, ProjectStore} = flux.getStore();
  const project = ProjectStore.getProject(projectID);
  const elements = ElementStore.getElementsOfProject(projectID);
  const mainScreen = project.get('main_screen', '');

  const views = elements
    .filter(screen => !screen.get('element_id'))
    .map(screen => generateView(elements, screen))
    .toArray();

  return TouchstoneViewManager({
    name: generateLiteral(projectID),
    defaultView: generateLiteral(mainScreen)
  }, views);
}

function generateApp(flux, projectID){
  /*
  React.createClass({
    displayName: 'App',
    mixins: [touchstone.createApp()],
    render: function(){
      var appWrapperClassName = 'app-wrapper';
      if (window.device) appWrapperClassName += ' device--' + window.device.platform;

      return <div className={appWrapperClassName}>...</div>
    }
  })
  */
  return ReactCreateClass({
    mixins: generateArrayExpression([
      generateCallExpression(generateMemberExpression('touchstone.createApp'))
    ]),
    render: {
      type: 'FunctionExpression',
      params: [],
      body: generateBlockStatement([
        generateVariable('appWrapperClassName', generateLiteral('app-wrapper')),
        {
          type: 'IfStatement',
          test: generateMemberExpression('window.device'),
          consequent: generateAssignmentStatement(
            '+=',
            generateIdentifier('appWrapperClassName'),
            generateBinaryExpression(
              '+',
              generateLiteral(' device--'),
              generateMemberExpression('window.device.platform')
            )
          )
        },
        {
          type: 'ReturnStatement',
          argument: ReactDiv({
            className: generateIdentifier('appWrapperClassName')
          }, [
            generateViewManager(flux, projectID)
          ])
        }
      ])
    }
  });
}

function generateAppStarter(flux, projectID){
  return [
    /*
    function startApp(){
      if (window.StatusBar){
        window.StatusBar.styleDefault();
      }

      React.render(..., document.getElementById('app'));
    }
    */
    {
      type: 'FunctionDeclaration',
      id: generateIdentifier('startApp'),
      params: [],
      body: generateBlockStatement([
        {
          type: 'IfStatement',
          test: generateMemberExpression('window.StatusBar'),
          consequent: generateBlockStatement([
            generateCallStatement(generateMemberExpression('window.StatusBar.styleDefault'))
          ])
        },
        generateCallStatement(generateMemberExpression('ReactDOM.render'), [
          ReactCreateElement(generateApp(flux, projectID)),
          generateCallExpression(generateMemberExpression('document.getElementById'), [
            generateLiteral('root')
          ])
        ])
      ])
    },
    /*
    if (window.cordova){
      document.addEventListener('deviceready', startApp, false);
    } else {
      startApp();
    }
    */
    {
      type: 'IfStatement',
      test: generateMemberExpression('window.cordova'),
      consequent: generateBlockStatement([
          generateCallStatement(generateMemberExpression('document.addEventListener'), [
            generateLiteral('deviceready'),
            generateIdentifier('startApp'),
            generateLiteral(false)
          ])
      ]),
      alternate: generateBlockStatement([
        generateCallStatement(generateIdentifier('startApp'))
      ])
    }
  ];
}

function generateProgram(flux, projectID){
  return [].concat(
    generateRequire('React', 'react'),
    generateRequire('ReactDOM', 'react-dom'),
    generateRequire('touchstone', 'touchstonejs'),
    generateAppStarter(flux, projectID)
  );
}

export default function generateScript(flux, projectID){
  let ast = {
    type: 'Program',
    body: generateProgram(flux, projectID)
  };

  return escodegen.generate(ast, {
    format: {
      indent: {
        style: '  '
      }
    }
  });
}
