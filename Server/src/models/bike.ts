import mongoose, { InferSchemaType } from "mongoose";
import { BIKE_STATUSES, GEOJSON_STRUCTURES } from "@app/shared";

const bikeSchema = new mongoose.Schema(
    {
        type: { type: String, required: true, trim: true },
        pricePerHour: { type: Number, required: true, min: 0 },
        status: { type: String, enum: BIKE_STATUSES, required: true },
        location: {
            type: { type: String, enum: GEOJSON_STRUCTURES, default: "Point" },
            coordinates: { type: [Number], required: true },
            required: true
        }
    }
);

bikeSchema.index({ location: "2dsphere" });

export type Bike = InferSchemaType<typeof bikeSchema>;
export const BikeModel = mongoose.model("Bike", bikeSchema);
