import { getLocales } from 'expo-localization';
import tr from '../locales/tr';
import en from '../locales/en';
import it from '../locales/it';
import de from '../locales/de';
import fr from '../locales/fr';
import es from '../locales/es';

const LOCALES = { tr, en, it, de, fr, es };

function detectLocale() {
  try {
    const [primary] = getLocales();
    const code = primary?.languageCode ?? 'en';
    return LOCALES[code] ? code : 'en';
  } catch {
    return 'en';
  }
}

const locale = LOCALES[detectLocale()];

export function t(key) {
  return locale[key] ?? key;
}
