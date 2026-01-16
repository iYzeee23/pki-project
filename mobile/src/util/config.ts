import { DEFAULT_PROFILE_PICTURE } from "@app/shared";
import Constants from "expo-constants";

export const EXPO_API_BASE_URL = Constants.expoConfig!.extra!.EXPO_API_BASE_URL;

export const DEFAULT_PROFILE_PICTURE_RESOLVED = `${EXPO_API_BASE_URL}${DEFAULT_PROFILE_PICTURE}`
