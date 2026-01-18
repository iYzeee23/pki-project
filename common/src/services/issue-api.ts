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
        },

        async list(signal?: AbortSignal) {
            const res = await http.get("/issues/admin/list", { signal: signal });

            const data = res.data;
            return data as IssueDto[];
        },

        async getById(id: string, signal?: AbortSignal) {
            const res = await http.get(`/issues/${id}`, { signal: signal });
    
            const data = res.data;
            return data as IssueDto;
        }
    };
}
