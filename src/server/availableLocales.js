import fs from 'graceful-fs';
import path from 'path';

const LOCALE_DIR = path.join(__dirname, '../../locales');

export default fs.readdirSync(LOCALE_DIR).map(lang => {
  const extname = path.extname(lang);
  return path.basename(lang, extname);
});
