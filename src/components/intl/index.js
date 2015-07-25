import ReactIntl from 'react-intl';
import connectToLocaleStore from '../../decorators/connectToLocaleStore';

let obj = {};

[
  'FormattedDate',
  'FormattedTime',
  'FormattedRelative',
  'FormattedNumber',
  'FormattedMessage',
  'FormattedHTMLMessage'
].forEach(key => {
  obj[key] = connectToLocaleStore(ReactIntl[key]);
});

export default obj;
