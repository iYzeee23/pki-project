import { BikeStatus, ImageSource, LngLat } from "./types";

export type UserDto = {
  id: string;
  username: string;
  isAdmin: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  profileImagePath: string;
};

export type BikeDto = {
  id: string;
  type: string;
  pricePerHour: number;
  status: BikeStatus;
  location: LngLat;
  qrCode: string;
};

export type ParkingSpotDto = {
  id: string;
  name: string;
  location: LngLat;
};

export type RentalDto = {
  id: string;
  userId: string;
  bikeId: string;
  startAt: string;
  endAt: string | null;
  totalCost: number | null;
  description: string;
};

export type IssueDto = {
  id: string;
  userId: string;
  bikeId: string;
  reportedAt: string;
  description: string;
};

export type ImageDto = {
  id: string;
  ownerId: string;
  ownerModel: ImageSource;
  takenAt: string;
  path: string;
};
