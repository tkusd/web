import prepareFullProject from '../server/prepareFullProject';
import archiver from 'archiver';
import xmlbuilder from 'xmlbuilder';
import generateScript from '../embed/generateScript';
import path from 'path';
import request from 'request';
import {extractAssetID} from '../utils/getAssetBlobURL';
import nunjucksRender from '../utils/nunjucksRender';

const F7_PATH = path.join(__dirname, '../../node_modules/framework7');
const F7_DIST = path.join(F7_PATH, 'dist');
const TEMPLATE_PATH = path.join(__dirname, 'template.html');

function generateXML(project){
  let root = xmlbuilder.create('widget');
  root.att('id', 'tw.tkusd.diff'); // TODO: change package name
  root.att('version', '0.0.1');
  root.att('xmlns', 'http://www.w3.org/ns/widgets');
  root.att('xmlns:cdv', 'http://cordova.apache.org/ns/1.0');

  root.ele('name', {}, project.get('title'));
  root.ele('description', {}, 'Generated by Diff');
  root.ele('author', {
    href: 'http://tkusd.zespia.tw'
  }, 'Diff');
  root.ele('content', {src: 'index.html'});

  root.ele('plugin', {
    name: 'cordova-plugin-whitelist',
    spec: '1'
  });

  root.ele('access', {origin: '*'});

  root.ele('allow-intent', {href: 'http://*/*'});
  root.ele('allow-intent', {href: 'https://*/*'});
  root.ele('allow-intent', {href: 'tel:*'});
  root.ele('allow-intent', {href: 'sms:*'});
  root.ele('allow-intent', {href: 'mailto:*'});
  root.ele('allow-intent', {href: 'geo:*'});

  root.ele('platform', {name: 'android'})
    .ele('allow-intent', {href: 'market:*'});

  root.ele('platform', {name: 'ios'})
    .ele('allow-intent', {href: 'itms:*'}).up()
    .ele('allow-intent', {href: 'itms:*'});

  return root.end({
    pretty: true,
    indent: '  ', // 2 spaces
    newline: '\n'
  });
}

export default function(req, res, next){
  const flux = req.flux;
  const projectID = req.params.id;

  prepareFullProject(req).then(() => {
    const {ProjectStore, AssetStore} = flux.getStore();
    const project = ProjectStore.getProject(projectID);
    const assets = AssetStore.getAssetsOfProject(projectID);

    return Promise.all([
      nunjucksRender(TEMPLATE_PATH, {project}),
      generateScript(flux, projectID, {
        getAssetURL(url){
          let id = extractAssetID(url);
          if (!id) return url;

          const asset = assets.get(id);
          if (asset) return 'assets/' + asset.get('name');
        }
      })
    ]);
  }).then(([html, script]) => {
    const {AppStore, ProjectStore, AssetStore, TokenStore} = flux.getStore();
    const projectID = req.params.id;
    const project = ProjectStore.getProject(projectID);
    const assets = AssetStore.getAssetsOfProject(projectID);
    const apiEndpoint = AppStore.getAPIEndpoint();
    const token = TokenStore.getTokenSecret();
    const zip = archiver.create('zip', {});

    zip.on('error', next);

    res.attachment(projectID + '.zip');
    zip.pipe(res);

    // config.xml
    let xml = generateXML(project);
    zip.append(xml, {name: 'config.xml'});

    // www/index.html
    zip.append(html, {name: 'www/index.html'});

    // www/js/script.js
    script = '(function(){' + script + '})()';
    zip.append(script, {name: 'www/js/script.js'});

    // www/framework7
    zip.directory(F7_DIST, 'www/framework7');

    // www/assets
    assets.forEach((asset, key) => {
      zip.append(request(`${apiEndpoint}assets/${key}/blob`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }), {name: 'www/assets/' + asset.get('name')});
    });

    zip.finalize();
  }).catch(err => {
    if (err.response && err.response.status === 404){
      return res.status(404).send('Not found');
    }

    next(err);
  });
}
