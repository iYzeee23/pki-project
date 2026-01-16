import { IMAGE_SOURCES } from "@app/shared";
import mongoose, { InferSchemaType } from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "ownerModel" },
        ownerModel: { type: String, enum: IMAGE_SOURCES, required: true },
        takenAt: { type: Date, required: true, default: Date.now },
        path: { type: String, required: true, trim: true }
    }
);

imageSchema.index({ ownerModel: 1, ownerId: 1, takenAt: -1 });

export type Image = InferSchemaType<typeof imageSchema>;
export const ImageModel = mongoose.model("Image", imageSchema);
