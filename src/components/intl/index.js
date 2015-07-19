import ReactIntl from 'react-intl';
import connectToIntlStore from '../../decorators/connectToIntlStore';

let obj = {};

[
  'FormattedDate',
  'FormattedTime',
  'FormattedRelative',
  'FormattedNumber',
  'FormattedMessage',
  'FormattedHTMLMessage'
].forEach(key => {
  obj[key] = connectToIntlStore(ReactIntl[key]);
});

export default obj;
