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
    const msgs = await import(/* webpackChunkName: "lang-[request]" */ `@/locales/client/${lang}`);
    i18n.setLocaleMessage(lang, msgs);
    i18n.loadedLanguages.push(lang);
  }
  return setI18nLanguage(i18n, lang);
}

export default async ({
  app,
  req,
}) => {
  // Set i18n instance on app to use it in middleware and pages asyncData/fetch
  let locale = defaultLocale;
  if (!process.server) {
    const navLangs = [navigator.language, ...navigator.languages];
    supportedLocales.find((supportedLocale) => {
      const match = navLangs.find(navLang => navLang.toLowerCase().includes(supportedLocale));
      if (match) {
        locale = supportedLocale;
      }
      return !!match;
    });
  } else if (req) {
    locale = (
      (req.acceptsLanguages && req.acceptsLanguages(supportedLocales))
      || defaultLocale
    );
    if (!supportedLocales.includes(locale)) locale = defaultLocale;
  }
  app.i18n = new VueI18n({
    locale,
    fallbackLocale: defaultLocale,
    messages: preloadMessages,
  });
  app.i18n.loadLanguageAsync = lang => loadLanguageAsync(app.i18n, lang);
  await app.i18n.loadLanguageAsync(locale);
};
