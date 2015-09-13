import fs from 'graceful-fs';
import promisify from '../utils/promisify';

const readFile = promisify(fs.readFile);
let cachedFiles = {};

export default function readCachedFile(path){
  if (cachedFiles.hasOwnProperty(path)){
    return Promise.resolve(cachedFiles[path]);
  }

  return readFile(path, 'utf8').then(content => {
    cachedFiles[path] = content;
    return content;
  });
}
