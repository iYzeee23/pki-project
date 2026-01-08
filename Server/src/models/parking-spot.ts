import mongoose, { InferSchemaType } from "mongoose";
import { GEOJSON_STRUCTURES } from "@app/shared";

const parkingSpotSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, unique: true },
        location: {
            type: { type: String, enum: GEOJSON_STRUCTURES, default: "Point" },
            coordinates: { type: [Number], required: true }
        }
    }
);

parkingSpotSchema.index({ location: "2dsphere" });

export type ParkingSpot = InferSchemaType<typeof parkingSpotSchema>;
export const ParkingSpotModel = mongoose.model("ParkingSpot", parkingSpotSchema);
