import type { TFunction } from "i18next";
import i18n from "../i18n";

export function commonTexts() {
  return {
    Error: i18n.t("common.Error"),
    Ok: i18n.t("common.Ok"),
    Success: i18n.t("common.Success"),
    UnexpectedError: i18n.t("common.UnexpectedError")
  };
}

export function changePasswordTexts(t: TFunction) {
  return {
    Title: t("changePassword.title"),
    OldPlaceholder: t("changePassword.oldPlaceholder"),
    NewPlaceholder: t("changePassword.newPlaceholder"),
    ConfPlaceholder: t("changePassword.confPlaceholder"),
    Changing: t("changePassword.changing"),
    Submit: t("changePassword.submit"),
    ErrOldMissing: t("changePassword.errOldMissing"),
    ErrNewMin: t("changePassword.errNewMin"),
    ErrMismatch: t("changePassword.errMismatch"),
    SuccessMsg: t("changePassword.successMsg")
  };
}

export function loginTexts(t: TFunction) {
  return {
    Username: t("login.Username"),
    Password: t("login.Password"),
    Login: t("login.Login"),
    NoAcc: t("login.NoAcc")
  };
}

export function registerTexts(t: TFunction) {
  return {
    ErrUsername: t("register.ErrUsername"),
    ErrPassword: t("register.ErrPassword"),
    ErrLength: t("register.ErrLength"),
    ErrMissmatch: t("register.ErrMissmatch"),
    ErrFirstName: t("register.ErrFirstName"),
    ErrLastName: t("register.ErrLastName"),
    ErrPhone: t("register.ErrPhone"),
    ErrMail: t("register.ErrMail"),
    Register: t("register.Register"),
    Change: t("register.Change"),
    Remove: t("register.Remove"),
    Username: t("register.Username"),
    Password: t("register.Password"),
    ConfPassword: t("register.ConfPassword"),
    FirstName: t("register.FirstName"),
    LastName: t("register.LastName"),
    Phone: t("register.Phone"),
    Email: t("register.Email"),
    Creating: t("register.Creating"),
    CreateAcc: t("register.CreateAcc")
  };
}

export function bikeDetailsTexts(t: TFunction) {
  return {
    ErrLocation: t("bikeDetails.ErrLocation"),
    Details: t("bikeDetails.Details"),
    Id: t("bikeDetails.Id"),
    Type: t("bikeDetails.Type"),
    Price: t("bikeDetails.Price"),
    Status: t("bikeDetails.Status"),
    Location: t("bikeDetails.Location"),
    Lat: t("bikeDetails.Lat"),
    Lng: t("bikeDetails.Lng")
  };
}

export function mapTexts(t: TFunction) {
  return {
    Bike: t("map.Bike"),
    Active: t("map.Active")
  };
}

export function parkingDetailsTexts(t: TFunction) {
  return {
    NoBikes: t("parkingDetails.NoBikes"),
    BikesIn: t("parkingDetails.BikesIn"),
    Bike: t("parkingDetails.Bike"),
    Status: t("parkingDetails.Status"),
    Type: t("parkingDetails.Type"),
    Id: t("parkingDetails.Id"),
    Lat: t("parkingDetails.Lat"),
    Lng: t("parkingDetails.Lng"),
    Distance: t("parkingDetails.Distance"),
    AlreadyInside: t("parkingDetails.AlreadyInside")
  };
}

export function editProfileTexts(t: TFunction) {
  return {
    ErrUsername: t("editProfile.ErrUsername"),
    ErrFirstName: t("editProfile.ErrFirstName"),
    ErrLastName: t("editProfile.ErrLastName"),
    ErrPhone: t("editProfile.ErrPhone"),
    ErrMail: t("editProfile.ErrMail"),
    ProfileUpdated: t("editProfile.ProfileUpdated"),
    Change: t("editProfile.Change"),
    Remove: t("editProfile.Remove"),
    Username: t("editProfile.Username"),
    FirstName: t("editProfile.FirstName"),
    LastName: t("editProfile.LastName"),
    Phone: t("editProfile.Phone"),
    Email: t("editProfile.Email"),
    Saving: t("editProfile.Saving"),
    SaveProfile: t("editProfile.SaveProfile"),
    MissingUser: t("editProfile.MissingUser"),
    Title: t("editProfile.Title")
  };
}
