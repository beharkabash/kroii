/**
 * i18n provider stub
 */

import React from 'react';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return React.createElement('div', {}, children);
};

export const useTranslation = () => ({
  t: (key: string, ..._args: unknown[]) => key,
  i18n: {
    language: 'fi',
    changeLanguage: (_locale: string) => Promise.resolve()
  },
  locale: 'fi' as const,
  setLocale: (_locale: 'fi' | 'en') => Promise.resolve()
});

export default I18nProvider;