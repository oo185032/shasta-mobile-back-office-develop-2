import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// @ts-ignore
import i18nextReactNative from 'i18next-react-native-language-detector';
import { formatPrice } from '../utils/StringUtils';
// import Backend from 'i18next-fs-backend';
import locales from './locales';
import moment from "moment";
i18n.on('languageChanged', function(lng) {
   moment.locale(lng);
});
i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(i18nextReactNative)
 
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options

  .init({
    fallbackLng: 'en',
    debug: true,
    resources: locales,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
      format: function(value, rawformat, lng) {
        const format = rawformat?.split(",").map((args)=> args.trim())

        if(format) {
          if (format[0] === 'uppercase') return value.toUpperCase();
          if(value instanceof Date) return moment(value).format(format[0]);
          if(format[0] === 'currency') {
            return formatPrice(value, format[1],lng)
          }
        }
        return value;
    }
    }
  });

export default i18n;