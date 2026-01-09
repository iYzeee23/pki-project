export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppTabsParamList = {
  MapTab: undefined;
  RentalTab: undefined;
  ProfileTab: undefined;
};

export type MapStackParamList = {
  MapHome: undefined;
  ParkingDetails: { parkingId: string };
  BikeDetails: { bikeId: string };
};

export type RentalStackParamList = {
  ActiveRental: undefined;
  QrScanner: undefined;
  ReportIssue: { bikeId: string; rentalId: string };
  PhotoUpload: { 
    purpose: "RETURN" | "ISSUE";
    rentalId: string;
    bikeId: string;
  };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  RentalHistory: undefined;
  RentalDetails: { rentalId: string };
};
