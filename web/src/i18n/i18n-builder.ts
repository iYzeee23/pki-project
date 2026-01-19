import type { TFunction } from "i18next";
import i18n from ".";

export function commonTexts() {
  return {
    Error: i18n.t("Error", { ns: "common" }),
    UnexpectedError: i18n.t("UnexpectedError", { ns: "common" }),
    Back: i18n.t("Back", { ns: "common" }),
    Close: i18n.t("Close", { ns: "common" })
  };
}

export function adminTexts(t: TFunction) {
  return {
    Map: t("Map", { ns: "admin" }),
    Rentals: t("Rentals", { ns: "admin" }),
    Issues: t("Issues", { ns: "admin" }),
    Profile: t("Profile", { ns: "admin" }),
    Language: t("Language", { ns: "admin" })
  };
}

export function bikeDetailsTexts(t: TFunction) {
  return {
    Language: t("Language", { ns: "bikeDetails" }),
    Bike: t("Bike", { ns: "bikeDetails" }),
    Loading: t("Loading", { ns: "bikeDetails" }),
    Type: t("Type", { ns: "bikeDetails" }),
    Status: t("Status", { ns: "bikeDetails" }),
    Price: t("Price", { ns: "bikeDetails" }),
    ID: t("ID", { ns: "bikeDetails" }),
    Coordinates: t("Coordinates", { ns: "bikeDetails" }),
    Address: t("Address", { ns: "bikeDetails" }),
    Edit: t("Edit", { ns: "bikeDetails" }),
    Back: t("Back", { ns: "bikeDetails" }),
    Scan: t("Scan", { ns: "bikeDetails" })
  };
}

export function bikeEditTexts(t: TFunction) {
  return {
    ErrBikeType: t("ErrBikeType", { ns: "bikeEdit" }),
    ErrPrice: t("ErrPrice", { ns: "bikeEdit" }),
    ErrLocation: t("ErrLocation", { ns: "bikeEdit" }),
    ErrSaving: t("ErrSaving", { ns: "bikeEdit" }),
    BikeEdit: t("BikeEdit", { ns: "bikeEdit" }),
    Saving: t("Saving", { ns: "bikeEdit" }),
    Save: t("Save", { ns: "bikeEdit" }),
    Type: t("Type", { ns: "bikeEdit" }),
    Price: t("Price", { ns: "bikeEdit" }),
    Status: t("Status", { ns: "bikeEdit" }),
    Location: t("Location", { ns: "bikeEdit" }),
    StopPicking: t("StopPicking", { ns: "bikeEdit" }),
    MapOrMarker: t("MapOrMarker", { ns: "bikeEdit" }),
    ChangeLocation: t("ChangeLocation", { ns: "bikeEdit" }),
    Dismiss: t("Dismiss", { ns: "bikeEdit" })
  };
}

export function changePasswordTexts(t: TFunction) {
  return {
    ErrAllFields: t("ErrAllFields", { ns: "changePassword" }),
    ErrMismatch: t("ErrMismatch", { ns: "changePassword" }),
    Changing: t("Changing", { ns: "changePassword" }),
    Change: t("Change", { ns: "changePassword" }),
    ChangePasswords: t("ChangePasswords", { ns: "changePassword" }),
    CurrentPassword: t("CurrentPassword", { ns: "changePassword" }),
    NewPassword: t("NewPassword", { ns: "changePassword" }),
    ConfNewPassword: t("ConfNewPassword", { ns: "changePassword" }),
    Back: t("Back", { ns: "changePassword" })
  };
}

export function editProfileTexts(t: TFunction) {
  return {
    Saving: t("Saving", { ns: "editProfile" }),
    Save: t("Save", { ns: "editProfile" }),
    EditProfile: t("EditProfile", { ns: "editProfile" }),
    Username: t("Username", { ns: "editProfile" }),
    FirstName: t("FirstName", { ns: "editProfile" }),
    LastName: t("LastName", { ns: "editProfile" }),
    Phone: t("Phone", { ns: "editProfile" }),
    Email: t("Email", { ns: "editProfile" }),
    ProfPicture: t("ProfPicture", { ns: "editProfile" }),
    Back: t("Back", { ns: "editProfile" })
  };
}

export function filterSortTexts(t: TFunction) {
  return {
    PlaceholderUserId: t("PlaceholderUserId", { ns: "filterSort" }),
    PlaceholderBikeId: t("PlaceholderBikeId", { ns: "filterSort" }),
    User: t("User", { ns: "filterSort" }),
    BikeId: t("BikeId", { ns: "filterSort" }),
    Date: t("Date", { ns: "filterSort" }),
    SortBy: t("SortBy", { ns: "filterSort" }),
    Direction: t("Direction", { ns: "filterSort" }),
    Desc: t("Desc", { ns: "filterSort" }),
    Asc: t("Asc", { ns: "filterSort" }),
    Reset: t("Reset", { ns: "filterSort" })
  };
}

