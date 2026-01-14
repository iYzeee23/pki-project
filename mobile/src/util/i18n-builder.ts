import type { TFunction } from "i18next";
import i18n from "../i18n";

export function commonTexts() {
  return {
    Error: i18n.t("Error", { ns: "common" }),
    Ok: i18n.t("Ok", { ns: "common" }),
    Success: i18n.t("Success", { ns: "common" }),
    UnexpectedError: i18n.t("UnexpectedError", { ns: "common" }),
    InvalidPlace: i18n.t("InvalidPlace", { ns: "common" }),
    AreYouSure: i18n.t("AreYouSure", { ns: "common" }),
    No: i18n.t("No", { ns: "common" }),
    Yes: i18n.t("Yes", { ns: "common" }),
    UnknownQR: i18n.t("UnknownQR", { ns: "common" })
  };
}

export function changePasswordTexts(t: TFunction) {
  return {
    Title: t("title", { ns: "changePassword" }),
    OldPlaceholder: t("oldPlaceholder", { ns: "changePassword" }),
    NewPlaceholder: t("newPlaceholder", { ns: "changePassword" }),
    ConfPlaceholder: t("confPlaceholder", { ns: "changePassword" }),
    Changing: t("changing", { ns: "changePassword" }),
    Submit: t("submit", { ns: "changePassword" }),
    ErrOldMissing: t("errOldMissing", { ns: "changePassword" }),
    ErrNewMin: t("errNewMin", { ns: "changePassword" }),
    ErrMismatch: t("changePassword.errMismatch", { ns: "changePassword" }),
    SuccessMsg: t("successMsg", { ns: "changePassword" })
  };
}

export function loginTexts(t: TFunction) {
  return {
    Username: t("Username", { ns: "login" }),
    Password: t("Password", { ns: "login" }),
    Login: t("Login", { ns: "login" }),
    NoAcc: t("NoAcc", { ns: "login" })
  };
}

export function registerTexts(t: TFunction) {
  return {
    ErrUsername: t("ErrUsername", { ns: "register" }),
    ErrPassword: t("ErrPassword", { ns: "register" }),
    ErrLength: t("ErrLength", { ns: "register" }),
    ErrMissmatch: t("ErrMissmatch", { ns: "register" }),
    ErrFirstName: t("ErrFirstName", { ns: "register" }),
    ErrLastName: t("ErrLastName", { ns: "register" }),
    ErrPhone: t("ErrPhone", { ns: "register" }),
    ErrMail: t("ErrMail", { ns: "register" }),
    Register: t("Register", { ns: "register" }),
    Change: t("Change", { ns: "register" }),
    Remove: t("Remove", { ns: "register" }),
    Username: t("Username", { ns: "register" }),
    Password: t("Password", { ns: "register" }),
    ConfPassword: t("ConfPassword", { ns: "register" }),
    FirstName: t("FirstName", { ns: "register" }),
    LastName: t("LastName", { ns: "register" }),
    Phone: t("Phone", { ns: "register" }),
    Email: t("Email", { ns: "register" }),
    Creating: t("Creating", { ns: "register" }),
    CreateAcc: t("CreateAcc", { ns: "register" })
  };
}

export function bikeDetailsTexts(t: TFunction) {
  return {
    ErrLocation: t("ErrLocation", { ns: "bikeDetails" }),
    Details: t("Details", { ns: "bikeDetails" }),
    Id: t("Id", { ns: "bikeDetails" }),
    Type: t("Type", { ns: "bikeDetails" }),
    Price: t("Price", { ns: "bikeDetails" }),
    Status: t("Status", { ns: "bikeDetails" }),
    Location: t("Location", { ns: "bikeDetails" }),
    Lat: t("Lat", { ns: "bikeDetails" }),
    Lng: t("Lng", { ns: "bikeDetails" })
  };
}

export function mapTexts(t: TFunction) {
  return {
    Bike: t("Bike", { ns: "map" }),
    Active: t("Active", { ns: "map" })
  };
}

export function parkingDetailsTexts(t: TFunction) {
  return {
    NoBikes: t("NoBikes", { ns: "parkingDetails" }),
    BikesIn: t("BikesIn", { ns: "parkingDetails" }),
    Bike: t("Bike", { ns: "parkingDetails" }),
    Status: t("Status", { ns: "parkingDetails" }),
    Type: t("Type", { ns: "parkingDetails" }),
    Id: t("Id", { ns: "parkingDetails" }),
    Lat: t("Lat", { ns: "parkingDetails" }),
    Lng: t("Lng", { ns: "parkingDetails" }),
    Distance: t("Distance", { ns: "parkingDetails" }),
    AlreadyInside: t("AlreadyInside", { ns: "parkingDetails" })
  };
}

