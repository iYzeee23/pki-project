import { http } from "./http";
import { createAuthApi, createBikeApi, createGeocodeApi, createImageApi } from "@app/shared";
import { createIssueApi, createParkingApi, createProfileApi, createRentalApi } from "@app/shared";

export const authApi = createAuthApi(http);
export const bikeApi = createBikeApi(http);
export const geocodeApi = createGeocodeApi(http);
export const imageApi = createImageApi(http);
export const issueApi = createIssueApi(http);
export const parkingApi = createParkingApi(http);
export const profileApi = createProfileApi(http);
export const rentalApi = createRentalApi(http);
