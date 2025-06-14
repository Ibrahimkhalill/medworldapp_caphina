import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization"; // Import from expo-localization
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your translation files
import en from "./locales/en.json";
import pt from "./locales/pt.json";

// Language resources
const resources = {
  en: { translation: en },
  pt: { translation: pt },
};

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: async (callback) => {
    const savedLanguage = await AsyncStorage.getItem("appLanguage");
    const deviceLanguage = Localization.locale.split("-")[0]; // Get the device's language
    callback(savedLanguage || deviceLanguage || "en");
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
    await AsyncStorage.setItem("appLanguage", language);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    compatibilityJSON: "v3",
    interpolation: {
      escapeValue: false, // Not needed for React Native
    },
  });

export default i18n;
