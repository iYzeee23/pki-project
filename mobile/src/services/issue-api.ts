import { http } from "../util/http";
import { IssueDto } from "@app/shared";

export type CreateIssuePayload = {
    bikeId: string;
    description: string;
};

export async function create(payload: CreateIssuePayload, signal?: AbortSignal) {
    const res = await http.post("/issues", payload, { signal: signal });

    const data = res.data;
    return data as IssueDto;
}
