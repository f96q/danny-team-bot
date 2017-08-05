const i18n = require('i18n')

i18n.configure({
  locales: ['en', 'ja'],
  register: global,
  objectNotation: true,
  directory: __dirname + '/locales',
  defaultLocale: process.env.DEFAULT_LOCALE
})
