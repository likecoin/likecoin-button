/* eslint no-param-reassign: "off" */
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueI18n from 'vue-i18n';
import axios from 'axios';

import { defaultLocale, preloadMessages, supportedLocales } from '../locales';

Vue.use(VueI18n);

const setI18nLanguage = (i18n, lang) => {
  i18n.locale = lang;
  axios.defaults.headers.common['Accept-Language'] = lang;
  return lang;
};

async function loadLanguageAsync(i18n, lang) {
  if (!i18n.loadedLanguages) {
    i18n.loadedLanguages = [defaultLocale];
  }
  if (!i18n.loadedLanguages.includes(lang)) {
    // Fix ESLint error in template string
    // eslint-disable-next-line prefer-template
    const msgs = await import(/* webpackChunkName: "lang-[request]" */ '@/locales/client/' + lang);
    i18n.setLocaleMessage(lang, msgs);
    i18n.loadedLanguages.push(lang);
  }
  return setI18nLanguage(i18n, lang);
}

export default async({
  app,
  req,
  query,
}) => {
  // Set i18n instance on app to use it in middleware and pages asyncData/fetch
  let locale = query.language;
  if (!locale) {
    if (!process.server) {
      let navLangs = [];
      if (navigator.language) { navLangs.push(navigator.language); }
      if (navigator.languages && navigator.languages.length) {
        navLangs = navLangs.concat(navigator.languages);
      }
      for (let i = 0; i < navLangs.length; i += 1) {
        const navLang = navLangs[i];
        const match = supportedLocales
          .find(supportedLocale => navLang.toLowerCase().includes(supportedLocale));
        if (match) {
          locale = match;
          break;
        }
      }
    } else if (req) {
      locale = (
        (req.acceptsLanguages && req.acceptsLanguages(supportedLocales)) ||
        defaultLocale
      );
    }
  }
  if (!supportedLocales.includes(locale)) { locale = defaultLocale; }
  app.i18n = new VueI18n({
    locale,
    fallbackLocale: defaultLocale,
    messages: preloadMessages,
  });
  app.i18n.loadLanguageAsync = lang => loadLanguageAsync(app.i18n, lang);
  await app.i18n.loadLanguageAsync(locale);
};
