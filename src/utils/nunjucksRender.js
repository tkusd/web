import nunjucks, {Environment} from 'nunjucks';
import fs from 'graceful-fs';
import promisify from '../utils/promisify';
import base62uuid from '../utils/base62uuid';

const env = new Environment(null, {
  autoescape: false
});
const readFile = promisify(fs.readFile);
let compiledTemplates = {};

env.addFilter('stringify', (str) => {
  return JSON.stringify(str);
});

env.addFilter('base62uuid', (str) => {
  return base62uuid(str);
});

function getCompiledTemplate(path){
  if (process.env.NODE_ENV === 'production' && compiledTemplates.hasOwnProperty(path)){
    return Promise.resolve(compiledTemplates[path]);
  }

  return readFile(path, 'utf8').then(content => {
    let template = compiledTemplates[path] = nunjucks.compile(content, env, path);

    return template;
  });
}

export default function nunjucksRender(templatePath, data){
  return getCompiledTemplate(templatePath).then(template => {
    return new Promise((resolve, reject) => {
      template.render(data, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });
}
