/**
 * i18n provider stub
 */

import React from 'react';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return React.createElement('div', {}, children);
};

export const useTranslation = () => ({
  t: (key: string, ...args: any[]) => key,
  i18n: {
    language: 'fi',
    changeLanguage: (locale: string) => Promise.resolve()
  }
});

export default I18nProvider;