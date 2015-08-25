import {IntlMixin} from 'react-intl';
import createClassFromMixin from './createClassFromMixin';

const IntlMixinClass = createClassFromMixin(IntlMixin);

export default function formatIntl(props) {
  const intl = new IntlMixinClass();
  intl.props = props;

  return intl;
}

export function formatIntlFromContext(flux){
  const {LocaleStore} = flux.getStore();

  return formatIntl({
    messages: LocaleStore.getMessages(),
    locales: LocaleStore.getLocales(),
    formats: LocaleStore.getFormats(),
  });
}
