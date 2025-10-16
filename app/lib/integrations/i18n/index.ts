/**
 * i18n integration stub
 */

export const i18n = {
  t: (key: string, ...args: any[]) => key,
  locale: 'fi',
  changeLanguage: (locale: string) => Promise.resolve()
};

export default i18n;