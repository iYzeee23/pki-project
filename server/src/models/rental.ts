import mongoose, { InferSchemaType } from "mongoose";

const rentalSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        bike: { type: mongoose.Schema.Types.ObjectId, ref: "Bike", required: true },
        startAt: { type: Date, required: true, default: Date.now },
        endAt: { type: Date, default: null },
        totalCost: { type: Number, default: null, min: 0 },
        description: { type: String, default: "" }
    }
);

rentalSchema.index({ startAt: -1 });
rentalSchema.index({ user: 1, startAt: -1 });

rentalSchema.index(
  { bike: 1 },
  { unique: true, partialFilterExpression: { endAt: null } }
);

rentalSchema.index(
  { user: 1 },
  { unique: true, partialFilterExpression: { endAt: null } }
);

export type Rental = InferSchemaType<typeof rentalSchema>;
export const RentalModel = mongoose.model("Rental", rentalSchema);
