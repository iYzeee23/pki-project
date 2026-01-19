import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import * as en from "./en";
import * as sr from "./sr"

const resources = {
  en: {
    activeRental: en.activeRental,
    bikeDetails: en.bikeDetails,
    changePassword: en.changePassword,
    common: en.common,
    editProfile: en.editProfile,
    finishRental: en.finishRental,
    login: en.login,
    map: en.map,
    parkingDetails: en.parkingDetails,
    photoUpload: en.photoUpload,
    profile: en.profile,
    qrScanner: en.qrScanner,
    register: en.register,
    rentalDetails: en.rentalDetails,
    rentalHistory: en.rentalHistory,
    reportIssue: en.reportIssue,
    filterSort: en.filterSort
  },
  sr: {
    activeRental: sr.activeRental,
    bikeDetails: sr.bikeDetails,
    changePassword: sr.changePassword,
    common: sr.common,
    editProfile: sr.editProfile,
    finishRental: sr.finishRental,
    login: sr.login,
    map: sr.map,
    parkingDetails: sr.parkingDetails,
    photoUpload: sr.photoUpload,
    profile: sr.profile,
    qrScanner: sr.qrScanner,
    register: sr.register,
    rentalDetails: sr.rentalDetails,
    rentalHistory: sr.rentalHistory,
    reportIssue: sr.reportIssue,
    filterSort: sr.filterSort
  },
} as const;

const deviceLang = Localization.getLocales()?.[0]?.languageCode ?? "en";

const namespaces = [
  "activeRental",
  "bikeDetails",
  "changePassword",
  "common",
  "editProfile",
  "finishRental",
  "login",
  "map",
  "parkingDetails",
  "photoUpload",
  "profile",
  "qrScanner",
  "register",
  "rentalDetails",
  "rentalHistory",
  "reportIssue",
  "filterSort"
];

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLang,
  fallbackLng: "en",
  ns: namespaces,
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export default i18n;
