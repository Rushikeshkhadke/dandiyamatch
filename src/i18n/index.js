import { en } from './en';
import { hi } from './hi';
import { gu } from './gu';

export const translations = {
  en,
  hi,
  gu,
};

export const getTranslation = (lang = 'en') => {
  return translations[lang] || translations.en;
};
