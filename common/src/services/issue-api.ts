import { AxiosInstance } from "axios";
import { IssueDto } from "../util/dtos";

export type CreateIssuePayload = {
    bikeId: string;
    description: string;
};

export function createIssueApi(http: AxiosInstance) {
    return {
        async create(payload: CreateIssuePayload, signal?: AbortSignal) {
            const res = await http.post("/issues", payload, { signal: signal });

            const data = res.data;
            return data as IssueDto;
        }
    };
}
