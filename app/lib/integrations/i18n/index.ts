/**
 * i18n integration stub
 */

export const i18n = {
  t: (key: string, ..._args: unknown[]) => key,
  locale: 'fi',
  changeLanguage: (_locale: string) => Promise.resolve()
};

export default i18n;