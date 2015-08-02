import fs from 'graceful-fs';
import path from 'path';

const CONFIG_DIR = path.join(__dirname, '../../config');

export default function loadConfig(env = 'development'){
  const configPath = path.join(CONFIG_DIR, env + '.js');

  if (!fs.existsSync(configPath) && env !== 'development'){
    return loadConfig('development');
  }

  return require(configPath);
}
