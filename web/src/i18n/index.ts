import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import * as en from "./en";
import * as sr from "./sr"

const resources = {
  en: {
    admin: en.admin,
    bikeDetails: en.bikeDetails,
    bikeEdit: en.bikeEdit,
    changePassword: en.changePassword,
    common: en.common,
    editProfile: en.editProfile,
    filterSort: en.filterSort,
    issueDetails: en.issueDetails,
    issueImages: en.issueImages,
    issues: en.issues,
    login: en.login,
    map: en.map,
    parkingDetails: en.parkingDetails,
    profile: en.profile,
    rentalDetails: en.rentalDetails,
    rentalImages: en.rentalImages,
    rentals: en.rentals
  },
  sr: {
    admin: sr.admin,
    bikeDetails: sr.bikeDetails,
    bikeEdit: sr.bikeEdit,
    changePassword: sr.changePassword,
    common: sr.common,
    editProfile: sr.editProfile,
    filterSort: sr.filterSort,
    issueDetails: sr.issueDetails,
    issueImages: sr.issueImages,
    issues: sr.issues,
    login: sr.login,
    map: sr.map,
    parkingDetails: sr.parkingDetails,
    profile: sr.profile,
    rentalDetails: sr.rentalDetails,
    rentalImages: sr.rentalImages,
    rentals: sr.rentals
  },
} as const;

const browserLang = (navigator.language || "en").toLowerCase();
const deviceLang = browserLang.startsWith("sr") ? "sr" : "en";

const namespaces = [
    "admin",
    "bikeDetails",
    "bikeEdit",
    "changePassword",
    "common",
    "editProfile",
    "filterSort",
    "issueDetails",
    "issueImages",
    "issues",
    "login",
    "map",
    "parkingDetails",
    "profile",
    "rentalDetails",
    "rentalImages",
    "rentals"
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