export function issueDetailsTexts(t: TFunction) {
  return {
    IssueDetails: t("IssueDetails", { ns: "issueDetails" }),
    Loading: t("Loading", { ns: "issueDetails" }),
    ID: t("ID", { ns: "issueDetails" }),
    User: t("User", { ns: "issueDetails" }),
    Bike: t("Bike", { ns: "issueDetails" }),
    Start: t("Start", { ns: "issueDetails" }),
    Description: t("Description", { ns: "issueDetails" }),
    ShowImages: t("ShowImages", { ns: "issueDetails" }),
    Back: t("Back", { ns: "issueDetails" })
  };
}

export function issueImagesTexts(t: TFunction) {
  return {
    IssueImages: t("IssueImages", { ns: "issueImages" }),
    Loading: t("Loading", { ns: "issueImages" }),
    NoImages: t("NoImages", { ns: "issueImages" }),
    Back: t("Back", { ns: "issueImages" })
  };
}

export function issuesTexts(t: TFunction) {
  return {
    Issues: t("Issues", { ns: "issues" }),
    Loading: t("Loading", { ns: "issues" }),
    User: t("User", { ns: "issues" }),
    Bike: t("Bike", { ns: "issues" }),
    NoResults: t("NoResults", { ns: "issues" })
  };
}

export function rentalDetailsTexts(t: TFunction) {
  return {
    RentalDetails: t("RentalDetails", { ns: "rentalDetails" }),
    Loading: t("Loading", { ns: "rentalDetails" }),
    ID: t("ID", { ns: "rentalDetails" }),
    User: t("User", { ns: "rentalDetails" }),
    Bike: t("Bike", { ns: "rentalDetails" }),
    Start: t("Start", { ns: "rentalDetails" }),
    End: t("End", { ns: "rentalDetails" }),
    Total: t("Total", { ns: "rentalDetails" }),
    Description: t("Description", { ns: "rentalDetails" }),
    ShowImages: t("ShowImages", { ns: "rentalDetails" }),
    Back: t("Back", { ns: "rentalDetails" })
  };
}

export function rentalImagesTexts(t: TFunction) {
  return {
    RentalImages: t("RentalImages", { ns: "rentalImages" }),
    Loading: t("Loading", { ns: "rentalImages" }),
    NoImages: t("NoImages", { ns: "rentalImages" }),
    Back: t("Back", { ns: "rentalImages" })
  };
}

export function rentalsTexts(t: TFunction) {
  return {
    Rentals: t("Rentals", { ns: "rentals" }),
    Loading: t("Loading", { ns: "rentals" }),
    User: t("User", { ns: "rentals" }),
    Bike: t("Bike", { ns: "rentals" }),
    NoResults: t("NoResults", { ns: "rentals" }),
    RSD: t("RSD", { ns: "rentals" })
  };
}

export function loginTexts(t: TFunction) {
  return {
    Logging: t("Logging", { ns: "login" }),
    Login: t("Login", { ns: "login" }),
    AdminLogin: t("AdminLogin", { ns: "login" }),
    Username: t("Username", { ns: "login" }),
    Password: t("Password", { ns: "login" })
  };
}

export function mapTexts(t: TFunction) {
  return {
    All: t("All", { ns: "map" }),
    Available: t("Available", { ns: "map" }),
    Busy: t("Busy", { ns: "map" }),
    Maintenance: t("Maintenance", { ns: "map" }),
    Off: t("Off", { ns: "map" })
  };
}

export function parkingTexts(t: TFunction) {
  return {
    Parking: t("Parking", { ns: "parking" }),
    Coordinates: t("Coordinates", { ns: "parking" }),
    Bikes: t("Bikes", { ns: "parking" }),
    NoBikes: t("NoBikes", { ns: "parking" })
  };
}

export function profileTexts(t: TFunction) {
  return {
    ProfPicture: t("ProfPicture", { ns: "profile" }),
    Profile: t("Profile", { ns: "profile" }),
    Logout: t("Logout", { ns: "profile" }),
    Email: t("Email", { ns: "profile" }),
    Phone: t("Phone", { ns: "profile" }),
    EditProfile: t("EditProfile", { ns: "profile" }),
    ChangePassword: t("ChangePassword", { ns: "profile" })
  };
}