export function editProfileTexts(t: TFunction) {
  return {
    ErrUsername: t("ErrUsername", { ns: "editProfile" }),
    ErrFirstName: t("ErrFirstName", { ns: "editProfile" }),
    ErrLastName: t("ErrLastName", { ns: "editProfile" }),
    ErrPhone: t("ErrPhone", { ns: "editProfile" }),
    ErrMail: t("ErrMail", { ns: "editProfile" }),
    ProfileUpdated: t("ProfileUpdated", { ns: "editProfile" }),
    Change: t("Change", { ns: "editProfile" }),
    Remove: t("Remove", { ns: "editProfile" }),
    Username: t("Username", { ns: "editProfile" }),
    FirstName: t("FirstName", { ns: "editProfile" }),
    LastName: t("LastName", { ns: "editProfile" }),
    Phone: t("Phone", { ns: "editProfile" }),
    Email: t("Email", { ns: "editProfile" }),
    Saving: t("Saving", { ns: "editProfile" }),
    SaveProfile: t("SaveProfile", { ns: "editProfile" }),
    MissingUser: t("MissingUser", { ns: "editProfile" }),
    Title: t("Title", { ns: "editProfile" })
  };
}

export function profileTexts(t: TFunction) {
  return {
    Title: t("Title", { ns: "profile" }),
    Username: t("Username", { ns: "profile" }),
    Name: t("Name", { ns: "profile" }),
    Email: t("Email", { ns: "profile" }),
    Phone: t("Phone", { ns: "profile" }),
    ChangeProfile: t("ChangeProfile", { ns: "profile" }),
    ChangePassword: t("ChangePassword", { ns: "profile" }),
    RentalHistory: t("RentalHistory", { ns: "profile" }),
    Logout: t("Logout", { ns: "profile" }),
    English: t("English", { ns: "profile" }),
    Serbian: t("Serbian", { ns: "profile" })
  };
}

export function rentalDetailsTexts(t: TFunction) {
  return {
    Title: t("Title", { ns: "rentalDetails" }),
    BikeId: t("BikeId", { ns: "rentalDetails" }),
    BikeType: t("BikeType", { ns: "rentalDetails" }),
    StartTime: t("StartTime", { ns: "rentalDetails" }),
    EndTime: t("EndTime", { ns: "rentalDetails" }),
    Price: t("Price", { ns: "rentalDetails" }),
    Duration: t("Duration", { ns: "rentalDetails" }),
    TotalCost: t("TotalCost", { ns: "rentalDetails" }),
    Description: t("Description", { ns: "rentalDetails" })
  };
}

export function rentalHistoryTexts(t: TFunction) {
  return {
    LabelNone: t("LabelNone", { ns: "rentalHistory" }),
    LabelDateFrom: t("LabelDateFrom", { ns: "rentalHistory" }),
    LabelDateTo: t("LabelDateTo", { ns: "rentalHistory" }),
    LabelBikeId: t("LabelBikeId", { ns: "rentalHistory" }),
    PlaceholderBikeId: t("PlaceholderBikeId", { ns: "rentalHistory" }),
    PickDateFrom: t("PickDateFrom", { ns: "rentalHistory" }),
    PickDateTo: t("PickDateTo", { ns: "rentalHistory" }),
    NoRentals: t("NoRentals", { ns: "rentalHistory" }),
    Date: t("Date", { ns: "rentalHistory" }),
    Bike: t("Bike", { ns: "rentalHistory" }),
    Filters: t("Filters", { ns: "rentalHistory" }),
    ClearFilters: t("ClearFilters", { ns: "rentalHistory" }),
    TotalSpent: t("TotalSpent", { ns: "rentalHistory" })
  };
}

export function activeRentalTexts(t: TFunction) {
  return {
    ErrInvalidPlace: t("ErrInvalidPlace", { ns: "activeRental" }),
    ReportIssue: t("ReportIssue", { ns: "activeRental" }),
    FinishRental: t("FinishRental", { ns: "activeRental" }),
    Title: t("Title", { ns: "activeRental" }),
    Bike: t("Bike", { ns: "activeRental" }),
    Duration: t("Duration", { ns: "activeRental" }),
    CurrCost: t("CurrCost", { ns: "activeRental" })
  };
}

export function finishRentalTexts(t: TFunction) {
  return {
    PlaceholderBike: t("PlaceholderBike", { ns: "finishRental" }),
    Next: t("Next", { ns: "finishRental" }),
    Title: t("Title", { ns: "finishRental" })
  };
}

export function photoUploadTexts(t: TFunction) {
  return {
    MissingInformation: t("MissingInformation", { ns: "photoUpload" }),
    AddImage: t("AddImage", { ns: "photoUpload" }),
    MsgSuccessfulIssue: t("MsgSuccessfulIssue", { ns: "photoUpload" }),
    MsgSuccessfulRental: t("MsgSuccessfulRental", { ns: "photoUpload" }),
    AddPhotos: t("AddPhotos", { ns: "photoUpload" }),
    Remove: t("Remove", { ns: "photoUpload" }),
    Submit: t("Submit", { ns: "photoUpload" })
  };
}

export function qrScannerTexts(t: TFunction) {
  return {
    Scanned: t("Scanned", { ns: "qrScanner" }),
    UnknownQR: t("UnknownQR", { ns: "qrScanner" }),
    AllowCamera: t("AllowCamera", { ns: "qrScanner" }),
    ScanAgain: t("ScanAgain", { ns: "qrScanner" }),
    CameraPermission: t("CameraPermission", { ns: "qrScanner" }),
    ScanQR: t("Scanned", { ns: "qrScanner" })
  };
}

export function reportIssueTexts(t: TFunction) {
  return {
    Description: t("Description", { ns: "reportIssue" }),
    Next: t("Next", { ns: "reportIssue" })
  };
}
