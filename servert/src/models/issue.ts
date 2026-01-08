import mongoose, { InferSchemaType } from "mongoose";

const issueSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        bike: { type: mongoose.Schema.Types.ObjectId, ref: "Bike", required: true },
        reportedAt: { type: Date, required: true, default: Date.now },
        description: { type: String, required: true, trim: true }
    }
);

issueSchema.index({ reportedAt: -1 });
issueSchema.index({ user: 1, reportedAt: -1 });
issueSchema.index({ bike: 1, reportedAt: -1 });

export type Issue = InferSchemaType<typeof issueSchema>;
export const IssueModel = mongoose.model("Issue", issueSchema);
