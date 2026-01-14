import { ImageSource } from "@app/shared";

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
  BikeDetails: { bikeId: string };
  ParkingDetails: { 
    spotId: string;
    isActiveMode: boolean;
    activeBikeId?: string;
    distance?: number;
  };
};

export type RentalStackParamList = {
  ActiveRental: undefined;
  QrScanner: undefined;
  FinishRental: { bikeId: string; };
  ReportIssue: { bikeId: string; };
  PhotoUpload: { mode: ImageSource; };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  RentalHistory: undefined;
  RentalDetails: { rentalId: string };
};
