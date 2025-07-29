import { useTranslation, UseTranslationResponse } from 'react-i18next';
import { capitalizeFirstLetter } from '../library/utilities/helperFunction';

export const useCapitalizedTranslation = (): UseTranslationResponse<string, object> => {
  const { t, i18n, ...rest } = useTranslation();

  const tCap = (key: string, options?: any) => {
    const raw = t(key, options);
    return typeof raw === 'string' ? capitalizeFirstLetter(raw) : raw;
  };

  return { t: tCap, i18n, ...rest };
};
